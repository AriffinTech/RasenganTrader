-- ==============================================================================
-- RasenganTrader Comprehensive Database Schema Migration (PostgreSQL / Supabase)
-- Hardened Security, RLS, Webhook Idempotency & Cloud Storage Configuration
-- ==============================================================================

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Enumerated Status & Types
DO $$ BEGIN
    CREATE TYPE class_status AS ENUM ('upcoming', 'open', 'completed_registering', 'closed', 'archived');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE discount_type AS ENUM ('fixed', 'percentage');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 3. Admin Users Table (Strict Authorization Guard)
CREATE TABLE IF NOT EXISTS public.admin_users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    role TEXT NOT NULL DEFAULT 'admin',
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Seed Initial Administrator
INSERT INTO public.admin_users (email, role)
VALUES ('admin@rasengantrader.com', 'admin')
ON CONFLICT (email) DO NOTHING;

-- 4. Courses Table (Master Catalog)
CREATE TABLE IF NOT EXISTS public.courses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    category TEXT NOT NULL DEFAULT 'advanced',
    educator TEXT NOT NULL DEFAULT 'Dr Hanis Hanafi',
    description TEXT NOT NULL,
    default_price_cents INTEGER NOT NULL DEFAULT 49900,
    default_telegram_link TEXT,
    modules JSONB NOT NULL DEFAULT '[]'::jsonb,
    bonuses JSONB NOT NULL DEFAULT '[]'::jsonb,
    exclusive_bonus JSONB,
    poster_url TEXT,
    is_active BOOLEAN NOT NULL DEFAULT true,
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 5. Class Sessions Table (Intakes & Schedules)
CREATE TABLE IF NOT EXISTS public.class_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
    session_title TEXT NOT NULL,
    display_date TEXT NOT NULL,
    display_time TEXT,
    start_date TIMESTAMPTZ,
    end_date TIMESTAMPTZ,
    price_cents INTEGER NOT NULL DEFAULT 49900,
    status class_status NOT NULL DEFAULT 'upcoming',
    telegram_link_override TEXT,
    poster_url_override TEXT,
    registration_url_override TEXT,
    custom_inclusions JSONB,
    is_featured BOOLEAN NOT NULL DEFAULT false,
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 6. Discount Codes Table (Coupons)
CREATE TABLE IF NOT EXISTS public.discount_codes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code TEXT UNIQUE NOT NULL,
    discount_type discount_type NOT NULL DEFAULT 'fixed',
    discount_value INTEGER NOT NULL,
    course_id UUID REFERENCES public.courses(id) ON DELETE SET NULL,
    class_session_id UUID REFERENCES public.class_sessions(id) ON DELETE SET NULL,
    valid_from TIMESTAMPTZ,
    valid_until TIMESTAMPTZ,
    max_uses INTEGER,
    times_used INTEGER NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 7. Payment Transactions Table (Webhook Idempotency & Payment Audit)
CREATE TABLE IF NOT EXISTS public.payment_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    bill_id TEXT UNIQUE NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending',
    amount_cents INTEGER NOT NULL,
    customer_name TEXT,
    customer_email TEXT,
    customer_phone TEXT,
    reference_1 TEXT,
    reference_2 TEXT,
    metadata JSONB,
    processed_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 8. Site Settings Table (Global Configuration)
CREATE TABLE IF NOT EXISTS public.site_settings (
    key TEXT PRIMARY KEY,
    value JSONB NOT NULL,
    description TEXT,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 9. Performance Indexes
CREATE INDEX IF NOT EXISTS idx_class_sessions_status ON public.class_sessions(status);
CREATE INDEX IF NOT EXISTS idx_class_sessions_course ON public.class_sessions(course_id);
CREATE INDEX IF NOT EXISTS idx_discount_codes_code ON public.discount_codes(code);
CREATE INDEX IF NOT EXISTS idx_discount_codes_active ON public.discount_codes(is_active);
CREATE INDEX IF NOT EXISTS idx_payment_transactions_bill_id ON public.payment_transactions(bill_id);

-- 10. Enable Row Level Security (RLS)
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.class_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.discount_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- Helper function to check if the current user is an authorized admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.admin_users
        WHERE user_id = auth.uid() OR email = (auth.jwt() ->> 'email')
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 11. Strict RLS Policies

-- Public Read Policies
CREATE POLICY "Allow public read active courses" ON public.courses
    FOR SELECT TO anon, authenticated USING (is_active = true OR public.is_admin());

CREATE POLICY "Allow public read visible class sessions" ON public.class_sessions
    FOR SELECT TO anon, authenticated USING (status <> 'archived' OR public.is_admin());

CREATE POLICY "Allow public read active discounts for validation" ON public.discount_codes
    FOR SELECT TO anon, authenticated USING (is_active = true OR public.is_admin());

CREATE POLICY "Allow public read settings" ON public.site_settings
    FOR SELECT TO anon, authenticated USING (true);

-- Admin Mutation Policies (Strictly requires is_admin() = true)
CREATE POLICY "Admin full access admin_users" ON public.admin_users
    FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE POLICY "Admin full access courses" ON public.courses
    FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE POLICY "Admin full access class sessions" ON public.class_sessions
    FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE POLICY "Admin full access discount codes" ON public.discount_codes
    FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE POLICY "Admin full access payment transactions" ON public.payment_transactions
    FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE POLICY "Admin full access site settings" ON public.site_settings
    FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

-- 12. Storage Bucket Setup
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'class-posters',
    'class-posters',
    true,
    5242880, -- 5MB limit
    ARRAY['image/jpeg', 'image/png', 'image/webp']
)
ON CONFLICT (id) DO UPDATE SET
    public = true,
    file_size_limit = 5242880,
    allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp'];

-- Storage RLS Policies
CREATE POLICY "Public read poster images" ON storage.objects
    FOR SELECT TO anon, authenticated USING (bucket_id = 'class-posters');

CREATE POLICY "Admin write poster images" ON storage.objects
    FOR ALL TO authenticated USING (bucket_id = 'class-posters' AND public.is_admin())
    WITH CHECK (bucket_id = 'class-posters' AND public.is_admin());
