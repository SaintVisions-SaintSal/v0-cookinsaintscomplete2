// ============================================
// ALPACA MARKETS API INTEGRATION
// Real Stock, ETF, Bond, and Crypto Trading
// ============================================

const ALPACA_CONFIG = {
  // Use paper trading by default for safety
  API_KEY: import.meta.env.VITE_ALPACA_API_KEY || "",
  API_SECRET: import.meta.env.VITE_ALPACA_API_SECRET || "",
  BASE_URL:
    import.meta.env.VITE_ALPACA_ENV === "live" ? "https://api.alpaca.markets" : "https://paper-api.alpaca.markets",
  DATA_URL: "https://data.alpaca.markets",
}

// Helper to make authenticated requests
const alpacaRequest = async (endpoint, options = {}) => {
  const url = `${ALPACA_CONFIG.BASE_URL}${endpoint}`

  const response = await fetch(url, {
    ...options,
    headers: {
      "APCA-API-KEY-ID": ALPACA_CONFIG.API_KEY,
      "APCA-API-SECRET-KEY": ALPACA_CONFIG.API_SECRET,
      "Content-Type": "application/json",
      ...options.headers,
    },
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: "Unknown error" }))
    throw new Error(error.message || `Alpaca API error: ${response.status}`)
  }

  return await response.json()
}

// Data API requests
const alpacaDataRequest = async (endpoint, options = {}) => {
  const url = `${ALPACA_CONFIG.DATA_URL}${endpoint}`

  const response = await fetch(url, {
    ...options,
    headers: {
      "APCA-API-KEY-ID": ALPACA_CONFIG.API_KEY,
      "APCA-API-SECRET-KEY": ALPACA_CONFIG.API_SECRET,
      ...options.headers,
    },
  })

  if (!response.ok) {
    throw new Error(`Alpaca Data API error: ${response.status}`)
  }

  return await response.json()
}

// ============================================
// ACCOUNT MANAGEMENT
// ============================================

export const alpacaAccount = {
  // Get account information
  getAccount: async () => {
    return await alpacaRequest("/v2/account")
  },

  // Get account buying power
  getBuyingPower: async () => {
    const account = await alpacaAccount.getAccount()
    return {
      cash: Number.parseFloat(account.cash),
      buyingPower: Number.parseFloat(account.buying_power),
      portfolioValue: Number.parseFloat(account.portfolio_value),
      equity: Number.parseFloat(account.equity),
    }
  },

  // Get account positions
  getPositions: async () => {
    const positions = await alpacaRequest("/v2/positions")
    return positions.map((pos) => ({
      symbol: pos.symbol,
      qty: Number.parseFloat(pos.qty),
      avgEntryPrice: Number.parseFloat(pos.avg_entry_price),
      marketValue: Number.parseFloat(pos.market_value),
      costBasis: Number.parseFloat(pos.cost_basis),
      unrealizedPL: Number.parseFloat(pos.unrealized_pl),
      unrealizedPLPercent: Number.parseFloat(pos.unrealized_plpc) * 100,
      currentPrice: Number.parseFloat(pos.current_price),
      side: pos.side,
    }))
  },

  // Get single position
  getPosition: async (symbol) => {
    try {
      const pos = await alpacaRequest(`/v2/positions/${symbol}`)
      return {
        symbol: pos.symbol,
        qty: Number.parseFloat(pos.qty),
        avgEntryPrice: Number.parseFloat(pos.avg_entry_price),
        marketValue: Number.parseFloat(pos.market_value),
        costBasis: Number.parseFloat(pos.cost_basis),
        unrealizedPL: Number.parseFloat(pos.unrealized_pl),
        unrealizedPLPercent: Number.parseFloat(pos.unrealized_plpc) * 100,
        currentPrice: Number.parseFloat(pos.current_price),
      }
    } catch (error) {
      if (error.message.includes("404")) return null
      throw error
    }
  },

  // Close position
  closePosition: async (symbol) => {
    return await alpacaRequest(`/v2/positions/${symbol}`, {
      method: "DELETE",
    })
  },

  // Get portfolio history
  getPortfolioHistory: async (period = "1M", timeframe = "1D") => {
    const params = new URLSearchParams({ period, timeframe })
    return await alpacaRequest(`/v2/account/portfolio/history?${params}`)
  },
}

// ============================================
// TRADING OPERATIONS
// ============================================

export const alpacaTrading = {
  // Place market order
  marketOrder: async (symbol, qty, side = "buy") => {
    return await alpacaRequest("/v2/orders", {
      method: "POST",
      body: JSON.stringify({
        symbol,
        qty,
        side,
        type: "market",
        time_in_force: "day",
      }),
    })
  },

  // Place limit order
  limitOrder: async (symbol, qty, limitPrice, side = "buy") => {
    return await alpacaRequest("/v2/orders", {
      method: "POST",
      body: JSON.stringify({
        symbol,
        qty,
        side,
        type: "limit",
        limit_price: limitPrice.toString(),
        time_in_force: "day",
      }),
    })
  },

  // Place stop loss order
  stopLossOrder: async (symbol, qty, stopPrice, side = "sell") => {
    return await alpacaRequest("/v2/orders", {
      method: "POST",
      body: JSON.stringify({
        symbol,
        qty,
        side,
        type: "stop",
        stop_price: stopPrice.toString(),
        time_in_force: "gtc",
      }),
    })
  },

  // Place bracket order (entry + take profit + stop loss)
  bracketOrder: async (symbol, qty, side, takeProfitPrice, stopLossPrice) => {
    return await alpacaRequest("/v2/orders", {
      method: "POST",
      body: JSON.stringify({
        symbol,
        qty,
        side,
        type: "market",
        time_in_force: "day",
        order_class: "bracket",
        take_profit: {
          limit_price: takeProfitPrice.toString(),
        },
        stop_loss: {
          stop_price: stopLossPrice.toString(),
        },
      }),
    })
  },

  // Get all orders
  getOrders: async (status = "all") => {
    const params = new URLSearchParams({ status, limit: 500 })
    return await alpacaRequest(`/v2/orders?${params}`)
  },

  // Get single order
  getOrder: async (orderId) => {
    return await alpacaRequest(`/v2/orders/${orderId}`)
  },

  // Cancel order
  cancelOrder: async (orderId) => {
    return await alpacaRequest(`/v2/orders/${orderId}`, {
      method: "DELETE",
    })
  },

  // Cancel all orders
  cancelAllOrders: async () => {
    return await alpacaRequest("/v2/orders", {
      method: "DELETE",
    })
  },
}

// ============================================
// MARKET DATA
// ============================================

export const alpacaMarketData = {
  // Get latest quote
  getQuote: async (symbol) => {
    const data = await alpacaDataRequest(`/v2/stocks/${symbol}/quotes/latest`)
    return {
      symbol,
      bidPrice: data.quote.bp,
      askPrice: data.quote.ap,
      bidSize: data.quote.bs,
      askSize: data.quote.as,
      timestamp: data.quote.t,
    }
  },

  // Get latest trade
  getLatestTrade: async (symbol) => {
    const data = await alpacaDataRequest(`/v2/stocks/${symbol}/trades/latest`)
    return {
      symbol,
      price: data.trade.p,
      size: data.trade.s,
      timestamp: data.trade.t,
    }
  },

  // Get bars (OHLCV data)
  getBars: async (symbol, timeframe = "1Day", start = null, end = null, limit = 100) => {
    const params = new URLSearchParams({
      timeframe,
      limit: limit.toString(),
    })
    if (start) params.append("start", start)
    if (end) params.append("end", end)

    const data = await alpacaDataRequest(`/v2/stocks/${symbol}/bars?${params}`)
    return data.bars.map((bar) => ({
      timestamp: bar.t,
      open: bar.o,
      high: bar.h,
      low: bar.l,
      close: bar.c,
      volume: bar.v,
    }))
  },

  // Get snapshot (quote + trade + daily bar + prev daily bar)
  getSnapshot: async (symbol) => {
    const data = await alpacaDataRequest(`/v2/stocks/${symbol}/snapshot`)
    return {
      symbol,
      latestTrade: data.latestTrade,
      latestQuote: data.latestQuote,
      minuteBar: data.minuteBar,
      dailyBar: data.dailyBar,
      prevDailyBar: data.prevDailyBar,
    }
  },

  // Get multiple snapshots
  getSnapshots: async (symbols) => {
    const params = new URLSearchParams({
      symbols: symbols.join(","),
    })
    return await alpacaDataRequest(`/v2/stocks/snapshots?${params}`)
  },

  // Search for assets
  searchAssets: async (query) => {
    const params = new URLSearchParams({
      status: "active",
      asset_class: "us_equity",
    })
    const assets = await alpacaRequest(`/v2/assets?${params}`)

    const lowerQuery = query.toLowerCase()
    return assets
      .filter(
        (asset) => asset.symbol.toLowerCase().includes(lowerQuery) || asset.name.toLowerCase().includes(lowerQuery),
      )
      .slice(0, 20)
  },

  // Get asset details
  getAsset: async (symbol) => {
    return await alpacaRequest(`/v2/assets/${symbol}`)
  },

  // Check if market is open
  getClock: async () => {
    return await alpacaRequest("/v2/clock")
  },

  // Get market calendar
  getCalendar: async (start, end) => {
    const params = new URLSearchParams()
    if (start) params.append("start", start)
    if (end) params.append("end", end)
    return await alpacaRequest(`/v2/calendar?${params}`)
  },
}

// ============================================
// CRYPTO TRADING (if enabled)
// ============================================

export const alpacaCrypto = {
  // Get crypto quote
  getCryptoQuote: async (symbol) => {
    // Alpaca crypto symbols are like BTC/USD, ETH/USD
    const data = await alpacaDataRequest(`/v1beta3/crypto/us/latest/quotes?symbols=${symbol}`)
    return data.quotes[symbol]
  },

  // Get crypto bars
  getCryptoBars: async (symbol, timeframe = "1Day", limit = 100) => {
    const params = new URLSearchParams({
      timeframe,
      limit: limit.toString(),
    })
    const data = await alpacaDataRequest(`/v1beta3/crypto/us/bars?symbols=${symbol}&${params}`)
    return data.bars[symbol]
  },

  // Place crypto order
  cryptoOrder: async (symbol, qty, side = "buy", type = "market", limitPrice = null) => {
    const orderData = {
      symbol,
      qty,
      side,
      type,
      time_in_force: type === "market" ? "ioc" : "gtc",
    }

    if (type === "limit" && limitPrice) {
      orderData.limit_price = limitPrice.toString()
    }

    return await alpacaRequest("/v2/orders", {
      method: "POST",
      body: JSON.stringify(orderData),
    })
  },
}

// ============================================
// WATCHLIST MANAGEMENT
// ============================================

export const alpacaWatchlist = {
  // Get all watchlists
  getWatchlists: async () => {
    return await alpacaRequest("/v2/watchlists")
  },

  // Create watchlist
  createWatchlist: async (name, symbols = []) => {
    return await alpacaRequest("/v2/watchlists", {
      method: "POST",
      body: JSON.stringify({ name, symbols }),
    })
  },

  // Get watchlist
  getWatchlist: async (watchlistId) => {
    return await alpacaRequest(`/v2/watchlists/${watchlistId}`)
  },

  // Add symbol to watchlist
  addToWatchlist: async (watchlistId, symbol) => {
    return await alpacaRequest(`/v2/watchlists/${watchlistId}`, {
      method: "POST",
      body: JSON.stringify({ symbol }),
    })
  },

  // Remove symbol from watchlist
  removeFromWatchlist: async (watchlistId, symbol) => {
    return await alpacaRequest(`/v2/watchlists/${watchlistId}/${symbol}`, {
      method: "DELETE",
    })
  },

  // Delete watchlist
  deleteWatchlist: async (watchlistId) => {
    return await alpacaRequest(`/v2/watchlists/${watchlistId}`, {
      method: "DELETE",
    })
  },
}

// ============================================
// HELPER FUNCTIONS
// ============================================

export const alpacaHelpers = {
  // Check if API is configured
  isConfigured: () => {
    return !!(ALPACA_CONFIG.API_KEY && ALPACA_CONFIG.API_SECRET)
  },

  // Check if using paper trading
  isPaperTrading: () => {
    return ALPACA_CONFIG.BASE_URL.includes("paper")
  },

  // Format order for display
  formatOrder: (order) => {
    return {
      id: order.id,
      symbol: order.symbol,
      qty: Number.parseFloat(order.qty),
      side: order.side,
      type: order.type,
      status: order.status,
      filledQty: Number.parseFloat(order.filled_qty || 0),
      filledAvgPrice: Number.parseFloat(order.filled_avg_price || 0),
      limitPrice: order.limit_price ? Number.parseFloat(order.limit_price) : null,
      stopPrice: order.stop_price ? Number.parseFloat(order.stop_price) : null,
      createdAt: order.created_at,
      updatedAt: order.updated_at,
    }
  },

  // Calculate position profit/loss
  calculatePL: (position) => {
    const pl = position.marketValue - position.costBasis
    const plPercent = (pl / position.costBasis) * 100
    return {
      pl,
      plPercent,
      isProfit: pl >= 0,
    }
  },
}

export default {
  account: alpacaAccount,
  trading: alpacaTrading,
  marketData: alpacaMarketData,
  crypto: alpacaCrypto,
  watchlist: alpacaWatchlist,
  helpers: alpacaHelpers,
}
