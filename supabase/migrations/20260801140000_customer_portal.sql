create table quotation_requests (
  id uuid default uuid_generate_v4() primary key,
  customer_id uuid references customers(id) not null,
  origin text not null,
  destination text not null,
  mode text not null,
  commodity text,
  weight numeric,
  notes text,
  status text default 'requested',
  created_at timestamptz default now()
);

create table support_tickets (
  id uuid default uuid_generate_v4() primary key,
  customer_id uuid references customers(id) not null,
  shipment_id uuid references shipments(id),
  subject text not null,
  message text not null,
  status text default 'open',
  created_at timestamptz default now()
);

alter table quotation_requests enable row level security;
create policy "Allow all for now" on quotation_requests for all using (true);

alter table support_tickets enable row level security;
create policy "Allow all for now" on support_tickets for all using (true);
