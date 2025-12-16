
# Phase 3 Enhancements: Stock Warnings

## Task Description
Implement optional features for the Calculator: showing available stock and detailed low-stock warnings.

## User Request
"ye b kro" (Do the optional tasks: Show available stock, Low-stock warning).

## Changes
1. **Modified `app/calculator/page.tsx`**:
   - Updated Supabase query to fetch `material_inventory`.
   - Added logic to compare `Required Qty` vs `Available Stock`.
   - Added visual "Low Stock" badge (Red) and "OK" badge (Green).
   - Rows higlight red if insufficient stock.

## Status
Completed.
