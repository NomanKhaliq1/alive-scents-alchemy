# Phase 18: Enhanced Notebook Features (Ingredient Type)

## User Request
"Add ability to specify a type for each ingredient in the formula notebook (e.g., Oil, Fixative, Base)."

## Implementation Details
1.  **Schema**: Added `ingredient_type` to `formula_items` table.
2.  **UI**: Updated `app/formulas/create/page.tsx` to include an input for Ingredient Type with a datalist.
3.  **Types**: Updated `types/index.ts`.

## Outcome
Users can now categorize ingredients within the notebook mode, improving organization.
