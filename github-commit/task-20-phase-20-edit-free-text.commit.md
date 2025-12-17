feat: enable free-text formula types and editing

- **Database**:
  - REMOVED `formulas_type_check` constraint.
  - Allowed any text string for `formula.type`.

- **Frontend**:
  - **Create Page**: Changed Type selector to free-text Input.
  - **Edit Page**: Created `app/formulas/[id]/page.tsx` for full formula editing.
  - **List Page**: Made formula cards clickable links to Edit page.

- **Fix**: Wrapped logic in `do $$` blocks in SQL script to safely drop constraints.
