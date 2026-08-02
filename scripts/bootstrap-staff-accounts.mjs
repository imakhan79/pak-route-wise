// One-time (idempotent) bootstrap: creates real Supabase Auth users + matching
// staff_profiles rows for the 6 internal demo roles, so AuthContext can log them
// in via supabase.auth.signInWithPassword() instead of the in-memory mock list.
// Run with: node scripts/bootstrap-staff-accounts.mjs
//
// Uses only the public anon key (same as the app) since this project has email
// confirmation disabled — supabase.auth.signUp() returns an active session
// immediately, no service role / Admin API required.

import { readFileSync } from 'fs';
import { createClient } from '@supabase/supabase-js';

function loadEnv() {
  const raw = readFileSync(new URL('../.env', import.meta.url), 'utf-8');
  const env = {};
  for (const line of raw.split('\n')) {
    const match = line.match(/^([A-Z0-9_]+)="?(.*?)"?$/);
    if (match) env[match[1]] = match[2];
  }
  return env;
}

const env = loadEnv();
const supabase = createClient(env.VITE_SUPABASE_URL, env.VITE_SUPABASE_PUBLISHABLE_KEY);

const STAFF_ACCOUNTS = [
  { username: 'admin', email: 'admin@logistics.com', password: 'Admin@123', full_name: 'System Administrator', phone: '+92 300 0000001', department: 'IT', location: 'HQ', role: 'Administrator' },
  { username: 'manager', email: 'manager@logistics.com', password: 'Manager@123', full_name: 'Operations Manager', phone: '+92 300 0000002', department: 'Operations', location: 'Karachi Port', role: 'Manager' },
  { username: 'agent', email: 'agent@logistics.com', password: 'Agent@123', full_name: 'Shipping Agent', phone: '+92 300 0000004', department: 'Shipping', location: 'Karachi Office', role: 'Shipping Agent' },
  { username: 'clearing', email: 'clearing@logistics.com', password: 'Clearing@123', full_name: 'Clearing Agent', phone: '+92 300 0000007', department: 'Customs Clearance', location: 'Karachi Port', role: 'Clearing Agent' },
  { username: 'carrier', email: 'carrier@logistics.com', password: 'Carrier@123', full_name: 'Carrier Agent', phone: '+92 300 0000005', department: 'Carrier Relations', location: 'Karachi Port', role: 'Carrier' },
  { username: 'terminal', email: 'terminal@logistics.com', password: 'Terminal@123', full_name: 'Terminal Operator', phone: '+92 300 0000006', department: 'Terminal Operations', location: 'Karachi Port', role: 'Terminal' },
];

async function main() {
  const { data: roles, error: rolesError } = await supabase.from('roles').select('id, name');
  if (rolesError) {
    console.error('Could not read roles table — has the 20260801170000_staff_auth.sql migration been applied?');
    console.error(rolesError.message);
    process.exit(1);
  }
  const roleIdByName = Object.fromEntries(roles.map((r) => [r.name, r.id]));

  for (const account of STAFF_ACCOUNTS) {
    const roleId = roleIdByName[account.role];
    if (!roleId) {
      console.error(`✗ ${account.username}: role "${account.role}" not found in roles table, skipping`);
      continue;
    }

    const { data: existing } = await supabase
      .from('staff_profiles')
      .select('id')
      .eq('username', account.username)
      .maybeSingle();

    if (existing) {
      console.log(`- ${account.username}: staff_profiles row already exists, skipping`);
      continue;
    }

    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email: account.email,
      password: account.password,
      options: { data: { full_name: account.full_name } },
    });

    let userId = signUpData?.user?.id;

    if (signUpError) {
      if (signUpError.message.toLowerCase().includes('already registered')) {
        // Auth user exists from a previous partial run — sign in to recover the id.
        const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
          email: account.email,
          password: account.password,
        });
        if (signInError) {
          console.error(`✗ ${account.username}: auth user already exists but password doesn't match (${signInError.message})`);
          continue;
        }
        userId = signInData.user?.id;
      } else {
        console.error(`✗ ${account.username}: signUp failed — ${signUpError.message}`);
        continue;
      }
    }

    if (!userId) {
      console.error(`✗ ${account.username}: no user id returned, skipping profile insert`);
      continue;
    }

    const { error: profileError } = await supabase.from('staff_profiles').insert({
      id: userId,
      full_name: account.full_name,
      username: account.username,
      email: account.email,
      phone: account.phone,
      role_id: roleId,
      department: account.department,
      location: account.location,
      status: 'active',
    });

    if (profileError) {
      console.error(`✗ ${account.username}: auth user created but staff_profiles insert failed — ${profileError.message}`);
      continue;
    }

    console.log(`✓ ${account.username} (${account.role}) bootstrapped`);
  }

  console.log('\nDone. Sign out any active session in the browser before testing these logins.');
}

main();
