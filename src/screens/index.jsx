// ============================================
// COOKINSAINTS™ - ALL SCREENS
// Complete iOS-Native Screen Components
// ============================================

import React, { useState, useEffect, useRef } from 'react';
import { 
  Card, Button, Input, Badge, ProgressBar, ScoreRing,
  MiniChart, PortfolioChart, LoadingSpinner, LoadingScreen,
  SaintSalRobot, ListItem, MetricCard, Modal, Toast,
  EmptyState, StatusBar, Header, IconButton, Switch,
  Slider, Divider, SegmentedControl, PillTabs, Avatar,
  tokens, neonGlow, goldGradient, goldBgGradient,
  formatCurrency, formatPercent, formatNumber, formatCompact,
  formatDate, formatTimeAgo,
} from './components';
import { useAuth, useApp } from './hooks';

// ============================================
// SPLASH SCREEN
// ============================================

export const SplashScreen = ({ onComplete }) => {
  useEffect(() => {
    const timer = setTimeout(onComplete, 2500);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div style={{
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: `radial-gradient(ellipse at center, ${tokens.colors.surface} 0%, ${tokens.colors.background} 70%)`,
    }}>
      <div style={{ animation: 'pulse 2s ease-in-out infinite' }}>
        <SaintSalRobot size={120} glow />
      </div>
      
      <h1 style={{
        ...goldGradient,
        fontSize: 36,
        fontWeight: 800,
        margin: '24px 0 8px 0',
        letterSpacing: 2,
      }}>
        CookinSaints
      </h1>
      
      <p style={{
        color: tokens.colors.textSecondary,
        fontSize: 16,
        margin: 0,
      }}>
        Where Hustlers Build Wealth
      </p>
      
      <div style={{
        marginTop: 48,
        display: 'flex',
        gap: 8,
      }}>
        {[0, 1, 2].map((i) => (
          <div key={i} style={{
            width: 8,
            height: 8,
            borderRadius: '50%',
            background: tokens.colors.gold,
            animation: `bounce 1.4s ease-in-out ${i * 0.2}s infinite`,
          }} />
        ))}
      </div>
      
      <p style={{
        color: tokens.colors.textMuted,
        fontSize: 12,
        position: 'absolute',
        bottom: 60,
      }}>
        Powered by <span style={{ color: tokens.colors.gold }}>SaintSal™</span> + <span style={{ color: tokens.colors.neonPurple }}>HACP™</span>
      </p>
      
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
  );
};

// ============================================
// AUTH SCREEN
// ============================================

export const AuthScreen = ({ onComplete }) => {
  const [mode, setMode] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { login, signup } = useAuth();

  const handleSubmit = async () => {
    setError('');
    setIsLoading(true);
    
    try {
      if (mode === 'login') {
        await login(email, password);
      } else {
        await signup(email, password, name);
      }
      onComplete();
    } catch (err) {
      setError(err.message || 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  const isValid = mode === 'login' 
    ? email && password 
    : email && password && name;

  return (
    <div style={{
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      padding: 24,
      paddingTop: 0,
    }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: 32, marginTop: 20 }}>
        <SaintSalRobot size={80} />
        <h1 style={{
          ...goldGradient,
          fontSize: 28,
          fontWeight: 800,
          margin: '20px 0 8px 0',
        }}>
          {mode === 'login' ? 'Welcome Back' : 'Join CookinSaints'}
        </h1>
        <p style={{ color: tokens.colors.textSecondary, fontSize: 14, margin: 0 }}>
          {mode === 'login' 
            ? 'Sign in to access your portfolio' 
            : 'Start building wealth with SaintSal™'
          }
        </p>
      </div>

      {/* Form */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 16 }}>
        {mode === 'signup' && (
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
          type={showPassword ? 'text' : 'password'}
          placeholder="Enter your password"
          icon="🔒"
          rightIcon={
            <span 
              onClick={() => setShowPassword(!showPassword)}
              style={{ cursor: 'pointer' }}
            >
              {showPassword ? '👁️' : '👁️‍🗨️'}
            </span>
          }
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={error}
        />

        {mode === 'login' && (
          <p style={{
            color: tokens.colors.gold,
            fontSize: 14,
            textAlign: 'right',
            margin: 0,
            cursor: 'pointer',
          }}>
            Forgot Password?
          </p>
        )}

        <Button
          variant="primary"
          fullWidth
          size="large"
          loading={isLoading}
          disabled={!isValid}
          onClick={handleSubmit}
          style={{ marginTop: 16 }}
        >
          {mode === 'login' ? 'Sign In' : 'Create Account'}
        </Button>

        {/* Divider */}
        <Divider label="OR" />

        {/* Social Auth */}
        <Button variant="surface" fullWidth icon="🍎">
          Continue with Apple
        </Button>
        
        <Button variant="surface" fullWidth icon="🔵">
          Continue with Google
        </Button>
      </div>

      {/* Footer */}
      <div style={{ textAlign: 'center', marginTop: 24, paddingBottom: 20 }}>
        <p style={{ color: tokens.colors.textSecondary, fontSize: 14, margin: 0 }}>
          {mode === 'login' ? "Don't have an account? " : "Already have an account? "}
          <span 
            onClick={() => {
              setMode(mode === 'login' ? 'signup' : 'login');
              setError('');
            }}
            style={{ color: tokens.colors.gold, cursor: 'pointer', fontWeight: 600 }}
          >
            {mode === 'login' ? 'Sign Up' : 'Sign In'}
          </span>
        </p>
        
        {mode === 'signup' && (
          <p style={{ 
            color: tokens.colors.textMuted, 
            fontSize: 12, 
            margin: '16px 0 0 0',
            lineHeight: 1.5,
          }}>
            By signing up, you agree to our Terms of Service and Privacy Policy
          </p>
        )}
      </div>
    </div>
  );
};

// ============================================
// HOME SCREEN
// ============================================

export const HomeScreen = ({ onOpenChat }) => {
  const { user } = useAuth();
  const { portfolio, notifications, unreadCount } = useApp();
  const [selectedPeriod, setSelectedPeriod] = useState('1M');

  const periods = ['1D', '1W', '1M', '3M', 'YTD', '1Y', 'ALL'];
  
  const getPeriodChange = () => {
    switch (selectedPeriod) {
      case '1D': return { value: portfolio.dayChange, percent: portfolio.dayChangePercent };
      case '1W': return { value: portfolio.weekChange, percent: portfolio.weekChangePercent };
      case '1M': return { value: portfolio.monthChange, percent: portfolio.monthChangePercent };
      default: return { value: portfolio.ytdChange, percent: portfolio.ytdChangePercent };
    }
  };

  const change = getPeriodChange();

  return (
    <div style={{ padding: 20 }}>
      {/* Header */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: 24 
      }}>
        <div>
          <p style={{ color: tokens.colors.textSecondary, fontSize: 14, margin: 0 }}>What's good,</p>
          <h1 style={{ ...goldGradient, fontSize: 28, fontWeight: 700, margin: 0 }}>
            {user?.name || 'Hustler'} 👋
          </h1>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <IconButton 
            icon="🔔" 
            badge={unreadCount}
          />
          <div onClick={onOpenChat} style={{ cursor: 'pointer' }}>
            <SaintSalRobot size={40} />
          </div>
        </div>
      </div>

      {/* Total Wealth Card */}
      <Card glow style={{ marginBottom: 20 }}>
        <p style={{ color: tokens.colors.textSecondary, fontSize: 14, margin: '0 0 8px 0' }}>
          TOTAL WEALTH
        </p>
        <h2 style={{ 
          fontSize: 36, 
          fontWeight: 700, 
          margin: '0 0 4px 0',
          color: tokens.colors.textPrimary,
        }}>
          {formatCurrency(portfolio.totalValue, 2).split('.')[0]}
          <span style={{ fontSize: 24, color: tokens.colors.textSecondary }}>
            .{formatCurrency(portfolio.totalValue, 2).split('.')[1]}
          </span>
        </h2>
        <p style={{ margin: '0 0 16px 0', fontSize: 14 }}>
          <span style={{ 
            ...neonGlow(change.percent >= 0 ? tokens.colors.neonGreen : tokens.colors.neonRed), 
            fontWeight: 600 
          }}>
            {change.percent >= 0 ? '▲' : '▼'} {formatCurrency(Math.abs(change.value))} ({formatPercent(change.percent)})
          </span>
          <span style={{ color: tokens.colors.textSecondary }}> {selectedPeriod}</span>
        </p>
        
        <PortfolioChart />
        
        <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
          {periods.map((period) => (
            <span 
              key={period}
              onClick={() => setSelectedPeriod(period)}
              style={{
                fontSize: 12,
                padding: '6px 10px',
                borderRadius: 8,
                background: selectedPeriod === period ? tokens.colors.gold : 'transparent',
                color: selectedPeriod === period ? tokens.colors.textInverse : tokens.colors.textSecondary,
                fontWeight: selectedPeriod === period ? 600 : 400,
                cursor: 'pointer',
                transition: `all ${tokens.transitions.base}`,
              }}
            >
              {period}
            </span>
          ))}
        </div>
      </Card>

      {/* Allocation Card */}
      <Card style={{ marginBottom: 20 }}>
        <p style={{ color: tokens.colors.textSecondary, fontSize: 14, margin: '0 0 16px 0' }}>
          YOUR ALLOCATION
        </p>
        {[
          { key: 'csrec', label: 'CSREC', emoji: '💎', color: tokens.colors.gold },
          { key: 'trading', label: 'Trading', emoji: '📈', color: tokens.colors.neonCyan },
          { key: 'capital', label: 'Capital', emoji: '💰', color: tokens.colors.neonGreen },
          { key: 'salRan', label: 'SAL-Ran', emoji: '🤖', color: tokens.colors.neonPurple },
        ].map((item) => (
          <div key={item.key} style={{ marginBottom: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
              <span style={{ color: tokens.colors.textPrimary, fontSize: 14 }}>
                {item.emoji} {item.label}
              </span>
              <span style={{ color: tokens.colors.textSecondary, fontSize: 14 }}>
                {formatCurrency(portfolio.allocations[item.key].value, 0)}{' '}
                <span style={{ color: item.color }}>{portfolio.allocations[item.key].percent}%</span>
              </span>
            </div>
            <ProgressBar 
              value={portfolio.allocations[item.key].percent} 
              color={item.color} 
            />
          </div>
        ))}
      </Card>

      {/* SAL's Daily Briefing */}
      <Card 
        variant="gold"
        onClick={onOpenChat}
        style={{ cursor: 'pointer' }}
      >
        <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
          <SaintSalRobot size={48} />
          <div style={{ flex: 1 }}>
            <p style={{ 
              ...neonGlow(tokens.colors.gold, 0.5), 
              fontSize: 14, 
              fontWeight: 600, 
              margin: '0 0 8px 0' 
            }}>
              🤖 SAL'S DAILY BRIEFING
            </p>
            <p style={{ color: tokens.colors.textSecondary, fontSize: 14, margin: 0, lineHeight: 1.5 }}>
              "Your <span style={{ color: tokens.colors.gold }}>CSREC</span> holdings are outperforming 
              public REITs by <span style={{ ...neonGlow(tokens.colors.neonGreen, 0.5) }}>4.2% YTD</span>. 
              New Austin property closing next week. Your{' '}
              <span style={{ color: tokens.colors.neonPurple }}>SAL-Ran</span> portfolio captured 
              the NVDA rally perfectly."
            </p>
            <div style={{ display: 'flex', gap: 12, marginTop: 16 }}>
              <Button style={{ flex: 1 }} size="small">ASK SAL</Button>
              <Button variant="primary" style={{ flex: 1 }} size="small">VIEW REPORT</Button>
            </div>
          </div>
        </div>
      </Card>

      {/* Recent Activity */}
      <div style={{ marginTop: 20 }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: 12,
        }}>
          <p style={{ color: tokens.colors.textSecondary, fontSize: 14, margin: 0 }}>
            RECENT ACTIVITY
          </p>
          <span style={{ color: tokens.colors.gold, fontSize: 14, cursor: 'pointer' }}>
            See All →
          </span>
        </div>
        <Card>
          {notifications.slice(0, 3).map((item, i) => (
            <ListItem
              key={item.id}
              emoji={item.type === 'trade' ? '🤖' : item.type === 'distribution' ? '💎' : '💰'}
              title={item.title}
              subtitle={formatTimeAgo(item.time)}
              rightValue={item.message}
              divider={i < 2}
            />
          ))}
        </Card>
      </div>
    </div>
  );
};

// ============================================
// TRADE SCREEN
// ============================================

export const TradeScreen = () => {
  const { trading } = useApp();
  const [activeCategory, setActiveCategory] = useState('stocks');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    { key: 'stocks', label: 'Stocks' },
    { key: 'crypto', label: 'Crypto' },
    { key: 'etfs', label: 'ETFs' },
    { key: 'options', label: 'Options' },
  ];

  const filteredPositions = trading.positions.filter(pos => {
    const matchesCategory = activeCategory === 'crypto' 
      ? pos.type === 'crypto' 
      : pos.type !== 'crypto';
    const matchesSearch = !searchQuery || 
      pos.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pos.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div style={{ padding: 20 }}>
      {/* Header */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: 20 
      }}>
        <h1 style={{ ...goldGradient, fontSize: 28, fontWeight: 700, margin: 0 }}>Trade</h1>
        <IconButton icon="🔍" />
      </div>

      {/* Category Tabs */}
      <SegmentedControl
        segments={categories}
        activeSegment={activeCategory}
        onChange={setActiveCategory}
      />

      {/* Portfolio Summary */}
      <Card style={{ marginTop: 20, marginBottom: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <p style={{ color: tokens.colors.textSecondary, fontSize: 14, margin: '0 0 4px 0' }}>
              {activeCategory.toUpperCase()} PORTFOLIO
            </p>
            <h2 style={{ fontSize: 28, fontWeight: 700, margin: '0 0 4px 0', color: tokens.colors.textPrimary }}>
              {formatCurrency(trading.portfolioValue, 0)}
            </h2>
            <p style={{ 
              ...neonGlow(trading.dayChangePercent >= 0 ? tokens.colors.neonGreen : tokens.colors.neonRed), 
              fontSize: 14, 
              margin: 0, 
              fontWeight: 600 
            }}>
              {trading.dayChangePercent >= 0 ? '▲' : '▼'} {formatCurrency(Math.abs(trading.dayChange))} ({formatPercent(trading.dayChangePercent)}) today
            </p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <p style={{ color: tokens.colors.textSecondary, fontSize: 12, margin: '0 0 4px 0' }}>Buying Power</p>
            <p style={{ color: tokens.colors.gold, fontSize: 18, fontWeight: 600, margin: 0 }}>
              {formatCurrency(trading.buyingPower, 0)}
            </p>
          </div>
        </div>
      </Card>

      {/* SAL's Top Picks */}
      <p style={{ 
        ...neonGlow(tokens.colors.gold, 0.5), 
        fontSize: 14, 
        fontWeight: 600, 
        marginBottom: 12 
      }}>
        🤖 SAL'S TOP PICKS TODAY
      </p>

      {trading.watchlist.slice(0, 2).map((stock, i) => (
        <Card key={i} style={{ marginBottom: 12 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{
                width: 44,
                height: 44,
                borderRadius: 12,
                background: `linear-gradient(135deg, ${tokens.colors.surfaceLight} 0%, ${tokens.colors.surface} 100%)`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 700,
                fontSize: 11,
                color: tokens.colors.gold,
                border: `1px solid ${tokens.colors.border}`,
              }}>
                {stock.symbol.slice(0, 4)}
              </div>
              <div>
                <p style={{ color: tokens.colors.textPrimary, fontWeight: 600, margin: 0 }}>{stock.symbol}</p>
                <p style={{ color: tokens.colors.textSecondary, fontSize: 12, margin: 0 }}>{stock.name}</p>
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <p style={{ color: tokens.colors.textPrimary, fontWeight: 600, margin: 0 }}>
                {formatCurrency(stock.price, stock.price > 1000 ? 0 : 2)}
              </p>
              <p style={{ 
                ...neonGlow(stock.change >= 0 ? tokens.colors.neonGreen : tokens.colors.neonRed, 0.5), 
                fontSize: 12, 
                margin: 0,
                fontWeight: 600,
              }}>
                {stock.change >= 0 ? '▲' : '▼'} {formatPercent(stock.change)}
              </p>
            </div>
          </div>
          
          <div style={{ 
            background: tokens.colors.surfaceLight, 
            borderRadius: 8, 
            padding: 12,
            display: 'flex',
            alignItems: 'center',
            gap: 12,
          }}>
            <ScoreRing score={stock.salScore} />
            <div style={{ flex: 1 }}>
              <p style={{ color: tokens.colors.textSecondary, fontSize: 12, margin: 0, lineHeight: 1.4 }}>
                {stock.change >= 0 
                  ? '"Strong momentum. HACP™ confidence: HIGH"'
                  : '"Consolidation phase. HACP™ confidence: MEDIUM"'
                }
              </p>
            </div>
          </div>
          
          <div style={{ display: 'flex', gap: 12, marginTop: 12 }}>
            <Button style={{ flex: 1 }} size="small">ANALYZE</Button>
            <Button variant="primary" style={{ flex: 1 }} size="small">TRADE</Button>
          </div>
        </Card>
      ))}

      {/* Positions */}
      <p style={{ color: tokens.colors.textSecondary, fontSize: 14, marginTop: 20, marginBottom: 12 }}>
        YOUR POSITIONS
      </p>
      <Card>
        {filteredPositions.slice(0, 4).map((pos, i) => (
          <ListItem
            key={pos.id}
            title={pos.symbol}
            subtitle={`${pos.shares} ${pos.shares === 1 ? 'share' : 'shares'}`}
            rightValue={formatCurrency(pos.value, 0)}
            rightLabel={`${pos.changePercent >= 0 ? '▲' : '▼'} ${formatPercent(pos.changePercent)}`}
            rightValueColor={pos.changePercent >= 0 ? tokens.colors.neonGreen : tokens.colors.neonRed}
            divider={i < filteredPositions.length - 1}
          />
        ))}
      </Card>

      {/* Trade Button */}
      <Button 
        variant="primary" 
        fullWidth 
        size="large" 
        style={{ marginTop: 20 }}
        icon="📈"
      >
        NEW TRADE
      </Button>
    </div>
  );
};

// ============================================
// CSREC SCREEN
// ============================================

export const CSRECScreen = () => {
  const { csrec, properties } = useApp();
  const [selectedPeriod, setSelectedPeriod] = useState('1M');
  const [showBuyModal, setShowBuyModal] = useState(false);
  const [buyAmount, setBuyAmount] = useState('');

  const periods = ['1M', '3M', '6M', '1Y', 'ALL'];

  return (
    <div style={{ padding: 20 }}>
      {/* Header Banner */}
      <Card glow variant="gold" style={{ 
        marginBottom: 20,
        textAlign: 'center',
        padding: 24,
      }}>
        <div style={{ 
          fontSize: 48, 
          marginBottom: 8,
          filter: `drop-shadow(0 0 20px ${tokens.colors.gold})`,
        }}>
          💎
        </div>
        <h1 style={{ 
          ...goldGradient, 
          fontSize: 32, 
          fontWeight: 800, 
          margin: '0 0 4px 0',
          letterSpacing: 4,
        }}>
          CSREC
        </h1>
        <p style={{ color: tokens.colors.textSecondary, fontSize: 14, margin: '0 0 12px 0' }}>
          CookinSaint Real Estate Currency
        </p>
        <p style={{ 
          ...neonGlow(tokens.colors.neonCyan, 0.5), 
          fontSize: 16, 
          fontWeight: 600, 
          margin: 0 
        }}>
          "Own Real Estate Like You Own Stocks"
        </p>
        <p style={{ color: tokens.colors.textSecondary, fontSize: 12, margin: '12px 0 0 0' }}>
          Powered by <span style={{ color: tokens.colors.gold }}>SaintSal™</span> + <span style={{ color: tokens.colors.neonPurple }}>HACP™</span>
        </p>
      </Card>

      {/* Price Card */}
      <Card style={{ marginBottom: 20 }}>
        <div style={{ textAlign: 'center', marginBottom: 16 }}>
          <p style={{ color: tokens.colors.textSecondary, fontSize: 14, margin: '0 0 8px 0' }}>CSREC PRICE</p>
          <h2 style={{ fontSize: 42, fontWeight: 700, margin: '0 0 4px 0', color: tokens.colors.textPrimary }}>
            ${Math.floor(csrec.price)}<span style={{ fontSize: 28 }}>.{(csrec.price % 1).toFixed(2).split('.')[1]}</span>
          </h2>
          <p style={{ margin: 0 }}>
            <span style={{ 
              ...neonGlow(csrec.dayChangePercent >= 0 ? tokens.colors.neonGreen : tokens.colors.neonRed, 0.5), 
              fontWeight: 600 
            }}>
              {csrec.dayChangePercent >= 0 ? '▲' : '▼'} {formatCurrency(Math.abs(csrec.dayChange))} ({formatPercent(csrec.dayChangePercent)})
            </span>
            <span style={{ color: tokens.colors.textSecondary }}> today</span>
          </p>
          <p style={{ ...neonGlow(tokens.colors.neonGreen, 0.5), fontSize: 14, margin: '4px 0 0 0' }}>
            ▲ {formatPercent(csrec.ytdReturn)} YTD
          </p>
        </div>
        
        <MiniChart positive={csrec.ytdReturn >= 0} height={80} color={tokens.colors.gold} />
        
        <div style={{ display: 'flex', gap: 8, marginTop: 12, justifyContent: 'center' }}>
          {periods.map((period) => (
            <span 
              key={period}
              onClick={() => setSelectedPeriod(period)}
              style={{
                fontSize: 12,
                padding: '6px 12px',
                borderRadius: 8,
                background: selectedPeriod === period ? tokens.colors.gold : 'transparent',
                color: selectedPeriod === period ? tokens.colors.textInverse : tokens.colors.textSecondary,
                fontWeight: selectedPeriod === period ? 600 : 400,
                cursor: 'pointer',
              }}
            >
              {period}
            </span>
          ))}
        </div>
      </Card>

      {/* Fund Metrics */}
      <Card style={{ marginBottom: 20 }}>
        <p style={{ 
          ...neonGlow(tokens.colors.gold, 0.5), 
          fontSize: 14, 
          fontWeight: 600, 
          margin: '0 0 16px 0',
        }}>
          CSREC FUND METRICS
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <MetricCard label="Total AUM" value={formatCompact(csrec.totalAUM)} />
          <MetricCard label="Properties" value={csrec.propertyCount} />
          <MetricCard label="Avg SAL Score" value={`${csrec.avgSalScore}/100`} color={tokens.colors.gold} />
          <MetricCard label="Avg Cap Rate" value={`${csrec.avgCapRate}%`} />
          <MetricCard label="Annual Yield" value={`${csrec.annualYield}%`} color={tokens.colors.neonGreen} />
          <MetricCard label="YTD Return" value={formatPercent(csrec.ytdReturn)} positive={csrec.ytdReturn >= 0} />
        </div>
      </Card>

      {/* Your Holdings */}
      <Card style={{ marginBottom: 20 }}>
        <p style={{ color: tokens.colors.textSecondary, fontSize: 14, margin: '0 0 16px 0' }}>
          YOUR CSREC HOLDINGS
        </p>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
          <div>
            <h3 style={{ ...goldGradient, fontSize: 28, fontWeight: 700, margin: '0 0 4px 0' }}>
              {formatNumber(csrec.holdings.units)} <span style={{ fontSize: 16 }}>CSREC</span>
            </h3>
            <p style={{ color: tokens.colors.textPrimary, fontSize: 18, margin: '0 0 4px 0' }}>
              Value: {formatCurrency(csrec.holdings.value)}
            </p>
            <p style={{ color: tokens.colors.textSecondary, fontSize: 14, margin: 0 }}>
              Avg Cost: {formatCurrency(csrec.holdings.avgCost)}
            </p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <p style={{ ...neonGlow(tokens.colors.neonGreen, 0.5), fontSize: 16, fontWeight: 700, margin: '0 0 4px 0' }}>
              +{formatCurrency(csrec.holdings.totalReturn)}
            </p>
            <p style={{ color: tokens.colors.neonGreen, fontSize: 14, margin: 0 }}>
              ({formatPercent(csrec.holdings.returnPercent)})
            </p>
          </div>
        </div>
        
        <div style={{ 
          background: tokens.colors.surfaceLight, 
          borderRadius: 12, 
          padding: 12,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <div>
            <p style={{ color: tokens.colors.textSecondary, fontSize: 12, margin: '0 0 4px 0' }}>Next Distribution</p>
            <p style={{ color: tokens.colors.textPrimary, fontWeight: 600, margin: 0 }}>
              {formatDate(csrec.nextDistribution.date, 'medium')}
            </p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <p style={{ color: tokens.colors.textSecondary, fontSize: 12, margin: '0 0 4px 0' }}>Est. Amount</p>
            <p style={{ ...neonGlow(tokens.colors.gold, 0.5), fontWeight: 700, margin: 0 }}>
              {formatCurrency(csrec.nextDistribution.estimatedAmount)}
            </p>
          </div>
        </div>
      </Card>

      {/* Action Buttons */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
        <Button 
          variant="primary" 
          style={{ flex: 1 }}
          size="large"
          icon="💎"
          onClick={() => setShowBuyModal(true)}
        >
          BUY CSREC
        </Button>
        <Button style={{ flex: 1 }} size="large" icon="💸">
          SELL CSREC
        </Button>
      </div>

      {/* Properties Preview */}
      <Card>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <p style={{ color: tokens.colors.textSecondary, fontSize: 14, margin: 0 }}>PROPERTIES IN PORTFOLIO</p>
          <span style={{ color: tokens.colors.gold, fontSize: 14, cursor: 'pointer' }}>View All →</span>
        </div>
        {properties.slice(0, 3).map((prop, i) => (
          <ListItem
            key={prop.id}
            icon={
              <span style={{ fontSize: 24 }}>
                {prop.type === 'Multifamily' ? '🏢' : prop.type === 'Industrial' ? '🏭' : prop.type === 'Office' ? '🏛️' : '🏠'}
              </span>
            }
            title={prop.name}
            subtitle={`${prop.location} • ${prop.units ? `${prop.units} Units` : `${formatNumber(prop.sqft)} SF`}`}
            rightValue={formatCompact(prop.nav)}
            rightContent={<Badge variant="gold" size="small">🤖 {prop.salScore}</Badge>}
            divider={i < 2}
          />
        ))}
      </Card>

      {/* Buy Modal */}
      <Modal
        isOpen={showBuyModal}
        onClose={() => setShowBuyModal(false)}
        title="Buy CSREC"
        footer={
          <>
            <Button 
              style={{ flex: 1 }} 
              onClick={() => setShowBuyModal(false)}
            >
              Cancel
            </Button>
            <Button 
              variant="primary" 
              style={{ flex: 1 }}
              disabled={!buyAmount || parseFloat(buyAmount) <= 0}
            >
              Confirm Purchase
            </Button>
          </>
        }
      >
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <p style={{ color: tokens.colors.textSecondary, fontSize: 14, margin: '0 0 8px 0' }}>Current Price</p>
          <h2 style={{ ...goldGradient, fontSize: 32, fontWeight: 700, margin: 0 }}>
            {formatCurrency(csrec.price)}
          </h2>
        </div>
        
        <Input
          label="Investment Amount ($)"
          type="number"
          placeholder="Enter amount"
          value={buyAmount}
          onChange={(e) => setBuyAmount(e.target.value)}
          icon="💵"
        />
        
        {buyAmount && parseFloat(buyAmount) > 0 && (
          <div style={{ 
            background: tokens.colors.surfaceLight, 
            borderRadius: 12, 
            padding: 16,
            marginTop: 16,
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <span style={{ color: tokens.colors.textSecondary }}>CSREC Units</span>
              <span style={{ color: tokens.colors.textPrimary, fontWeight: 600 }}>
                ~{(parseFloat(buyAmount) / csrec.price).toFixed(2)}
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: tokens.colors.textSecondary }}>Est. Annual Yield</span>
              <span style={{ color: tokens.colors.neonGreen, fontWeight: 600 }}>
                ~{formatCurrency(parseFloat(buyAmount) * (csrec.annualYield / 100))}
              </span>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

// ============================================
// CAPITAL SCREEN
// ============================================

export const CapitalScreen = () => {
  const { capital } = useApp();
  const [selectedTab, setSelectedTab] = useState('fund');

  return (
    <div style={{ padding: 20 }}>
      {/* Header Banner */}
      <Card glow variant="success" style={{ 
        marginBottom: 20,
        textAlign: 'center',
        padding: 24,
      }}>
        <div style={{ fontSize: 48, marginBottom: 8 }}>💰</div>
        <h1 style={{ 
          ...goldGradient, 
          fontSize: 28, 
          fontWeight: 800, 
          margin: '0 0 4px 0',
        }}>
          COOKIN CAPITAL
        </h1>
        <p style={{ color: tokens.colors.textSecondary, fontSize: 14, margin: '0 0 12px 0' }}>
          Private Real Estate Lending
        </p>
        <p style={{ 
          ...neonGlow(tokens.colors.neonGreen, 0.5), 
          fontSize: 20, 
          fontWeight: 700, 
          margin: 0 
        }}>
          Earn 9-12% Returns
        </p>
        <p style={{ color: tokens.colors.textSecondary, fontSize: 12, margin: '8px 0 0 0' }}>
          Every loan underwritten by <span style={{ color: tokens.colors.gold }}>SaintSal™</span>
        </p>
      </Card>

      {/* Portfolio Summary */}
      <Card style={{ marginBottom: 20 }}>
        <p style={{ color: tokens.colors.textSecondary, fontSize: 14, margin: '0 0 16px 0' }}>
          YOUR LENDING PORTFOLIO
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <MetricCard label="Total Invested" value={formatCurrency(capital.totalInvested, 0)} />
          <MetricCard label="Weighted Avg Rate" value={`${capital.weightedAvgRate}%`} color={tokens.colors.neonGreen} />
          <MetricCard label="Total Earned" value={formatCurrency(capital.totalEarned)} color={tokens.colors.gold} />
          <MetricCard label="Next Payment" value={formatCurrency(capital.nextPayment.amount)} />
        </div>
      </Card>

      {/* Investment Options */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
        <Card 
          onClick={() => setSelectedTab('fund')}
          style={{ 
            flex: 1, 
            textAlign: 'center',
            border: selectedTab === 'fund' ? `2px solid ${tokens.colors.gold}` : `1px solid ${tokens.colors.border}`,
            cursor: 'pointer',
          }}
        >
          <div style={{ fontSize: 32, marginBottom: 8 }}>🏦</div>
          <p style={{ color: tokens.colors.textPrimary, fontWeight: 600, margin: '0 0 4px 0' }}>LENDING FUND</p>
          <p style={{ ...neonGlow(tokens.colors.neonGreen, 0.5), fontWeight: 700, margin: '0 0 4px 0' }}>9-10%</p>
          <p style={{ color: tokens.colors.textSecondary, fontSize: 12, margin: 0 }}>Diversified</p>
        </Card>
        <Card 
          onClick={() => setSelectedTab('notes')}
          style={{ 
            flex: 1, 
            textAlign: 'center',
            border: selectedTab === 'notes' ? `2px solid ${tokens.colors.gold}` : `1px solid ${tokens.colors.border}`,
            cursor: 'pointer',
          }}
        >
          <div style={{ fontSize: 32, marginBottom: 8 }}>📄</div>
          <p style={{ color: tokens.colors.textPrimary, fontWeight: 600, margin: '0 0 4px 0' }}>PICK LOANS</p>
          <p style={{ ...neonGlow(tokens.colors.neonCyan, 0.5), fontWeight: 700, margin: '0 0 4px 0' }}>10-12%</p>
          <p style={{ color: tokens.colors.textSecondary, fontSize: 12, margin: 0 }}>Choose deals</p>
        </Card>
      </div>

      {/* Fund Metrics */}
      <Card style={{ marginBottom: 20 }}>
        <p style={{ ...neonGlow(tokens.colors.gold, 0.5), fontSize: 14, fontWeight: 600, margin: '0 0 16px 0' }}>
          FUND METRICS
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          {[
            { label: 'Fund Size', value: formatCompact(capital.fundMetrics.fundSize) },
            { label: 'Active Loans', value: capital.fundMetrics.activeLoans },
            { label: 'Avg SAL Score', value: `${capital.fundMetrics.avgSalScore}/100` },
            { label: 'Current Yield', value: `${capital.fundMetrics.currentYield}%` },
            { label: 'Default Rate', value: `${capital.fundMetrics.defaultRate}%` },
            { label: 'Avg LTV', value: `${capital.fundMetrics.avgLTV}%` },
          ].map((metric, i) => (
            <div key={i} style={{ 
              display: 'flex', 
              justifyContent: 'space-between',
              padding: '8px 0',
              borderBottom: i < 4 ? `1px solid ${tokens.colors.border}` : 'none',
            }}>
              <span style={{ color: tokens.colors.textSecondary, fontSize: 14 }}>{metric.label}</span>
              <span style={{ color: tokens.colors.textPrimary, fontSize: 14, fontWeight: 600 }}>{metric.value}</span>
            </div>
          ))}
        </div>
      </Card>

      {/* Your Investments */}
      <Card style={{ marginBottom: 20 }}>
        <p style={{ color: tokens.colors.textSecondary, fontSize: 14, margin: '0 0 16px 0' }}>
          YOUR INVESTMENTS
        </p>
        {capital.investments.map((inv, i) => (
          <ListItem
            key={inv.id}
            emoji={inv.type === 'fund' ? '🏦' : '📄'}
            title={inv.name}
            subtitle={<Badge variant="success" size="small">{inv.status}</Badge>}
            rightValue={formatCurrency(inv.amount, 0)}
            rightLabel={`${inv.rate}%`}
            rightValueColor={tokens.colors.neonGreen}
            divider={i < capital.investments.length - 1}
          />
        ))}
      </Card>

      {/* Available Loans */}
      {selectedTab === 'notes' && (
        <Card style={{ marginBottom: 20 }}>
          <p style={{ color: tokens.colors.textSecondary, fontSize: 14, margin: '0 0 16px 0' }}>
            AVAILABLE LOANS
          </p>
          {capital.availableLoans.map((loan, i) => (
            <div key={loan.id} style={{
              padding: '16px 0',
              borderBottom: i < capital.availableLoans.length - 1 ? `1px solid ${tokens.colors.border}` : 'none',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                <div>
                  <p style={{ color: tokens.colors.textPrimary, fontWeight: 600, margin: 0 }}>{loan.name}</p>
                  <p style={{ color: tokens.colors.textSecondary, fontSize: 12, margin: '4px 0 0 0' }}>
                    {loan.propertyType} • {loan.location}
                  </p>
                </div>
                <Badge variant="gold" size="small">🤖 {loan.salScore}</Badge>
              </div>
              <div style={{ display: 'flex', gap: 16, marginBottom: 12 }}>
                <span style={{ color: tokens.colors.textSecondary, fontSize: 12 }}>
                  Rate: <span style={{ color: tokens.colors.neonGreen }}>{loan.rate}%</span>
                </span>
                <span style={{ color: tokens.colors.textSecondary, fontSize: 12 }}>
                  LTV: {loan.ltv}%
                </span>
                <span style={{ color: tokens.colors.textSecondary, fontSize: 12 }}>
                  Term: {loan.term}mo
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: tokens.colors.textSecondary, fontSize: 12 }}>
                  Available: {formatCurrency(loan.available, 0)} • Min: {formatCurrency(loan.minInvestment, 0)}
                </span>
                <Button variant="primary" size="small">INVEST</Button>
              </div>
            </div>
          ))}
        </Card>
      )}

      {/* Invest Button */}
      <Button variant="primary" fullWidth size="large" icon="💰">
        INVEST MORE
      </Button>
    </div>
  );
};

// ============================================
// SAL SCREEN
// ============================================

export const SALScreen = ({ onOpenChat }) => {
  const { user, updatePreferences } = useAuth();
  const { salRan } = useApp();

  const preferenceItems = [
    { key: 'riskTolerance', label: 'Risk Tolerance', color: tokens.colors.neonCyan },
    { key: 'growthFocus', label: 'Growth Focus', color: tokens.colors.neonGreen },
    { key: 'reAllocation', label: 'RE Allocation', color: tokens.colors.gold },
    { key: 'cryptoComfort', label: 'Crypto Comfort', color: tokens.colors.neonPurple },
  ];

  return (
    <div style={{ padding: 20 }}>
      {/* Header */}
      <Card glow variant="gold" style={{ 
        marginBottom: 20,
        textAlign: 'center',
        padding: 24,
      }}>
        <SaintSalRobot size={80} glow />
        <h1 style={{ 
          ...goldGradient, 
          fontSize: 28, 
          fontWeight: 800, 
          margin: '16px 0 4px 0',
        }}>
          SaintSal™
        </h1>
        <p style={{ color: tokens.colors.textSecondary, fontSize: 14, margin: '0 0 8px 0' }}>
          Powered by <span style={{ ...neonGlow(tokens.colors.neonPurple, 0.5) }}>HACP™</span> Technology
        </p>
        <p style={{ color: tokens.colors.textSecondary, fontSize: 12, margin: 0, fontStyle: 'italic' }}>
          "I don't just manage your money. I learn HOW you want it managed."
        </p>
      </Card>

      {/* Quick Actions */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 20 }}>
        {[
          { icon: '💬', label: 'Chat with SAL', onClick: onOpenChat },
          { icon: '🤖', label: 'SAL-Ran Portfolio' },
          { icon: '📊', label: 'Market Analysis' },
          { icon: '⚙️', label: 'HACP™ Settings' },
        ].map((item, i) => (
          <Card 
            key={i} 
            style={{ textAlign: 'center', cursor: 'pointer' }}
            onClick={item.onClick}
          >
            <div style={{ fontSize: 32, marginBottom: 8 }}>{item.icon}</div>
            <p style={{ color: tokens.colors.textPrimary, fontWeight: 600, margin: 0, fontSize: 14 }}>{item.label}</p>
          </Card>
        ))}
      </div>

      {/* SAL-Ran Portfolio */}
      <Card variant="purple" style={{ marginBottom: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
          <div>
            <p style={{ ...neonGlow(tokens.colors.neonPurple, 0.5), fontSize: 14, fontWeight: 600, margin: '0 0 8px 0' }}>
              🤖 SAL-RAN PORTFOLIO
            </p>
            <h3 style={{ color: tokens.colors.textPrimary, fontSize: 28, fontWeight: 700, margin: '0 0 4px 0' }}>
              {formatCurrency(salRan.portfolioValue, 0)}
            </h3>
            <p style={{ ...neonGlow(tokens.colors.neonGreen, 0.5), fontSize: 14, margin: 0, fontWeight: 600 }}>
              ▲ {formatCurrency(salRan.ytdReturnDollars)} ({formatPercent(salRan.ytdReturn)}) YTD
            </p>
          </div>
          <div style={{ 
            background: tokens.colors.surfaceLight, 
            borderRadius: 12, 
            padding: '8px 12px',
            textAlign: 'center',
          }}>
            <p style={{ color: tokens.colors.textSecondary, fontSize: 10, margin: '0 0 2px 0' }}>vs S&P 500</p>
            <p style={{ ...neonGlow(tokens.colors.neonGreen, 0.5), fontWeight: 700, margin: 0 }}>
              +{salRan.outperformance}%
            </p>
          </div>
        </div>
        
        <MiniChart positive height={60} color={tokens.colors.neonPurple} />
        
        <div style={{ display: 'flex', gap: 12, marginTop: 16 }}>
          <Button style={{ flex: 1 }} size="small">VIEW PORTFOLIO</Button>
          <Button variant="primary" style={{ flex: 1 }} size="small">ADD FUNDS</Button>
        </div>
      </Card>

      {/* Holdings */}
      <Card style={{ marginBottom: 20 }}>
        <p style={{ color: tokens.colors.textSecondary, fontSize: 14, margin: '0 0 16px 0' }}>
          SAL-RAN HOLDINGS
        </p>
        {salRan.holdings.slice(0, 5).map((holding, i) => (
          <div key={i} style={{
            display: 'flex',
            alignItems: 'center',
            padding: '10px 0',
            borderBottom: i < 4 ? `1px solid ${tokens.colors.border}` : 'none',
          }}>
            <div style={{ flex: 1 }}>
              <p style={{ color: tokens.colors.textPrimary, fontWeight: 600, margin: 0, fontSize: 14 }}>
                {holding.symbol}
              </p>
            </div>
            <div style={{ width: 60, textAlign: 'right' }}>
              <p style={{ color: tokens.colors.gold, fontWeight: 600, margin: 0, fontSize: 14 }}>
                {holding.percent}%
              </p>
            </div>
            <div style={{ width: 80, textAlign: 'right' }}>
              <p style={{ 
                ...neonGlow(holding.change >= 0 ? tokens.colors.neonGreen : tokens.colors.neonRed, 0.5),
                fontSize: 12, 
                margin: 0,
                fontWeight: 600,
              }}>
                {holding.change >= 0 ? '+' : ''}{holding.change}%
              </p>
            </div>
          </div>
        ))}
      </Card>

      {/* HACP Profile */}
      <Card>
        <p style={{ ...neonGlow(tokens.colors.gold, 0.5), fontSize: 14, fontWeight: 600, margin: '0 0 8px 0' }}>
          HACP™ PROFILE
        </p>
        <p style={{ color: tokens.colors.textSecondary, fontSize: 12, margin: '0 0 16px 0' }}>
          SAL has learned these preferences from your interactions:
        </p>
        {preferenceItems.map((pref) => (
          <Slider
            key={pref.key}
            label={pref.label}
            value={user?.preferences?.[pref.key] || 50}
            onChange={(val) => updatePreferences({ [pref.key]: val })}
            color={pref.color}
          />
        ))}
        <Button fullWidth style={{ marginTop: 16 }} icon="⚙️">
          FINE-TUNE HACP™
        </Button>
      </Card>

      {/* Recent SAL Actions */}
      <div style={{ marginTop: 20 }}>
        <p style={{ color: tokens.colors.textSecondary, fontSize: 14, marginBottom: 12 }}>
          RECENT SAL ACTIONS
        </p>
        <Card>
          {salRan.recentTrades.slice(0, 3).map((trade, i) => (
            <ListItem
              key={trade.id}
              emoji={trade.action === 'buy' ? '🟢' : '🔴'}
              title={`${trade.action.toUpperCase()} ${trade.shares} ${trade.symbol}`}
              subtitle={formatDate(trade.date, 'short')}
              rightValue={`@${formatCurrency(trade.price, trade.price > 1000 ? 0 : 2)}`}
              divider={i < 2}
            />
          ))}
        </Card>
      </div>
    </div>
  );
};

// ============================================
// CHAT SCREEN
// ============================================

export const ChatScreen = ({ onClose }) => {
  const { chatMessages, sendMessageToSal, isChatLoading, clearChat } = useApp();
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  // Initial message if chat is empty
  useEffect(() => {
    if (chatMessages.length === 0) {
      sendMessageToSal('Hey SAL, what\'s the latest with my portfolio?');
    }
  }, []);

  const handleSend = () => {
    if (!input.trim() || isChatLoading) return;
    sendMessageToSal(input.trim());
    setInput('');
  };

  const quickActions = [
    'Portfolio summary',
    'CSREC update',
    'Market outlook',
    'Buy recommendations',
  ];

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: tokens.colors.background,
      display: 'flex',
      flexDirection: 'column',
      zIndex: 100,
    }}>
      {/* Status Bar */}
      <StatusBar />
      
      {/* Chat Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: '16px 20px',
        borderBottom: `1px solid ${tokens.colors.border}`,
      }}>
        <div 
          onClick={onClose}
          style={{ cursor: 'pointer', fontSize: 20, color: tokens.colors.textPrimary }}
        >
          ←
        </div>
        <SaintSalRobot size={40} />
        <div style={{ flex: 1 }}>
          <p style={{ ...goldGradient, fontWeight: 700, margin: 0 }}>SaintSal™</p>
          <p style={{ color: tokens.colors.neonGreen, fontSize: 12, margin: 0 }}>● Online</p>
        </div>
        <IconButton icon="🗑️" variant="ghost" onClick={clearChat} />
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: 'auto', padding: 20 }}>
        {chatMessages.map((msg) => (
          <div 
            key={msg.id}
            style={{
              display: 'flex',
              gap: 12,
              marginBottom: 20,
              justifyContent: msg.from === 'user' ? 'flex-end' : 'flex-start',
            }}
          >
            {msg.from === 'sal' && <SaintSalRobot size={36} />}
            <div style={{
              background: msg.from === 'sal' 
                ? tokens.colors.surface 
                : `linear-gradient(135deg, ${tokens.colors.gold}30 0%, ${tokens.colors.gold}10 100%)`,
              borderRadius: msg.from === 'sal' ? '4px 16px 16px 16px' : '16px 4px 16px 16px',
              padding: 16,
              maxWidth: '80%',
              border: `1px solid ${msg.from === 'sal' ? tokens.colors.borderGold : `${tokens.colors.gold}50`}`,
            }}>
              <p style={{ color: tokens.colors.textPrimary, margin: 0, lineHeight: 1.5, fontSize: 14 }}>
                {msg.text}
              </p>
              <p style={{ 
                color: tokens.colors.textMuted, 
                fontSize: 10, 
                margin: '8px 0 0 0',
                textAlign: msg.from === 'user' ? 'right' : 'left',
              }}>
                {formatDate(msg.time, 'time')}
              </p>
            </div>
          </div>
        ))}
        
        {isChatLoading && (
          <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
            <SaintSalRobot size={36} />
            <div style={{
              background: tokens.colors.surface,
              borderRadius: '4px 16px 16px 16px',
              padding: 16,
              border: `1px solid ${tokens.colors.borderGold}`,
            }}>
              <div style={{ display: 'flex', gap: 6 }}>
                {[0, 1, 2].map((i) => (
                  <div key={i} style={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    background: tokens.colors.gold,
                    animation: `bounce 1.4s ease-in-out ${i * 0.2}s infinite`,
                  }} />
                ))}
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Actions */}
      {chatMessages.length <= 2 && (
        <div style={{ 
          padding: '0 20px 12px 20px',
          display: 'flex',
          gap: 8,
          overflowX: 'auto',
        }}>
          {quickActions.map((action, i) => (
            <Button 
              key={i}
              variant="surface"
              size="small"
              onClick={() => sendMessageToSal(action)}
              style={{ whiteSpace: 'nowrap' }}
            >
              {action}
            </Button>
          ))}
        </div>
      )}

      {/* Input */}
      <div style={{
        padding: '16px 20px 32px 20px',
        borderTop: `1px solid ${tokens.colors.border}`,
        display: 'flex',
        gap: 12,
        background: tokens.colors.surface,
      }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Message SaintSal..."
          style={{
            flex: 1,
            background: tokens.colors.background,
            border: `1px solid ${tokens.colors.border}`,
            borderRadius: 24,
            padding: '14px 20px',
            color: tokens.colors.textPrimary,
            fontSize: 16,
            outline: 'none',
            fontFamily: tokens.typography.fontFamily,
          }}
        />
        <div 
          onClick={handleSend}
          style={{
            width: 48,
            height: 48,
            borderRadius: 24,
            background: input.trim() ? goldBgGradient : tokens.colors.surfaceLight,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: input.trim() ? 'pointer' : 'default',
            boxShadow: input.trim() ? tokens.shadows.gold : 'none',
            color: input.trim() ? tokens.colors.textInverse : tokens.colors.textMuted,
            fontSize: 18,
            transition: `all ${tokens.transitions.base}`,
          }}
        >
          ➤
        </div>
      </div>
      
      <style>{`
        @keyframes bounce {
          0%, 80%, 100% { transform: translateY(0); }
          40% { transform: translateY(-6px); }
        }
      `}</style>
    </div>
  );
};

// ============================================
// NOTIFICATIONS SCREEN
// ============================================

export const NotificationsScreen = ({ onClose }) => {
  const { notifications, markNotificationRead, markAllNotificationsRead, unreadCount } = useApp();

  const getIcon = (type) => {
    switch (type) {
      case 'trade': return '📈';
      case 'distribution': return '💎';
      case 'capital': return '💰';
      case 'alert': return '🔔';
      case 'sal': return '🤖';
      default: return '📌';
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: tokens.colors.background,
      display: 'flex',
      flexDirection: 'column',
      zIndex: 100,
    }}>
      <StatusBar />
      
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '16px 20px',
        borderBottom: `1px solid ${tokens.colors.border}`,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div onClick={onClose} style={{ cursor: 'pointer', fontSize: 20 }}>←</div>
          <h1 style={{ ...goldGradient, fontSize: 24, fontWeight: 700, margin: 0 }}>
            Notifications
          </h1>
        </div>
        {unreadCount > 0 && (
          <span 
            onClick={markAllNotificationsRead}
            style={{ color: tokens.colors.gold, fontSize: 14, cursor: 'pointer' }}
          >
            Mark all read
          </span>
        )}
      </div>

      {/* Notifications List */}
      <div style={{ flex: 1, overflowY: 'auto', padding: 20 }}>
        {notifications.length === 0 ? (
          <EmptyState
            icon="🔔"
            title="No notifications"
            description="You're all caught up!"
          />
        ) : (
          <Card>
            {notifications.map((notification, i) => (
              <div 
                key={notification.id}
                onClick={() => markNotificationRead(notification.id)}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 12,
                  padding: '16px 0',
                  borderBottom: i < notifications.length - 1 ? `1px solid ${tokens.colors.border}` : 'none',
                  cursor: 'pointer',
                  opacity: notification.read ? 0.6 : 1,
                }}
              >
                <span style={{ fontSize: 24 }}>{getIcon(notification.type)}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <p style={{ 
                      color: tokens.colors.textPrimary, 
                      fontWeight: notification.read ? 400 : 600, 
                      margin: 0,
                      fontSize: 14,
                    }}>
                      {notification.title}
                    </p>
                    {!notification.read && (
                      <div style={{
                        width: 8,
                        height: 8,
                        borderRadius: '50%',
                        background: tokens.colors.gold,
                        boxShadow: `0 0 8px ${tokens.colors.gold}`,
                      }} />
                    )}
                  </div>
                  <p style={{ color: tokens.colors.textSecondary, fontSize: 13, margin: '4px 0 0 0' }}>
                    {notification.message}
                  </p>
                  <p style={{ color: tokens.colors.textMuted, fontSize: 11, margin: '6px 0 0 0' }}>
                    {formatTimeAgo(notification.time)}
                  </p>
                </div>
              </div>
            ))}
          </Card>
        )}
      </div>
    </div>
  );
};

// ============================================
// SETTINGS SCREEN
// ============================================

export const SettingsScreen = ({ onClose }) => {
  const { user, logout, updatePreferences } = useAuth();

  const settingsSections = [
    {
      title: 'Account',
      items: [
        { icon: '👤', label: 'Profile', subtitle: user?.email },
        { icon: '🔐', label: 'Security', subtitle: '2FA enabled' },
        { icon: '🏦', label: 'Linked Accounts', subtitle: '2 accounts' },
        { icon: '📋', label: 'Documents', subtitle: 'KYC status: Verified' },
      ],
    },
    {
      title: 'Notifications',
      items: [
        { icon: '📈', label: 'Trade Alerts', toggle: true, key: 'trades' },
        { icon: '💎', label: 'Distributions', toggle: true, key: 'distributions' },
        { icon: '🔔', label: 'Price Alerts', toggle: true, key: 'alerts' },
        { icon: '📰', label: 'News & Updates', toggle: true, key: 'news' },
      ],
    },
    {
      title: 'App',
      items: [
        { icon: '🎨', label: 'Appearance', subtitle: 'Dark mode' },
        { icon: '🌍', label: 'Language', subtitle: 'English' },
        { icon: '❓', label: 'Help & Support' },
        { icon: '📜', label: 'Legal' },
      ],
    },
  ];

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: tokens.colors.background,
      display: 'flex',
      flexDirection: 'column',
      zIndex: 100,
    }}>
      <StatusBar />
      
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: '16px 20px',
        borderBottom: `1px solid ${tokens.colors.border}`,
      }}>
        <div onClick={onClose} style={{ cursor: 'pointer', fontSize: 20 }}>←</div>
        <h1 style={{ ...goldGradient, fontSize: 24, fontWeight: 700, margin: 0 }}>
          Settings
        </h1>
      </div>

      {/* Settings Content */}
      <div style={{ flex: 1, overflowY: 'auto', padding: 20 }}>
        {/* User Card */}
        <Card style={{ marginBottom: 20, display: 'flex', alignItems: 'center', gap: 16 }}>
          <Avatar name={user?.name} size={60} showBadge />
          <div>
            <h3 style={{ color: tokens.colors.textPrimary, margin: '0 0 4px 0' }}>{user?.name}</h3>
            <p style={{ color: tokens.colors.textSecondary, fontSize: 14, margin: 0 }}>{user?.email}</p>
            <Badge variant="gold" size="small" style={{ marginTop: 8 }}>Premium</Badge>
          </div>
        </Card>

        {/* Settings Sections */}
        {settingsSections.map((section, si) => (
          <div key={si} style={{ marginBottom: 24 }}>
            <p style={{ 
              color: tokens.colors.textSecondary, 
              fontSize: 12, 
              fontWeight: 600,
              textTransform: 'uppercase',
              marginBottom: 8,
            }}>
              {section.title}
            </p>
            <Card padding={0}>
              {section.items.map((item, i) => (
                <div
                  key={i}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: 16,
                    borderBottom: i < section.items.length - 1 ? `1px solid ${tokens.colors.border}` : 'none',
                    cursor: item.toggle ? 'default' : 'pointer',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <span style={{ fontSize: 20 }}>{item.icon}</span>
                    <div>
                      <p style={{ color: tokens.colors.textPrimary, margin: 0 }}>{item.label}</p>
                      {item.subtitle && (
                        <p style={{ color: tokens.colors.textSecondary, fontSize: 12, margin: '2px 0 0 0' }}>
                          {item.subtitle}
                        </p>
                      )}
                    </div>
                  </div>
                  {item.toggle ? (
                    <Switch
                      checked={user?.preferences?.notifications?.[item.key] ?? true}
                      onChange={(val) => updatePreferences({
                        notifications: {
                          ...user?.preferences?.notifications,
                          [item.key]: val,
                        },
                      })}
                    />
                  ) : (
                    <span style={{ color: tokens.colors.textMuted }}>›</span>
                  )}
                </div>
              ))}
            </Card>
          </div>
        ))}

        {/* Logout Button */}
        <Button 
          variant="danger" 
          fullWidth 
          onClick={logout}
          style={{ marginTop: 8 }}
        >
          Sign Out
        </Button>

        {/* Version */}
        <p style={{ 
          color: tokens.colors.textMuted, 
          fontSize: 12, 
          textAlign: 'center',
          marginTop: 24,
        }}>
          CookinSaints v1.0.0 • Powered by SaintSal™
        </p>
      </div>
    </div>
  );
};

export default {
  SplashScreen,
  AuthScreen,
  HomeScreen,
  TradeScreen,
  CSRECScreen,
  CapitalScreen,
  SALScreen,
  ChatScreen,
  NotificationsScreen,
  SettingsScreen,
};
