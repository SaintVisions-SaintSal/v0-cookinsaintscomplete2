// ============================================
// COOKINSAINTS™ - HOOKS & CONTEXT
// State Management & Authentication
// ============================================

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';

// ============================================
// AUTH CONTEXT
// ============================================

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState(null);

  // Check for existing session on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const savedUser = localStorage.getItem('cookinsaints_user');
        const savedToken = localStorage.getItem('cookinsaints_token');
        
        if (savedUser && savedToken) {
          const userData = JSON.parse(savedUser);
          setUser(userData);
          setIsAuthenticated(true);
        }
      } catch (err) {
        console.error('Auth check failed:', err);
        localStorage.removeItem('cookinsaints_user');
        localStorage.removeItem('cookinsaints_token');
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAuth();
  }, []);

  const login = async (email, password) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Simulate API call - replace with actual Supabase auth
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock validation
      if (!email || !password) {
        throw new Error('Email and password are required');
      }
      
      const userData = {
        id: 'usr_' + Math.random().toString(36).substr(2, 9),
        email,
        name: email.split('@')[0].charAt(0).toUpperCase() + email.split('@')[0].slice(1),
        avatar: null,
        createdAt: new Date().toISOString(),
        accredited: false,
        kycStatus: 'pending',
        preferences: {
          riskTolerance: 75,
          growthFocus: 85,
          reAllocation: 65,
          cryptoComfort: 45,
          autonomyLevel: 'balanced', // conservative, balanced, aggressive, full
          notifications: {
            trades: true,
            distributions: true,
            alerts: true,
            news: false,
          },
        },
      };
      
      const token = 'tok_' + Math.random().toString(36).substr(2, 16);
      
      localStorage.setItem('cookinsaints_user', JSON.stringify(userData));
      localStorage.setItem('cookinsaints_token', token);
      
      setUser(userData);
      setIsAuthenticated(true);
      setIsLoading(false);
      
      return { user: userData, token };
    } catch (err) {
      setError(err.message || 'Login failed');
      setIsLoading(false);
      throw err;
    }
  };

  const signup = async (email, password, name, phone) => {
    setIsLoading(true);
    setError(null);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      if (!email || !password || !name) {
        throw new Error('All fields are required');
      }
      
      if (password.length < 8) {
        throw new Error('Password must be at least 8 characters');
      }
      
      const userData = {
        id: 'usr_' + Math.random().toString(36).substr(2, 9),
        email,
        name,
        phone: phone || null,
        avatar: null,
        createdAt: new Date().toISOString(),
        accredited: false,
        kycStatus: 'pending',
        preferences: {
          riskTolerance: 50,
          growthFocus: 50,
          reAllocation: 50,
          cryptoComfort: 50,
          autonomyLevel: 'balanced',
          notifications: {
            trades: true,
            distributions: true,
            alerts: true,
            news: true,
          },
        },
      };
      
      const token = 'tok_' + Math.random().toString(36).substr(2, 16);
      
      localStorage.setItem('cookinsaints_user', JSON.stringify(userData));
      localStorage.setItem('cookinsaints_token', token);
      
      setUser(userData);
      setIsAuthenticated(true);
      setIsLoading(false);
      
      return { user: userData, token };
    } catch (err) {
      setError(err.message || 'Signup failed');
      setIsLoading(false);
      throw err;
    }
  };

  const logout = () => {
    localStorage.removeItem('cookinsaints_user');
    localStorage.removeItem('cookinsaints_token');
    setUser(null);
    setIsAuthenticated(false);
  };

  const updateUser = (updates) => {
    const updatedUser = { ...user, ...updates };
    localStorage.setItem('cookinsaints_user', JSON.stringify(updatedUser));
    setUser(updatedUser);
  };

  const updatePreferences = (prefs) => {
    const updatedUser = {
      ...user,
      preferences: { ...user.preferences, ...prefs },
    };
    localStorage.setItem('cookinsaints_user', JSON.stringify(updatedUser));
    setUser(updatedUser);
  };

  const resetPassword = async (email) => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      // TODO: Implement actual password reset
      setIsLoading(false);
      return { success: true };
    } catch (err) {
      setError(err.message);
      setIsLoading(false);
      throw err;
    }
  };

  const verifyEmail = async (token) => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      // TODO: Implement actual email verification
      setIsLoading(false);
      return { success: true };
    } catch (err) {
      setError(err.message);
      setIsLoading(false);
      throw err;
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      isLoading,
      isAuthenticated,
      error,
      login,
      signup,
      logout,
      updateUser,
      updatePreferences,
      resetPassword,
      verifyEmail,
      clearError: () => setError(null),
    }}>
      {children}
    </AuthContext.Provider>
  );
};

// ============================================
// APP STATE CONTEXT
// ============================================

const AppContext = createContext(null);

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};

export const AppProvider = ({ children }) => {
  // Portfolio State
  const [portfolio, setPortfolio] = useState({
    totalValue: 347892.45,
    dayChange: 12847.20,
    dayChangePercent: 3.84,
    weekChange: 8234.50,
    weekChangePercent: 2.42,
    monthChange: 24567.80,
    monthChangePercent: 7.61,
    ytdChange: 67234.00,
    ytdChangePercent: 24.03,
    allocations: {
      csrec: { value: 142500, percent: 41, target: 40 },
      trading: { value: 98200, percent: 28, target: 30 },
      capital: { value: 72192, percent: 21, target: 20 },
      salRan: { value: 35000, percent: 10, target: 10 },
    },
  });

  // CSREC State
  const [csrec, setCSREC] = useState({
    price: 12.47,
    nav: 12.45,
    dayChange: 0.08,
    dayChangePercent: 0.65,
    weekChange: 0.23,
    weekChangePercent: 1.88,
    ytdReturn: 20.5,
    inceptionReturn: 45.2,
    totalAUM: 47200000,
    propertyCount: 23,
    avgSalScore: 89,
    avgCapRate: 6.8,
    annualYield: 7.2,
    occupancy: 94.5,
    holdings: {
      units: 11425,
      value: 142500.75,
      avgCost: 10.35,
      totalReturn: 24253.00,
      returnPercent: 20.5,
    },
    nextDistribution: {
      date: '2025-12-31',
      estimatedAmount: 2565.00,
      frequency: 'quarterly',
    },
    distributions: [
      { date: '2025-09-30', amount: 2234.50, status: 'paid' },
      { date: '2025-06-30', amount: 2156.20, status: 'paid' },
      { date: '2025-03-31', amount: 2089.75, status: 'paid' },
    ],
    priceHistory: [
      { date: '2025-01', price: 10.35 },
      { date: '2025-02', price: 10.52 },
      { date: '2025-03', price: 10.78 },
      { date: '2025-04', price: 11.02 },
      { date: '2025-05', price: 11.25 },
      { date: '2025-06', price: 11.48 },
      { date: '2025-07', price: 11.65 },
      { date: '2025-08', price: 11.89 },
      { date: '2025-09', price: 12.08 },
      { date: '2025-10', price: 12.25 },
      { date: '2025-11', price: 12.38 },
      { date: '2025-12', price: 12.47 },
    ],
  });

  // Trading State
  const [trading, setTrading] = useState({
    portfolioValue: 98200,
    dayChange: 2847.50,
    dayChangePercent: 2.98,
    buyingPower: 24320,
    marginAvailable: 48640,
    positions: [
      {
        id: 'pos_1',
        symbol: 'AAPL',
        name: 'Apple Inc.',
        shares: 100,
        avgCost: 176.55,
        currentPrice: 198.42,
        value: 19842,
        dayChange: 234.00,
        dayChangePercent: 1.19,
        totalChange: 2187.00,
        changePercent: 12.4,
        salScore: 85,
        sector: 'Technology',
      },
      {
        id: 'pos_2',
        symbol: 'NVDA',
        name: 'NVIDIA Corporation',
        shares: 75,
        avgCost: 81.12,
        currentPrice: 142.87,
        value: 10715.25,
        dayChange: 428.25,
        dayChangePercent: 4.16,
        totalChange: 4631.25,
        changePercent: 76.1,
        salScore: 94,
        sector: 'Technology',
      },
      {
        id: 'pos_3',
        symbol: 'BTC',
        name: 'Bitcoin',
        shares: 0.45,
        avgCost: 42500,
        currentPrice: 104230,
        value: 46903.50,
        dayChange: -892.35,
        dayChangePercent: -1.87,
        totalChange: 27778.50,
        changePercent: 145.2,
        salScore: 87,
        type: 'crypto',
      },
      {
        id: 'pos_4',
        symbol: 'ETH',
        name: 'Ethereum',
        shares: 8.2,
        avgCost: 880,
        currentPrice: 1660,
        value: 13612,
        dayChange: 245.22,
        dayChangePercent: 1.84,
        totalChange: 6396,
        changePercent: 88.6,
        salScore: 82,
        type: 'crypto',
      },
      {
        id: 'pos_5',
        symbol: 'MSFT',
        name: 'Microsoft Corporation',
        shares: 30,
        avgCost: 395.50,
        currentPrice: 428.50,
        value: 12855,
        dayChange: 156.00,
        dayChangePercent: 1.23,
        totalChange: 990,
        changePercent: 8.3,
        salScore: 88,
        sector: 'Technology',
      },
    ],
    watchlist: [
      { symbol: 'TSLA', name: 'Tesla', price: 248.90, change: 2.45, salScore: 72 },
      { symbol: 'AMD', name: 'AMD', price: 142.33, change: -0.87, salScore: 86 },
      { symbol: 'GOOGL', name: 'Alphabet', price: 178.45, change: 1.23, salScore: 84 },
      { symbol: 'META', name: 'Meta', price: 587.20, change: 3.12, salScore: 81 },
      { symbol: 'SOL', name: 'Solana', price: 198.50, change: 5.67, salScore: 78 },
    ],
    recentTrades: [
      { id: 't1', date: '2025-12-10', symbol: 'NVDA', action: 'buy', shares: 25, price: 142.50, total: 3562.50, executor: 'SAL' },
      { id: 't2', date: '2025-12-08', symbol: 'TSLA', action: 'sell', shares: 25, price: 248.90, total: 6222.50, executor: 'user' },
      { id: 't3', date: '2025-12-05', symbol: 'BTC', action: 'buy', shares: 0.05, price: 98500, total: 4925, executor: 'SAL' },
    ],
  });

  // Capital (Lending) State
  const [capital, setCapital] = useState({
    totalInvested: 72192,
    currentValue: 79039.20,
    weightedAvgRate: 10.8,
    totalEarned: 6847.20,
    pendingInterest: 245.50,
    nextPayment: {
      date: '2025-12-15',
      amount: 649.73,
    },
    fundMetrics: {
      fundSize: 25200000,
      activeLoans: 42,
      avgLoanSize: 600000,
      avgSalScore: 87,
      currentYield: 9.8,
      historicalYield: 10.2,
      defaultRate: 0.4,
      avgLTV: 68,
      avgDSCR: 1.35,
      avgTerm: 18, // months
    },
    investments: [
      {
        id: 'inv_1',
        type: 'fund',
        name: 'CookinCapital Lending Fund',
        amount: 50000,
        currentValue: 54750,
        rate: 9.8,
        status: 'performing',
        startDate: '2024-06-15',
        earned: 4750,
      },
      {
        id: 'inv_2',
        type: 'note',
        name: 'Phoenix Bridge Loan',
        propertyType: 'Multifamily',
        location: 'Phoenix, AZ',
        amount: 15000,
        currentValue: 16425,
        rate: 11.5,
        ltv: 72,
        term: 24,
        maturity: '2026-03-15',
        status: 'performing',
        salScore: 89,
        earned: 1425,
      },
      {
        id: 'inv_3',
        type: 'note',
        name: 'Dallas Fix & Flip',
        propertyType: 'SFR',
        location: 'Dallas, TX',
        amount: 7192,
        currentValue: 7864.20,
        rate: 12.0,
        ltv: 65,
        term: 12,
        maturity: '2025-08-20',
        status: 'performing',
        salScore: 91,
        earned: 672.20,
      },
    ],
    paymentHistory: [
      { date: '2025-12-01', amount: 649.73, type: 'interest', status: 'paid' },
      { date: '2025-11-01', amount: 649.73, type: 'interest', status: 'paid' },
      { date: '2025-10-01', amount: 642.15, type: 'interest', status: 'paid' },
    ],
    availableLoans: [
      {
        id: 'loan_1',
        name: 'Austin Multifamily Bridge',
        propertyType: 'Multifamily',
        location: 'Austin, TX',
        loanAmount: 2400000,
        available: 125000,
        minInvestment: 5000,
        rate: 11.0,
        ltv: 70,
        term: 18,
        salScore: 92,
      },
      {
        id: 'loan_2',
        name: 'Houston Industrial',
        propertyType: 'Industrial',
        location: 'Houston, TX',
        loanAmount: 3800000,
        available: 250000,
        minInvestment: 10000,
        rate: 10.5,
        ltv: 65,
        term: 24,
        salScore: 88,
      },
    ],
  });

  // SAL-Ran Portfolio State
  const [salRan, setSalRan] = useState({
    portfolioValue: 35000,
    initialInvestment: 27258,
    ytdReturn: 28.4,
    ytdReturnDollars: 7742,
    totalReturn: 7742,
    totalReturnPercent: 28.4,
    benchmarkReturn: 19.2, // S&P 500
    outperformance: 9.2,
    riskScore: 72,
    sharpeRatio: 1.85,
    autonomyLevel: 'balanced',
    holdings: [
      { symbol: 'NVDA', name: 'NVIDIA', percent: 28, value: 9800, shares: 68.6, change: 42.3, salScore: 94 },
      { symbol: 'AAPL', name: 'Apple', percent: 18, value: 6300, shares: 31.7, change: 18.7, salScore: 85 },
      { symbol: 'BTC', name: 'Bitcoin', percent: 15, value: 5250, shares: 0.05, change: 52.1, salScore: 87 },
      { symbol: 'MSFT', name: 'Microsoft', percent: 14, value: 4900, shares: 11.4, change: 12.4, salScore: 88 },
      { symbol: 'CSREC', name: 'CookinSaint RE', percent: 12, value: 4200, shares: 336.8, change: 20.5, salScore: 91 },
      { symbol: 'ETH', name: 'Ethereum', percent: 8, value: 2800, shares: 1.69, change: 34.2, salScore: 82 },
      { symbol: 'CASH', name: 'Cash', percent: 5, value: 1750, shares: 1750, change: 0, salScore: null },
    ],
    recentTrades: [
      { id: 'sr_1', date: '2025-12-10', action: 'buy', symbol: 'NVDA', shares: 15, price: 142.50, reason: 'AI demand accelerating, strong earnings momentum' },
      { id: 'sr_2', date: '2025-12-08', action: 'sell', symbol: 'TSLA', shares: 25, price: 248.90, reason: 'Taking profits, rotation to higher conviction plays' },
      { id: 'sr_3', date: '2025-12-05', action: 'buy', symbol: 'CSREC', shares: 200, price: 12.35, reason: 'Portfolio rebalance, yield optimization' },
      { id: 'sr_4', date: '2025-12-02', action: 'buy', symbol: 'BTC', shares: 0.02, price: 98500, reason: 'Institutional adoption thesis intact' },
    ],
    pendingTrades: [],
    settings: {
      maxSinglePosition: 30,
      maxCrypto: 25,
      maxRealEstate: 20,
      rebalanceThreshold: 5,
      stopLoss: 15,
      takeProfit: null,
    },
  });

  // Properties State
  const [properties, setProperties] = useState([
    {
      id: 'prop_1',
      name: 'Riverside Apartments',
      location: 'Phoenix, AZ',
      address: '4521 E Riverside Dr, Phoenix, AZ 85008',
      type: 'Multifamily',
      subtype: 'Garden Style',
      units: 48,
      sqft: 52000,
      nav: 4200000,
      purchasePrice: 3800000,
      purchaseDate: '2023-06-15',
      capRate: 5.8,
      noi: 243600,
      occupancy: 96.2,
      avgRent: 1425,
      marketRent: 1485,
      salScore: 91,
      yearBuilt: 1998,
      renovated: 2023,
      image: null,
      features: ['Pool', 'Fitness Center', 'Covered Parking'],
      status: 'stabilized',
    },
    {
      id: 'prop_2',
      name: 'Gateway Industrial',
      location: 'Houston, TX',
      address: '8900 Gateway Blvd, Houston, TX 77017',
      type: 'Industrial',
      subtype: 'Distribution',
      units: null,
      sqft: 85000,
      nav: 5100000,
      purchasePrice: 4500000,
      purchaseDate: '2024-02-28',
      capRate: 7.1,
      noi: 362100,
      occupancy: 100,
      salScore: 89,
      yearBuilt: 2015,
      image: null,
      features: ['Dock High', 'Clear Height 32\'', 'ESFR Sprinklers'],
      status: 'stabilized',
    },
    {
      id: 'prop_3',
      name: 'Oak Street Portfolio',
      location: 'Dallas, TX',
      address: 'Various - Dallas Metro',
      type: 'SFR Portfolio',
      subtype: 'Scattered Site',
      units: 12,
      sqft: 24000,
      nav: 2800000,
      purchasePrice: 2400000,
      purchaseDate: '2023-09-10',
      capRate: 6.2,
      noi: 173600,
      occupancy: 91.7,
      avgRent: 1850,
      salScore: 87,
      image: null,
      status: 'value-add',
    },
    {
      id: 'prop_4',
      name: 'Austin Tech Center',
      location: 'Austin, TX',
      address: '2100 Tech Ridge Pkwy, Austin, TX 78758',
      type: 'Office',
      subtype: 'Class A',
      units: null,
      sqft: 42000,
      nav: 8200000,
      purchasePrice: 7200000,
      purchaseDate: '2024-05-20',
      capRate: 5.9,
      noi: 483800,
      occupancy: 94.5,
      salScore: 88,
      yearBuilt: 2019,
      image: null,
      features: ['LEED Certified', 'Rooftop Deck', 'EV Charging'],
      status: 'stabilized',
    },
    {
      id: 'prop_5',
      name: 'Sunrise Self Storage',
      location: 'Las Vegas, NV',
      address: '5500 Sunrise Ave, Las Vegas, NV 89110',
      type: 'Self Storage',
      subtype: 'Climate Controlled',
      units: 450,
      sqft: 65000,
      nav: 6800000,
      purchasePrice: 5900000,
      purchaseDate: '2024-08-12',
      capRate: 6.5,
      noi: 442000,
      occupancy: 92.3,
      salScore: 90,
      yearBuilt: 2018,
      image: null,
      features: ['Climate Control', '24/7 Access', 'Security Cameras'],
      status: 'stabilized',
    },
  ]);

  // Notifications State
  const [notifications, setNotifications] = useState([
    { id: 1, type: 'trade', title: 'SAL bought 25 NVDA', message: 'Executed at $142.50', time: new Date(Date.now() - 7200000), read: false, actionUrl: '/trade' },
    { id: 2, type: 'distribution', title: 'CSREC Distribution', message: 'You received $1,892.40', time: new Date(Date.now() - 86400000), read: false, actionUrl: '/csrec' },
    { id: 3, type: 'capital', title: 'Interest Payment', message: 'Capital payment of $649.73', time: new Date(Date.now() - 172800000), read: true, actionUrl: '/capital' },
    { id: 4, type: 'alert', title: 'Price Alert: BTC', message: 'Bitcoin crossed $105,000', time: new Date(Date.now() - 259200000), read: true },
    { id: 5, type: 'sal', title: 'SAL Portfolio Update', message: 'Rebalanced for Q4 outlook', time: new Date(Date.now() - 345600000), read: true, actionUrl: '/sal' },
  ]);

  // Chat Messages State (for SAL)
  const [chatMessages, setChatMessages] = useState([]);
  const [isChatLoading, setIsChatLoading] = useState(false);

  // Mark notification as read
  const markNotificationRead = useCallback((id) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  }, []);

  // Mark all notifications as read
  const markAllNotificationsRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  }, []);

  // Add notification
  const addNotification = useCallback((notification) => {
    const newNotification = {
      id: Date.now(),
      time: new Date(),
      read: false,
      ...notification,
    };
    setNotifications(prev => [newNotification, ...prev]);
  }, []);

  // Send message to SAL
  const sendMessageToSal = useCallback(async (message) => {
    const userMessage = {
      id: Date.now(),
      from: 'user',
      text: message,
      time: new Date(),
    };
    
    setChatMessages(prev => [...prev, userMessage]);
    setIsChatLoading(true);
    
    try {
      // Simulate SAL API response - replace with actual saintsal.ai call
      await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 1000));
      
      const salResponse = {
        id: Date.now() + 1,
        from: 'sal',
        text: generateSalResponse(message),
        time: new Date(),
      };
      
      setChatMessages(prev => [...prev, salResponse]);
    } catch (err) {
      console.error('SAL response error:', err);
    } finally {
      setIsChatLoading(false);
    }
  }, []);

  // Clear chat
  const clearChat = useCallback(() => {
    setChatMessages([]);
  }, []);

  // Refresh portfolio data
  const refreshPortfolio = useCallback(async () => {
    // TODO: Implement actual API refresh
    console.log('Refreshing portfolio data...');
  }, []);

  return (
    <AppContext.Provider value={{
      // State
      portfolio, setPortfolio,
      csrec, setCSREC,
      trading, setTrading,
      capital, setCapital,
      salRan, setSalRan,
      properties, setProperties,
      notifications, setNotifications,
      chatMessages, setChatMessages,
      isChatLoading,
      
      // Actions
      markNotificationRead,
      markAllNotificationsRead,
      addNotification,
      sendMessageToSal,
      clearChat,
      refreshPortfolio,
      
      // Computed
      unreadCount: notifications.filter(n => !n.read).length,
    }}>
      {children}
    </AppContext.Provider>
  );
};

// Helper to generate SAL responses (mock)
const generateSalResponse = (userMessage) => {
  const lowered = userMessage.toLowerCase();
  
  if (lowered.includes('portfolio') || lowered.includes('performance')) {
    return "Your portfolio is looking strong! 📈 Up 3.84% this month with CSREC leading at 41% allocation. Your SAL-Ran portfolio is outperforming the S&P by 9.2% YTD. The NVDA position I added last week is already up 4.1%. Want me to break down any specific area?";
  }
  
  if (lowered.includes('csrec') || lowered.includes('real estate')) {
    return "CSREC is trading at $12.47 with a NAV of $12.45 - slight premium reflecting demand. The fund has 23 properties with an average SAL Score of 89. Your next quarterly distribution is estimated at $2,565 on Dec 31st. We have a new Austin multifamily closing next week that scores 92. Should I add to your position?";
  }
  
  if (lowered.includes('buy') || lowered.includes('invest')) {
    return "Based on your HACP™ profile, I'd recommend adding to CSREC for stability and the 7.2% yield. For growth, NVDA still has strong momentum with my conviction at 94. If you want more income, the CookinCapital Fund is yielding 9.8% with a 0.4% default rate. What's your priority - growth, income, or balance? 🎯";
  }
  
  if (lowered.includes('market') || lowered.includes('economy')) {
    return "Here's my read: Tech is strong with AI demand accelerating - that's why I'm heavy NVDA. Crypto is consolidating but institutional flows remain positive. Real estate fundamentals are solid, especially sunbelt multifamily and industrial. The Fed is likely done hiking. I'm positioned for a strong 2026. 🔥";
  }
  
  if (lowered.includes('risk') || lowered.includes('safe')) {
    return "Your current risk profile shows 75% risk tolerance in HACP™. Your portfolio beta is 1.2 vs S&P. Downside protection: CSREC provides stability with its 7.2% yield floor. I've got stop losses at 15% on SAL-Ran positions. Want me to shift to a more defensive allocation?";
  }
  
  return "I got you, fam! 🔥 Your portfolio's up 3.84% this month. CSREC is solid at $12.47, SAL-Ran is crushing the benchmark by 9.2%. What do you want to dig into? I can analyze any position, find new opportunities, or update your HACP™ preferences.";
};

// ============================================
// CUSTOM HOOKS
// ============================================

// Hook for local storage with sync
export const useLocalStorage = (key, initialValue) => {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  });

  const setValue = (value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(error);
    }
  };

  return [storedValue, setValue];
};

// Hook for debounced value
export const useDebounce = (value, delay = 500) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
};

// Hook for window size (useful for responsive)
export const useWindowSize = () => {
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0,
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);
    handleResize();
    
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return windowSize;
};

// Hook for scroll position
export const useScrollPosition = () => {
  const [scrollPosition, setScrollPosition] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollPosition(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return scrollPosition;
};

// Hook for online status
export const useOnlineStatus = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return isOnline;
};

// Hook for copy to clipboard
export const useCopyToClipboard = () => {
  const [copied, setCopied] = useState(false);

  const copy = useCallback(async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      return true;
    } catch (err) {
      console.error('Copy failed:', err);
      return false;
    }
  }, []);

  return { copied, copy };
};

// Hook for intersection observer (lazy loading, animations)
export const useInView = (options = {}) => {
  const ref = useRef(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      setIsInView(entry.isIntersecting);
    }, options);

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [options]);

  return { ref, isInView };
};

// Hook for previous value
export const usePrevious = (value) => {
  const ref = useRef();
  
  useEffect(() => {
    ref.current = value;
  }, [value]);
  
  return ref.current;
};

// Hook for interval
export const useInterval = (callback, delay) => {
  const savedCallback = useRef();

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    if (delay !== null) {
      const id = setInterval(() => savedCallback.current(), delay);
      return () => clearInterval(id);
    }
  }, [delay]);
};

// Hook for countdown
export const useCountdown = (targetDate) => {
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft(targetDate));

  useInterval(() => {
    setTimeLeft(calculateTimeLeft(targetDate));
  }, 1000);

  return timeLeft;
};

const calculateTimeLeft = (targetDate) => {
  const difference = new Date(targetDate) - new Date();
  
  if (difference <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  }

  return {
    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((difference / 1000 / 60) % 60),
    seconds: Math.floor((difference / 1000) % 60),
  };
};

// Hook for form validation
export const useForm = (initialValues, validate) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (name) => (e) => {
    const value = e.target ? e.target.value : e;
    setValues(prev => ({ ...prev, [name]: value }));
  };

  const handleBlur = (name) => () => {
    setTouched(prev => ({ ...prev, [name]: true }));
    if (validate) {
      const validationErrors = validate(values);
      setErrors(validationErrors);
    }
  };

  const handleSubmit = (onSubmit) => async (e) => {
    e?.preventDefault();
    setIsSubmitting(true);
    
    if (validate) {
      const validationErrors = validate(values);
      setErrors(validationErrors);
      
      if (Object.keys(validationErrors).length > 0) {
        setIsSubmitting(false);
        return;
      }
    }
    
    try {
      await onSubmit(values);
    } finally {
      setIsSubmitting(false);
    }
  };

  const reset = () => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
  };

  return {
    values,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
    reset,
    setValues,
    setErrors,
  };
};

export default {
  AuthProvider,
  AppProvider,
  useAuth,
  useApp,
  useLocalStorage,
  useDebounce,
  useWindowSize,
  useScrollPosition,
  useOnlineStatus,
  useCopyToClipboard,
  useInView,
  usePrevious,
  useInterval,
  useCountdown,
  useForm,
};
