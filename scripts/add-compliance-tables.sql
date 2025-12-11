-- ============================================
-- COOKINSAINTS COMPLIANCE & ACCOUNT OPENING
-- Additional tables for brokerage compliance
-- ============================================

-- ============================================
-- BROKERAGE ACCOUNTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.brokerage_accounts (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  alpaca_account_id TEXT UNIQUE,
  account_number TEXT UNIQUE,
  account_status TEXT DEFAULT 'pending' CHECK (account_status IN ('pending', 'submitted', 'active', 'rejected', 'suspended', 'closed')),
  account_type TEXT DEFAULT 'individual' CHECK (account_type IN ('individual', 'joint', 'trust', 'ira', 'entity')),
  trading_enabled BOOLEAN DEFAULT false,
  pattern_day_trader BOOLEAN DEFAULT false,
  buying_power DECIMAL(18, 2) DEFAULT 0,
  cash DECIMAL(18, 2) DEFAULT 0,
  portfolio_value DECIMAL(18, 2) DEFAULT 0,
  equity DECIMAL(18, 2) DEFAULT 0,
  last_equity DECIMAL(18, 2) DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  approved_at TIMESTAMPTZ,
  UNIQUE(user_id)
);

-- ============================================
-- KYC INFORMATION TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.kyc_information (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  first_name TEXT NOT NULL,
  middle_name TEXT,
  last_name TEXT NOT NULL,
  date_of_birth DATE NOT NULL,
  ssn_encrypted TEXT NOT NULL, -- encrypted SSN
  citizenship TEXT DEFAULT 'USA',
  country_of_birth TEXT,
  address TEXT NOT NULL,
  address_line2 TEXT,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  zip_code TEXT NOT NULL,
  phone TEXT NOT NULL,
  employment_status TEXT CHECK (employment_status IN ('employed', 'unemployed', 'retired', 'student', 'self_employed')),
  employer_name TEXT,
  employer_address TEXT,
  occupation TEXT,
  funding_source TEXT[] DEFAULT ARRAY['employment_income'],
  annual_income_range TEXT CHECK (annual_income_range IN ('under_25k', '25k_50k', '50k_100k', '100k_200k', '200k_300k', '300k_500k', '500k_1m', 'over_1m')),
  net_worth_range TEXT CHECK (net_worth_range IN ('under_50k', '50k_100k', '100k_200k', '200k_500k', '500k_1m', '1m_5m', 'over_5m')),
  liquid_net_worth_range TEXT CHECK (liquid_net_worth_range IN ('under_50k', '50k_100k', '100k_200k', '200k_500k', '500k_1m', '1m_5m', 'over_5m')),
  verification_status TEXT DEFAULT 'pending' CHECK (verification_status IN ('pending', 'in_review', 'verified', 'failed')),
  verification_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id)
);

-- ============================================
-- REGULATORY DISCLOSURES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.regulatory_disclosures (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  is_control_person BOOLEAN DEFAULT false,
  control_person_details TEXT,
  is_affiliated_exchange_or_finra BOOLEAN DEFAULT false,
  affiliated_firm_name TEXT,
  is_politically_exposed BOOLEAN DEFAULT false,
  political_organization TEXT,
  immediate_family_exposed BOOLEAN DEFAULT false,
  family_member_details TEXT,
  has_investment_objectives BOOLEAN DEFAULT true,
  investment_objectives TEXT[] DEFAULT ARRAY['growth', 'income'],
  investment_experience TEXT CHECK (investment_experience IN ('none', 'limited', 'good', 'extensive')),
  risk_tolerance TEXT CHECK (risk_tolerance IN ('conservative', 'moderate', 'aggressive', 'speculative')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id)
);

-- ============================================
-- LEGAL AGREEMENTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.legal_agreements (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  agreement_type TEXT NOT NULL CHECK (agreement_type IN (
    'customer_agreement', 
    'margin_agreement', 
    'account_agreement',
    'advisory_agreement',
    'discretionary_authority',
    'risk_disclosure',
    'privacy_policy',
    'terms_of_service'
  )),
  agreement_version TEXT NOT NULL,
  agreed_at TIMESTAMPTZ DEFAULT NOW(),
  ip_address INET,
  user_agent TEXT,
  signature_data TEXT, -- could be base64 encoded signature image
  document_url TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- IDENTITY DOCUMENTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.identity_documents (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  document_type TEXT NOT NULL CHECK (document_type IN ('drivers_license', 'passport', 'state_id', 'utility_bill', 'bank_statement', 'tax_document')),
  document_purpose TEXT NOT NULL CHECK (document_purpose IN ('identity_verification', 'address_verification', 'accreditation_verification')),
  file_url TEXT NOT NULL,
  file_name TEXT NOT NULL,
  mime_type TEXT NOT NULL,
  file_size INTEGER,
  uploaded_at TIMESTAMPTZ DEFAULT NOW(),
  verification_status TEXT DEFAULT 'pending' CHECK (verification_status IN ('pending', 'approved', 'rejected')),
  verified_at TIMESTAMPTZ,
  verified_by UUID,
  rejection_reason TEXT,
  alpaca_document_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- TRUSTED CONTACTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.trusted_contacts (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  relationship TEXT NOT NULL CHECK (relationship IN ('spouse', 'parent', 'sibling', 'child', 'friend', 'advisor', 'attorney', 'other')),
  street_address TEXT,
  city TEXT,
  state TEXT,
  zip_code TEXT,
  is_primary BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- ACCREDITED INVESTOR VERIFICATION TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.accredited_investor_verification (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  verification_method TEXT NOT NULL CHECK (verification_method IN ('income', 'net_worth', 'professional_certification', 'third_party_verification')),
  income_verification_year INTEGER,
  annual_income DECIMAL(18, 2),
  joint_income BOOLEAN DEFAULT false,
  net_worth DECIMAL(18, 2),
  net_worth_date DATE,
  professional_certifications TEXT[], -- series 7, 65, 82, CFA, etc.
  verification_documents UUID[],
  verification_status TEXT DEFAULT 'pending' CHECK (verification_status IN ('pending', 'verified', 'rejected', 'expired')),
  verified_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,
  verified_by TEXT, -- third party verifier or internal
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id)
);

-- ============================================
-- ADVISORY RELATIONSHIPS TABLE
-- For SaintSal and third-party money managers
-- ============================================
CREATE TABLE IF NOT EXISTS public.advisory_relationships (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  account_id UUID REFERENCES public.brokerage_accounts(id) ON DELETE CASCADE,
  advisor_type TEXT NOT NULL CHECK (advisor_type IN ('saintsal_ai', 'third_party_manager', 'fund_manager')),
  advisor_name TEXT NOT NULL, -- 'SaintSal AI' or actual manager name
  advisor_entity_id UUID, -- references external manager if applicable
  discretionary BOOLEAN DEFAULT false, -- can advisor trade without approval?
  limited_power BOOLEAN DEFAULT false, -- limited trading authority
  trade_approval_required BOOLEAN DEFAULT true,
  max_trade_size DECIMAL(18, 2),
  max_position_size DECIMAL(5, 2), -- percentage
  allowed_asset_types TEXT[] DEFAULT ARRAY['stock', 'etf'],
  management_fee_percent DECIMAL(5, 4), -- annual % fee
  performance_fee_percent DECIMAL(5, 4), -- % of gains
  agreement_signed_at TIMESTAMPTZ NOT NULL,
  agreement_version TEXT NOT NULL,
  agreement_document_url TEXT,
  relationship_status TEXT DEFAULT 'active' CHECK (relationship_status IN ('pending', 'active', 'suspended', 'terminated')),
  started_at TIMESTAMPTZ DEFAULT NOW(),
  terminated_at TIMESTAMPTZ,
  termination_reason TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- ADVISORY ACTIONS LOG
-- Track all actions taken by advisors
-- ============================================
CREATE TABLE IF NOT EXISTS public.advisory_actions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  relationship_id UUID REFERENCES public.advisory_relationships(id) ON DELETE CASCADE,
  action_type TEXT NOT NULL CHECK (action_type IN ('trade_executed', 'trade_recommended', 'rebalance', 'risk_adjustment', 'alert_sent', 'report_generated')),
  action_details JSONB NOT NULL,
  trade_id UUID, -- reference to actual trade if applicable
  requires_approval BOOLEAN DEFAULT false,
  approval_status TEXT CHECK (approval_status IN ('pending', 'approved', 'rejected', 'auto_approved')),
  approved_by UUID,
  approved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- BANK ACCOUNTS & ACH RELATIONSHIPS
-- ============================================
CREATE TABLE IF NOT EXISTS public.linked_bank_accounts (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  brokerage_account_id UUID REFERENCES public.brokerage_accounts(id) ON DELETE CASCADE,
  alpaca_relationship_id TEXT UNIQUE,
  account_owner_name TEXT NOT NULL,
  bank_name TEXT,
  account_type TEXT NOT NULL CHECK (account_type IN ('checking', 'savings')),
  routing_number_encrypted TEXT NOT NULL,
  account_number_last4 TEXT NOT NULL,
  verification_status TEXT DEFAULT 'pending' CHECK (verification_status IN ('pending', 'microdeposit_sent', 'verified', 'failed')),
  verified_at TIMESTAMPTZ,
  is_primary BOOLEAN DEFAULT false,
  nickname TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- FUND TRANSFERS
-- ============================================
CREATE TABLE IF NOT EXISTS public.fund_transfers (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  brokerage_account_id UUID REFERENCES public.brokerage_accounts(id) ON DELETE CASCADE,
  bank_account_id UUID REFERENCES public.linked_bank_accounts(id) ON DELETE SET NULL,
  alpaca_transfer_id TEXT UNIQUE,
  transfer_type TEXT NOT NULL CHECK (transfer_type IN ('deposit', 'withdrawal')),
  amount DECIMAL(18, 2) NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('queued', 'pending', 'sent_to_clearing', 'approved', 'canceled', 'returned')),
  direction TEXT NOT NULL CHECK (direction IN ('incoming', 'outgoing')),
  initiated_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  settled_at TIMESTAMPTZ,
  expected_settlement_date DATE,
  failure_reason TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- ROW LEVEL SECURITY POLICIES
-- ============================================

ALTER TABLE public.brokerage_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.kyc_information ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.regulatory_disclosures ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.legal_agreements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.identity_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trusted_contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.accredited_investor_verification ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.advisory_relationships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.advisory_actions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.linked_bank_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fund_transfers ENABLE ROW LEVEL SECURITY;

-- Users can only access their own data
CREATE POLICY "Users can view own brokerage account" ON public.brokerage_accounts FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can view own KYC info" ON public.kyc_information FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can view own disclosures" ON public.regulatory_disclosures FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can view own agreements" ON public.legal_agreements FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can view own documents" ON public.identity_documents FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can view own trusted contacts" ON public.trusted_contacts FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can view own accreditation" ON public.accredited_investor_verification FOR SELECT USING (auth.uid() = user_id);

-- Users can insert their own data
CREATE POLICY "Users can create own KYC info" ON public.kyc_information FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can create own disclosures" ON public.regulatory_disclosures FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can create agreements" ON public.legal_agreements FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can upload documents" ON public.identity_documents FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can add trusted contacts" ON public.trusted_contacts FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create indexes for performance
CREATE INDEX idx_brokerage_accounts_user_id ON public.brokerage_accounts(user_id);
CREATE INDEX idx_brokerage_accounts_status ON public.brokerage_accounts(account_status);
CREATE INDEX idx_kyc_information_user_id ON public.kyc_information(user_id);
CREATE INDEX idx_legal_agreements_user_id ON public.legal_agreements(user_id);
CREATE INDEX idx_advisory_relationships_account_id ON public.advisory_relationships(account_id);
CREATE INDEX idx_fund_transfers_account_id ON public.fund_transfers(brokerage_account_id);
CREATE INDEX idx_fund_transfers_status ON public.fund_transfers(status);
