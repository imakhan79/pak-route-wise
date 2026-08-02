-- Moves internal-role user/role/audit-log administration off the in-memory mock
-- AuthContext (src/contexts/AuthContext.tsx MOCK_USERS/MOCK_ROLES) and onto real,
-- persisted tables. This migration only creates the schema and seeds the 6 internal
-- roles with the same permissions as today's MOCK_ROLES — it does NOT create the
-- matching Supabase Auth users.
--
-- IMPORTANT: creating auth.users rows with working passwords must be done via
-- supabase.auth.signUp() (client) or the Admin API's auth.admin.createUser()
-- (service role, e.g. from an Edge Function) — not raw SQL. GoTrue expects a
-- specific password hash format and related triggers that a plain INSERT into
-- auth.users will not satisfy correctly. Once this schema is applied, the next
-- step is to create one auth user per demo account (admin, manager, agent,
-- clearing, carrier, terminal) via the Admin API, each with a staff_profiles row
-- pointing at the matching role below.

create table roles (
  id uuid default uuid_generate_v4() primary key,
  name text not null unique,
  description text,
  is_system boolean default false,
  permissions jsonb not null default '{}',
  created_at timestamptz default now()
);

create table staff_profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  full_name text not null,
  username text not null unique,
  email text not null,
  phone text,
  role_id uuid references roles(id) not null,
  department text,
  location text,
  status text not null default 'active', -- 'active' | 'inactive' | 'locked'
  failed_login_attempts integer not null default 0,
  locked_until timestamptz,
  requires_password_change boolean not null default false,
  created_at timestamptz default now()
);

create table staff_audit_logs (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references staff_profiles(id),
  user_name text not null,
  action text not null,
  module text not null,
  details text,
  ip_address text,
  created_at timestamptz default now()
);
create index on staff_audit_logs (created_at desc);

alter table roles enable row level security;
create policy "Allow all for now roles" on roles for all using (true);

alter table staff_profiles enable row level security;
create policy "Allow all for now staff_profiles" on staff_profiles for all using (true);

alter table staff_audit_logs enable row level security;
create policy "Allow all for now staff_audit_logs" on staff_audit_logs for all using (true);

-- Seed the 6 internal roles with the same permissions as MOCK_ROLES in AuthContext.tsx.
-- ('Customer' is intentionally excluded — that role already has a real, working
-- Supabase Auth flow via the customers table + portal registration.)
insert into roles (name, description, is_system, permissions) values
('Administrator', 'Full system access', true, '{
  "dashboard": ["view","export"],
  "freight_sea": ["view","create","edit","delete","export","approve","lock"],
  "freight_air": ["view","create","edit","delete","export","approve","lock"],
  "freight_road": ["view","create","edit","delete","export","approve","lock"],
  "freight_rail": ["view","create","edit","delete","export","approve","lock"],
  "bl_management": ["view","create","edit","delete","export","approve","lock"],
  "customs_gd": ["view","create","edit","delete","export","approve","lock"],
  "import": ["view","create","edit","delete","export","approve","lock"],
  "export": ["view","create","edit","delete","export","approve","lock"],
  "cnf": ["view","create","edit","delete","export","approve","lock"],
  "transshipment": ["view","create","edit","delete","export","approve","lock"],
  "afghan_transit": ["view","create","edit","delete","export","approve","lock"],
  "warehousing": ["view","create","edit","delete","export","approve","lock"],
  "finance": ["view","create","edit","delete","export","approve","lock"],
  "reports": ["view","create","edit","delete","export","approve","lock"],
  "settings": ["view","create","edit","delete","export","approve","lock"],
  "tracking": ["view","create","edit","delete","export","approve","lock"]
}'::jsonb),
('Manager', 'Operations, Approvals, Reports. No Settings.', true, '{
  "dashboard": ["view","export"],
  "freight_sea": ["view","create","edit","approve","export"],
  "freight_air": ["view","create","edit","approve","export"],
  "freight_road": ["view","create","edit","approve","export"],
  "bl_management": ["view","create","edit","approve"],
  "customs_gd": ["view","create","edit","approve"],
  "import": ["view","create","edit","approve"],
  "export": ["view","create","edit","approve"],
  "reports": ["view","export"],
  "tracking": ["view","export","approve"]
}'::jsonb),
('Shipping Agent', 'Books and manages freight shipments and bills of lading on behalf of customers.', true, '{
  "dashboard": ["view"],
  "freight_sea": ["view","create","edit"],
  "freight_air": ["view","create","edit"],
  "freight_road": ["view","create","edit"],
  "freight_rail": ["view","create","edit"],
  "bl_management": ["view","create","edit"],
  "customs_gd": ["view"],
  "import": ["view"],
  "export": ["view"],
  "reports": ["view"],
  "tracking": ["view"]
}'::jsonb),
('Clearing Agent', 'Handles customs clearance, GD filing, and duty assessment on behalf of importers/exporters.', true, '{
  "dashboard": ["view"],
  "customs_gd": ["view","create","edit"],
  "import": ["view","create","edit"],
  "export": ["view","create","edit"],
  "cnf": ["view","create","edit"],
  "afghan_transit": ["view"],
  "reports": ["view"],
  "tracking": ["view"]
}'::jsonb),
('Carrier', 'Represents a carrier/shipping line, airline, or truck company - manages vessel/flight/truck schedules and transshipment.', true, '{
  "dashboard": ["view"],
  "freight_sea": ["view","edit"],
  "bl_management": ["view"],
  "cnf": ["view"],
  "transshipment": ["view","edit"],
  "reports": ["view"],
  "tracking": ["view","edit"]
}'::jsonb),
('Terminal', 'Manages port/terminal handling, container yard, cargo receiving/dispatch, and customs examination coordination.', true, '{
  "dashboard": ["view"],
  "warehousing": ["view","create","edit"],
  "customs_gd": ["view","edit"],
  "afghan_transit": ["view"],
  "transshipment": ["view","edit"],
  "reports": ["view"],
  "tracking": ["view"]
}'::jsonb);
