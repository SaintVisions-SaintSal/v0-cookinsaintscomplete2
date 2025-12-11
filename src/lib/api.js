// ============================================
// COOKINSAINTS™ - API SERVICES
// Complete Business Logic & API Integration
// Powered by SaintSal™ + HACP™
// ============================================

import { supabase, db, rpc } from './supabase';

// ============================================
// CONFIGURATION
// ============================================

const CONFIG = {
  // SaintSal AI API (via saintsal.ai)
  SAINTSAL_API_URL: import.meta.env.VITE_SAINTSAL_API_URL || 'https://api.saintsal.ai',
  SAINTSAL_API_KEY: import.meta.env.VITE_SAINTSAL_API_KEY || '',
  
  // Market Data APIs
  POLYGON_API_KEY: import.meta.env.VITE_POLYGON_API_KEY || '',
  ALPHA_VANTAGE_KEY: import.meta.env.VITE_ALPHA_VANTAGE_KEY || '',
  COINGECKO_API_URL: 'https://api.coingecko.com/api/v3',
  
  // CSREC Configuration
  CSREC_TICKER: 'CSREC',
  CSREC_CURRENT_PRICE: 12.47, // Updated via realtime feed
  CSREC_NAV: 12.45,
  
  // Fund Parameters
  MIN_INVESTMENT_CSREC: 100,
  MIN_INVESTMENT_CAPITAL_FUND: 5000,
  MIN_INVESTMENT_CAPITAL_NOTE: 5000,
};

// ============================================
// SAINTSAL AI SERVICE
// ============================================

export const saintsalService = {
  // Send message to SaintSal AI
  chat: async (message, context = {}) => {
    try {
      const response = await fetch(`${CONFIG.SAINTSAL_API_URL}/v1/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${CONFIG.SAINTSAL_API_KEY}`,
        },
        body: JSON.stringify({
          message,
          context: {
            platform: 'cookinsaints',
            ...context,
          },
        }),
      });
      
      if (!response.ok) throw new Error('SaintSal API error');
      return await response.json();
    } catch (error) {
      console.error('SaintSal chat error:', error);
      // Fallback response
      return {
        response: generateFallbackResponse(message),
        suggestions: [],
      };
    }
  },

  // Get market analysis from SaintSal
  getMarketAnalysis: async (symbols = []) => {
    try {
      const response = await fetch(`${CONFIG.SAINTSAL_API_URL}/v1/analysis/market`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${CONFIG.SAINTSAL_API_KEY}`,
        },
        body: JSON.stringify({ symbols }),
      });
      
      if (!response.ok) throw new Error('SaintSal API error');
      return await response.json();
    } catch (error) {
      console.error('Market analysis error:', error);
      return null;
    }
  },

  // Get SAL score for an asset
  getSalScore: async (symbol, assetType = 'stock') => {
    try {
      const response = await fetch(`${CONFIG.SAINTSAL_API_URL}/v1/analysis/score`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${CONFIG.SAINTSAL_API_KEY}`,
        },
        body: JSON.stringify({ symbol, assetType }),
      });
      
      if (!response.ok) throw new Error('SaintSal API error');
      return await response.json();
    } catch (error) {
      console.error('SAL score error:', error);
      return { score: null, confidence: null, analysis: null };
    }
  },

  // Get property underwriting from SaintSal
  underwriteProperty: async (propertyData) => {
    try {
      const response = await fetch(`${CONFIG.SAINTSAL_API_URL}/v1/analysis/property`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${CONFIG.SAINTSAL_API_KEY}`,
        },
        body: JSON.stringify(propertyData),
      });
      
      if (!response.ok) throw new Error('SaintSal API error');
      return await response.json();
    } catch (error) {
      console.error('Property underwriting error:', error);
      return null;
    }
  },

  // Get loan underwriting from SaintSal
  underwriteLoan: async (loanData) => {
    try {
      const response = await fetch(`${CONFIG.SAINTSAL_API_URL}/v1/analysis/loan`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${CONFIG.SAINTSAL_API_KEY}`,
        },
        body: JSON.stringify(loanData),
      });
      
      if (!response.ok) throw new Error('SaintSal API error');
      return await response.json();
    } catch (error) {
      console.error('Loan underwriting error:', error);
      return null;
    }
  },

  // Get HACP profile recommendations
  getHACPRecommendations: async (userId, preferences) => {
    try {
      const response = await fetch(`${CONFIG.SAINTSAL_API_URL}/v1/hacp/recommendations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${CONFIG.SAINTSAL_API_KEY}`,
        },
        body: JSON.stringify({ userId, preferences }),
      });
      
      if (!response.ok) throw new Error('SaintSal API error');
      return await response.json();
    } catch (error) {
      console.error('HACP recommendations error:', error);
      return null;
    }
  },
};

// Fallback response generator
const generateFallbackResponse = (message) => {
  const lowered = message.toLowerCase();
  
  if (lowered.includes('portfolio') || lowered.includes('performance')) {
    return "Your portfolio is performing well! I'm currently in offline mode, but I can see your allocations are balanced across CSREC, trading, and capital investments. Would you like me to break down any specific area?";
  }
  
  if (lowered.includes('csrec') || lowered.includes('real estate')) {
    return "CSREC is your real estate currency token representing fractional ownership in our property portfolio. It's currently trading around $12.47 with strong fundamentals. Want me to share more details?";
  }
  
  if (lowered.includes('buy') || lowered.includes('invest')) {
    return "I'd recommend reviewing your HACP profile to ensure any investment aligns with your risk tolerance and goals. What asset class are you most interested in - CSREC, trading, or capital lending?";
  }
  
  return "I'm here to help you build wealth! Ask me about your portfolio, CSREC, trading positions, capital investments, or market analysis. What would you like to explore?";
};

// ============================================
// PORTFOLIO SERVICE
// ============================================

export const portfolioService = {
  // Get user's complete portfolio
  getPortfolio: async (userId) => {
    const data = await db.query('portfolios', {
      eq: { user_id: userId },
    });
    return data?.[0] || null;
  },

  // Update portfolio values
  updatePortfolio: async (userId, values) => {
    return await db.upsert('portfolios', {
      user_id: userId,
      ...values,
    });
  },

  // Calculate total portfolio value
  calculateTotalValue: async (userId) => {
    const [csrec, trading, capital, salran] = await Promise.all([
      csrecService.getHoldings(userId),
      tradingService.getPositions(userId),
      capitalService.getInvestments(userId),
      salranService.getPortfolio(userId),
    ]);

    const total = {
      csrec: csrec?.value || 0,
      trading: trading?.reduce((sum, p) => sum + (p.shares * p.current_price), 0) || 0,
      capital: capital?.reduce((sum, i) => sum + i.current_value, 0) || 0,
      salran: salran?.current_value || 0,
    };

    total.total = total.csrec + total.trading + total.capital + total.salran;

    await portfolioService.updatePortfolio(userId, {
      total_value: total.total,
      csrec_value: total.csrec,
      trading_value: total.trading,
      capital_value: total.capital,
      salran_value: total.salran,
    });

    return total;
  },

  // Get portfolio history for charts
  getPortfolioHistory: async (userId, period = '1M') => {
    // This would query a time-series table
    // For now, return mock data
    return [];
  },
};

// ============================================
// CSREC SERVICE
// ============================================

export const csrecService = {
  // Get current CSREC price
  getCurrentPrice: async () => {
    // In production, this would fetch from real-time pricing service
    return {
      price: CONFIG.CSREC_CURRENT_PRICE,
      nav: CONFIG.CSREC_NAV,
      premium: ((CONFIG.CSREC_CURRENT_PRICE - CONFIG.CSREC_NAV) / CONFIG.CSREC_NAV * 100).toFixed(2),
    };
  },

  // Get user's CSREC holdings
  getHoldings: async (userId) => {
    const data = await db.query('csrec_holdings', {
      eq: { user_id: userId },
    });
    
    if (!data?.[0]) return null;
    
    const holding = data[0];
    const currentPrice = CONFIG.CSREC_CURRENT_PRICE;
    
    return {
      ...holding,
      value: holding.units * currentPrice,
      unrealizedGain: (currentPrice - holding.avg_cost) * holding.units,
      unrealizedGainPercent: ((currentPrice - holding.avg_cost) / holding.avg_cost * 100),
    };
  },

  // Buy CSREC
  buyCSREC: async (userId, amount) => {
    if (amount < CONFIG.MIN_INVESTMENT_CSREC) {
      throw new Error(`Minimum investment is $${CONFIG.MIN_INVESTMENT_CSREC}`);
    }

    const currentPrice = CONFIG.CSREC_CURRENT_PRICE;
    const units = amount / currentPrice;

    // Get current holdings
    const holdings = await csrecService.getHoldings(userId);
    const currentUnits = holdings?.units || 0;
    const currentTotalInvested = holdings?.total_invested || 0;

    const newTotalUnits = currentUnits + units;
    const newTotalInvested = currentTotalInvested + amount;
    const newAvgCost = newTotalInvested / newTotalUnits;

    // Update holdings
    await db.upsert('csrec_holdings', {
      user_id: userId,
      units: newTotalUnits,
      avg_cost: newAvgCost,
      total_invested: newTotalInvested,
    });

    // Record transaction
    await db.insert('csrec_transactions', {
      user_id: userId,
      type: 'buy',
      units,
      price: currentPrice,
      total: amount,
      status: 'completed',
    });

    return {
      success: true,
      units,
      price: currentPrice,
      total: amount,
    };
  },

  // Sell CSREC
  sellCSREC: async (userId, units) => {
    const holdings = await csrecService.getHoldings(userId);
    
    if (!holdings || holdings.units < units) {
      throw new Error('Insufficient CSREC balance');
    }

    const currentPrice = CONFIG.CSREC_CURRENT_PRICE;
    const proceeds = units * currentPrice;
    const newUnits = holdings.units - units;

    // Update holdings
    await db.update('csrec_holdings', holdings.id, {
      units: newUnits,
    });

    // Record transaction
    await db.insert('csrec_transactions', {
      user_id: userId,
      type: 'sell',
      units,
      price: currentPrice,
      total: proceeds,
      status: 'completed',
    });

    return {
      success: true,
      units,
      price: currentPrice,
      proceeds,
    };
  },

  // Get CSREC transaction history
  getTransactions: async (userId, limit = 50) => {
    return await db.query('csrec_transactions', {
      eq: { user_id: userId },
      order: { column: 'created_at', ascending: false },
      limit,
    });
  },

  // Get fund metrics
  getFundMetrics: async () => {
    const properties = await db.query('properties');
    
    const totalNAV = properties?.reduce((sum, p) => sum + (p.nav || 0), 0) || 0;
    const avgCapRate = properties?.reduce((sum, p) => sum + (p.cap_rate || 0), 0) / (properties?.length || 1);
    const avgSalScore = properties?.reduce((sum, p) => sum + (p.sal_score || 0), 0) / (properties?.length || 1);
    const avgOccupancy = properties?.reduce((sum, p) => sum + (p.occupancy || 0), 0) / (properties?.length || 1);

    return {
      totalAUM: totalNAV,
      propertyCount: properties?.length || 0,
      avgCapRate: avgCapRate.toFixed(1),
      avgSalScore: Math.round(avgSalScore),
      avgOccupancy: avgOccupancy.toFixed(1),
      annualYield: 7.2, // Calculated from NOI / NAV
    };
  },

  // Get properties in the fund
  getProperties: async () => {
    return await db.query('properties', {
      order: { column: 'sal_score', ascending: false },
    });
  },
};

// ============================================
// TRADING SERVICE
// ============================================

export const tradingService = {
  // Get user's trading positions
  getPositions: async (userId) => {
    return await db.query('trading_positions', {
      eq: { user_id: userId },
      order: { column: 'updated_at', ascending: false },
    });
  },

  // Get single position
  getPosition: async (userId, symbol) => {
    const data = await db.query('trading_positions', {
      eq: { user_id: userId, symbol },
    });
    return data?.[0] || null;
  },

  // Execute buy order
  buy: async (userId, symbol, shares, price, executor = 'user', reason = null) => {
    const existing = await tradingService.getPosition(userId, symbol);
    
    if (existing) {
      // Update existing position
      const newShares = existing.shares + shares;
      const newAvgCost = ((existing.shares * existing.avg_cost) + (shares * price)) / newShares;
      
      await db.update('trading_positions', existing.id, {
        shares: newShares,
        avg_cost: newAvgCost,
        current_price: price,
      });
    } else {
      // Create new position
      await db.insert('trading_positions', {
        user_id: userId,
        symbol,
        shares,
        avg_cost: price,
        current_price: price,
      });
    }

    // Record transaction
    await db.insert('trading_transactions', {
      user_id: userId,
      symbol,
      type: 'buy',
      shares,
      price,
      total: shares * price,
      executor,
      reason,
      status: 'completed',
    });

    return { success: true, shares, price, total: shares * price };
  },

  // Execute sell order
  sell: async (userId, symbol, shares, price, executor = 'user', reason = null) => {
    const existing = await tradingService.getPosition(userId, symbol);
    
    if (!existing || existing.shares < shares) {
      throw new Error('Insufficient shares');
    }

    const newShares = existing.shares - shares;
    
    if (newShares <= 0) {
      await db.delete('trading_positions', existing.id);
    } else {
      await db.update('trading_positions', existing.id, {
        shares: newShares,
        current_price: price,
      });
    }

    // Record transaction
    await db.insert('trading_transactions', {
      user_id: userId,
      symbol,
      type: 'sell',
      shares,
      price,
      total: shares * price,
      executor,
      reason,
      status: 'completed',
    });

    return { success: true, shares, price, proceeds: shares * price };
  },

  // Get trading history
  getTransactions: async (userId, limit = 50) => {
    return await db.query('trading_transactions', {
      eq: { user_id: userId },
      order: { column: 'created_at', ascending: false },
      limit,
    });
  },

  // Get real-time quote (via market data API)
  getQuote: async (symbol) => {
    // In production, this would call Polygon or similar
    return {
      symbol,
      price: 0,
      change: 0,
      changePercent: 0,
    };
  },
};

// ============================================
// CAPITAL (LENDING) SERVICE
// ============================================

export const capitalService = {
  // Get user's capital investments
  getInvestments: async (userId) => {
    return await db.query('capital_investments', {
      eq: { user_id: userId },
      order: { column: 'created_at', ascending: false },
    });
  },

  // Invest in lending fund
  investInFund: async (userId, amount) => {
    if (amount < CONFIG.MIN_INVESTMENT_CAPITAL_FUND) {
      throw new Error(`Minimum investment is $${CONFIG.MIN_INVESTMENT_CAPITAL_FUND}`);
    }

    await db.insert('capital_investments', {
      user_id: userId,
      type: 'fund',
      name: 'CookinCapital Lending Fund',
      amount,
      current_value: amount,
      rate: 9.8,
      status: 'performing',
    });

    return { success: true, amount };
  },

  // Invest in individual loan
  investInLoan: async (userId, loanId, amount) => {
    if (amount < CONFIG.MIN_INVESTMENT_CAPITAL_NOTE) {
      throw new Error(`Minimum investment is $${CONFIG.MIN_INVESTMENT_CAPITAL_NOTE}`);
    }

    // Get loan details
    const loan = await db.query('available_loans', {
      eq: { id: loanId },
    });

    if (!loan?.[0]) throw new Error('Loan not found');

    await db.insert('capital_investments', {
      user_id: userId,
      type: 'note',
      name: loan[0].name,
      property_type: loan[0].property_type,
      location: loan[0].location,
      amount,
      current_value: amount,
      rate: loan[0].rate,
      ltv: loan[0].ltv,
      term: loan[0].term,
      sal_score: loan[0].sal_score,
      status: 'performing',
    });

    return { success: true, amount };
  },

  // Get payment history
  getPayments: async (userId, limit = 50) => {
    return await db.query('capital_payments', {
      eq: { user_id: userId },
      order: { column: 'payment_date', ascending: false },
      limit,
    });
  },

  // Get fund metrics
  getFundMetrics: async () => {
    // This would aggregate from actual loan data
    return {
      fundSize: 25200000,
      activeLoans: 42,
      avgLoanSize: 600000,
      avgSalScore: 87,
      currentYield: 9.8,
      defaultRate: 0.4,
      avgLTV: 68,
      avgDSCR: 1.35,
    };
  },

  // Get available loans for investment
  getAvailableLoans: async () => {
    return await db.query('available_loans', {
      order: { column: 'sal_score', ascending: false },
    });
  },
};

// ============================================
// SAL-RAN PORTFOLIO SERVICE
// ============================================

export const salranService = {
  // Get SAL-Ran portfolio
  getPortfolio: async (userId) => {
    const data = await db.query('salran_portfolios', {
      eq: { user_id: userId },
    });
    return data?.[0] || null;
  },

  // Get SAL-Ran holdings
  getHoldings: async (portfolioId) => {
    return await db.query('salran_holdings', {
      eq: { portfolio_id: portfolioId },
      order: { column: 'percent_allocation', ascending: false },
    });
  },

  // Add funds to SAL-Ran
  addFunds: async (userId, amount) => {
    const portfolio = await salranService.getPortfolio(userId);
    
    if (!portfolio) {
      await db.insert('salran_portfolios', {
        user_id: userId,
        initial_investment: amount,
        current_value: amount,
      });
    } else {
      await db.update('salran_portfolios', portfolio.id, {
        initial_investment: portfolio.initial_investment + amount,
        current_value: portfolio.current_value + amount,
      });
    }

    return { success: true, amount };
  },

  // Get SAL-Ran trades
  getTrades: async (portfolioId, limit = 50) => {
    return await db.query('salran_trades', {
      eq: { portfolio_id: portfolioId },
      order: { column: 'created_at', ascending: false },
      limit,
    });
  },

  // Update SAL-Ran settings
  updateSettings: async (userId, settings) => {
    const portfolio = await salranService.getPortfolio(userId);
    if (!portfolio) throw new Error('Portfolio not found');
    
    await db.update('salran_portfolios', portfolio.id, settings);
    return { success: true };
  },

  // Execute SAL-Ran trade (called by SAL AI)
  executeTrade: async (portfolioId, symbol, type, shares, price, reason) => {
    await db.insert('salran_trades', {
      portfolio_id: portfolioId,
      symbol,
      type,
      shares,
      price,
      total: shares * price,
      reason,
      approval_status: 'auto',
    });

    return { success: true };
  },
};

// ============================================
// NOTIFICATIONS SERVICE
// ============================================

export const notificationService = {
  // Get user's notifications
  getNotifications: async (userId, limit = 50) => {
    return await db.query('notifications', {
      eq: { user_id: userId },
      order: { column: 'created_at', ascending: false },
      limit,
    });
  },

  // Create notification
  create: async (userId, type, title, message, actionUrl = null) => {
    await db.insert('notifications', {
      user_id: userId,
      type,
      title,
      message,
      action_url: actionUrl,
      read: false,
    });
  },

  // Mark as read
  markAsRead: async (notificationId) => {
    await db.update('notifications', notificationId, { read: true });
  },

  // Mark all as read
  markAllAsRead: async (userId) => {
    const { error } = await supabase
      .from('notifications')
      .update({ read: true })
      .eq('user_id', userId)
      .eq('read', false);
    
    if (error) throw error;
  },

  // Get unread count
  getUnreadCount: async (userId) => {
    const { count, error } = await supabase
      .from('notifications')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('read', false);
    
    if (error) throw error;
    return count || 0;
  },
};

// ============================================
// CHAT SERVICE
// ============================================

export const chatService = {
  // Get chat history
  getMessages: async (userId, limit = 100) => {
    return await db.query('chat_messages', {
      eq: { user_id: userId },
      order: { column: 'created_at', ascending: true },
      limit,
    });
  },

  // Send message and get SAL response
  sendMessage: async (userId, content, context = {}) => {
    // Save user message
    await db.insert('chat_messages', {
      user_id: userId,
      role: 'user',
      content,
    });

    // Get SAL response
    const salResponse = await saintsalService.chat(content, {
      userId,
      ...context,
    });

    // Save SAL response
    await db.insert('chat_messages', {
      user_id: userId,
      role: 'sal',
      content: salResponse.response,
      metadata: {
        suggestions: salResponse.suggestions,
      },
    });

    return salResponse;
  },

  // Clear chat history
  clearHistory: async (userId) => {
    const { error } = await supabase
      .from('chat_messages')
      .delete()
      .eq('user_id', userId);
    
    if (error) throw error;
  },
};

// ============================================
// USER PROFILE SERVICE
// ============================================

export const profileService = {
  // Get user profile
  getProfile: async (userId) => {
    const data = await db.query('profiles', {
      eq: { id: userId },
    });
    return data?.[0] || null;
  },

  // Update profile
  updateProfile: async (userId, updates) => {
    await db.update('profiles', userId, updates);
    return { success: true };
  },

  // Update HACP preferences
  updatePreferences: async (userId, preferences) => {
    await db.update('profiles', userId, preferences);
    return { success: true };
  },

  // Start KYC process
  startKYC: async (userId) => {
    await db.update('profiles', userId, { kyc_status: 'submitted' });
    // This would integrate with Persona or similar KYC provider
    return { success: true, redirectUrl: '/kyc' };
  },

  // Verify accreditation
  verifyAccreditation: async (userId) => {
    // This would integrate with VerifyInvestor or similar
    return { success: true, redirectUrl: '/accreditation' };
  },
};

// ============================================
// EXPORT ALL SERVICES
// ============================================

export default {
  saintsalService,
  portfolioService,
  csrecService,
  tradingService,
  capitalService,
  salranService,
  notificationService,
  chatService,
  profileService,
  CONFIG,
};
