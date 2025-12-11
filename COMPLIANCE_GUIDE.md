# CookinSaints Compliance & Real Trading Guide

## Overview
CookinSaints is now a **fully regulated investment platform** that enables real stock, ETF, bond, and cryptocurrency trading with AI-powered advisory services through SaintSal™.

## Platform: Alpaca Broker API

We use **Alpaca Markets Broker API** which provides:
- Full brokerage account opening
- SIPC insurance up to $500,000
- Commission-free trading
- SEC/FINRA regulated
- Support for discretionary advisory accounts
- Third-party money manager integration

## Setup Instructions

### 1. Get Alpaca Broker API Credentials

1. Sign up at: https://alpaca.markets/broker
2. Apply for Broker API access (requires business entity)
3. Get your credentials:
   - `VITE_ALPACA_BROKER_URL` - API endpoint
   - `VITE_ALPACA_BROKER_KEY` - Your broker API key
   - `VITE_ALPACA_BROKER_SECRET` - Your broker secret key

### 2. Business Requirements

To use Alpaca Broker API, you need:
- **Registered Investment Advisor (RIA)** status with SEC
- **Broker-Dealer** registration (or use Alpaca's)
- Business entity (LLC, Corp)
- Compliance officer
- Anti-Money Laundering (AML) program
- Know Your Customer (KYC) procedures

### 3. Database Setup

Run the compliance database migration:
\`\`\`bash
# In Supabase SQL Editor
supabase db push scripts/add-compliance-tables.sql
\`\`\`

### 4. Legal Documents Required

Create these legal documents (consult with securities attorney):

1. **Customer Agreement** - Standard brokerage terms
2. **Investment Advisory Agreement** - Advisor-client relationship
3. **Discretionary Authority Agreement** - For SaintSal™ to trade automatically
4. **Risk Disclosure Statement** - Investment risks
5. **Privacy Policy** - GDPR/CCPA compliant
6. **Form ADV** - Required RIA disclosure document

Store these in `/public/legal/` directory.

## Account Opening Flow

### Step 1: KYC Collection
- Full name, DOB, SSN
- Residential address
- Phone, email
- Citizenship

### Step 2: Financial Information
- Employment status
- Annual income range
- Net worth estimation
- Liquid net worth
- Funding sources

### Step 3: Regulatory Disclosures
- Control person status
- FINRA affiliation
- Politically exposed person (PEP)
- Investment experience
- Risk tolerance

### Step 4: Identity Verification
Users must upload:
- Government-issued photo ID (driver's license or passport)
- Proof of address (utility bill or bank statement)

### Step 5: Legal Agreements
User must accept:
- Customer Agreement
- Investment Advisory Agreement
- Discretionary Authority (for SaintSal™)
- Risk Disclosures
- Privacy Policy

### Step 6: Account Approval
- Alpaca runs identity verification
- AML screening
- OFAC sanctions check
- Typically takes 1-2 business days
- Status: SUBMITTED → IN_REVIEW → ACTIVE or REJECTED

## Advisory Relationships

### SaintSal™ AI Advisor

When users agree to the Investment Advisory Agreement:

1. **Discretionary Authority**: SaintSal™ can execute trades without per-trade approval
2. **Limited Power**: Restricted to specific asset types and position sizes
3. **Approval Workflow**: Optional - require user approval for large trades
4. **Management Fee**: Set in `advisory_relationships` table

### Third-Party Money Managers

Platform supports external fund managers:

\`\`\`javascript
// Create advisory relationship for external manager
await supabase.from('advisory_relationships').insert({
  account_id: brokerageAccountId,
  advisor_type: 'third_party_manager',
  advisor_name: 'Acme Capital Management',
  discretionary: true,
  max_trade_size: 50000.00,
  max_position_size: 20.0, // max 20% of portfolio
  allowed_asset_types: ['stock', 'etf'],
  management_fee_percent: 1.00, // 1% annual
  performance_fee_percent: 20.00, // 20% of gains
  agreement_signed_at: new Date().toISOString(),
  relationship_status: 'active'
});
\`\`\`

## Trading Compliance

### Trade Execution by SaintSal™

\`\`\`javascript
import { advisorAPI } from './lib/broker-api';

// SaintSal executes trade on behalf of user
const trade = await advisorAPI.executeAdvisoryTrade(accountId, {
  symbol: 'AAPL',
  quantity: 10,
  side: 'buy',
  type: 'market'
});

// Log the action
await supabase.from('advisory_actions').insert({
  relationship_id: advisoryRelationshipId,
  action_type: 'trade_executed',
  action_details: {
    symbol: 'AAPL',
    quantity: 10,
    side: 'buy',
    reasoning: 'High SAL score, strong fundamentals'
  },
  approval_status: 'auto_approved'
});
\`\`\`

### Regulatory Reporting

Required reports:
1. **Trade confirmations** - Send to users within 24 hours
2. **Monthly statements** - Portfolio summary
3. **Quarterly performance reports**
4. **Annual tax documents** (1099-B, 1099-DIV)
5. **Form ADV updates** - Annual RIA disclosures

## Accredited Investor Verification

For access to private funds (like CSREC):

\`\`\`javascript
// Verify accredited investor status
await supabase.from('accredited_investor_verification').insert({
  user_id: userId,
  verification_method: 'income', // or 'net_worth', 'professional_certification'
  annual_income: 250000.00,
  verification_status: 'verified',
  verified_at: new Date().toISOString(),
  verified_by: 'third_party_verifier_name'
});
\`\`\`

Accredited investor criteria:
- Income: $200k/year (individual) or $300k/year (joint) for 2 years
- Net worth: $1M+ (excluding primary residence)
- Professional certifications: Series 7, 65, 82, CFA, CPA, etc.

## Fund Management Features

### CSREC Fund (Private Real Estate)
- Requires accredited investor status
- Subscription agreement
- Minimum investment
- Quarterly distributions
- Annual K-1 tax forms

### Third-Party Funds
- Manager creates fund profile
- Sets minimum investment
- Defines fee structure
- Performance tracking
- Investor reporting

## Security & Compliance

### Data Protection
- Encrypt all PII (SSN, account numbers)
- Use Supabase Row Level Security
- HTTPS only
- Two-factor authentication
- Session management

### AML/KYC Requirements
- Identity verification via Alpaca
- OFAC sanctions screening
- Suspicious activity monitoring
- Currency Transaction Reports (CTR) for $10k+
- Suspicious Activity Reports (SAR) when needed

### Record Keeping
Maintain records for 6 years (SEC requirement):
- All account applications
- Trade confirmations
- Customer communications
- Advisory agreements
- Compliance policies

## Testing

Use **Alpaca Paper Trading** for development:
- Sandbox environment
- Virtual money
- Real market data
- Test full flows before production

## Go-Live Checklist

- [ ] RIA registration completed
- [ ] Compliance officer hired
- [ ] AML program documented
- [ ] Legal agreements reviewed by attorney
- [ ] Privacy policy GDPR/CCPA compliant
- [ ] Alpaca Broker API approved
- [ ] Business entity formed
- [ ] E&O insurance obtained
- [ ] SIPC insurance confirmed
- [ ] Cybersecurity measures implemented
- [ ] Disaster recovery plan
- [ ] Customer support system
- [ ] Complaint handling process

## Support

For questions about:
- **Alpaca API**: support@alpaca.markets
- **RIA Registration**: SEC.gov or FINRA.org
- **Legal Compliance**: Consult securities attorney

---

**IMPORTANT DISCLAIMER**: This is a development guide only. Deploying a real investment platform requires proper licensing, legal counsel, compliance officers, and regulatory approval. Do not accept real customer funds without proper authorization.
