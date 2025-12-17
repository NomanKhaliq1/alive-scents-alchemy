feat: add ingredient type to formula notebook

- **Database**:
  - Added `ingredient_type` column to `formula_items` table.
  - Updated `setup_missing_tables.sql` migration script.

- **Frontend**:
  - Updated `CreateFormulaPage` to include Ingredient Type input.
  - Added Type display in the ingredients list (table).

- **Types**:
  - Updated `FormulaItem` interface in `types/index.ts`.
