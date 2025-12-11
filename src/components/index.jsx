"use client"

// ============================================
// COOKINSAINTS™ - COMPLETE COMPONENT LIBRARY
// iOS-Native Design System
// Powered by SaintSal™ + HACP™
// ============================================

import { useState, useEffect } from "react"

// ============================================
// DESIGN TOKENS
// ============================================

export const tokens = {
  // Colors
  colors: {
    // Core Background
    background: "#0F0F0F",
    surface: "#1A1A1A",
    surfaceLight: "#242424",
    surfaceHover: "#2A2A2A",
    surfaceElevated: "#2E2E2E",

    // Gold Palette (SaintSal™ Brand)
    gold: "#D4AF37",
    goldLight: "#FFD700",
    goldDark: "#B8960C",
    goldMuted: "#9A7B2C",
    goldSubtle: "rgba(212, 175, 55, 0.1)",

    // Neon Accents
    neonCyan: "#00FFFF",
    neonPurple: "#BF00FF",
    neonGreen: "#00FF88",
    neonRed: "#FF3366",
    neonBlue: "#0088FF",
    neonOrange: "#FF8800",
    neonPink: "#FF00AA",

    // Text
    textPrimary: "#FFFFFF",
    textSecondary: "#888888",
    textMuted: "#555555",
    textInverse: "#0F0F0F",

    // Borders & Dividers
    border: "#2A2A2A",
    borderLight: "#3A3A3A",
    borderGold: "rgba(212, 175, 55, 0.3)",

    // Semantic
    success: "#00FF88",
    error: "#FF3366",
    warning: "#FFB800",
    info: "#0088FF",

    // Overlays
    overlayDark: "rgba(0, 0, 0, 0.7)",
    overlayLight: "rgba(255, 255, 255, 0.05)",
  },

  // Typography
  typography: {
    fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
    fontFamilyMono: '"SF Mono", "Fira Code", Consolas, monospace',

    // Font Sizes
    xs: 10,
    sm: 12,
    base: 14,
    md: 16,
    lg: 18,
    xl: 20,
    "2xl": 24,
    "3xl": 28,
    "4xl": 32,
    "5xl": 36,
    "6xl": 42,
    "7xl": 48,

    // Font Weights
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    extrabold: 800,
  },

  // Spacing
  spacing: {
    xs: 4,
    sm: 8,
    md: 12,
    base: 16,
    lg: 20,
    xl: 24,
    "2xl": 32,
    "3xl": 40,
    "4xl": 48,
    "5xl": 64,
  },

  // Border Radius
  radius: {
    sm: 6,
    md: 8,
    base: 12,
    lg: 16,
    xl: 20,
    "2xl": 24,
    full: 9999,
  },

  // Shadows
  shadows: {
    sm: "0 2px 8px rgba(0, 0, 0, 0.3)",
    md: "0 4px 12px rgba(0, 0, 0, 0.4)",
    lg: "0 8px 24px rgba(0, 0, 0, 0.5)",
    xl: "0 12px 32px rgba(0, 0, 0, 0.6)",
    gold: "0 4px 20px rgba(212, 175, 55, 0.4)",
    goldIntense: "0 8px 30px rgba(212, 175, 55, 0.6)",
    neon: (color) => `0 0 20px ${color}, 0 0 40px ${color}`,
  },

  // Transitions
  transitions: {
    fast: "0.15s ease",
    base: "0.2s ease",
    slow: "0.3s ease",
    smooth: "0.4s cubic-bezier(0.4, 0, 0.2, 1)",
  },

  // Z-Index
  zIndex: {
    base: 1,
    dropdown: 10,
    sticky: 20,
    modal: 30,
    popover: 40,
    tooltip: 50,
    toast: 60,
  },
}

// ============================================
// STYLE UTILITIES
// ============================================

// Neon glow effect generator
export const neonGlow = (color, intensity = 1) => ({
  color: color,
  textShadow: `0 0 ${10 * intensity}px ${color}, 0 0 ${20 * intensity}px ${color}, 0 0 ${30 * intensity}px ${color}`,
})

// Gold gradient for text
export const goldGradient = {
  background: `linear-gradient(135deg, ${tokens.colors.goldDark} 0%, ${tokens.colors.gold} 50%, ${tokens.colors.goldLight} 100%)`,
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
  backgroundClip: "text",
}

// Gold gradient for backgrounds
export const goldBgGradient = `linear-gradient(135deg, ${tokens.colors.goldDark} 0%, ${tokens.colors.gold} 50%, ${tokens.colors.goldLight} 100%)`

// Surface gradient
export const surfaceGradient = (accentColor = tokens.colors.gold, intensity = 0.1) =>
  `linear-gradient(135deg, ${tokens.colors.surface} 0%, rgba(${hexToRgb(accentColor)}, ${intensity}) 100%)`

// Hex to RGB helper
const hexToRgb = (hex) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result
    ? `${Number.parseInt(result[1], 16)}, ${Number.parseInt(result[2], 16)}, ${Number.parseInt(result[3], 16)}`
    : "212, 175, 55"
}

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

export const formatPercent = (value, decimals = 2, showSign = true) => {
  const sign = showSign && value >= 0 ? "+" : ""
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

export const formatDate = (date, format = "short") => {
  const d = new Date(date)
  const formats = {
    short: { month: "short", day: "numeric" },
    medium: { month: "short", day: "numeric", year: "numeric" },
    long: { weekday: "long", month: "long", day: "numeric", year: "numeric" },
    time: { hour: "numeric", minute: "2-digit" },
    full: { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" },
  }
  return d.toLocaleDateString("en-US", formats[format])
}

export const formatTimeAgo = (date) => {
  const seconds = Math.floor((new Date() - new Date(date)) / 1000)
  const intervals = [
    { label: "y", seconds: 31536000 },
    { label: "mo", seconds: 2592000 },
    { label: "d", seconds: 86400 },
    { label: "h", seconds: 3600 },
    { label: "m", seconds: 60 },
  ]

  for (const interval of intervals) {
    const count = Math.floor(seconds / interval.seconds)
    if (count > 0) return `${count}${interval.label} ago`
  }
  return "Just now"
}

// ============================================
// SAINTSALROBOT COMPONENT
// ============================================

export const SaintSalRobot = ({ size = 60, animated = false, glow = false }) => {
  const glowStyle = glow
    ? {
        filter: `drop-shadow(0 0 ${size * 0.3}px ${tokens.colors.gold})`,
      }
    : {}

  return (
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
        animation: animated ? "pulse 2s ease-in-out infinite" : "none",
        ...glowStyle,
      }}
    />
  )
}

// ============================================
// CARD COMPONENT
// ============================================

export const Card = ({
  children,
  style = {},
  glow = false,
  glowColor = tokens.colors.gold,
  variant = "default",
  onClick,
  className = "",
  padding = tokens.spacing.base,
  elevated = false,
}) => {
  const variants = {
    default: {
      background: tokens.colors.surface,
      border: `1px solid ${tokens.colors.border}`,
    },
    elevated: {
      background: tokens.colors.surfaceElevated,
      border: `1px solid ${tokens.colors.borderLight}`,
    },
    gold: {
      background: surfaceGradient(tokens.colors.gold, 0.15),
      border: `1px solid ${tokens.colors.borderGold}`,
    },
    success: {
      background: surfaceGradient(tokens.colors.neonGreen, 0.1),
      border: `1px solid rgba(0, 255, 136, 0.3)`,
    },
    purple: {
      background: surfaceGradient(tokens.colors.neonPurple, 0.1),
      border: `1px solid rgba(191, 0, 255, 0.3)`,
    },
  }

  return (
    <div
      onClick={onClick}
      className={className}
      style={{
        ...variants[variant],
        borderRadius: tokens.radius.lg,
        padding: padding,
        boxShadow: glow
          ? `0 0 20px rgba(${hexToRgb(glowColor)}, 0.2)`
          : elevated
            ? tokens.shadows.lg
            : tokens.shadows.md,
        cursor: onClick ? "pointer" : "default",
        transition: `all ${tokens.transitions.slow}`,
        ...style,
      }}
    >
      {children}
    </div>
  )
}

// ============================================
// BUTTON COMPONENT
// ============================================

export const Button = ({
  children,
  variant = "outline",
  size = "medium",
  disabled = false,
  loading = false,
  fullWidth = false,
  icon,
  iconPosition = "left",
  style = {},
  onClick,
}) => {
  const sizes = {
    small: { padding: "8px 16px", fontSize: tokens.typography.sm, gap: 6 },
    medium: { padding: "14px 24px", fontSize: tokens.typography.md, gap: 8 },
    large: { padding: "18px 32px", fontSize: tokens.typography.lg, gap: 10 },
  }

  const variants = {
    primary: {
      background: goldBgGradient,
      border: "none",
      color: tokens.colors.textInverse,
      boxShadow: tokens.shadows.gold,
    },
    outline: {
      background: "transparent",
      border: `1px solid ${tokens.colors.gold}`,
      color: tokens.colors.gold,
      boxShadow: "none",
    },
    ghost: {
      background: "transparent",
      border: "none",
      color: tokens.colors.gold,
      boxShadow: "none",
    },
    danger: {
      background: `linear-gradient(135deg, #CC2244 0%, ${tokens.colors.neonRed} 100%)`,
      border: "none",
      color: tokens.colors.textPrimary,
      boxShadow: `0 4px 15px rgba(255, 51, 102, 0.4)`,
    },
    success: {
      background: `linear-gradient(135deg, #00AA55 0%, ${tokens.colors.neonGreen} 100%)`,
      border: "none",
      color: tokens.colors.textInverse,
      boxShadow: `0 4px 15px rgba(0, 255, 136, 0.4)`,
    },
    surface: {
      background: tokens.colors.surface,
      border: `1px solid ${tokens.colors.border}`,
      color: tokens.colors.textPrimary,
      boxShadow: "none",
    },
  }

  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      style={{
        ...sizes[size],
        ...variants[variant],
        borderRadius: tokens.radius.base,
        fontWeight: tokens.typography.semibold,
        cursor: disabled ? "not-allowed" : "pointer",
        transition: `all ${tokens.transitions.base}`,
        opacity: disabled ? 0.5 : 1,
        width: fullWidth ? "100%" : "auto",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: iconPosition === "right" ? "row-reverse" : "row",
        gap: sizes[size].gap,
        fontFamily: tokens.typography.fontFamily,
        ...style,
      }}
    >
      {loading && <LoadingSpinner size={16} />}
      {!loading && icon && <span style={{ display: "flex" }}>{icon}</span>}
      {children}
    </button>
  )
}

// ============================================
// INPUT COMPONENT
// ============================================

export const Input = ({
  type = "text",
  placeholder,
  value,
  onChange,
  onFocus,
  onBlur,
  icon,
  rightIcon,
  error,
  label,
  helperText,
  disabled = false,
  multiline = false,
  rows = 4,
  style = {},
}) => {
  const [isFocused, setIsFocused] = useState(false)

  const handleFocus = (e) => {
    setIsFocused(true)
    onFocus?.(e)
  }

  const handleBlur = (e) => {
    setIsFocused(false)
    onBlur?.(e)
  }

  const InputComponent = multiline ? "textarea" : "input"

  return (
    <div style={{ width: "100%", ...style }}>
      {label && (
        <label
          style={{
            display: "block",
            color: tokens.colors.textSecondary,
            fontSize: tokens.typography.base,
            marginBottom: tokens.spacing.sm,
            fontWeight: tokens.typography.medium,
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
              left: tokens.spacing.base,
              color: isFocused ? tokens.colors.gold : tokens.colors.textMuted,
              fontSize: 18,
              transition: `color ${tokens.transitions.base}`,
              pointerEvents: "none",
            }}
          >
            {icon}
          </span>
        )}
        <InputComponent
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          disabled={disabled}
          rows={multiline ? rows : undefined}
          style={{
            width: "100%",
            background: tokens.colors.surface,
            border: `1px solid ${error ? tokens.colors.error : isFocused ? tokens.colors.gold : tokens.colors.border}`,
            borderRadius: tokens.radius.base,
            padding: icon
              ? `${tokens.spacing.base}px ${tokens.spacing.base}px ${tokens.spacing.base}px 48px`
              : `${tokens.spacing.base}px`,
            paddingRight: rightIcon ? 48 : tokens.spacing.base,
            color: tokens.colors.textPrimary,
            fontSize: tokens.typography.md,
            fontFamily: tokens.typography.fontFamily,
            outline: "none",
            transition: `border-color ${tokens.transitions.base}`,
            opacity: disabled ? 0.5 : 1,
            resize: multiline ? "vertical" : "none",
            minHeight: multiline ? 100 : "auto",
          }}
        />
        {rightIcon && (
          <span
            style={{
              position: "absolute",
              right: tokens.spacing.base,
              color: tokens.colors.textMuted,
              fontSize: 18,
              cursor: "pointer",
            }}
          >
            {rightIcon}
          </span>
        )}
      </div>
      {(error || helperText) && (
        <p
          style={{
            color: error ? tokens.colors.error : tokens.colors.textMuted,
            fontSize: tokens.typography.sm,
            marginTop: tokens.spacing.xs,
            marginBottom: 0,
          }}
        >
          {error || helperText}
        </p>
      )}
    </div>
  )
}

// ============================================
// LOADING SPINNER
// ============================================

export const LoadingSpinner = ({ size = 24, color = tokens.colors.gold }) => (
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

// Full page loading
export const LoadingScreen = ({ message = "Loading..." }) => (
  <div
    style={{
      position: "fixed",
      inset: 0,
      background: tokens.colors.background,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      gap: tokens.spacing.lg,
      zIndex: tokens.zIndex.modal,
    }}
  >
    <SaintSalRobot size={80} animated />
    <p style={{ color: tokens.colors.textSecondary, fontSize: tokens.typography.md }}>{message}</p>
  </div>
)

// ============================================
// BADGE COMPONENT
// ============================================

export const Badge = ({ children, variant = "default", size = "medium", dot = false }) => {
  const variants = {
    default: { bg: tokens.colors.surfaceLight, color: tokens.colors.textSecondary },
    success: { bg: `${tokens.colors.neonGreen}20`, color: tokens.colors.neonGreen },
    warning: { bg: `${tokens.colors.warning}20`, color: tokens.colors.warning },
    error: { bg: `${tokens.colors.neonRed}20`, color: tokens.colors.neonRed },
    gold: { bg: `${tokens.colors.gold}20`, color: tokens.colors.gold },
    purple: { bg: `${tokens.colors.neonPurple}20`, color: tokens.colors.neonPurple },
    cyan: { bg: `${tokens.colors.neonCyan}20`, color: tokens.colors.neonCyan },
    blue: { bg: `${tokens.colors.neonBlue}20`, color: tokens.colors.neonBlue },
  }

  const sizes = {
    small: { padding: "4px 8px", fontSize: tokens.typography.xs },
    medium: { padding: "6px 12px", fontSize: tokens.typography.sm },
    large: { padding: "8px 16px", fontSize: tokens.typography.base },
  }

  return (
    <span
      style={{
        ...sizes[size],
        background: variants[variant].bg,
        color: variants[variant].color,
        borderRadius: tokens.radius.md,
        fontWeight: tokens.typography.semibold,
        display: "inline-flex",
        alignItems: "center",
        gap: tokens.spacing.xs,
      }}
    >
      {dot && (
        <span
          style={{
            width: 6,
            height: 6,
            borderRadius: "50%",
            background: variants[variant].color,
          }}
        />
      )}
      {children}
    </span>
  )
}

// ============================================
// PROGRESS BAR
// ============================================

export const ProgressBar = ({
  value,
  max = 100,
  color = tokens.colors.gold,
  height = 6,
  showLabel = false,
  animated = false,
}) => (
  <div>
    {showLabel && (
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: tokens.spacing.xs,
        }}
      >
        <span style={{ color: tokens.colors.textSecondary, fontSize: tokens.typography.xs }}>Progress</span>
        <span style={{ color, fontSize: tokens.typography.xs, fontWeight: tokens.typography.semibold }}>
          {Math.round((value / max) * 100)}%
        </span>
      </div>
    )}
    <div
      style={{
        height,
        background: tokens.colors.surfaceLight,
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
          transition: `width ${tokens.transitions.slow}`,
          animation: animated ? "progressPulse 2s ease-in-out infinite" : "none",
        }}
      />
    </div>
    <style>{`
      @keyframes progressPulse {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.7; }
      }
    `}</style>
  </div>
)

// ============================================
// SCORE RING
// ============================================

export const ScoreRing = ({ score, size = 48, strokeWidth = 4, color = tokens.colors.gold, label }) => {
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
          stroke={tokens.colors.surfaceLight}
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{
            filter: `drop-shadow(0 0 4px ${color})`,
            transition: `stroke-dashoffset ${tokens.transitions.slow}`,
          }}
        />
      </svg>
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <span
          style={{
            fontWeight: tokens.typography.bold,
            fontSize: size * 0.28,
            color: color,
          }}
        >
          {score}
        </span>
        {label && (
          <span
            style={{
              fontSize: size * 0.15,
              color: tokens.colors.textMuted,
            }}
          >
            {label}
          </span>
        )}
      </div>
    </div>
  )
}

// ============================================
// CHARTS
// ============================================

export const MiniChart = ({ positive = true, height = 60, data, color }) => {
  const defaultPoints = positive
    ? "0,50 20,45 40,48 60,35 80,38 100,25 120,30 140,15 160,20 180,10"
    : "0,20 20,25 40,22 60,35 80,32 100,45 120,40 140,50 160,48 180,55"

  const chartColor = color || (positive ? tokens.colors.neonGreen : tokens.colors.neonRed)
  const gradientId = `chartGrad${Math.random().toString(36).substr(2, 9)}`

  return (
    <svg width="100%" height={height} viewBox="0 0 180 60" preserveAspectRatio="none">
      <defs>
        <linearGradient id={gradientId} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={chartColor} stopOpacity="0.3" />
          <stop offset="100%" stopColor={chartColor} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon points={`0,60 ${data || defaultPoints} 180,60`} fill={`url(#${gradientId})`} />
      <polyline
        points={data || defaultPoints}
        fill="none"
        stroke={chartColor}
        strokeWidth="2"
        style={{ filter: `drop-shadow(0 0 4px ${chartColor})` }}
      />
    </svg>
  )
}

export const PortfolioChart = ({ color = tokens.colors.gold, height = 120, data }) => {
  const defaultPoints = "0,90 30,85 60,80 90,70 120,75 150,60 180,55 210,45 240,50 270,35 300,30"
  const gradientId = `portfolioGrad${Math.random().toString(36).substr(2, 9)}`

  return (
    <svg width="100%" height={height} viewBox="0 0 300 120" preserveAspectRatio="none">
      <defs>
        <linearGradient id={gradientId} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={color} stopOpacity="0.4" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon points={`0,120 ${data || defaultPoints} 300,120`} fill={`url(#${gradientId})`} />
      <polyline
        points={data || defaultPoints}
        fill="none"
        stroke={color}
        strokeWidth="3"
        style={{ filter: `drop-shadow(0 0 8px ${color})` }}
      />
    </svg>
  )
}

// ============================================
// TAB BAR
// ============================================

export const TabBar = ({ tabs, activeTab, onTabChange }) => (
  <div
    style={{
      position: "absolute",
      bottom: 0,
      left: 0,
      right: 0,
      background: `${tokens.colors.surface}ee`,
      backdropFilter: "blur(20px)",
      WebkitBackdropFilter: "blur(20px)",
      borderTop: `1px solid ${tokens.colors.border}`,
      display: "flex",
      justifyContent: "space-around",
      padding: `${tokens.spacing.sm}px 0 ${tokens.spacing.xl}px 0`,
    }}
  >
    {tabs.map((tab) => (
      <TabItem key={tab.key} {...tab} isActive={activeTab === tab.key} onClick={() => onTabChange(tab.key)} />
    ))}
  </div>
)

export const TabItem = ({ icon, label, isActive, onClick, badge }) => (
  <div
    onClick={onClick}
    style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: tokens.spacing.xs,
      cursor: "pointer",
      padding: `${tokens.spacing.sm}px ${tokens.spacing.base}px`,
      transition: `all ${tokens.transitions.base}`,
      position: "relative",
    }}
  >
    <span
      style={{
        fontSize: 24,
        filter: isActive ? `drop-shadow(0 0 8px ${tokens.colors.gold})` : "none",
        transition: `filter ${tokens.transitions.base}`,
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
          background: tokens.colors.neonRed,
          boxShadow: `0 0 8px ${tokens.colors.neonRed}`,
        }}
      />
    )}
    <span
      style={{
        fontSize: tokens.typography.xs,
        fontWeight: tokens.typography.medium,
        color: isActive ? tokens.colors.gold : tokens.colors.textSecondary,
        ...(isActive ? neonGlow(tokens.colors.gold, 0.5) : {}),
        transition: `all ${tokens.transitions.base}`,
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
          background: tokens.colors.gold,
          boxShadow: `0 0 8px ${tokens.colors.gold}`,
        }}
      />
    )}
  </div>
)

// ============================================
// SEGMENTED CONTROL
// ============================================

export const SegmentedControl = ({ segments, activeSegment, onChange }) => (
  <div
    style={{
      display: "flex",
      gap: tokens.spacing.sm,
      background: tokens.colors.surface,
      padding: tokens.spacing.xs,
      borderRadius: tokens.radius.base,
      border: `1px solid ${tokens.colors.border}`,
    }}
  >
    {segments.map((segment) => (
      <div
        key={segment.key}
        onClick={() => onChange(segment.key)}
        style={{
          flex: 1,
          padding: `${tokens.spacing.md}px ${tokens.spacing.base}px`,
          borderRadius: tokens.radius.md,
          background: activeSegment === segment.key ? tokens.colors.gold : "transparent",
          color: activeSegment === segment.key ? tokens.colors.textInverse : tokens.colors.textSecondary,
          fontWeight: tokens.typography.semibold,
          fontSize: tokens.typography.base,
          textAlign: "center",
          cursor: "pointer",
          textTransform: "uppercase",
          transition: `all ${tokens.transitions.base}`,
        }}
      >
        {segment.label}
      </div>
    ))}
  </div>
)

// ============================================
// AVATAR
// ============================================

export const Avatar = ({ src, name, size = 40, showBadge = false, badgeColor = tokens.colors.neonGreen }) => {
  const initials = name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)

  return (
    <div
      style={{
        position: "relative",
        width: size,
        height: size,
      }}
    >
      {src ? (
        <img
          src={src || "/placeholder.svg"}
          alt={name}
          style={{
            width: size,
            height: size,
            borderRadius: size / 4,
            objectFit: "cover",
          }}
        />
      ) : (
        <div
          style={{
            width: size,
            height: size,
            borderRadius: size / 4,
            background: goldBgGradient,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: tokens.colors.textInverse,
            fontWeight: tokens.typography.semibold,
            fontSize: size * 0.4,
          }}
        >
          {initials || "?"}
        </div>
      )}
      {showBadge && (
        <div
          style={{
            position: "absolute",
            bottom: -2,
            right: -2,
            width: size * 0.3,
            height: size * 0.3,
            borderRadius: "50%",
            background: badgeColor,
            border: `2px solid ${tokens.colors.background}`,
            boxShadow: `0 0 8px ${badgeColor}`,
          }}
        />
      )}
    </div>
  )
}

// ============================================
// LIST ITEM
// ============================================

export const ListItem = ({
  icon,
  emoji,
  title,
  subtitle,
  rightContent,
  rightLabel,
  rightValue,
  rightValueColor,
  onClick,
  showChevron = false,
  divider = true,
}) => (
  <div
    onClick={onClick}
    style={{
      display: "flex",
      alignItems: "center",
      padding: `${tokens.spacing.md}px 0`,
      borderBottom: divider ? `1px solid ${tokens.colors.border}` : "none",
      cursor: onClick ? "pointer" : "default",
      gap: tokens.spacing.md,
    }}
  >
    {emoji && <span style={{ fontSize: 20 }}>{emoji}</span>}
    {icon && (
      <div
        style={{
          width: 44,
          height: 44,
          borderRadius: tokens.radius.base,
          background: tokens.colors.surfaceLight,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          border: `1px solid ${tokens.colors.border}`,
        }}
      >
        {icon}
      </div>
    )}
    <div style={{ flex: 1, minWidth: 0 }}>
      <p
        style={{
          color: tokens.colors.textPrimary,
          fontWeight: tokens.typography.semibold,
          margin: 0,
          fontSize: tokens.typography.base,
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}
      >
        {title}
      </p>
      {subtitle && (
        <p
          style={{
            color: tokens.colors.textSecondary,
            fontSize: tokens.typography.sm,
            margin: 0,
            marginTop: 2,
          }}
        >
          {subtitle}
        </p>
      )}
    </div>
    {rightContent && rightContent}
    {(rightLabel || rightValue) && (
      <div style={{ textAlign: "right" }}>
        {rightValue && (
          <p
            style={{
              color: rightValueColor || tokens.colors.textPrimary,
              fontWeight: tokens.typography.semibold,
              margin: 0,
              fontSize: tokens.typography.base,
              ...(rightValueColor ? neonGlow(rightValueColor, 0.5) : {}),
            }}
          >
            {rightValue}
          </p>
        )}
        {rightLabel && (
          <p
            style={{
              color: tokens.colors.textSecondary,
              fontSize: tokens.typography.sm,
              margin: 0,
              marginTop: 2,
            }}
          >
            {rightLabel}
          </p>
        )}
      </div>
    )}
    {showChevron && <span style={{ color: tokens.colors.textMuted, fontSize: 16 }}>›</span>}
  </div>
)

// ============================================
// METRIC CARD
// ============================================

export const MetricCard = ({ label, value, change, changePercent, positive, icon, color, size = "medium" }) => {
  const sizes = {
    small: { padding: tokens.spacing.md, labelSize: tokens.typography.xs, valueSize: tokens.typography.lg },
    medium: { padding: tokens.spacing.base, labelSize: tokens.typography.sm, valueSize: tokens.typography.xl },
    large: { padding: tokens.spacing.lg, labelSize: tokens.typography.base, valueSize: tokens.typography["2xl"] },
  }

  const changeColor =
    positive !== undefined
      ? positive
        ? tokens.colors.neonGreen
        : tokens.colors.neonRed
      : color || tokens.colors.textSecondary

  return (
    <div
      style={{
        background: tokens.colors.surfaceLight,
        borderRadius: tokens.radius.base,
        padding: sizes[size].padding,
        textAlign: "center",
      }}
    >
      {icon && <div style={{ marginBottom: tokens.spacing.xs }}>{icon}</div>}
      <p
        style={{
          color: tokens.colors.textSecondary,
          fontSize: sizes[size].labelSize,
          margin: `0 0 ${tokens.spacing.xs}px 0`,
          textTransform: "uppercase",
        }}
      >
        {label}
      </p>
      <p
        style={{
          color: color || tokens.colors.textPrimary,
          fontSize: sizes[size].valueSize,
          fontWeight: tokens.typography.bold,
          margin: 0,
          ...(color ? neonGlow(color, 0.5) : {}),
        }}
      >
        {value}
      </p>
      {(change !== undefined || changePercent !== undefined) && (
        <p
          style={{
            color: changeColor,
            fontSize: tokens.typography.sm,
            fontWeight: tokens.typography.semibold,
            margin: `${tokens.spacing.xs}px 0 0 0`,
            ...neonGlow(changeColor, 0.5),
          }}
        >
          {positive !== undefined && (positive ? "▲ " : "▼ ")}
          {change !== undefined && formatCurrency(change)}
          {changePercent !== undefined && ` (${formatPercent(changePercent)})`}
        </p>
      )}
    </div>
  )
}

// ============================================
// MODAL
// ============================================

export const Modal = ({ isOpen, onClose, title, children, footer, size = "medium" }) => {
  if (!isOpen) return null

  const sizes = {
    small: { width: "90%", maxWidth: 320 },
    medium: { width: "90%", maxWidth: 400 },
    large: { width: "95%", maxWidth: 500 },
    full: { width: "100%", maxWidth: "100%", height: "100%", borderRadius: 0 },
  }

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: tokens.colors.overlayDark,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: tokens.zIndex.modal,
        padding: size === "full" ? 0 : tokens.spacing.lg,
      }}
    >
      <div
        style={{
          ...sizes[size],
          background: tokens.colors.surface,
          borderRadius: size === "full" ? 0 : tokens.radius.xl,
          border: `1px solid ${tokens.colors.border}`,
          boxShadow: tokens.shadows.xl,
          display: "flex",
          flexDirection: "column",
          maxHeight: size === "full" ? "100%" : "90%",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: tokens.spacing.lg,
            borderBottom: `1px solid ${tokens.colors.border}`,
          }}
        >
          <h3 style={{ ...goldGradient, margin: 0, fontSize: tokens.typography.lg }}>{title}</h3>
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              color: tokens.colors.textMuted,
              fontSize: 24,
              cursor: "pointer",
              padding: 0,
              lineHeight: 1,
            }}
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            padding: tokens.spacing.lg,
          }}
        >
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div
            style={{
              padding: tokens.spacing.lg,
              borderTop: `1px solid ${tokens.colors.border}`,
              display: "flex",
              gap: tokens.spacing.md,
            }}
          >
            {footer}
          </div>
        )}
      </div>
    </div>
  )
}

// ============================================
// TOAST
// ============================================

export const Toast = ({ message, type = "info", isVisible, onClose }) => {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(onClose, 3000)
      return () => clearTimeout(timer)
    }
  }, [isVisible, onClose])

  if (!isVisible) return null

  const types = {
    info: { bg: tokens.colors.neonBlue, icon: "ℹ️" },
    success: { bg: tokens.colors.neonGreen, icon: "✓" },
    warning: { bg: tokens.colors.warning, icon: "⚠️" },
    error: { bg: tokens.colors.neonRed, icon: "✕" },
  }

  return (
    <div
      style={{
        position: "fixed",
        top: 80,
        left: "50%",
        transform: "translateX(-50%)",
        background: `${types[type].bg}20`,
        border: `1px solid ${types[type].bg}50`,
        borderRadius: tokens.radius.base,
        padding: `${tokens.spacing.md}px ${tokens.spacing.lg}px`,
        display: "flex",
        alignItems: "center",
        gap: tokens.spacing.sm,
        zIndex: tokens.zIndex.toast,
        boxShadow: `0 0 20px ${types[type].bg}30`,
      }}
    >
      <span style={{ color: types[type].bg }}>{types[type].icon}</span>
      <span style={{ color: tokens.colors.textPrimary, fontSize: tokens.typography.base }}>{message}</span>
    </div>
  )
}

// ============================================
// EMPTY STATE
// ============================================

export const EmptyState = ({ icon, title, description, action }) => (
  <div
    style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: tokens.spacing["3xl"],
      textAlign: "center",
    }}
  >
    <div
      style={{
        fontSize: 48,
        marginBottom: tokens.spacing.base,
        opacity: 0.5,
      }}
    >
      {icon}
    </div>
    <h3
      style={{
        color: tokens.colors.textPrimary,
        margin: `0 0 ${tokens.spacing.sm}px 0`,
        fontSize: tokens.typography.lg,
      }}
    >
      {title}
    </h3>
    <p
      style={{
        color: tokens.colors.textSecondary,
        margin: `0 0 ${tokens.spacing.xl}px 0`,
        fontSize: tokens.typography.base,
      }}
    >
      {description}
    </p>
    {action}
  </div>
)

// ============================================
// STATUS BAR
// ============================================

export const StatusBar = () => (
  <div
    style={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: `${tokens.spacing.md}px ${tokens.spacing["2xl"]}px`,
      color: tokens.colors.textPrimary,
      fontSize: tokens.typography.base,
      fontWeight: tokens.typography.semibold,
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
    <div style={{ display: "flex", gap: tokens.spacing.xs, alignItems: "center" }}>
      <span style={{ fontSize: tokens.typography.md }}>📶</span>
      <span style={{ fontSize: tokens.typography.md }}>🔋</span>
    </div>
  </div>
)

// ============================================
// HEADER
// ============================================

export const Header = ({ title, subtitle, leftAction, rightAction, showSal = false, transparent = false }) => (
  <div
    style={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: `${tokens.spacing.md}px ${tokens.spacing.lg}px`,
      background: transparent ? "transparent" : tokens.colors.background,
    }}
  >
    <div style={{ display: "flex", alignItems: "center", gap: tokens.spacing.md }}>
      {leftAction}
      <div>
        {subtitle && (
          <p
            style={{
              color: tokens.colors.textSecondary,
              fontSize: tokens.typography.base,
              margin: 0,
            }}
          >
            {subtitle}
          </p>
        )}
        <h1
          style={{
            ...goldGradient,
            fontSize: tokens.typography["2xl"],
            fontWeight: tokens.typography.bold,
            margin: 0,
          }}
        >
          {title}
        </h1>
      </div>
    </div>
    <div style={{ display: "flex", gap: tokens.spacing.md, alignItems: "center" }}>
      {rightAction}
      {showSal && <SaintSalRobot size={40} />}
    </div>
  </div>
)

// ============================================
// ICON BUTTON
// ============================================

export const IconButton = ({ icon, onClick, badge, size = 40, variant = "default" }) => {
  const variants = {
    default: {
      background: tokens.colors.surface,
      border: `1px solid ${tokens.colors.border}`,
    },
    gold: {
      background: goldBgGradient,
      border: "none",
    },
    ghost: {
      background: "transparent",
      border: "none",
    },
  }

  return (
    <div
      onClick={onClick}
      style={{
        width: size,
        height: size,
        borderRadius: tokens.radius.base,
        ...variants[variant],
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        position: "relative",
        fontSize: size * 0.5,
        transition: `all ${tokens.transitions.base}`,
      }}
    >
      {icon}
      {badge !== undefined && badge > 0 && (
        <span
          style={{
            position: "absolute",
            top: -4,
            right: -4,
            minWidth: 16,
            height: 16,
            borderRadius: "50%",
            background: tokens.colors.neonRed,
            color: tokens.colors.textPrimary,
            fontSize: tokens.typography.xs,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: tokens.typography.semibold,
            padding: badge > 9 ? "0 4px" : 0,
          }}
        >
          {badge > 99 ? "99+" : badge}
        </span>
      )}
    </div>
  )
}

// ============================================
// SWITCH / TOGGLE
// ============================================

export const Switch = ({ checked, onChange, disabled = false, label }) => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      gap: tokens.spacing.md,
      opacity: disabled ? 0.5 : 1,
    }}
  >
    {label && (
      <span
        style={{
          color: tokens.colors.textSecondary,
          fontSize: tokens.typography.base,
        }}
      >
        {label}
      </span>
    )}
    <div
      onClick={() => !disabled && onChange?.(!checked)}
      style={{
        width: 51,
        height: 31,
        borderRadius: 16,
        background: checked ? tokens.colors.gold : tokens.colors.surfaceLight,
        padding: 2,
        cursor: disabled ? "not-allowed" : "pointer",
        transition: `background ${tokens.transitions.base}`,
        boxShadow: checked ? tokens.shadows.gold : "none",
      }}
    >
      <div
        style={{
          width: 27,
          height: 27,
          borderRadius: "50%",
          background: tokens.colors.textPrimary,
          transform: checked ? "translateX(20px)" : "translateX(0)",
          transition: `transform ${tokens.transitions.base}`,
          boxShadow: tokens.shadows.sm,
        }}
      />
    </div>
  </div>
)

// ============================================
// SLIDER
// ============================================

export const Slider = ({
  value,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  label,
  showValue = true,
  color = tokens.colors.gold,
}) => {
  const percentage = ((value - min) / (max - min)) * 100

  return (
    <div>
      {(label || showValue) && (
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: tokens.spacing.sm,
          }}
        >
          {label && (
            <span
              style={{
                color: tokens.colors.textSecondary,
                fontSize: tokens.typography.sm,
              }}
            >
              {label}
            </span>
          )}
          {showValue && (
            <span
              style={{
                color: color,
                fontSize: tokens.typography.sm,
                fontWeight: tokens.typography.semibold,
              }}
            >
              {value}%
            </span>
          )}
        </div>
      )}
      <div
        style={{
          position: "relative",
          height: 6,
          background: tokens.colors.surfaceLight,
          borderRadius: 3,
        }}
      >
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            height: "100%",
            width: `${percentage}%`,
            background: color,
            borderRadius: 3,
            boxShadow: `0 0 10px ${color}`,
          }}
        />
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange?.(Number.parseInt(e.target.value))}
          style={{
            position: "absolute",
            width: "100%",
            height: "100%",
            opacity: 0,
            cursor: "pointer",
          }}
        />
        <div
          style={{
            position: "absolute",
            left: `${percentage}%`,
            top: "50%",
            transform: "translate(-50%, -50%)",
            width: 18,
            height: 18,
            borderRadius: "50%",
            background: tokens.colors.textPrimary,
            boxShadow: `0 2px 6px rgba(0,0,0,0.3), 0 0 10px ${color}`,
            pointerEvents: "none",
          }}
        />
      </div>
    </div>
  )
}

// ============================================
// DIVIDER
// ============================================

export const Divider = ({ label, style = {} }) => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      gap: tokens.spacing.base,
      margin: `${tokens.spacing.lg}px 0`,
      ...style,
    }}
  >
    <div
      style={{
        flex: 1,
        height: 1,
        background: tokens.colors.border,
      }}
    />
    {label && (
      <span
        style={{
          color: tokens.colors.textMuted,
          fontSize: tokens.typography.sm,
        }}
      >
        {label}
      </span>
    )}
    <div
      style={{
        flex: 1,
        height: 1,
        background: tokens.colors.border,
      }}
    />
  </div>
)

// ============================================
// PILL TABS
// ============================================

export const PillTabs = ({ tabs, activeTab, onChange }) => (
  <div
    style={{
      display: "flex",
      gap: tokens.spacing.sm,
      overflowX: "auto",
      paddingBottom: tokens.spacing.xs,
    }}
  >
    {tabs.map((tab) => (
      <div
        key={tab.key}
        onClick={() => onChange(tab.key)}
        style={{
          padding: `${tokens.spacing.sm}px ${tokens.spacing.base}px`,
          borderRadius: tokens.radius.full,
          background: activeTab === tab.key ? tokens.colors.gold : tokens.colors.surface,
          color: activeTab === tab.key ? tokens.colors.textInverse : tokens.colors.textSecondary,
          fontWeight: tokens.typography.medium,
          fontSize: tokens.typography.sm,
          cursor: "pointer",
          whiteSpace: "nowrap",
          border: activeTab === tab.key ? "none" : `1px solid ${tokens.colors.border}`,
          transition: `all ${tokens.transitions.base}`,
        }}
      >
        {tab.icon && <span style={{ marginRight: 6 }}>{tab.icon}</span>}
        {tab.label}
      </div>
    ))}
  </div>
)

// Export all tokens for external use
export default {
  tokens,
  neonGlow,
  goldGradient,
  goldBgGradient,
  surfaceGradient,
  formatCurrency,
  formatPercent,
  formatNumber,
  formatCompact,
  formatDate,
  formatTimeAgo,
}
