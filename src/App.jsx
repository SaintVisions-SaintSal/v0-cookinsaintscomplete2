"use client"

import { useState, useEffect, createContext, useContext } from "react"

// ============================================
// COOKINSAINTS™ - COMPLETE iOS APPLICATION
// Powered by SaintSal™ + HACP™
// ============================================

// ============================================
// CONTEXT & STATE MANAGEMENT
// ============================================

const AuthContext = createContext(null)
const AppContext = createContext(null)

export const useAuth = () => useContext(AuthContext)
export const useApp = () => useContext(AppContext)

// ============================================
// DESIGN SYSTEM - COLORS & STYLES
// ============================================

export const colors = {
  // Core Background
  background: "#000000",
  surface: "rgba(255, 255, 255, 0.03)",
  surfaceLight: "rgba(255, 255, 255, 0.05)",
  surfaceHover: "rgba(255, 255, 255, 0.08)",

  // Gold Palette (SaintSal™ Brand)
  gold: "#D4AF37",
  goldLight: "#FFD700",
  goldDark: "#B8960C",
  goldMuted: "#9A7B2C",

  // Neon Accents
  neonCyan: "#00FFFF",
  neonPurple: "#BF00FF",
  neonGreen: "#00FF88",
  neonRed: "#FF3366",
  neonBlue: "#0088FF",
  neonOrange: "#FF8800",

  // Text
  textPrimary: "#FFFFFF",
  textSecondary: "#999999",
  textMuted: "#666666",

  // Borders & Dividers
  border: "rgba(255, 255, 255, 0.06)",
  borderLight: "rgba(255, 255, 255, 0.1)",

  // Semantic
  success: "#00FF88",
  error: "#FF3366",
  warning: "#FFB800",
  info: "#0088FF",
}

// Neon glow effect generator
export const neonGlow = (color, intensity = 1) => ({
  color: color,
  textShadow: `0 0 ${8 * intensity}px ${color}80, 0 0 ${16 * intensity}px ${color}60, 0 0 ${24 * intensity}px ${color}40`,
  filter: `drop-shadow(0 0 ${6 * intensity}px ${color}40)`,
})

// Gold gradient for text
export const goldGradient = {
  background: `linear-gradient(135deg, ${colors.goldDark} 0%, ${colors.gold} 50%, ${colors.goldLight} 100%)`,
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
  backgroundClip: "text",
}

// ============================================
// AUTHENTICATION PROVIDER
// ============================================

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    // Check for existing session
    const checkAuth = async () => {
      const savedUser = localStorage.getItem("cookinsaints_user")
      if (savedUser) {
        setUser(JSON.parse(savedUser))
        setIsAuthenticated(true)
      }
      setIsLoading(false)
    }
    checkAuth()
  }, [])

  const login = async (email, password) => {
    // Simulate API call
    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 1500))

    const userData = {
      id: "usr_" + Math.random().toString(36).substr(2, 9),
      email,
      name: "Cap",
      avatar: null,
      createdAt: new Date().toISOString(),
      preferences: {
        riskTolerance: 75,
        growthFocus: 85,
        reAllocation: 65,
        cryptoComfort: 45,
      },
    }

    // Fix: Use JSON.stringify before setting to localStorage
    localStorage.setItem("cookinsaints_user", JSON.stringify(userData))
    setUser(userData)
    setIsAuthenticated(true)
    setIsLoading(false)
    return userData
  }

  const signup = async (email, password, name) => {
    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 2000))

    const userData = {
      id: "usr_" + Math.random().toString(36).substr(2, 9),
      email,
      name,
      avatar: null,
      createdAt: new Date().toISOString(),
      preferences: {
        riskTolerance: 50,
        growthFocus: 50,
        reAllocation: 50,
        cryptoComfort: 50,
      },
    }

    // Fix: Use JSON.stringify before setting to localStorage
    localStorage.setItem("cookinsaints_user", JSON.stringify(userData))
    setUser(userData)
    setIsAuthenticated(true)
    setIsLoading(false)
    return userData
  }

  const logout = () => {
    localStorage.removeItem("cookinsaints_user")
    setUser(null)
    setIsAuthenticated(false)
  }

  const updatePreferences = (prefs) => {
    const updatedUser = { ...user, preferences: { ...user.preferences, ...prefs } }
    // Fix: Use JSON.stringify before setting to localStorage
    localStorage.setItem("cookinsaints_user", JSON.stringify(updatedUser))
    setUser(updatedUser)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated,
        login,
        signup,
        logout,
        updatePreferences,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

// ============================================
// APP STATE PROVIDER
// ============================================

const AppProvider = ({ children }) => {
  const [portfolio, setPortfolio] = useState({
    totalValue: 347892.45,
    dayChange: 12847.2,
    dayChangePercent: 3.84,
    allocations: {
      csrec: { value: 142500, percent: 41 },
      trading: { value: 98200, percent: 28 },
      capital: { value: 72192, percent: 21 },
      salRan: { value: 35000, percent: 10 },
    },
  })

  const [csrec, setCSREC] = useState({
    price: 12.47,
    dayChange: 0.08,
    dayChangePercent: 0.65,
    ytdReturn: 20.5,
    totalAUM: 47200000,
    propertyCount: 23,
    avgSalScore: 89,
    avgCapRate: 6.8,
    annualYield: 7.2,
    holdings: {
      units: 11425,
      value: 142500.75,
      avgCost: 10.35,
      totalReturn: 24253.0,
      returnPercent: 20.5,
    },
    nextDistribution: {
      date: "2025-12-31",
      estimatedAmount: 2565.0,
    },
  })

  const [trading, setTrading] = useState({
    portfolioValue: 98200,
    dayChange: 2847.5,
    dayChangePercent: 2.98,
    buyingPower: 24320,
    positions: [
      {
        symbol: "AAPL",
        name: "Apple Inc.",
        shares: 100,
        avgCost: 176.55,
        currentPrice: 198.42,
        value: 19842,
        changePercent: 12.4,
      },
      {
        symbol: "NVDA",
        name: "NVIDIA",
        shares: 75,
        avgCost: 81.12,
        currentPrice: 142.87,
        value: 10715.25,
        changePercent: 76.1,
      },
      {
        symbol: "BTC",
        name: "Bitcoin",
        shares: 0.45,
        avgCost: 42500,
        currentPrice: 104230,
        value: 46903.5,
        changePercent: 145.2,
      },
      {
        symbol: "ETH",
        name: "Ethereum",
        shares: 8.2,
        avgCost: 880,
        currentPrice: 1660,
        value: 13612,
        changePercent: 88.6,
      },
      {
        symbol: "MSFT",
        name: "Microsoft",
        shares: 30,
        avgCost: 395.5,
        currentPrice: 428.5,
        value: 12855,
        changePercent: 8.3,
      },
    ],
    watchlist: ["AAPL", "NVDA", "BTC", "CSREC", "TSLA", "AMD"],
  })

  const [capital, setCapital] = useState({
    totalInvested: 72192,
    weightedAvgRate: 10.8,
    totalEarned: 6847.2,
    nextPayment: {
      date: "2025-12-15",
      amount: 649.73,
    },
    fundMetrics: {
      fundSize: 25200000,
      activeLoans: 42,
      avgSalScore: 87,
      currentYield: 9.8,
      defaultRate: 0.4,
      avgLTV: 68,
    },
    investments: [
      { type: "fund", name: "Lending Fund", amount: 50000, rate: 9.8, status: "performing" },
      { type: "note", name: "Phoenix Bridge", amount: 15000, rate: 11.5, status: "performing" },
      { type: "note", name: "Dallas Fix & Flip", amount: 7192, rate: 12.0, status: "performing" },
    ],
  })

  const [salRan, setSalRan] = useState({
    portfolioValue: 35000,
    ytdReturn: 28.4,
    ytdReturnDollars: 7742,
    benchmarkReturn: 19.2,
    outperformance: 9.2,
    holdings: [
      { symbol: "NVDA", percent: 28, value: 9800, change: 42.3 },
      { symbol: "AAPL", percent: 18, value: 6300, change: 18.7 },
      { symbol: "BTC", percent: 15, value: 5250, change: 52.1 },
      { symbol: "MSFT", percent: 14, value: 4900, change: 12.4 },
      { symbol: "CSREC", percent: 12, value: 4200, change: 20.5 },
      { symbol: "ETH", percent: 8, value: 2800, change: 34.2 },
      { symbol: "CASH", percent: 5, value: 1750, change: 0 },
    ],
    recentTrades: [
      { date: "2025-12-10", action: "buy", symbol: "NVDA", shares: 15, price: 142.5 },
      { date: "2025-12-08", action: "sell", symbol: "TSLA", shares: 25, price: 248.9 },
      { date: "2025-12-05", action: "buy", symbol: "CSREC", shares: 200, price: 12.35 },
      { date: "2025-12-02", action: "buy", symbol: "BTC", shares: 0.02, price: 98500 },
    ],
  })

  const [properties, setProperties] = useState([
    {
      id: "prop_1",
      name: "Riverside Apartments",
      location: "Phoenix, AZ",
      type: "Multifamily",
      units: 48,
      nav: 4200000,
      capRate: 5.8,
      occupancy: 96.2,
      avgRent: 1425,
      salScore: 91,
      yearBuilt: 1998,
      renovated: 2023,
      image: null,
    },
    {
      id: "prop_2",
      name: "Gateway Industrial",
      location: "Houston, TX",
      type: "Industrial",
      sqft: 85000,
      nav: 5100000,
      capRate: 7.1,
      occupancy: 100,
      salScore: 89,
      yearBuilt: 2015,
      image: null,
    },
    {
      id: "prop_3",
      name: "Oak Street Portfolio",
      location: "Dallas, TX",
      type: "SFR Portfolio",
      units: 12,
      nav: 2800000,
      capRate: 6.2,
      occupancy: 91.7,
      avgRent: 1850,
      salScore: 87,
      image: null,
    },
    {
      id: "prop_4",
      name: "Austin Tech Center",
      location: "Austin, TX",
      type: "Office",
      sqft: 42000,
      nav: 8200000,
      capRate: 5.9,
      occupancy: 94.5,
      salScore: 88,
      yearBuilt: 2019,
      image: null,
    },
  ])

  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: "trade",
      title: "SAL bought 25 NVDA",
      message: "Executed at $142.50",
      time: "2 hours ago",
      read: false,
    },
    {
      id: 2,
      type: "distribution",
      title: "CSREC Distribution",
      message: "You received $1,892.40",
      time: "1 day ago",
      read: false,
    },
    {
      id: 3,
      type: "capital",
      title: "Interest Payment",
      message: "Capital payment of $649.73",
      time: "2 days ago",
      read: true,
    },
    {
      id: 4,
      type: "alert",
      title: "Price Alert: BTC",
      message: "Bitcoin crossed $105,000",
      time: "3 days ago",
      read: true,
    },
  ])

  return (
    <AppContext.Provider
      value={{
        portfolio,
        setPortfolio,
        csrec,
        setCSREC,
        trading,
        setTrading,
        capital,
        setCapital,
        salRan,
        setSalRan,
        properties,
        setProperties,
        notifications,
        setNotifications,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

// ============================================
// REUSABLE COMPONENTS
// ============================================

// SaintSal Robot Icon
export const SaintSalRobot = ({ size = 60 }) => (
  <img
    src="/saintsal-icon.png"
    alt="SaintSal™"
    style={{
      width: size,
      height: size,
      borderRadius: size * 0.2,
      boxShadow: `0 4px 20px rgba(212, 175, 55, 0.3)`,
      flexShrink: 0,
      objectFit: "contain",
    }}
  />
)

// Card Component
export const Card = ({ children, style = {}, glow = false, onClick, className = "" }) => (
  <div
    onClick={onClick}
    className={className}
    style={{
      background: "linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.02) 100%)",
      backdropFilter: "blur(20px)",
      borderRadius: 24,
      padding: 20,
      border: `1px solid ${glow ? "rgba(212, 175, 55, 0.2)" : "rgba(255, 255, 255, 0.08)"}`,
      boxShadow: glow
        ? "0 8px 32px rgba(212, 175, 55, 0.15), 0 0 0 1px rgba(212, 175, 55, 0.1) inset"
        : "0 8px 32px rgba(0, 0, 0, 0.4)",
      cursor: onClick ? "pointer" : "default",
      transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
      ...style,
    }}
  >
    {children}
  </div>
)

// Button Component
export const Button = ({
  children,
  primary = false,
  danger = false,
  disabled = false,
  loading = false,
  fullWidth = false,
  size = "medium",
  style = {},
  onClick,
}) => {
  const sizes = {
    small: { padding: "10px 18px", fontSize: 13 },
    medium: { padding: "16px 28px", fontSize: 16 },
    large: { padding: "20px 36px", fontSize: 18 },
  }

  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      style={{
        ...sizes[size],
        borderRadius: 16,
        border: primary || danger ? "none" : `1px solid rgba(212, 175, 55, 0.3)`,
        background: danger
          ? `linear-gradient(135deg, #FF3366 0%, #CC2244 100%)`
          : primary
            ? `linear-gradient(135deg, ${colors.goldDark} 0%, ${colors.gold} 50%, ${colors.goldLight} 100%)`
            : "rgba(255, 255, 255, 0.04)",
        color: primary || danger ? "#000000" : colors.gold,
        fontWeight: 600,
        cursor: disabled ? "not-allowed" : "pointer",
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        boxShadow: primary
          ? "0 8px 24px rgba(212, 175, 55, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.1) inset"
          : "0 4px 12px rgba(0, 0, 0, 0.3)",
        opacity: disabled ? 0.5 : 1,
        width: fullWidth ? "100%" : "auto",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        transform: "translateY(0)",
        ...style,
      }}
      onMouseEnter={(e) => {
        if (!disabled) {
          e.currentTarget.style.transform = "translateY(-2px)"
          e.currentTarget.style.boxShadow = primary
            ? "0 12px 32px rgba(212, 175, 55, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.2) inset"
            : "0 8px 20px rgba(0, 0, 0, 0.4)"
        }
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)"
        e.currentTarget.style.boxShadow = primary
          ? "0 8px 24px rgba(212, 175, 55, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.1) inset"
          : "0 4px 12px rgba(0, 0, 0, 0.3)"
      }}
    >
      {loading && <LoadingSpinner size={16} />}
      {children}
    </button>
  )
}

// Input Component
export const Input = ({ type = "text", placeholder, value, onChange, icon, error, label, style = {} }) => (
  <div style={{ width: "100%", ...style }}>
    {label && (
      <label
        style={{
          display: "block",
          color: colors.textSecondary,
          fontSize: 14,
          marginBottom: 8,
          fontWeight: 500,
        }}
      >
        {label}
      </label>
    )}
    <div
      style={{
        position: "relative",
        display: "flex",
        alignItems: "center",
      }}
    >
      {icon && (
        <span
          style={{
            position: "absolute",
            left: 18,
            color: colors.textMuted,
            fontSize: 18,
          }}
        >
          {icon}
        </span>
      )}
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        style={{
          width: "100%",
          background: "rgba(255, 255, 255, 0.04)",
          backdropFilter: "blur(10px)",
          border: `1px solid ${error ? colors.error : "rgba(255, 255, 255, 0.08)"}`,
          borderRadius: 16,
          padding: icon ? "18px 18px 18px 52px" : "18px",
          color: colors.textPrimary,
          fontSize: 16,
          outline: "none",
          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        }}
        onFocus={(e) => {
          e.currentTarget.style.borderColor = error ? colors.error : "rgba(212, 175, 55, 0.5)"
          e.currentTarget.style.boxShadow = `0 0 0 4px ${error ? "rgba(255, 51, 102, 0.1)" : "rgba(212, 175, 55, 0.1)"}`
        }}
        onBlur={(e) => {
          e.currentTarget.style.borderColor = error ? colors.error : "rgba(255, 255, 255, 0.08)"
          e.currentTarget.style.boxShadow = "none"
        }}
      />
    </div>
    {error && (
      <p
        style={{
          color: colors.error,
          fontSize: 12,
          marginTop: 6,
          marginBottom: 0,
        }}
      >
        {error}
      </p>
    )}
  </div>
)

// Loading Spinner
export const LoadingSpinner = ({ size = 24, color = colors.gold }) => (
  <div
    style={{
      width: size,
      height: size,
      border: `2px solid ${color}30`,
      borderTopColor: color,
      borderRadius: "50%",
      animation: "spin 1s linear infinite",
    }}
  >
    <style>{`
      @keyframes spin {
        to { transform: rotate(360deg); }
      }
    `}</style>
  </div>
)

// Tab Bar Item
export const TabItem = ({ icon, label, isActive, onClick, badge }) => (
  <div
    onClick={onClick}
    style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: 4,
      cursor: "pointer",
      padding: "8px 16px",
      transition: "all 0.3s ease",
      position: "relative",
    }}
  >
    <span
      style={{
        fontSize: 24,
        filter: isActive ? `drop-shadow(0 0 8px ${colors.gold})` : "none",
        transition: "filter 0.3s ease",
      }}
    >
      {icon}
    </span>
    {badge && (
      <span
        style={{
          position: "absolute",
          top: 4,
          right: 8,
          width: 8,
          height: 8,
          borderRadius: "50%",
          background: colors.neonRed,
          boxShadow: `0 0 8px ${colors.neonRed}`,
        }}
      />
    )}
    <span
      style={{
        fontSize: 11,
        fontWeight: 500,
        color: isActive ? colors.gold : colors.textSecondary,
        ...(isActive ? neonGlow(colors.gold, 0.5) : {}),
        transition: "all 0.3s ease",
      }}
    >
      {label}
    </span>
    {isActive && (
      <div
        style={{
          width: 4,
          height: 4,
          borderRadius: "50%",
          background: colors.gold,
          boxShadow: `0 0 8px ${colors.gold}`,
        }}
      />
    )}
  </div>
)

// Progress Bar
export const ProgressBar = ({ value, max = 100, color = colors.gold, height = 6 }) => (
  <div
    style={{
      height,
      background: colors.surfaceLight,
      borderRadius: height / 2,
      overflow: "hidden",
    }}
  >
    <div
      style={{
        width: `${(value / max) * 100}%`,
        height: "100%",
        background: color,
        borderRadius: height / 2,
        boxShadow: `0 0 10px ${color}`,
        transition: "width 0.5s ease",
      }}
    />
  </div>
)

// Chart Components
export const MiniChart = ({ positive = true, height = 60, data }) => {
  const defaultPoints = positive
    ? "0,50 20,45 40,48 60,35 80,38 100,25 120,30 140,15 160,20 180,10"
    : "0,20 20,25 40,22 60,35 80,32 100,45 120,40 140,50 160,48 180,55"

  const color = positive ? colors.neonGreen : colors.neonRed

  return (
    <svg width="100%" height={height} viewBox="0 0 180 60" preserveAspectRatio="none">
      <defs>
        <linearGradient id={`chartGrad${positive ? "Pos" : "Neg"}`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon points={`0,60 ${data || defaultPoints} 180,60`} fill={`url(#chartGrad${positive ? "Pos" : "Neg"})`} />
      <polyline
        points={data || defaultPoints}
        fill="none"
        stroke={color}
        strokeWidth="2"
        style={{ filter: `drop-shadow(0 0 4px ${color})` }}
      />
    </svg>
  )
}

export const PortfolioChart = ({ color = colors.gold }) => (
  <svg width="100%" height="120" viewBox="0 0 300 120" preserveAspectRatio="none">
    <defs>
      <linearGradient id="portfolioGrad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor={color} stopOpacity="0.4" />
        <stop offset="100%" stopColor={color} stopOpacity="0" />
      </linearGradient>
    </defs>
    <polygon
      points="0,120 0,90 30,85 60,80 90,70 120,75 150,60 180,55 210,45 240,50 270,35 300,30 300,120"
      fill="url(#portfolioGrad)"
    />
    <polyline
      points="0,90 30,85 60,80 90,70 120,75 150,60 180,55 210,45 240,50 270,35 300,30"
      fill="none"
      stroke={color}
      strokeWidth="3"
      style={{ filter: `drop-shadow(0 0 8px ${color})` }}
    />
  </svg>
)

// Score Ring
export const ScoreRing = ({ score, size = 48, strokeWidth = 4 }) => {
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const offset = circumference - (score / 100) * circumference

  return (
    <div style={{ position: "relative", width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={colors.surfaceLight}
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={colors.gold}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ filter: `drop-shadow(0 0 4px ${colors.gold})` }}
        />
      </svg>
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontWeight: 700,
          fontSize: size * 0.28,
          color: colors.gold,
        }}
      >
        {score}
      </div>
    </div>
  )
}

// Badge Component
export const Badge = ({ children, variant = "default", size = "medium" }) => {
  const variants = {
    default: { bg: colors.surfaceLight, color: colors.textSecondary },
    success: { bg: `${colors.neonGreen}20`, color: colors.neonGreen },
    warning: { bg: `${colors.warning}20`, color: colors.warning },
    error: { bg: `${colors.neonRed}20`, color: colors.neonRed },
    gold: { bg: `${colors.gold}20`, color: colors.gold },
    purple: { bg: `${colors.neonPurple}20`, color: colors.neonPurple },
  }

  const sizes = {
    small: { padding: "4px 8px", fontSize: 10 },
    medium: { padding: "6px 12px", fontSize: 12 },
    large: { padding: "8px 16px", fontSize: 14 },
  }

  return (
    <span
      style={{
        ...sizes[size],
        background: variants[variant].bg,
        color: variants[variant].color,
        borderRadius: 8,
        fontWeight: 600,
        display: "inline-flex",
        alignItems: "center",
        gap: 4,
      }}
    >
      {children}
    </span>
  )
}

// Empty State
export const EmptyState = ({ icon, title, description, action }) => (
  <div
    style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: 40,
      textAlign: "center",
    }}
  >
    <div style={{ fontSize: 48, marginBottom: 16, opacity: 0.5 }}>{icon}</div>
    <h3 style={{ color: colors.textPrimary, margin: "0 0 8px 0" }}>{title}</h3>
    <p style={{ color: colors.textSecondary, margin: "0 0 24px 0" }}>{description}</p>
    {action}
  </div>
)

// ============================================
// FORMAT UTILITIES
// ============================================

export const formatCurrency = (value, decimals = 2) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value)
}

export const formatPercent = (value, decimals = 2) => {
  const sign = value >= 0 ? "+" : ""
  return `${sign}${value.toFixed(decimals)}%`
}

export const formatNumber = (value, decimals = 0) => {
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value)
}

export const formatCompact = (value) => {
  if (value >= 1000000000) return `$${(value / 1000000000).toFixed(1)}B`
  if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`
  if (value >= 1000) return `$${(value / 1000).toFixed(1)}K`
  return `$${value}`
}

// ============================================
// MAIN APP COMPONENT
// ============================================

const CookinSaintsApp = () => {
  const [currentScreen, setCurrentScreen] = useState("splash")
  const [activeTab, setActiveTab] = useState("home")

  // Splash screen timer
  useEffect(() => {
    if (currentScreen === "splash") {
      const timer = setTimeout(() => setCurrentScreen("auth"), 2500)
      return () => clearTimeout(timer)
    }
  }, [currentScreen])

  return (
    <AuthProvider>
      <AppProvider>
        <div
          style={{
            width: "100%",
            maxWidth: 430,
            height: 932,
            margin: "0 auto",
            background: colors.background,
            borderRadius: 40,
            overflow: "hidden",
            position: "relative",
            fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", sans-serif',
            boxShadow: "0 25px 80px rgba(0,0,0,0.5)",
            border: `1px solid ${colors.border}`,
          }}
        >
          {/* Status Bar */}
          <StatusBar />

          {/* Screen Content */}
          <ScreenRouter
            currentScreen={currentScreen}
            setCurrentScreen={setCurrentScreen}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />
        </div>
      </AppProvider>
    </AuthProvider>
  )
}

// Status Bar
const StatusBar = () => (
  <div
    style={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "12px 28px",
      color: colors.textPrimary,
      fontSize: 14,
      fontWeight: 600,
      position: "relative",
      zIndex: 50,
    }}
  >
    <span>9:41</span>
    <div
      style={{
        width: 125,
        height: 34,
        background: "#000",
        borderRadius: 20,
        position: "absolute",
        left: "50%",
        transform: "translateX(-50%)",
      }}
    />
    <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
      <span style={{ fontSize: 16 }}>📶</span>
      <span style={{ fontSize: 16 }}>🔋</span>
    </div>
  </div>
)

// Screen Router
const ScreenRouter = ({ currentScreen, setCurrentScreen, activeTab, setActiveTab }) => {
  const { isAuthenticated, isLoading } = useAuth()

  if (currentScreen === "splash") {
    return <SplashScreen />
  }

  if (currentScreen === "auth" && !isAuthenticated) {
    return <AuthScreen onComplete={() => setCurrentScreen("main")} />
  }

  return <MainApp activeTab={activeTab} setActiveTab={setActiveTab} />
}

// ============================================
// SPLASH SCREEN
// ============================================

const SplashScreen = () => (
  <div
    style={{
      height: "calc(100% - 58px)",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      background: `radial-gradient(ellipse at center, ${colors.surface} 0%, ${colors.background} 70%)`,
    }}
  >
    <div
      style={{
        animation: "pulse 2s ease-in-out infinite",
      }}
    >
      <SaintSalRobot size={120} />
    </div>

    <h1
      style={{
        ...goldGradient,
        fontSize: 36,
        fontWeight: 800,
        margin: "24px 0 8px 0",
        letterSpacing: 2,
      }}
    >
      CookinSaints
    </h1>

    <p
      style={{
        color: colors.textSecondary,
        fontSize: 16,
        margin: 0,
      }}
    >
      Where Hustlers Build Wealth
    </p>

    <div
      style={{
        marginTop: 48,
        display: "flex",
        gap: 8,
      }}
    >
      <div
        style={{
          width: 8,
          height: 8,
          borderRadius: "50%",
          background: colors.gold,
          animation: "bounce 1.4s ease-in-out infinite",
        }}
      />
      <div
        style={{
          width: 8,
          height: 8,
          borderRadius: "50%",
          background: colors.gold,
          animation: "bounce 1.4s ease-in-out 0.2s infinite",
        }}
      />
      <div
        style={{
          width: 8,
          height: 8,
          borderRadius: "50%",
          background: colors.gold,
          animation: "bounce 1.4s ease-in-out 0.4s infinite",
        }}
      />
    </div>

    <style>{`
      @keyframes pulse {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.05); }
      }
      @keyframes bounce {
        0%, 80%, 100% { transform: translateY(0); }
        40% { transform: translateY(-10px); }
      }
    `}</style>
  </div>
)

// ============================================
// AUTH SCREEN
// ============================================

const AuthScreen = ({ onComplete }) => {
  const [mode, setMode] = useState("login")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const { login, signup } = useAuth()

  const handleSubmit = async () => {
    setError("")
    setIsLoading(true)

    try {
      if (mode === "login") {
        await login(email, password)
      } else {
        await signup(email, password, name)
      }
      onComplete()
    } catch (err) {
      setError(err.message || "Something went wrong")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div
      style={{
        height: "calc(100% - 58px)",
        display: "flex",
        flexDirection: "column",
        padding: 24,
      }}
    >
      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: 40, marginTop: 20 }}>
        <SaintSalRobot size={80} />
        <h1
          style={{
            ...goldGradient,
            fontSize: 28,
            fontWeight: 800,
            margin: "20px 0 8px 0",
          }}
        >
          {mode === "login" ? "Welcome Back" : "Join CookinSaints"}
        </h1>
        <p style={{ color: colors.textSecondary, fontSize: 14, margin: 0 }}>
          {mode === "login" ? "Sign in to access your portfolio" : "Start building wealth with SaintSal™"}
        </p>
      </div>

      {/* Form */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 16 }}>
        {mode === "signup" && (
          <Input
            label="Full Name"
            placeholder="Enter your name"
            icon="👤"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        )}

        <Input
          label="Email"
          type="email"
          placeholder="Enter your email"
          icon="✉️"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <Input
          label="Password"
          type="password"
          placeholder="Enter your password"
          icon="🔒"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={error}
        />

        {mode === "login" && (
          <p
            style={{
              color: colors.gold,
              fontSize: 14,
              textAlign: "right",
              margin: 0,
              cursor: "pointer",
            }}
          >
            Forgot Password?
          </p>
        )}

        <Button primary fullWidth size="large" loading={isLoading} onClick={handleSubmit} style={{ marginTop: 16 }}>
          {mode === "login" ? "Sign In" : "Create Account"}
        </Button>

        {/* Divider */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            margin: "16px 0",
          }}
        >
          <div style={{ flex: 1, height: 1, background: colors.border }} />
          <span style={{ color: colors.textMuted, fontSize: 12 }}>OR</span>
          <div style={{ flex: 1, height: 1, background: colors.border }} />
        </div>

        {/* Social Auth */}
        <Button fullWidth style={{ background: colors.surface }}>
          🍎 Continue with Apple
        </Button>

        <Button fullWidth style={{ background: colors.surface }}>
          🔵 Continue with Google
        </Button>
      </div>

      {/* Footer */}
      <div style={{ textAlign: "center", marginTop: 24 }}>
        <p style={{ color: colors.textSecondary, fontSize: 14, margin: 0 }}>
          {mode === "login" ? "Don't have an account? " : "Already have an account? "}
          <span
            onClick={() => setMode(mode === "login" ? "signup" : "login")}
            style={{ color: colors.gold, cursor: "pointer", fontWeight: 600 }}
          >
            {mode === "login" ? "Sign Up" : "Sign In"}
          </span>
        </p>
      </div>
    </div>
  )
}

// ============================================
// MAIN APP CONTAINER
// ============================================

const MainApp = ({ activeTab, setActiveTab }) => {
  const { notifications } = useApp()
  const unreadCount = notifications.filter((n) => !n.read).length

  const renderScreen = () => {
    switch (activeTab) {
      case "home":
        return <HomeScreen />
      case "trade":
        return <TradeScreen />
      case "csrec":
        return <CSRECScreen />
      case "capital":
        return <CapitalScreen />
      case "sal":
        return <SALScreen />
      default:
        return <HomeScreen />
    }
  }

  return (
    <>
      <div
        style={{
          height: "calc(100% - 140px)",
          overflowY: "auto",
          overflowX: "hidden",
        }}
      >
        {renderScreen()}
      </div>

      {/* Tab Bar */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          background: `${colors.surface}ee`,
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          borderTop: `1px solid ${colors.border}`,
          display: "flex",
          justifyContent: "space-around",
          padding: "8px 0 24px 0",
        }}
      >
        <TabItem icon="🏠" label="HOME" isActive={activeTab === "home"} onClick={() => setActiveTab("home")} />
        <TabItem icon="📈" label="TRADE" isActive={activeTab === "trade"} onClick={() => setActiveTab("trade")} />
        <TabItem icon="💎" label="CSREC" isActive={activeTab === "csrec"} onClick={() => setActiveTab("csrec")} />
        <TabItem icon="💰" label="CAPITAL" isActive={activeTab === "capital"} onClick={() => setActiveTab("capital")} />
        <TabItem
          icon="🤖"
          label="SAL"
          isActive={activeTab === "sal"}
          onClick={() => setActiveTab("sal")}
          badge={unreadCount > 0}
        />
      </div>
    </>
  )
}

// ============================================
// HOME SCREEN
// ============================================

const HomeScreen = () => {
  const { user } = useAuth()
  const { portfolio, notifications } = useApp()
  const [selectedPeriod, setSelectedPeriod] = useState("1M")

  return (
    <div style={{ padding: 20 }}>
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 24,
        }}
      >
        <div>
          <p style={{ color: colors.textSecondary, fontSize: 14, margin: 0 }}>What's good,</p>
          <h1 style={{ ...goldGradient, fontSize: 28, fontWeight: 700, margin: 0 }}>{user?.name || "Hustler"} 👋</h1>
        </div>
        <div style={{ display: "flex", gap: 12 }}>
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: 12,
              background: colors.surface,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: `1px solid ${colors.border}`,
              position: "relative",
              cursor: "pointer",
            }}
          >
            🔔
            {notifications.filter((n) => !n.read).length > 0 && (
              <span
                style={{
                  position: "absolute",
                  top: -4,
                  right: -4,
                  width: 16,
                  height: 16,
                  borderRadius: "50%",
                  background: colors.neonRed,
                  color: "#fff",
                  fontSize: 10,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: 600,
                }}
              >
                {notifications.filter((n) => !n.read).length}
              </span>
            )}
          </div>
          <SaintSalRobot size={40} />
        </div>
      </div>

      {/* Total Wealth Card */}
      <Card glow style={{ marginBottom: 20 }}>
        <p style={{ color: colors.textSecondary, fontSize: 14, margin: "0 0 8px 0" }}>TOTAL WEALTH</p>
        <h2
          style={{
            fontSize: 36,
            fontWeight: 700,
            margin: "0 0 4px 0",
            color: colors.textPrimary,
          }}
        >
          {formatCurrency(portfolio.totalValue, 2).split(".")[0]}
          <span style={{ fontSize: 24, color: colors.textSecondary }}>
            .{formatCurrency(portfolio.totalValue, 2).split(".")[1]}
          </span>
        </h2>
        <p style={{ margin: "0 0 16px 0", fontSize: 14 }}>
          <span style={{ ...neonGlow(colors.neonGreen, 0.5), fontWeight: 600 }}>
            ▲ {formatCurrency(portfolio.dayChange)} ({formatPercent(portfolio.dayChangePercent)})
          </span>
          <span style={{ color: colors.textSecondary }}> this month</span>
        </p>

        <PortfolioChart />

        <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
          {["1D", "1W", "1M", "3M", "YTD", "1Y", "ALL"].map((period) => (
            <span
              key={period}
              onClick={() => setSelectedPeriod(period)}
              style={{
                fontSize: 12,
                padding: "6px 10px",
                borderRadius: 8,
                background: selectedPeriod === period ? colors.gold : "transparent",
                color: selectedPeriod === period ? "#0F0F0F" : colors.textSecondary,
                fontWeight: selectedPeriod === period ? 600 : 400,
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
            >
              {period}
            </span>
          ))}
        </div>
      </Card>

      {/* Allocation Card */}
      <Card style={{ marginBottom: 20 }}>
        <p style={{ color: colors.textSecondary, fontSize: 14, margin: "0 0 16px 0" }}>YOUR ALLOCATION</p>
        {[
          { key: "csrec", label: "CSREC", emoji: "💎", color: colors.gold },
          { key: "trading", label: "Trading", emoji: "📈", color: colors.neonCyan },
          { key: "capital", label: "Capital", emoji: "💰", color: colors.neonGreen },
          { key: "salRan", label: "SAL-Ran", emoji: "🤖", color: colors.neonPurple },
        ].map((item) => (
          <div key={item.key} style={{ marginBottom: 12 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
              <span style={{ color: colors.textPrimary, fontSize: 14 }}>
                {item.emoji} {item.label}
              </span>
              <span style={{ color: colors.textSecondary, fontSize: 14 }}>
                {formatCurrency(portfolio.allocations[item.key].value, 0)}{" "}
                <span style={{ color: item.color }}>{portfolio.allocations[item.key].percent}%</span>
              </span>
            </div>
            <ProgressBar value={portfolio.allocations[item.key].percent} color={item.color} />
          </div>
        ))}
      </Card>

      {/* SAL's Daily Briefing */}
      <Card
        style={{
          background: `linear-gradient(135deg, ${colors.surface} 0%, rgba(212, 175, 55, 0.1) 100%)`,
          border: `1px solid ${colors.gold}30`,
        }}
      >
        <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
          <SaintSalRobot size={48} />
          <div style={{ flex: 1 }}>
            <p
              style={{
                ...neonGlow(colors.gold, 0.5),
                fontSize: 14,
                fontWeight: 600,
                margin: "0 0 8px 0",
              }}
            >
              🤖 SAL'S DAILY BRIEFING
            </p>
            <p style={{ color: colors.textSecondary, fontSize: 14, margin: 0, lineHeight: 1.5 }}>
              "Your <span style={{ color: colors.gold }}>CSREC</span> holdings are outperforming public REITs by{" "}
              <span style={{ ...neonGlow(colors.neonGreen, 0.5) }}>4.2% YTD</span>. New Austin property closing next
              week. Your <span style={{ color: colors.neonPurple }}>SAL-Ran</span> portfolio captured the NVDA rally
              perfectly."
            </p>
            <div style={{ display: "flex", gap: 12, marginTop: 16 }}>
              <Button style={{ flex: 1, padding: "10px 16px", fontSize: 14 }}>ASK SAL</Button>
              <Button primary style={{ flex: 1, padding: "10px 16px", fontSize: 14 }}>
                VIEW REPORT
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* Recent Activity */}
      <div style={{ marginTop: 20 }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 12,
          }}
        >
          <p style={{ color: colors.textSecondary, fontSize: 14, margin: 0 }}>RECENTACTIVITY</p>
          <span style={{ color: colors.gold, fontSize: 14, cursor: "pointer" }}>See All →</span>
        </div>
        <Card>
          {[
            { icon: "🤖", title: "SAL bought 25 NVDA @ $142.50", amount: "-$3,562.50", time: "2h ago" },
            { icon: "💎", title: "CSREC distribution received", amount: "+$1,892.40", positive: true, time: "1d ago" },
            { icon: "💰", title: "Capital interest payment", amount: "+$892.40", positive: true, time: "2d ago" },
          ].map((item, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
                padding: "12px 0",
                borderBottom: i < 2 ? `1px solid ${colors.border}` : "none",
              }}
            >
              <span style={{ fontSize: 20, marginRight: 12 }}>{item.icon}</span>
              <div style={{ flex: 1 }}>
                <p style={{ color: colors.textPrimary, fontSize: 14, margin: 0 }}>{item.title}</p>
                <p style={{ color: colors.textMuted, fontSize: 12, margin: 0 }}>{item.time}</p>
              </div>
              <span
                style={{
                  color: item.positive ? colors.neonGreen : colors.textSecondary,
                  fontWeight: 600,
                  fontSize: 14,
                }}
              >
                {item.amount}
              </span>
            </div>
          ))}
        </Card>
      </div>
    </div>
  )
}

// ============================================
// TRADE SCREEN
// ============================================

const TradeScreen = () => {
  const { trading } = useApp()
  const [activeCategory, setActiveCategory] = useState("stocks")

  return (
    <div style={{ padding: 20 }}>
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 20,
        }}
      >
        <h1 style={{ ...goldGradient, fontSize: 28, fontWeight: 700, margin: 0 }}>Trade</h1>
        <div
          style={{
            width: 40,
            height: 40,
            borderRadius: 12,
            background: colors.surface,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            border: `1px solid ${colors.border}`,
            fontSize: 20,
            cursor: "pointer",
          }}
        >
          🔍
        </div>
      </div>

      {/* Category Tabs */}
      <div
        style={{
          display: "flex",
          gap: 8,
          marginBottom: 20,
          background: colors.surface,
          padding: 4,
          borderRadius: 12,
        }}
      >
        {["stocks", "crypto", "etfs", "options"].map((cat) => (
          <div
            key={cat}
            onClick={() => setActiveCategory(cat)}
            style={{
              flex: 1,
              padding: "10px 16px",
              borderRadius: 10,
              background: activeCategory === cat ? colors.gold : "transparent",
              color: activeCategory === cat ? "#0F0F0F" : colors.textSecondary,
              fontWeight: 600,
              fontSize: 14,
              textAlign: "center",
              cursor: "pointer",
              textTransform: "uppercase",
              transition: "all 0.2s ease",
            }}
          >
            {cat}
          </div>
        ))}
      </div>

      {/* Portfolio Summary */}
      <Card style={{ marginBottom: 20 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <p style={{ color: colors.textSecondary, fontSize: 14, margin: "0 0 4px 0" }}>TRADING PORTFOLIO</p>
            <h2 style={{ fontSize: 28, fontWeight: 700, margin: "0 0 4px 0", color: colors.textPrimary }}>
              {formatCurrency(trading.portfolioValue, 0)}
            </h2>
            <p style={{ ...neonGlow(colors.neonGreen, 0.5), fontSize: 14, margin: 0, fontWeight: 600 }}>
              ▲ {formatCurrency(trading.dayChange)} ({formatPercent(trading.dayChangePercent)}) today
            </p>
          </div>
          <div style={{ textAlign: "right" }}>
            <p style={{ color: colors.textSecondary, fontSize: 12, margin: "0 0 4px 0" }}>Buying Power</p>
            <p style={{ color: colors.gold, fontSize: 18, fontWeight: 600, margin: 0 }}>
              {formatCurrency(trading.buyingPower, 0)}
            </p>
          </div>
        </div>
      </Card>

      {/* SAL's Top Picks */}
      <p
        style={{
          ...neonGlow(colors.gold, 0.5),
          fontSize: 14,
          fontWeight: 600,
          marginBottom: 12,
        }}
      >
        🤖 SAL'S TOP PICKS TODAY
      </p>

      {[
        { symbol: "NVDA", name: "NVIDIA", price: 142.87, change: 3.45, score: 94, positive: true },
        { symbol: "BTC", name: "Bitcoin", price: 104230, change: -0.82, score: 87, positive: false },
      ].map((stock, i) => (
        <Card key={i} style={{ marginBottom: 12 }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 12,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 12,
                  background: `linear-gradient(135deg, ${colors.surfaceLight} 0%, ${colors.surface} 100%)`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: 700,
                  fontSize: 12,
                  color: colors.gold,
                  border: `1px solid ${colors.border}`,
                }}
              >
                {stock.symbol.slice(0, 3)}
              </div>
              <div>
                <p style={{ color: colors.textPrimary, fontWeight: 600, margin: 0 }}>{stock.symbol}</p>
                <p style={{ color: colors.textSecondary, fontSize: 12, margin: 0 }}>{stock.name}</p>
              </div>
            </div>
            <div style={{ textAlign: "right" }}>
              <p style={{ color: colors.textPrimary, fontWeight: 600, margin: 0 }}>
                {formatCurrency(stock.price, stock.price > 1000 ? 0 : 2)}
              </p>
              <p
                style={{
                  ...neonGlow(stock.positive ? colors.neonGreen : colors.neonRed, 0.5),
                  fontSize: 12,
                  margin: 0,
                  fontWeight: 600,
                }}
              >
                {stock.positive ? "▲" : "▼"} {formatPercent(stock.change)}
              </p>
            </div>
          </div>

          <div
            style={{
              background: colors.surfaceLight,
              borderRadius: 8,
              padding: 12,
              display: "flex",
              alignItems: "center",
              gap: 12,
            }}
          >
            <ScoreRing score={stock.score} />
            <div style={{ flex: 1 }}>
              <p style={{ color: colors.textSecondary, fontSize: 12, margin: 0, lineHeight: 1.4 }}>
                {stock.positive
                  ? '"Strong buy signal. AI demand accelerating. HACP™ confidence: HIGH"'
                  : '"Consolidation phase. Accumulate on dips. HACP™ confidence: MEDIUM-HIGH"'}
              </p>
            </div>
          </div>

          <div style={{ display: "flex", gap: 12, marginTop: 12 }}>
            <Button style={{ flex: 1, padding: "10px 16px", fontSize: 14 }}>ANALYZE</Button>
            <Button primary style={{ flex: 1, padding: "10px 16px", fontSize: 14 }}>
              TRADE
            </Button>
          </div>
        </Card>
      ))}

      {/* Positions */}
      <p style={{ color: colors.textSecondary, fontSize: 14, marginTop: 20, marginBottom: 12 }}>YOUR POSITIONS</p>
      <Card>
        {trading.positions.slice(0, 4).map((pos, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "12px 0",
              borderBottom: i < 3 ? `1px solid ${colors.border}` : "none",
            }}
          >
            <div>
              <p style={{ color: colors.textPrimary, fontWeight: 600, margin: 0 }}>{pos.symbol}</p>
              <p style={{ color: colors.textSecondary, fontSize: 12, margin: 0 }}>
                {pos.shares} {pos.shares === 1 ? "share" : "shares"}
              </p>
            </div>
            <div style={{ textAlign: "right" }}>
              <p style={{ color: colors.textPrimary, fontWeight: 600, margin: 0 }}>{formatCurrency(pos.value, 0)}</p>
              <p
                style={{
                  ...neonGlow(pos.changePercent >= 0 ? colors.neonGreen : colors.neonRed, 0.5),
                  fontSize: 12,
                  margin: 0,
                  fontWeight: 600,
                }}
              >
                {pos.changePercent >= 0 ? "▲" : "▼"} {formatPercent(pos.changePercent)}
              </p>
            </div>
          </div>
        ))}
      </Card>
    </div>
  )
}

// ============================================
// CSREC SCREEN
// ============================================

const CSRECScreen = () => {
  const { csrec, properties } = useApp()
  const [selectedPeriod, setSelectedPeriod] = useState("1M")

  return (
    <div style={{ padding: 20 }}>
      {/* Header Banner */}
      <Card
        glow
        style={{
          marginBottom: 20,
          background: `linear-gradient(135deg, ${colors.surface} 0%, rgba(212, 175, 55, 0.15) 100%)`,
          textAlign: "center",
          padding: 24,
        }}
      >
        <div
          style={{
            fontSize: 48,
            marginBottom: 8,
            filter: `drop-shadow(0 0 20px ${colors.gold})`,
          }}
        >
          💎
        </div>
        <h1
          style={{
            ...goldGradient,
            fontSize: 32,
            fontWeight: 800,
            margin: "0 0 4px 0",
            letterSpacing: 4,
          }}
        >
          CSREC
        </h1>
        <p style={{ color: colors.textSecondary, fontSize: 14, margin: "0 0 12px 0" }}>
          CookinSaint Real Estate Currency
        </p>
        <p
          style={{
            ...neonGlow(colors.neonCyan, 0.5),
            fontSize: 16,
            fontWeight: 700,
            margin: 0,
          }}
        >
          "Own Real Estate Like You Own Stocks"
        </p>
        <p style={{ color: colors.textSecondary, fontSize: 12, margin: "12px 0 0 0" }}>
          Powered by <span style={{ color: colors.gold }}>SaintSal™</span> +{" "}
          <span style={{ color: colors.neonPurple }}>HACP™</span>
        </p>
      </Card>

      {/* Price Card */}
      <Card style={{ marginBottom: 20 }}>
        <div style={{ textAlign: "center", marginBottom: 16 }}>
          <p style={{ color: colors.textSecondary, fontSize: 14, margin: "0 0 8px 0" }}>CSREC PRICE</p>
          <h2 style={{ fontSize: 42, fontWeight: 700, margin: "0 0 4px 0", color: colors.textPrimary }}>
            ${Math.floor(csrec.price)}
            <span style={{ fontSize: 28 }}>.{(csrec.price % 1).toFixed(2).split(".")[1]}</span>
          </h2>
          <p style={{ margin: 0 }}>
            <span style={{ ...neonGlow(colors.neonGreen, 0.5), fontWeight: 600 }}>
              ▲ {formatCurrency(csrec.dayChange)} ({formatPercent(csrec.dayChangePercent)})
            </span>
            <span style={{ color: colors.textSecondary }}> today</span>
          </p>
          <p style={{ ...neonGlow(colors.neonGreen, 0.5), fontSize: 14, margin: "4px 0 0 0" }}>
            ▲ {formatPercent(csrec.ytdReturn)} YTD
          </p>
        </div>

        <MiniChart positive height={80} />

        <div style={{ display: "flex", gap: 8, marginTop: 12, justifyContent: "center" }}>
          {["1M", "3M", "6M", "1Y", "ALL"].map((period) => (
            <span
              key={period}
              onClick={() => setSelectedPeriod(period)}
              style={{
                fontSize: 12,
                padding: "6px 12px",
                borderRadius: 8,
                background: selectedPeriod === period ? colors.gold : "transparent",
                color: selectedPeriod === period ? "#0F0F0F" : colors.textSecondary,
                fontWeight: selectedPeriod === period ? 600 : 400,
                cursor: "pointer",
              }}
            >
              {period}
            </span>
          ))}
        </div>
      </Card>

      {/* Fund Metrics */}
      <Card style={{ marginBottom: 20 }}>
        <p
          style={{
            ...neonGlow(colors.gold, 0.5),
            fontSize: 14,
            fontWeight: 600,
            margin: "0 0 16px 0",
          }}
        >
          CSREC FUND METRICS
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          {[
            { label: "Total AUM", value: formatCompact(csrec.totalAUM) },
            { label: "Properties", value: csrec.propertyCount },
            { label: "Avg SAL Score", value: `${csrec.avgSalScore}/100`, highlight: true },
            { label: "Avg Cap Rate", value: `${csrec.avgCapRate}%` },
            { label: "Annual Yield", value: `${csrec.annualYield}%`, highlight: true },
            { label: "YTD Return", value: formatPercent(csrec.ytdReturn), positive: true },
          ].map((metric, i) => (
            <div
              key={i}
              style={{
                background: colors.surfaceLight,
                borderRadius: 12,
                padding: 12,
                textAlign: "center",
              }}
            >
              <p style={{ color: colors.textSecondary, fontSize: 11, margin: "0 0 4px 0" }}>{metric.label}</p>
              <p
                style={{
                  color: metric.positive ? colors.neonGreen : metric.highlight ? colors.gold : colors.textPrimary,
                  fontSize: 18,
                  fontWeight: 700,
                  margin: 0,
                  ...(metric.positive ? neonGlow(colors.neonGreen, 0.5) : {}),
                }}
              >
                {metric.value}
              </p>
            </div>
          ))}
        </div>
      </Card>

      {/* Your Holdings */}
      <Card style={{ marginBottom: 20 }}>
        <p style={{ color: colors.textSecondary, fontSize: 14, margin: "0 0 16px 0" }}>YOUR CSREC HOLDINGS</p>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
          <div>
            <h3 style={{ ...goldGradient, fontSize: 28, fontWeight: 700, margin: "0 0 4px 0" }}>
              {formatNumber(csrec.holdings.units)} <span style={{ fontSize: 16 }}>CSREC</span>
            </h3>
            <p style={{ color: colors.textPrimary, fontSize: 18, margin: "0 0 4px 0" }}>
              Value: {formatCurrency(csrec.holdings.value)}
            </p>
            <p style={{ color: colors.textSecondary, fontSize: 14, margin: 0 }}>
              Avg Cost: {formatCurrency(csrec.holdings.avgCost)}
            </p>
          </div>
          <div style={{ textAlign: "right" }}>
            <p style={{ ...neonGlow(colors.neonGreen, 0.5), fontSize: 16, fontWeight: 700, margin: "0 0 4px 0" }}>
              +{formatCurrency(csrec.holdings.totalReturn)}
            </p>
            <p style={{ color: colors.neonGreen, fontSize: 14, margin: 0 }}>
              ({formatPercent(csrec.holdings.returnPercent)})
            </p>
          </div>
        </div>

        <div
          style={{
            background: colors.surfaceLight,
            borderRadius: 12,
            padding: 12,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div>
            <p style={{ color: colors.textSecondary, fontSize: 12, margin: "0 0 4px 0" }}>Next Distribution</p>
            <p style={{ color: colors.textPrimary, fontWeight: 600, margin: 0 }}>
              {new Date(csrec.nextDistribution.date).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </p>
          </div>
          <div style={{ textAlign: "right" }}>
            <p style={{ color: colors.textSecondary, fontSize: 12, margin: "0 0 4px 0" }}>Est. Amount</p>
            <p style={{ ...neonGlow(colors.gold, 0.5), fontWeight: 700, margin: 0 }}>
              {formatCurrency(csrec.nextDistribution.estimatedAmount)}
            </p>
          </div>
        </div>
      </Card>

      {/* Action Buttons */}
      <div style={{ display: "flex", gap: 12, marginBottom: 20 }}>
        <Button primary style={{ flex: 1, padding: "16px 24px" }}>
          💎 BUY CSREC
        </Button>
        <Button style={{ flex: 1, padding: "16px 24px" }}>💸 SELL CSREC</Button>
      </div>

      {/* Properties Preview */}
      <Card>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <p style={{ color: colors.textSecondary, fontSize: 14, margin: 0 }}>PROPERTIES IN PORTFOLIO</p>
          <span style={{ color: colors.gold, fontSize: 14, cursor: "pointer" }}>View All →</span>
        </div>
        {properties.slice(0, 2).map((prop, i) => (
          <div
            key={prop.id}
            style={{
              display: "flex",
              alignItems: "center",
              padding: "12px 0",
              borderBottom: i === 0 ? `1px solid ${colors.border}` : "none",
              gap: 12,
            }}
          >
            <div
              style={{
                width: 56,
                height: 56,
                borderRadius: 12,
                background: `linear-gradient(135deg, ${colors.gold}30 0%, ${colors.gold}10 100%)`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 24,
              }}
            >
              {prop.type === "Multifamily" ? "🏢" : prop.type === "Industrial" ? "🏭" : "🏠"}
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ color: colors.textPrimary, fontWeight: 600, margin: "0 0 4px 0" }}>{prop.name}</p>
              <p style={{ color: colors.textSecondary, fontSize: 12, margin: 0 }}>
                {prop.location} • {prop.units ? `${prop.units} Units` : `${formatNumber(prop.sqft)} SF`}
              </p>
            </div>
            <div style={{ textAlign: "right" }}>
              <p style={{ color: colors.textPrimary, fontWeight: 600, margin: "0 0 4px 0" }}>
                {formatCompact(prop.nav)}
              </p>
              <Badge variant="gold" size="small">
                🤖 {prop.salScore}
              </Badge>
            </div>
          </div>
        ))}
      </Card>
    </div>
  )
}

// ============================================
// CAPITAL SCREEN
// ============================================

const CapitalScreen = () => {
  const { capital } = useApp()
  const [selectedTab, setSelectedTab] = useState("fund")

  return (
    <div style={{ padding: 20 }}>
      {/* Header Banner */}
      <Card
        glow
        style={{
          marginBottom: 20,
          background: `linear-gradient(135deg, ${colors.surface} 0%, rgba(0, 255, 136, 0.1) 100%)`,
          textAlign: "center",
          padding: 24,
        }}
      >
        <div style={{ fontSize: 48, marginBottom: 8 }}>💰</div>
        <h1
          style={{
            ...goldGradient,
            fontSize: 28,
            fontWeight: 800,
            margin: "0 0 4px 0",
          }}
        >
          COOKIN CAPITAL
        </h1>
        <p style={{ color: colors.textSecondary, fontSize: 14, margin: "0 0 12px 0" }}>Private Real Estate Lending</p>
        <p
          style={{
            ...neonGlow(colors.neonGreen, 0.5),
            fontSize: 20,
            fontWeight: 700,
            margin: 0,
          }}
        >
          Earn 9-12% Returns
        </p>
        <p style={{ color: colors.textSecondary, fontSize: 12, margin: "8px 0 0 0" }}>
          Every loan underwritten by <span style={{ color: colors.gold }}>SaintSal™</span>
        </p>
      </Card>

      {/* Portfolio Summary */}
      <Card style={{ marginBottom: 20 }}>
        <p style={{ color: colors.textSecondary, fontSize: 14, margin: "0 0 16px 0" }}>YOUR LENDING PORTFOLIO</p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          {[
            { label: "Total Invested", value: formatCurrency(capital.totalInvested, 0) },
            { label: "Weighted Avg Rate", value: `${capital.weightedAvgRate}%`, neon: true },
            { label: "Total Earned", value: formatCurrency(capital.totalEarned), gold: true },
            { label: "Next Payment", value: formatCurrency(capital.nextPayment.amount) },
          ].map((metric, i) => (
            <div key={i} style={{ background: colors.surfaceLight, borderRadius: 12, padding: 12 }}>
              <p style={{ color: colors.textSecondary, fontSize: 11, margin: "0 0 4px 0" }}>{metric.label}</p>
              <p
                style={{
                  color: metric.neon ? colors.neonGreen : metric.gold ? colors.gold : colors.textPrimary,
                  fontSize: 20,
                  fontWeight: 700,
                  margin: 0,
                  ...(metric.neon ? neonGlow(colors.neonGreen, 0.5) : {}),
                }}
              >
                {metric.value}
              </p>
            </div>
          ))}
        </div>
      </Card>

      {/* Investment Options */}
      <div style={{ display: "flex", gap: 12, marginBottom: 20 }}>
        <Card
          onClick={() => setSelectedTab("fund")}
          style={{
            flex: 1,
            textAlign: "center",
            border: selectedTab === "fund" ? `2px solid ${colors.gold}` : `1px solid ${colors.border}`,
            cursor: "pointer",
          }}
        >
          <div style={{ fontSize: 32, marginBottom: 8 }}>🏦</div>
          <p style={{ color: colors.textPrimary, fontWeight: 600, margin: "0 0 4px 0" }}>LENDING FUND</p>
          <p style={{ ...neonGlow(colors.neonGreen, 0.5), fontWeight: 700, margin: "0 0 4px 0" }}>9-10%</p>
          <p style={{ color: colors.textSecondary, fontSize: 12, margin: 0 }}>Diversified</p>
        </Card>
        <Card
          onClick={() => setSelectedTab("notes")}
          style={{
            flex: 1,
            textAlign: "center",
            border: selectedTab === "notes" ? `2px solid ${colors.gold}` : `1px solid ${colors.border}`,
            cursor: "pointer",
          }}
        >
          <div style={{ fontSize: 32, marginBottom: 8 }}>📄</div>
          <p style={{ color: colors.textPrimary, fontWeight: 600, margin: "0 0 4px 0" }}>PICK LOANS</p>
          <p style={{ ...neonGlow(colors.neonCyan, 0.5), fontWeight: 700, margin: "0 0 4px 0" }}>10-12%</p>
          <p style={{ color: colors.textSecondary, fontSize: 12, margin: 0 }}>Choose deals</p>
        </Card>
      </div>

      {/* Fund Metrics */}
      <Card style={{ marginBottom: 20 }}>
        <p style={{ ...neonGlow(colors.gold, 0.5), fontSize: 14, fontWeight: 600, margin: "0 0 16px 0" }}>
          FUND METRICS
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
          {[
            { label: "Fund Size", value: formatCompact(capital.fundMetrics.fundSize) },
            { label: "Active Loans", value: capital.fundMetrics.activeLoans },
            { label: "Avg SAL Score", value: `${capital.fundMetrics.avgSalScore}/100` },
            { label: "Current Yield", value: `${capital.fundMetrics.currentYield}%` },
            { label: "Default Rate", value: `${capital.fundMetrics.defaultRate}%` },
            { label: "Avg LTV", value: `${capital.fundMetrics.avgLTV}%` },
          ].map((metric, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "8px 0",
                borderBottom: i < 4 ? `1px solid ${colors.border}` : "none",
              }}
            >
              <span style={{ color: colors.textSecondary, fontSize: 14 }}>{metric.label}</span>
              <span style={{ color: colors.textPrimary, fontSize: 14, fontWeight: 600 }}>{metric.value}</span>
            </div>
          ))}
        </div>
      </Card>

      {/* Your Investments */}
      <Card style={{ marginBottom: 20 }}>
        <p style={{ color: colors.textSecondary, fontSize: 14, margin: "0 0 16px 0" }}>YOUR INVESTMENTS</p>
        {capital.investments.map((inv, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "12px 0",
              borderBottom: i < capital.investments.length - 1 ? `1px solid ${colors.border}` : "none",
            }}
          >
            <div>
              <p style={{ color: colors.textPrimary, fontWeight: 600, margin: "0 0 4px 0" }}>{inv.name}</p>
              <Badge variant="success" size="small">
                {inv.status}
              </Badge>
            </div>
            <div style={{ textAlign: "right" }}>
              <p style={{ color: colors.textPrimary, fontWeight: 600, margin: "0 0 4px 0" }}>
                {formatCurrency(inv.amount, 0)}
              </p>
              <p style={{ ...neonGlow(colors.neonGreen, 0.5), fontSize: 12, margin: 0 }}>{inv.rate}%</p>
            </div>
          </div>
        ))}
      </Card>

      {/* Invest Button */}
      <Button primary fullWidth size="large">
        💰 INVEST MORE
      </Button>
    </div>
  )
}

// ============================================
// SAL SCREEN
// ============================================

const SALScreen = () => {
  const { user, updatePreferences } = useAuth()
  const { salRan } = useApp()
  const [showChat, setShowChat] = useState(false)

  if (showChat) {
    return <ChatScreen onClose={() => setShowChat(false)} />
  }

  return (
    <div style={{ padding: 20 }}>
      {/* Header */}
      <Card
        glow
        style={{
          marginBottom: 20,
          background: `linear-gradient(135deg, ${colors.surface} 0%, rgba(212, 175, 55, 0.15) 100%)`,
          textAlign: "center",
          padding: 24,
        }}
      >
        <SaintSalRobot size={80} />
        <h1
          style={{
            ...goldGradient,
            fontSize: 28,
            fontWeight: 800,
            margin: "16px 0 4px 0",
          }}
        >
          SaintSal™
        </h1>
        <p style={{ color: colors.textSecondary, fontSize: 14, margin: "0 0 8px 0" }}>
          Powered by <span style={{ ...neonGlow(colors.neonPurple, 0.5) }}>HACP™</span> Technology
        </p>
        <p style={{ color: colors.textSecondary, fontSize: 12, margin: 0, fontStyle: "italic" }}>
          "I don't just manage your money. I learn HOW you want it managed."
        </p>
      </Card>

      {/* Quick Actions */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 20 }}>
        {[
          { icon: "💬", label: "Chat with SAL", onClick: () => setShowChat(true) },
          { icon: "🤖", label: "SAL-Ran Portfolio" },
          { icon: "📊", label: "Market Analysis" },
          { icon: "⚙️", label: "HACP™ Settings" },
        ].map((item, i) => (
          <Card key={i} style={{ textAlign: "center", cursor: "pointer" }} onClick={item.onClick}>
            <div style={{ fontSize: 32, marginBottom: 8 }}>{item.icon}</div>
            <p style={{ color: colors.textPrimary, fontWeight: 600, margin: 0 }}>{item.label}</p>
          </Card>
        ))}
      </div>

      {/* SAL-Ran Portfolio */}
      <Card style={{ marginBottom: 20 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
          <div>
            <p style={{ ...neonGlow(colors.neonPurple, 0.5), fontSize: 14, fontWeight: 600, margin: "0 0 8px 0" }}>
              🤖 SAL-RAN PORTFOLIO
            </p>
            <h3 style={{ color: colors.textPrimary, fontSize: 28, fontWeight: 700, margin: "0 0 4px 0" }}>
              {formatCurrency(salRan.portfolioValue, 0)}
            </h3>
            <p style={{ ...neonGlow(colors.neonGreen, 0.5), fontSize: 14, margin: 0, fontWeight: 600 }}>
              ▲ {formatCurrency(salRan.ytdReturnDollars)} ({formatPercent(salRan.ytdReturn)}) YTD
            </p>
          </div>
          <div
            style={{
              background: colors.surfaceLight,
              borderRadius: 12,
              padding: "8px 12px",
              textAlign: "center",
            }}
          >
            <p style={{ color: colors.textSecondary, fontSize: 10, margin: "0 0 2px 0" }}>vs S&P 500</p>
            <p style={{ ...neonGlow(colors.neonGreen, 0.5), fontWeight: 700, margin: 0 }}>+{salRan.outperformance}%</p>
          </div>
        </div>

        <MiniChart positive height={60} />

        <div style={{ display: "flex", gap: 12, marginTop: 16 }}>
          <Button style={{ flex: 1, padding: "10px 16px", fontSize: 14 }}>VIEW PORTFOLIO</Button>
          <Button primary style={{ flex: 1, padding: "10px 16px", fontSize: 14 }}>
            ADD FUNDS
          </Button>
        </div>
      </Card>

      {/* HACP Profile */}
      <Card>
        <p style={{ ...neonGlow(colors.gold, 0.5), fontSize: 14, fontWeight: 600, margin: "0 0 16px 0" }}>
          HACP™ PROFILE
        </p>
        <p style={{ color: colors.textSecondary, fontSize: 12, margin: "0 0 16px 0" }}>
          SAL has learned these preferences from your interactions:
        </p>
        {[
          { key: "riskTolerance", label: "Risk Tolerance", color: colors.neonCyan },
          { key: "growthFocus", label: "Growth Focus", color: colors.neonGreen },
          { key: "reAllocation", label: "RE Allocation", color: colors.gold },
          { key: "cryptoComfort", label: "Crypto Comfort", color: colors.neonPurple },
        ].map((pref) => (
          <div key={pref.key} style={{ marginBottom: 12 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
              <span style={{ color: colors.textSecondary, fontSize: 13 }}>{pref.label}</span>
              <span style={{ color: pref.color, fontSize: 13, fontWeight: 600 }}>
                {user?.preferences?.[pref.key] || 50}%
              </span>
            </div>
            <ProgressBar value={user?.preferences?.[pref.key] || 50} color={pref.color} />
          </div>
        ))}
        <Button fullWidth style={{ marginTop: 8, padding: "12px 16px" }}>
          ⚙️ FINE-TUNE HACP™
        </Button>
      </Card>
    </div>
  )
}

// ============================================
// CHAT SCREEN
// ============================================

const ChatScreen = ({ onClose }) => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      from: "sal",
      text: "What's good! 🔥 Your portfolio is up 3.84% this month. That NVDA position is carrying hard. What do you want to dig into?",
      time: new Date(),
    },
  ])
  const [input, setInput] = useState("")

  const sendMessage = () => {
    if (!input.trim()) return

    const userMessage = {
      id: messages.length + 1,
      from: "user",
      text: input,
      time: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")

    // Simulate SAL response
    setTimeout(() => {
      const salResponse = {
        id: messages.length + 2,
        from: "sal",
        text: `Based on your HACP™ profile, I'd suggest focusing on CSREC for stability with that 7.2% yield. The Austin property closing next week has a SAL Score of 88 - strong fundamentals. Want me to break down the opportunity?`,
        time: new Date(),
      }
      setMessages((prev) => [...prev, salResponse])
    }, 1500)
  }

  return (
    <div
      style={{
        position: "absolute",
        top: 58,
        left: 0,
        right: 0,
        bottom: 0,
        background: colors.background,
        display: "flex",
        flexDirection: "column",
        zIndex: 100,
      }}
    >
      {/* Chat Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          padding: "16px 20px",
          borderBottom: `1px solid ${colors.border}`,
        }}
      >
        <div onClick={onClose} style={{ cursor: "pointer", fontSize: 20, color: colors.textPrimary }}>
          ←
        </div>
        <SaintSalRobot size={40} />
        <div>
          <p style={{ ...goldGradient, fontWeight: 700, margin: 0 }}>SaintSal™</p>
          <p style={{ color: colors.neonGreen, fontSize: 12, margin: 0 }}>● Online</p>
        </div>
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: "auto", padding: 20 }}>
        {messages.map((msg) => (
          <div
            key={msg.id}
            style={{
              display: "flex",
              gap: 12,
              marginBottom: 20,
              justifyContent: msg.from === "user" ? "flex-end" : "flex-start",
            }}
          >
            {msg.from === "sal" && <SaintSalRobot size={36} />}
            <div
              style={{
                background:
                  msg.from === "sal"
                    ? colors.surface
                    : `linear-gradient(135deg, ${colors.gold}30 0%, ${colors.gold}10 100%)`,
                borderRadius: msg.from === "sal" ? "4px 16px 16px 16px" : "16px 4px 16px 16px",
                padding: 16,
                maxWidth: "80%",
                border: `1px solid ${msg.from === "sal" ? colors.gold + "30" : colors.gold + "50"}`,
              }}
            >
              <p style={{ color: colors.textPrimary, margin: 0, lineHeight: 1.5 }}>{msg.text}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Input */}
      <div
        style={{
          padding: "16px 20px 32px 20px",
          borderTop: `1px solid ${colors.border}`,
          display: "flex",
          gap: 12,
        }}
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && sendMessage()}
          placeholder="Message SaintSal..."
          style={{
            flex: 1,
            background: colors.surface,
            border: `1px solid ${colors.border}`,
            borderRadius: 24,
            padding: "14px 20px",
            color: colors.textPrimary,
            fontSize: 16,
            outline: "none",
          }}
        />
        <div
          onClick={sendMessage}
          style={{
            width: 48,
            height: 48,
            borderRadius: 24,
            background: `linear-gradient(135deg, ${colors.goldDark} 0%, ${colors.gold} 100%)`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            boxShadow: `0 4px 15px rgba(212, 175, 55, 0.4)`,
            color: "#0F0F0F",
            fontSize: 18,
          }}
        >
          ➤
        </div>
      </div>
    </div>
  )
}

export default CookinSaintsApp
