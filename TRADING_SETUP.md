# Real Trading Setup Guide

## Quick Start (5 minutes)

### 1. Get Alpaca API Keys

1. Go to [Alpaca Markets](https://alpaca.markets) and sign up (free)
2. Generate **Paper Trading** API keys (no real money required)
3. Copy your API Key and Secret Key

### 2. Add Environment Variables

Create a `.env` file in your project root:

\`\`\`env
VITE_ALPACA_API_KEY=PK...
VITE_ALPACA_API_SECRET=...
VITE_ALPACA_ENV=paper
\`\`\`

### 3. Test Your Setup

The app will automatically detect when Alpaca is configured and enable real trading.

---

## What You Can Trade

### Stocks & ETFs
- **All US stocks** - Apple (AAPL), Tesla (TSLA), NVIDIA (NVDA), etc.
- **ETFs** - SPY, QQQ, VOO, VTI, etc.
- **Commission-free** - No trading fees

### Cryptocurrency
- **Bitcoin (BTC/USD)**
- **Ethereum (ETH/USD)**
- **And more** - Check Alpaca's crypto offerings

### Bonds & Fixed Income
- **Bond ETFs** - AGG, BND, TLT, etc.
- Coming soon: Individual bonds via integration

---

## Trading Features

### Order Types
- ✅ **Market Orders** - Instant execution at current price
- ✅ **Limit Orders** - Set your price, wait for fill
- ✅ **Stop Loss** - Automatic sell to limit losses
- ✅ **Bracket Orders** - Take profit + stop loss together

### Risk Management
- Real-time position tracking
- Portfolio value updates
- Buying power monitoring
- Day trade protection

### Market Hours
- Pre-market: 4:00 AM - 9:30 AM ET
- Regular: 9:30 AM - 4:00 PM ET
- After-hours: 4:00 PM - 8:00 PM ET

---

## Safety First

### Paper Trading (Recommended)
- **No real money** - Practice with $100K virtual cash
- **Real market data** - Live prices and execution
- **Perfect for testing** - Try strategies risk-free

### Going Live
1. Verify your identity with Alpaca
2. Fund your account
3. Change `VITE_ALPACA_ENV=live`
4. Start with small positions

---

## Integration with CookinSaints

### Automatic Sync
- Positions sync every 30 seconds
- Real-time price updates
- Transaction history stored in Supabase

### SaintSal AI Integration
- AI analyzes trades before execution
- SAL Score for every stock
- Smart recommendations based on your HACP profile

### Portfolio Management
- Combined view: CSREC + Stocks + Crypto + Capital
- Unified performance tracking
- Tax-loss harvesting suggestions

---

## API Limits (Free Tier)

### Alpaca Paper Trading
- ✅ Unlimited trades
- ✅ Real-time data
- ✅ Full order types
- ✅ No time limit

### Alpaca Live Trading
- ✅ Commission-free stocks/ETFs
- ✅ Unlimited trades
- ⚠️ Pattern day trader rules apply

---

## Troubleshooting

### "Trading not configured"
→ Check your `.env` file has correct API keys

### "Market is closed"
→ Use limit orders outside market hours

### "Insufficient buying power"
→ Check your account balance

### Orders not filling
→ Check if market is open
→ Try market order instead of limit

---

## Support

- **Alpaca Support**: https://alpaca.markets/support
- **CookinSaints Discord**: Join for trading tips
- **SaintSal AI**: Contact for advanced features

---

## Next Steps

1. **Fund Your Account** - Add real money when ready
2. **Enable SAL-Ran** - Let AI manage a portion
3. **Set Up Alerts** - Get notified on price targets
4. **Invite Friends** - Build wealth together

**Remember**: Start small, learn the platform, then scale up! 🚀
