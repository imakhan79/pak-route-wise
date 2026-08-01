-- Tracking token: lightweight deterrent (not real auth) so a driver link can't be trivially guessed
alter table vehicles add column if not exists tracking_token text default uuid_generate_v4()::text;

-- Raw GPS pings reported by drivers. Derived values (distance travelled, idle state)
-- are computed client-side from consecutive rows rather than stored, so they can't
-- drift or double-count if a vehicle is tracked from more than one device/tab.
create table vehicle_locations (
  id uuid default uuid_generate_v4() primary key,
  vehicle_id uuid references vehicles(id) not null,
  latitude double precision not null,
  longitude double precision not null,
  speed_kmh numeric,
  heading numeric,
  accuracy_m numeric,
  altitude_m numeric,
  battery_level numeric,
  connection_status text,
  engine_status text,
  recorded_at timestamptz not null,
  created_at timestamptz default now()
);
create index on vehicle_locations (vehicle_id, recorded_at desc);

create view vehicle_latest_locations as
  select distinct on (vehicle_id) *
  from vehicle_locations
  order by vehicle_id, recorded_at desc;

alter table vehicle_locations enable row level security;
create policy "Allow all for now" on vehicle_locations for all using (true);

alter publication supabase_realtime add table vehicle_locations;
