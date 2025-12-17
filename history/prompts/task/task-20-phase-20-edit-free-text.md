# Phase 20: Free-Text Formula Type & Edit Support

## User Request
"Allow custom Formula Types (write anything) and fix the missing ability to Edit formulas."

## Implementation Details
1.  **Schema**:
    - Dropped `formulas_type_check` constraint to allow free-text Types.
2.  **UI - Create**:
    - Converted "Type" Select to Input with Datalist.
3.  **UI - Edit**:
    - Created `app/formulas/[id]/page.tsx` (Edit Page).
    - Linked Formula List cards to the Edit Page.
    - Implemented Update logic (Delete/Re-insert items & steps).

## Outcome
Users are no longer restricted to rigid types and can finally modify their existing formulas.
