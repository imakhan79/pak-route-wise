-- Vendor / Supplier Management did not exist anywhere in the schema or the app.
-- Modeled on the existing `customers` table for consistency.
create table vendors (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  contact_person text,
  email text,
  phone text,
  address text,
  category text, -- e.g. 'Bonded Carrier', 'Warehouse', 'Customs Agent', 'Fuel Supplier'
  tax_id text,
  payment_terms text, -- e.g. 'Net 30'
  is_active boolean default true,
  created_at timestamptz default now()
);

alter table vendors enable row level security;
create policy "Allow all for now vendors" on vendors for all using (true);
