feat: decouple formulas for notebook mode

- **Database**:
  - Added `ingredient_name`.
  - Made `material_id` NULLable.
  - Drop unique constraint.

- **Frontend**:
  - `CreateFormulaPage`: Support free-text ingredient entry.
  - `BatchesPage`: Implement soft-matching for stock deduction.

- **Outcome**:
  - Enables "Notebook Mode" for experimental formulas.
