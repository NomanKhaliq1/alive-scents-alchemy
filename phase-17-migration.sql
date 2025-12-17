
-- Phase 17 Migration: Decouple Formulas from Inventory
-- Run these commands in the Supabase SQL Editor

-- 1. Add 'ingredient_name' column to store the free-text name
ALTER TABLE formula_items ADD COLUMN ingredient_name text;

-- 2. Make 'material_id' optional (so you don't HAVE to pick from inventory)
ALTER TABLE formula_items ALTER COLUMN material_id DROP NOT NULL;

-- 3. Update the unique constraint (optional, but good practice to prevent duplicates by name now)
-- First drop the old one
ALTER TABLE formula_items DROP CONSTRAINT formula_items_formula_id_material_id_key;
-- Add new one based on name (optional, skipping for flexibility in notebook mode)
