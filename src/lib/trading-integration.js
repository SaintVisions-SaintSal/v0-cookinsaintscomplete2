// ============================================
// TRADING INTEGRATION LAYER
// Combines Alpaca real trading with app state
// ============================================

import alpaca from "./alpaca"
import { tradingService } from "./api"

export const realTrading = {
  // Sync Alpaca positions to local database
  syncPositions: async (userId) => {
    try {
      if (!alpaca.helpers.isConfigured()) {
        console.log("[v0] Alpaca not configured, using mock data")
        return
      }

      const positions = await alpaca.account.getPositions()

      // Update local database with real positions
      for (const pos of positions) {
        await tradingService.updatePosition(userId, {
          symbol: pos.symbol,
          shares: pos.qty,
          avg_cost: pos.avgEntryPrice,
          current_price: pos.currentPrice,
          market_value: pos.marketValue,
          unrealized_pl: pos.unrealizedPL,
          unrealized_pl_percent: pos.unrealizedPLPercent,
        })
      }

      return positions
    } catch (error) {
      console.error("[v0] Error syncing positions:", error)
      throw error
    }
  },

  // Execute real buy order
  executeBuy: async (userId, symbol, shares, orderType = "market", limitPrice = null) => {
    try {
      console.log(`[v0] Executing BUY order: ${shares} shares of ${symbol}`)

      if (!alpaca.helpers.isConfigured()) {
        throw new Error("Trading not configured. Please add Alpaca API credentials.")
      }

      // Check market hours
      const clock = await alpaca.marketData.getClock()
      if (!clock.is_open && orderType === "market") {
        throw new Error("Market is closed. Use limit orders for after-hours trading.")
      }

      // Place order
      let order
      if (orderType === "market") {
        order = await alpaca.trading.marketOrder(symbol, shares, "buy")
      } else if (orderType === "limit" && limitPrice) {
        order = await alpaca.trading.limitOrder(symbol, shares, limitPrice, "buy")
      } else {
        throw new Error("Invalid order type")
      }

      console.log("[v0] Order placed:", order.id)

      // Record transaction in database
      await tradingService.recordTransaction(userId, {
        symbol,
        type: "buy",
        shares,
        price: limitPrice || 0, // Will be updated when filled
        order_id: order.id,
        status: order.status,
        executor: "user",
      })

      // Sync positions after order
      await realTrading.syncPositions(userId)

      return {
        success: true,
        orderId: order.id,
        status: order.status,
        message: `Buy order placed for ${shares} shares of ${symbol}`,
      }
    } catch (error) {
      console.error("[v0] Buy order failed:", error)
      throw error
    }
  },

  // Execute real sell order
  executeSell: async (userId, symbol, shares, orderType = "market", limitPrice = null) => {
    try {
      console.log(`[v0] Executing SELL order: ${shares} shares of ${symbol}`)

      if (!alpaca.helpers.isConfigured()) {
        throw new Error("Trading not configured. Please add Alpaca API credentials.")
      }

      // Verify position exists
      const position = await alpaca.account.getPosition(symbol)
      if (!position || position.qty < shares) {
        throw new Error(`Insufficient shares. You have ${position?.qty || 0} ${symbol}`)
      }

      // Check market hours
      const clock = await alpaca.marketData.getClock()
      if (!clock.is_open && orderType === "market") {
        throw new Error("Market is closed. Use limit orders for after-hours trading.")
      }

      // Place order
      let order
      if (orderType === "market") {
        order = await alpaca.trading.marketOrder(symbol, shares, "sell")
      } else if (orderType === "limit" && limitPrice) {
        order = await alpaca.trading.limitOrder(symbol, shares, limitPrice, "sell")
      } else {
        throw new Error("Invalid order type")
      }

      console.log("[v0] Sell order placed:", order.id)

      // Record transaction
      await tradingService.recordTransaction(userId, {
        symbol,
        type: "sell",
        shares,
        price: limitPrice || 0,
        order_id: order.id,
        status: order.status,
        executor: "user",
      })

      // Sync positions
      await realTrading.syncPositions(userId)

      return {
        success: true,
        orderId: order.id,
        status: order.status,
        message: `Sell order placed for ${shares} shares of ${symbol}`,
      }
    } catch (error) {
      console.error("[v0] Sell order failed:", error)
      throw error
    }
  },

  // Get real-time quote with caching
  getQuote: async (symbol) => {
    try {
      if (!alpaca.helpers.isConfigured()) {
        // Return mock data if not configured
        return { symbol, price: 0, change: 0, changePercent: 0 }
      }

      const snapshot = await alpaca.marketData.getSnapshot(symbol)
      const currentPrice = snapshot.latestTrade.p
      const prevClose = snapshot.prevDailyBar?.c || currentPrice
      const change = currentPrice - prevClose
      const changePercent = (change / prevClose) * 100

      return {
        symbol,
        price: currentPrice,
        change,
        changePercent,
        bid: snapshot.latestQuote.bp,
        ask: snapshot.latestQuote.ap,
        volume: snapshot.dailyBar?.v || 0,
        timestamp: snapshot.latestTrade.t,
      }
    } catch (error) {
      console.error(`[v0] Error fetching quote for ${symbol}:`, error)
      return { symbol, price: 0, change: 0, changePercent: 0 }
    }
  },

  // Get multiple quotes efficiently
  getQuotes: async (symbols) => {
    try {
      if (!alpaca.helpers.isConfigured() || !symbols.length) {
        return {}
      }

      const snapshots = await alpaca.marketData.getSnapshots(symbols)
      const quotes = {}

      for (const [symbol, snapshot] of Object.entries(snapshots)) {
        const currentPrice = snapshot.latestTrade?.p || 0
        const prevClose = snapshot.prevDailyBar?.c || currentPrice
        const change = currentPrice - prevClose
        const changePercent = prevClose > 0 ? (change / prevClose) * 100 : 0

        quotes[symbol] = {
          symbol,
          price: currentPrice,
          change,
          changePercent,
          bid: snapshot.latestQuote?.bp || 0,
          ask: snapshot.latestQuote?.ap || 0,
          volume: snapshot.dailyBar?.v || 0,
        }
      }

      return quotes
    } catch (error) {
      console.error("[v0] Error fetching quotes:", error)
      return {}
    }
  },

  // Get account summary
  getAccountSummary: async () => {
    try {
      if (!alpaca.helpers.isConfigured()) {
        return null
      }

      const account = await alpaca.account.getAccount()
      return {
        equity: Number.parseFloat(account.equity),
        cash: Number.parseFloat(account.cash),
        buyingPower: Number.parseFloat(account.buying_power),
        portfolioValue: Number.parseFloat(account.portfolio_value),
        dayTradeCount: Number.parseInt(account.daytrade_count),
        patternDayTrader: account.pattern_day_trader,
      }
    } catch (error) {
      console.error("[v0] Error fetching account:", error)
      return null
    }
  },

  // Search for tradeable assets
  searchAssets: async (query) => {
    try {
      if (!alpaca.helpers.isConfigured()) {
        return []
      }

      const assets = await alpaca.marketData.searchAssets(query)
      return assets.map((asset) => ({
        symbol: asset.symbol,
        name: asset.name,
        exchange: asset.exchange,
        tradeable: asset.tradable,
        marginable: asset.marginable,
        shortable: asset.shortable,
      }))
    } catch (error) {
      console.error("[v0] Error searching assets:", error)
      return []
    }
  },

  // Check trading status
  getTradingStatus: async () => {
    try {
      if (!alpaca.helpers.isConfigured()) {
        return {
          configured: false,
          paperTrading: false,
          marketOpen: false,
          message: "Trading not configured. Add Alpaca API credentials to enable real trading.",
        }
      }

      const clock = await alpaca.marketData.getClock()
      return {
        configured: true,
        paperTrading: alpaca.helpers.isPaperTrading(),
        marketOpen: clock.is_open,
        nextOpen: clock.next_open,
        nextClose: clock.next_close,
        message: clock.is_open ? "Market is open" : "Market is closed",
      }
    } catch (error) {
      console.error("[v0] Error checking trading status:", error)
      return {
        configured: true,
        error: error.message,
      }
    }
  },
}

export default realTrading
