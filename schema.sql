-- ALIVE SCENTS ALCHEMY – SCHEMA v1

-- 1. Materials Table
-- Tracks all raw ingredients (Oils, Fixatives, Alcohol, etc)
create table materials (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  name text not null,
  category text not null check (category in ('Oil', 'Fixative', 'Base', 'Solvent', 'Additive')),
  description text,
  unit text not null default 'ml', -- 'ml' or 'g'
  -- Optional: link to a dealer or source preference
  dealer_preference text
);

-- 2. Material Inventory
-- Tracks stock levels for each material
create table material_inventory (
  id uuid default gen_random_uuid() primary key,
  material_id uuid references materials(id) on delete cascade not null,
  quantity_available numeric not null default 0, -- Current stock
  reorder_level numeric default 0, -- Minimum stock trigger
  last_updated timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. Formulas
-- Stores reusable recipes (Percentages are stored in items table)
create table formulas (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  name text not null unique,
  type text not null check (type in ('Fixative', 'Base', 'Perfume', 'Oil_Blend')),
  notes text,
  default_bonding_days integer default 0
);

-- 4. Formula Items
-- The ingredients of a formula. MUST use percentage.
create table formula_items (
  id uuid default gen_random_uuid() primary key,
  formula_id uuid references formulas(id) on delete cascade not null,
  material_id uuid references materials(id) not null,
  percentage numeric not null check (percentage > 0 and percentage <= 100),
  -- Constraint: A material appears only once per formula
  unique(formula_id, material_id)
);

-- 5. Batches
-- Production records. This is where stock deduction happens.
create table batches (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  batch_number serial, -- Simple incrementing ID for physical labels
  formula_id uuid references formulas(id) not null,
  type text not null check (type in ('Fixative', 'Base', 'Perfume')),
  total_quantity numeric not null, -- Total ml/g produced
  unit text not null default 'ml',
  status text not null default 'Bonding' check (status in ('Bonding', 'Ready', 'Finished')),
  bonding_start_date timestamp with time zone default timezone('utc'::text, now()),
  bonding_end_date_estimated timestamp with time zone,
  notes text
);

-- 6. Finished Stock
-- Where batches go after they are matured/bottled
create table finished_stock (
  id uuid default gen_random_uuid() primary key,
  batch_id uuid references batches(id) not null,
  product_name text not null, -- Can be same as formula name or marketing name
  bottles_available integer default 0,
  bottle_size_ml numeric not null, -- e.g. 50, 100
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 7. Dealers (Optional / Phase 8)
create table dealers (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  contact_info text,
  city text,
  notes text
);

-- Indexes for performance
create index idx_materials_category on materials(category);
create index idx_formulas_type on formulas(type);
create index idx_batches_status on batches(status);
