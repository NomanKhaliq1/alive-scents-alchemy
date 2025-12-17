# Phase 19: Bonding Process Guide

## User Request
"Implement a feature to add step-by-step instructions and bonding durations to formulas."

## Implementation Details
1.  **Schema**: Created `formula_steps` table (formula_id, step_number, instruction, bonding_days).
2.  **UI**: Added a "Process Guide" section to `app/formulas/create/page.tsx`.
    - Allows adding/removing steps.
    - Automatically calculates `default_bonding_days` from steps.
3.  **Types**: Added `FormulaStep` interface.

## Outcome
Formulas now serve as complete guides, including the method and aging process.
