# Phase 17: Decoupling Formulas (Notebook Mode)

## User Request
"Decouple formulas from strict inventory material linking. Allow plain text ingredients."

## Implementation Details
1.  **Schema**:
    - Added `ingredient_name` to `formula_items`.
    - Made `material_id` nullable in `formula_items`.
    - Removed strict unique constraint on `formula_id` + `material_id`.
2.  **UI**:
    - Refactored `app/formulas/create/page.tsx` to allow adding ingredients by name (text) without selecting a material.
3.  **Core Logic**:
    - Updated `app/batches/create/page.tsx` to "soft match" text ingredients to materials for stock deduction.

## Outcome
Formulas can now be used as a flexible notebook for ideas without cluttering the material inventory.
