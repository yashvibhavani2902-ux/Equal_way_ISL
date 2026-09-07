-- ============================================================================
-- EQUAL WAY ISL - SUPABASE DATABASE SETUP SCRIPT
-- Copy and paste this complete script into the Supabase SQL Editor and click "Run".
-- ============================================================================

-- 1. Create PROFILES table
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    citizen_id TEXT,
    phone TEXT,
    photo_url TEXT,
    preferred_sign_mode TEXT DEFAULT 'ISL Native (Signer)',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Create SURAKSHA_WARDS table (3-letter MudraID as Primary Key)
CREATE TABLE IF NOT EXISTS public.suraksha_wards (
    id TEXT PRIMARY KEY, -- e.g. "GAV", "VKR", "SAM"
    ward_name TEXT NOT NULL,
    parent_name TEXT NOT NULL,
    birth_date TEXT,
    primary_preference TEXT DEFAULT 'General Accessibility',
    other_disorder TEXT,
    address TEXT,
    emergency_contact TEXT,
    medical_conditions TEXT,
    identification_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Create TRAVEL_TICKETS table
CREATE TABLE IF NOT EXISTS public.travel_tickets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    pnr TEXT NOT NULL,
    passenger_name TEXT,
    citizen_id TEXT,
    photo_url TEXT,
    from_station TEXT,
    to_station TEXT,
    mode TEXT,
    service_name TEXT,
    travel_date TEXT,
    travel_class TEXT,
    seat_berth TEXT,
    quota TEXT,
    fare TEXT,
    status TEXT,
    sign_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Create PUBLIC_SERVICE_REQUESTS table
CREATE TABLE IF NOT EXISTS public.public_service_requests (
    id TEXT PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    type TEXT,
    category TEXT,
    mode TEXT,
    details TEXT,
    status TEXT DEFAULT 'Pending Review',
    urgency TEXT DEFAULT 'Normal',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. Create ARCHIVED_TRANSCRIPTS table
CREATE TABLE IF NOT EXISTS public.archived_transcripts (
    id TEXT PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    text TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- Enabling RLS and adding policies to allow public & authenticated operations
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.suraksha_wards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.travel_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.public_service_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.archived_transcripts ENABLE ROW LEVEL SECURITY;

-- Allow public read & write for profiles
DROP POLICY IF EXISTS "Public access to profiles" ON public.profiles;
CREATE POLICY "Public access to profiles" ON public.profiles FOR ALL USING (true) WITH CHECK (true);

-- Allow public read & write for suraksha_wards (for emergency lookup & registration)
DROP POLICY IF EXISTS "Public access to suraksha_wards" ON public.suraksha_wards;
CREATE POLICY "Public access to suraksha_wards" ON public.suraksha_wards FOR ALL USING (true) WITH CHECK (true);

-- Allow public read & write for travel_tickets
DROP POLICY IF EXISTS "Public access to travel_tickets" ON public.travel_tickets;
CREATE POLICY "Public access to travel_tickets" ON public.travel_tickets FOR ALL USING (true) WITH CHECK (true);

-- Allow public read & write for public_service_requests
DROP POLICY IF EXISTS "Public access to public_service_requests" ON public.public_service_requests;
CREATE POLICY "Public access to public_service_requests" ON public.public_service_requests FOR ALL USING (true) WITH CHECK (true);

-- Allow public read & write for archived_transcripts
DROP POLICY IF EXISTS "Public access to archived_transcripts" ON public.archived_transcripts;
CREATE POLICY "Public access to archived_transcripts" ON public.archived_transcripts FOR ALL USING (true) WITH CHECK (true);

-- ============================================================================
-- INITIAL DEMO SEED DATA (Suraksha Mudra Wards)
-- ============================================================================

INSERT INTO public.suraksha_wards (
    id, ward_name, parent_name, birth_date, primary_preference, address, emergency_contact, medical_conditions, identification_notes
) VALUES
  ('GAV', 'Gaurav Sharma', 'Ramesh Sharma', '2016-04-12', 'Speech & Hearing Impaired', 'Flat 402, Shanti Heights, Sector 14, Navi Mumbai, MH', '+91 98200 45678', 'Allergic to penicillin. Uses ISL manual signs.', 'Carries orange safety wristband with MudraID GAV.'),
  ('VKR', 'Vikram Joshi', 'Sunita Joshi', '2018-09-23', 'Hearing Impaired', '12-B Railway Colony, Dadar East, Mumbai, MH', '+91 98190 12345', 'Hearing impaired, wears cochlear implant on right ear.', 'Responds to visual light signals and ISL letters.'),
  ('SAM', 'Sameera Khan', 'Farhan Khan', '2017-11-05', 'Speech Impaired', 'Plot 88, Civil Lines, Nagpur, MH', '+91 94230 78901', 'Pre-verbal, mild asthma inhaler in school bag.', 'Understands basic ISL signs for water, help, home.')
ON CONFLICT (id) DO NOTHING;
