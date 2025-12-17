
-- 1. Create Batches (If missing)
create table if not exists batches (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  batch_number serial,
  formula_id uuid references formulas(id) not null,
  type text not null check (type in ('Fixative', 'Base', 'Perfume')),
  total_quantity numeric not null,
  unit text not null default 'ml',
  status text not null default 'Bonding',
  bonding_start_date timestamp with time zone default timezone('utc'::text, now()),
  bonding_end_date_estimated timestamp with time zone,
  notes text
);

-- 2. Create Finished Stock (If missing)
create table if not exists finished_stock (
  id uuid default gen_random_uuid() primary key,
  batch_id uuid references batches(id) not null,
  product_name text not null,
  bottles_available integer default 0,
  bottle_size_ml numeric not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. Create Dealers & Contacts (If missing)
create table if not exists dealers (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  contact_info text,
  city text,
  notes text
);

create table if not exists dealer_contacts (
  id uuid default gen_random_uuid() primary key,
  dealer_id uuid references dealers(id) on delete cascade not null,
  name text not null,
  role text,
  phone text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table if not exists dealer_prices (
  id uuid default gen_random_uuid() primary key,
  dealer_id uuid references dealers(id) on delete cascade not null,
  material_id uuid references materials(id) on delete cascade not null,
  price numeric not null,
  currency text not null default 'PKR',
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 4. Create Purchases (If missing)
create table if not exists purchases (
  id uuid default gen_random_uuid() primary key,
  material_id uuid references materials(id) not null,
  dealer_id uuid references dealers(id),
  quantity numeric not null check (quantity > 0),
  cost numeric not null check (cost >= 0),
  purchase_date date default current_date not null,
  notes text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 5. Create Sales (If missing)
create table if not exists sales (
  id uuid default gen_random_uuid() primary key,
  product_id uuid references finished_stock(id) not null,
  quantity_sold integer not null check (quantity_sold > 0),
  sale_price numeric not null check (sale_price >= 0),
  total_amount numeric generated always as (quantity_sold * sale_price) stored,
  customer_name text,
  sale_date date default current_date not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 6. PHASE 17 & 18 MIGRATION (Notebook Mode)

-- Add ingredient_name if not exists
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='formula_items' AND column_name='ingredient_name') THEN
        ALTER TABLE formula_items ADD COLUMN ingredient_name text;
    END IF;
END $$;

-- Add ingredient_type if not exists
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='formula_items' AND column_name='ingredient_type') THEN
        ALTER TABLE formula_items ADD COLUMN ingredient_type text;
    END IF;
END $$;

-- Make material_id nullable (Notebook Mode)
ALTER TABLE formula_items ALTER COLUMN material_id DROP NOT NULL;

-- Drop strict unique constraint if it exists
DO $$ 
BEGIN 
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'formula_items_formula_id_material_id_key') THEN
        ALTER TABLE formula_items DROP CONSTRAINT formula_items_formula_id_material_id_key;
    END IF;
END $$;

-- 7. PHASE 19 MIGRATION (Bonding Steps)
create table if not exists formula_steps (
  id uuid default gen_random_uuid() primary key,
  formula_id uuid references formulas(id) on delete cascade not null,
  step_number integer not null,
  instruction text not null,
  bonding_days integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 8. PHASE 20 MIGRATION (Free Text Formula Type)
-- Explicitly drop the known check constraint
ALTER TABLE formulas DROP CONSTRAINT IF EXISTS formulas_type_check;
-- Also drop the other potential name just in case (older Postgres versions or manual naming)
ALTER TABLE formulas DROP CONSTRAINT IF EXISTS formulas_type_check1;
