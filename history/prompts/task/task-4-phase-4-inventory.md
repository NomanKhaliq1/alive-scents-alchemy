
# Phase 4: Inventory Management

## Task Description
Implement the Inventory Management system to track raw material stocks.

## User Request
"Start on phase 4 now"

## Changes
1. **Created `app/inventory/page.tsx`**:
   - Fetches all materials joined with `material_inventory`.
   - Displays Name, Category, current Stock, and Status.
   - Implemented "Adjust" button functionality.
   - Allows setting both **Stock Quantity** and **Reorder Level** (Min Level).
   - Visual indicator for Low Stock based on the specific material's `reorder_level`.

2. **UI Components**:
   - utilized `Skeleton` loader for better UX during fetching.

## Status
Completed.
