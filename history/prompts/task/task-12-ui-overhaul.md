
# Phase 12: UI Overhaul

## Task Description
Overhaul the UI to match the "Alchemy" theme (Premium, Dark, Glassmorphism) as requested by the user.

## Changes
1.  **Global Theme (`globals.css`)**:
    - Switched to Dark/Violet/Gold palette.
    - Added utility classes for `.glass-card`, `.glass-panel`.
2.  **Components**:
    - `Button.tsx`: Added `framer-motion` interactions, "glass" variant, and gradients.
    - `Card.tsx`: Added glassmorphism, hover glow effects, and entrance animations.
3.  **Layout (`layout.tsx`)**:
    - Added fixed background mesh with blurred blobs for depth.
4.  **Utilities**: Created `lib/utils.ts` for class merging.

## Status
Completed.
