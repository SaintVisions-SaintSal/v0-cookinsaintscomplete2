// ============================================
// COOKINSAINTS™ - SUPABASE CONFIGURATION
// Database, Auth, and Realtime Setup
// ============================================

import { createClient } from '@supabase/supabase-js';

// ============================================
// SUPABASE CLIENT CONFIGURATION
// ============================================

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'YOUR_SUPABASE_URL';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'YOUR_SUPABASE_ANON_KEY';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    storage: typeof window !== 'undefined' ? window.localStorage : undefined,
  },
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
});

// ============================================
// AUTH HELPERS
// ============================================

export const auth = {
  // Sign up with email and password
  signUp: async (email, password, metadata = {}) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: metadata,
      },
    });
    if (error) throw error;
    return data;
  },

  // Sign in with email and password
  signIn: async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    return data;
  },

  // Sign in with OAuth (Apple, Google)
  signInWithOAuth: async (provider) => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    if (error) throw error;
    return data;
  },

  // Sign out
  signOut: async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  // Get current session
  getSession: async () => {
    const { data, error } = await supabase.auth.getSession();
    if (error) throw error;
    return data.session;
  },

  // Get current user
  getUser: async () => {
    const { data, error } = await supabase.auth.getUser();
    if (error) throw error;
    return data.user;
  },

  // Reset password
  resetPassword: async (email) => {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    });
    if (error) throw error;
    return data;
  },

  // Update user
  updateUser: async (updates) => {
    const { data, error } = await supabase.auth.updateUser(updates);
    if (error) throw error;
    return data;
  },

  // Listen for auth changes
  onAuthStateChange: (callback) => {
    return supabase.auth.onAuthStateChange(callback);
  },
};

// ============================================
// DATABASE HELPERS
// ============================================

export const db = {
  // Generic query helper
  query: async (table, options = {}) => {
    let query = supabase.from(table).select(options.select || '*');
    
    if (options.eq) {
      Object.entries(options.eq).forEach(([key, value]) => {
        query = query.eq(key, value);
      });
    }
    
    if (options.order) {
      query = query.order(options.order.column, { ascending: options.order.ascending ?? false });
    }
    
    if (options.limit) {
      query = query.limit(options.limit);
    }
    
    if (options.range) {
      query = query.range(options.range.from, options.range.to);
    }
    
    const { data, error } = await query;
    if (error) throw error;
    return data;
  },

  // Insert helper
  insert: async (table, data) => {
    const { data: result, error } = await supabase
      .from(table)
      .insert(data)
      .select();
    if (error) throw error;
    return result;
  },

  // Update helper
  update: async (table, id, data) => {
    const { data: result, error } = await supabase
      .from(table)
      .update(data)
      .eq('id', id)
      .select();
    if (error) throw error;
    return result;
  },

  // Delete helper
  delete: async (table, id) => {
    const { error } = await supabase
      .from(table)
      .delete()
      .eq('id', id);
    if (error) throw error;
  },

  // Upsert helper
  upsert: async (table, data) => {
    const { data: result, error } = await supabase
      .from(table)
      .upsert(data)
      .select();
    if (error) throw error;
    return result;
  },
};

// ============================================
// REALTIME SUBSCRIPTIONS
// ============================================

export const realtime = {
  // Subscribe to table changes
  subscribe: (table, callback, filter = null) => {
    let channel = supabase
      .channel(`${table}_changes`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: table,
          filter: filter,
        },
        callback
      );
    
    channel.subscribe();
    return channel;
  },

  // Unsubscribe from channel
  unsubscribe: async (channel) => {
    await supabase.removeChannel(channel);
  },

  // Broadcast to channel
  broadcast: async (channelName, event, payload) => {
    const channel = supabase.channel(channelName);
    await channel.send({
      type: 'broadcast',
      event,
      payload,
    });
  },
};

// ============================================
// STORAGE HELPERS
// ============================================

export const storage = {
  // Upload file
  upload: async (bucket, path, file) => {
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(path, file, {
        cacheControl: '3600',
        upsert: false,
      });
    if (error) throw error;
    return data;
  },

  // Download file
  download: async (bucket, path) => {
    const { data, error } = await supabase.storage
      .from(bucket)
      .download(path);
    if (error) throw error;
    return data;
  },

  // Get public URL
  getPublicUrl: (bucket, path) => {
    const { data } = supabase.storage
      .from(bucket)
      .getPublicUrl(path);
    return data.publicUrl;
  },

  // Delete file
  delete: async (bucket, paths) => {
    const { error } = await supabase.storage
      .from(bucket)
      .remove(paths);
    if (error) throw error;
  },

  // List files
  list: async (bucket, path = '') => {
    const { data, error } = await supabase.storage
      .from(bucket)
      .list(path);
    if (error) throw error;
    return data;
  },
};

// ============================================
// RPC HELPERS (Stored Procedures)
// ============================================

export const rpc = {
  call: async (functionName, params = {}) => {
    const { data, error } = await supabase.rpc(functionName, params);
    if (error) throw error;
    return data;
  },
};

// ============================================
// DATABASE SCHEMA (SQL for reference)
// Run these in Supabase SQL Editor
// ============================================

export const SQL_SCHEMA = `
-- ============================================
-- COOKINSAINTS DATABASE SCHEMA
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- USERS TABLE (extends Supabase auth.users)
-- ============================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  phone TEXT,
  avatar_url TEXT,
  accredited BOOLEAN DEFAULT false,
  kyc_status TEXT DEFAULT 'pending' CHECK (kyc_status IN ('pending', 'submitted', 'verified', 'rejected')),
  risk_tolerance INTEGER DEFAULT 50 CHECK (risk_tolerance >= 0 AND risk_tolerance <= 100),
  growth_focus INTEGER DEFAULT 50 CHECK (growth_focus >= 0 AND growth_focus <= 100),
  re_allocation INTEGER DEFAULT 50 CHECK (re_allocation >= 0 AND re_allocation <= 100),
  crypto_comfort INTEGER DEFAULT 50 CHECK (crypto_comfort >= 0 AND crypto_comfort <= 100),
  autonomy_level TEXT DEFAULT 'balanced' CHECK (autonomy_level IN ('conservative', 'balanced', 'aggressive', 'full')),
  notifications_trades BOOLEAN DEFAULT true,
  notifications_distributions BOOLEAN DEFAULT true,
  notifications_alerts BOOLEAN DEFAULT true,
  notifications_news BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- PORTFOLIO TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.portfolios (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  total_value DECIMAL(18, 2) DEFAULT 0,
  csrec_value DECIMAL(18, 2) DEFAULT 0,
  trading_value DECIMAL(18, 2) DEFAULT 0,
  capital_value DECIMAL(18, 2) DEFAULT 0,
  salran_value DECIMAL(18, 2) DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id)
);

-- ============================================
-- CSREC HOLDINGS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.csrec_holdings (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  units DECIMAL(18, 8) DEFAULT 0,
  avg_cost DECIMAL(18, 4) DEFAULT 0,
  total_invested DECIMAL(18, 2) DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id)
);

-- ============================================
-- CSREC TRANSACTIONS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.csrec_transactions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('buy', 'sell', 'distribution')),
  units DECIMAL(18, 8) NOT NULL,
  price DECIMAL(18, 4) NOT NULL,
  total DECIMAL(18, 2) NOT NULL,
  status TEXT DEFAULT 'completed' CHECK (status IN ('pending', 'completed', 'failed', 'cancelled')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- TRADING POSITIONS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.trading_positions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  symbol TEXT NOT NULL,
  name TEXT,
  asset_type TEXT DEFAULT 'stock' CHECK (asset_type IN ('stock', 'crypto', 'etf', 'option')),
  shares DECIMAL(18, 8) NOT NULL,
  avg_cost DECIMAL(18, 4) NOT NULL,
  current_price DECIMAL(18, 4),
  sal_score INTEGER CHECK (sal_score >= 0 AND sal_score <= 100),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, symbol)
);

-- ============================================
-- TRADING TRANSACTIONS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.trading_transactions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  position_id UUID REFERENCES public.trading_positions(id) ON DELETE SET NULL,
  symbol TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('buy', 'sell')),
  shares DECIMAL(18, 8) NOT NULL,
  price DECIMAL(18, 4) NOT NULL,
  total DECIMAL(18, 2) NOT NULL,
  executor TEXT DEFAULT 'user' CHECK (executor IN ('user', 'sal')),
  reason TEXT,
  status TEXT DEFAULT 'completed' CHECK (status IN ('pending', 'completed', 'failed', 'cancelled')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- CAPITAL INVESTMENTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.capital_investments (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('fund', 'note')),
  name TEXT NOT NULL,
  property_type TEXT,
  location TEXT,
  amount DECIMAL(18, 2) NOT NULL,
  current_value DECIMAL(18, 2),
  rate DECIMAL(5, 2) NOT NULL,
  ltv DECIMAL(5, 2),
  term INTEGER, -- months
  maturity_date DATE,
  status TEXT DEFAULT 'performing' CHECK (status IN ('performing', 'late', 'default', 'paid_off')),
  sal_score INTEGER CHECK (sal_score >= 0 AND sal_score <= 100),
  earned DECIMAL(18, 2) DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- CAPITAL PAYMENTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.capital_payments (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  investment_id UUID REFERENCES public.capital_investments(id) ON DELETE CASCADE,
  amount DECIMAL(18, 2) NOT NULL,
  type TEXT DEFAULT 'interest' CHECK (type IN ('interest', 'principal', 'distribution')),
  status TEXT DEFAULT 'paid' CHECK (status IN ('pending', 'paid', 'failed')),
  payment_date DATE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- SAL-RAN PORTFOLIO TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.salran_portfolios (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  initial_investment DECIMAL(18, 2) DEFAULT 0,
  current_value DECIMAL(18, 2) DEFAULT 0,
  autonomy_level TEXT DEFAULT 'balanced',
  max_single_position INTEGER DEFAULT 30,
  max_crypto INTEGER DEFAULT 25,
  max_real_estate INTEGER DEFAULT 20,
  rebalance_threshold INTEGER DEFAULT 5,
  stop_loss INTEGER DEFAULT 15,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id)
);

-- ============================================
-- SAL-RAN HOLDINGS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.salran_holdings (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  portfolio_id UUID REFERENCES public.salran_portfolios(id) ON DELETE CASCADE,
  symbol TEXT NOT NULL,
  name TEXT,
  shares DECIMAL(18, 8) NOT NULL,
  percent_allocation DECIMAL(5, 2),
  sal_score INTEGER CHECK (sal_score >= 0 AND sal_score <= 100),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(portfolio_id, symbol)
);

-- ============================================
-- SAL-RAN TRADES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.salran_trades (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  portfolio_id UUID REFERENCES public.salran_portfolios(id) ON DELETE CASCADE,
  symbol TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('buy', 'sell', 'rebalance')),
  shares DECIMAL(18, 8) NOT NULL,
  price DECIMAL(18, 4) NOT NULL,
  total DECIMAL(18, 2) NOT NULL,
  reason TEXT,
  approval_status TEXT DEFAULT 'auto' CHECK (approval_status IN ('pending', 'approved', 'rejected', 'auto')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- PROPERTIES TABLE (CSREC Fund Properties)
-- ============================================
CREATE TABLE IF NOT EXISTS public.properties (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  address TEXT,
  city TEXT,
  state TEXT,
  zip TEXT,
  property_type TEXT NOT NULL,
  subtype TEXT,
  units INTEGER,
  sqft INTEGER,
  nav DECIMAL(18, 2),
  purchase_price DECIMAL(18, 2),
  purchase_date DATE,
  cap_rate DECIMAL(5, 2),
  noi DECIMAL(18, 2),
  occupancy DECIMAL(5, 2),
  avg_rent DECIMAL(10, 2),
  sal_score INTEGER CHECK (sal_score >= 0 AND sal_score <= 100),
  year_built INTEGER,
  renovated INTEGER,
  features TEXT[],
  status TEXT DEFAULT 'stabilized' CHECK (status IN ('acquisition', 'value-add', 'stabilized', 'disposition')),
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- NOTIFICATIONS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('trade', 'distribution', 'capital', 'alert', 'sal', 'system')),
  title TEXT NOT NULL,
  message TEXT,
  action_url TEXT,
  read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- CHAT MESSAGES TABLE (SAL Conversations)
-- ============================================
CREATE TABLE IF NOT EXISTS public.chat_messages (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('user', 'sal')),
  content TEXT NOT NULL,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- ROW LEVEL SECURITY POLICIES
-- ============================================

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portfolios ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.csrec_holdings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.csrec_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trading_positions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trading_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.capital_investments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.capital_payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.salran_portfolios ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.salran_holdings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.salran_trades ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

-- Profiles: users can read/update their own profile
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Portfolios: users can read/update their own portfolio
CREATE POLICY "Users can view own portfolio" ON public.portfolios FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own portfolio" ON public.portfolios FOR UPDATE USING (auth.uid() = user_id);

-- CSREC Holdings: users can manage their own holdings
CREATE POLICY "Users can view own csrec holdings" ON public.csrec_holdings FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own csrec holdings" ON public.csrec_holdings FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own csrec holdings" ON public.csrec_holdings FOR UPDATE USING (auth.uid() = user_id);

-- Trading Positions: users can manage their own positions
CREATE POLICY "Users can view own trading positions" ON public.trading_positions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own trading positions" ON public.trading_positions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own trading positions" ON public.trading_positions FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own trading positions" ON public.trading_positions FOR DELETE USING (auth.uid() = user_id);

-- Notifications: users can manage their own notifications
CREATE POLICY "Users can view own notifications" ON public.notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own notifications" ON public.notifications FOR UPDATE USING (auth.uid() = user_id);

-- Chat Messages: users can manage their own messages
CREATE POLICY "Users can view own chat messages" ON public.chat_messages FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own chat messages" ON public.chat_messages FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Properties: anyone can view (public fund data)
CREATE POLICY "Anyone can view properties" ON public.properties FOR SELECT USING (true);

-- ============================================
-- TRIGGERS
-- ============================================

-- Update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply trigger to all relevant tables
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_portfolios_updated_at BEFORE UPDATE ON public.portfolios FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_csrec_holdings_updated_at BEFORE UPDATE ON public.csrec_holdings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_trading_positions_updated_at BEFORE UPDATE ON public.trading_positions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_capital_investments_updated_at BEFORE UPDATE ON public.capital_investments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_salran_portfolios_updated_at BEFORE UPDATE ON public.salran_portfolios FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_salran_holdings_updated_at BEFORE UPDATE ON public.salran_holdings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_properties_updated_at BEFORE UPDATE ON public.properties FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create profile on user signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'name');
  
  INSERT INTO public.portfolios (user_id)
  VALUES (NEW.id);
  
  INSERT INTO public.csrec_holdings (user_id)
  VALUES (NEW.id);
  
  INSERT INTO public.salran_portfolios (user_id)
  VALUES (NEW.id);
  
  RETURN NEW;
END;
$$ language 'plpgsql' security definer;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();
`;

export default {
  supabase,
  auth,
  db,
  realtime,
  storage,
  rpc,
  SQL_SCHEMA,
};
