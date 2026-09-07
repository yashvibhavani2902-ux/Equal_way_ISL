import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const url = process.env.VITE_SUPABASE_URL || 'https://qmntfgqdhrzjpzlssxml.supabase.co';
const anonKey = process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFtbnRmZ3FkaHJ6anB6bHNzeG1sIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODg0Njc2NjEsImV4cCI6MjEwNDA0MzY2MX0.cKwCDPvYQ3chOU0-o7Mmta2f3tQDfxQKGdUlKrHcj1E';

console.log('Connecting to Supabase at:', url);
const client = createClient(url, anonKey);

async function testDatabase() {
  console.log('\n--- 1. Testing "suraksha_wards" Table ---');
  const { data: wards, error: wardsErr } = await client.from('suraksha_wards').select('*');
  if (wardsErr) {
    console.error('❌ Error querying suraksha_wards:', wardsErr.message);
  } else {
    console.log(`✅ Success! Found ${wards.length} records in suraksha_wards:`);
    console.log(wards);
  }

  console.log('\n--- 2. Testing Insert into "public_service_requests" ---');
  const testId = 'TEST-' + Date.now().toString().slice(-4);
  const { error: insErr } = await client.from('public_service_requests').insert({
    id: testId,
    type: 'Supabase Connectivity Test',
    category: 'servicesathi',
    details: 'Automated test record created to verify Supabase storage',
    status: 'Pending Review',
    urgency: 'Normal'
  });

  if (insErr) {
    console.error('❌ Error inserting test service request:', insErr.message);
  } else {
    console.log(`✅ Success! Inserted test request ID: ${testId}`);
    
    // Fetch it back
    const { data: fetchedReq } = await client.from('public_service_requests').select('*').eq('id', testId);
    console.log('Fetched back inserted record:', fetchedReq);
  }

  console.log('\n--- 3. Testing "profiles" Table Query ---');
  const { data: profiles, error: profErr } = await client.from('profiles').select('*');
  if (profErr) {
    console.error('❌ Error querying profiles:', profErr.message);
  } else {
    console.log(`✅ Success! Queried profiles table. Found ${profiles.length} profiles.`);
  }

  console.log('\n--- 4. Testing "travel_tickets" Table Query ---');
  const { data: tickets, error: tickErr } = await client.from('travel_tickets').select('*');
  if (tickErr) {
    console.error('❌ Error querying travel_tickets:', tickErr.message);
  } else {
    console.log(`✅ Success! Queried travel_tickets table. Found ${tickets.length} tickets.`);
  }

  console.log('\n--- 5. Testing "archived_transcripts" Table Query ---');
  const { data: transcripts, error: transErr } = await client.from('archived_transcripts').select('*');
  if (transErr) {
    console.error('❌ Error querying archived_transcripts:', transErr.message);
  } else {
    console.log(`✅ Success! Queried archived_transcripts table. Found ${transcripts.length} transcripts.`);
  }
}

testDatabase();
