feat: add bonding process guide to formulas

- **Database**:
  - Created `formula_steps` table.
  - Linked steps to formulas with cascade delete.

- **Frontend**:
  - Added "Process Guide" UI to `CreateFormulaPage`.
  - Implemented dynamic step addition/removal.
  - Auto-calculation of total bonding days.

- **Types**:
  - Added `FormulaStep` type definition.
