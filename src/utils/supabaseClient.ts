import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { WardRecord } from '../types';

const LOCAL_WARDS_KEY = 'equalway_local_wards_v1';

// Initial sample wards with 3-letter MudraIDs (GAV, VKR, SAM) - NO unnecessary emojis as profile
export const INITIAL_DEMO_WARDS: WardRecord[] = [
  {
    id: 'GAV',
    wardName: 'Gaurav Sharma',
    parentName: 'Ramesh Sharma',
    birthDate: '2016-04-12',
    primaryPreference: 'Speech & Hearing Impaired',
    address: 'Flat 402, Shanti Heights, Sector 14, Navi Mumbai, MH',
    emergencyContact: '+91 98200 45678',
    medicalConditions: 'Allergic to penicillin. Uses ISL manual signs.',
    identificationNotes: 'Carries orange safety wristband with MudraID GAV.',
    registeredAt: '2026-08-15',
    syncedWithSupabase: false,
  },
  {
    id: 'VKR',
    wardName: 'Vikram Joshi',
    parentName: 'Sunita Joshi',
    birthDate: '2018-09-23',
    primaryPreference: 'Hearing Impaired',
    address: '12-B Railway Colony, Dadar East, Mumbai, MH',
    emergencyContact: '+91 98190 12345',
    medicalConditions: 'Hearing impaired, wears cochlear implant on right ear.',
    identificationNotes: 'Responds to visual light signals and ISL letters.',
    registeredAt: '2026-08-20',
    syncedWithSupabase: false,
  },
  {
    id: 'SAM',
    wardName: 'Sameera Khan',
    parentName: 'Farhan Khan',
    birthDate: '2017-11-05',
    primaryPreference: 'Speech Impaired',
    address: 'Plot 88, Civil Lines, Nagpur, MH',
    emergencyContact: '+91 94230 78901',
    medicalConditions: 'Pre-verbal, mild asthma inhaler in school bag.',
    identificationNotes: 'Understands basic ISL signs for water, help, home.',
    registeredAt: '2026-08-25',
    syncedWithSupabase: false,
  },
];

let supabaseInstance: SupabaseClient | null = null;

export function initSupabase(): SupabaseClient | null {
  if (supabaseInstance) return supabaseInstance;

  const url = (import.meta as any).env?.VITE_SUPABASE_URL || '';
  const anonKey = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || '';

  if (url && anonKey && url.startsWith('http')) {
    try {
      supabaseInstance = createClient(url, anonKey);
      return supabaseInstance;
    } catch (err) {
      console.error('Failed to initialize Supabase client:', err);
      supabaseInstance = null;
    }
  }
  return null;
}

// Local Storage Wards persistence helper
export function getLocalWards(): WardRecord[] {
  try {
    const raw = localStorage.getItem(LOCAL_WARDS_KEY);
    if (!raw) {
      localStorage.setItem(LOCAL_WARDS_KEY, JSON.stringify(INITIAL_DEMO_WARDS));
      return INITIAL_DEMO_WARDS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_DEMO_WARDS;
  } catch {
    return INITIAL_DEMO_WARDS;
  }
}

export function saveLocalWards(wards: WardRecord[]): void {
  try {
    localStorage.setItem(LOCAL_WARDS_KEY, JSON.stringify(wards));
  } catch (err) {
    console.error('Failed to save wards to localStorage:', err);
  }
}

// Save a newly registered ward to Supabase and local cache
export async function saveNewWard(ward: WardRecord): Promise<{ success: boolean; syncedWithSupabase: boolean; error?: string }> {
  // Always maintain local cache
  const currentLocal = getLocalWards();
  const updated = [ward, ...currentLocal.filter((w) => w.id !== ward.id)];
  saveLocalWards(updated);

  const client = initSupabase();
  if (client) {
    try {
      const { error } = await client.from('suraksha_wards').upsert({
        id: ward.id.toUpperCase(),
        ward_name: ward.wardName,
        parent_name: ward.parentName,
        birth_date: ward.birthDate,
        primary_preference: ward.primaryPreference,
        other_disorder: ward.otherDisorder || null,
        address: ward.address,
        emergency_contact: ward.emergencyContact,
        medical_conditions: ward.medicalConditions || null,
        identification_notes: ward.identificationNotes || null,
      });

      if (error) {
        console.warn('Supabase upsert note:', error.message);
        return { success: true, syncedWithSupabase: false, error: error.message };
      }
      return { success: true, syncedWithSupabase: true };
    } catch (err: any) {
      return { success: true, syncedWithSupabase: false, error: err?.message };
    }
  }

  return { success: true, syncedWithSupabase: false };
}

// Lookup a ward by 3-letter code from Supabase (or fallback cache)
export async function findWardByMudraId(rawCode: string): Promise<WardRecord | null> {
  const cleanId = rawCode.trim().toUpperCase().replace(/[^A-Z]/g, '').slice(0, 3);
  if (cleanId.length < 3) return null;

  const client = initSupabase();
  if (client) {
    try {
      const { data, error } = await client
        .from('suraksha_wards')
        .select('*')
        .eq('id', cleanId)
        .maybeSingle();

      if (!error && data) {
        return {
          id: data.id,
          wardName: data.ward_name,
          parentName: data.parent_name,
          birthDate: data.birth_date || '',
          primaryPreference: data.primary_preference || 'General Accessibility',
          otherDisorder: data.other_disorder || '',
          address: data.address || '',
          emergencyContact: data.emergency_contact || '',
          medicalConditions: data.medical_conditions || '',
          identificationNotes: data.identification_notes || '',
          registeredAt: data.created_at ? new Date(data.created_at).toLocaleDateString() : new Date().toLocaleDateString(),
          syncedWithSupabase: true,
        };
      }
    } catch (err) {
      console.warn('Supabase query note:', err);
    }
  }

  const localWards = getLocalWards();
  return localWards.find((w) => w.id.toUpperCase() === cleanId) || null;
}
