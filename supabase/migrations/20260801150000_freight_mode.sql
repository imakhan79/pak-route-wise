-- Freight Orders bug fix: useFreightShipments(mode) has never had a real column to
-- filter on, so Road/Sea/Air/Rail Freight pages all render the same rows today.
-- Backfill existing rows to 'road' so behavior doesn't change until the app code
-- (useFreightShipments.ts) is updated to actually write/filter this column.
alter table shipments add column if not exists mode text not null default 'road'
  check (mode in ('road', 'sea', 'air', 'rail'));

create index if not exists shipments_mode_idx on shipments (mode);
