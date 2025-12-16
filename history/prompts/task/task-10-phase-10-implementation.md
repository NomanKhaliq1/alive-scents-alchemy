
# Phase 10: Sales & Finance (v3)

## Task Description
Implement the complete business loop: **Buy -> Make -> Sell -> Cash**.
Based on `infov3.md`.

## Changes
1. **Schema**:
   - Added `purchases` table (Tracks costs, updates inventory).
   - Added `sales` table (Tracks revenue, reduces finished stock).

2. **Modules Implemented**:
   - **Purchases (`app/purchases/page.tsx`)**: Entry form adds stock to `material_inventory`.
   - **Sales (`app/sales/page.tsx`)**: Entry form deducts stock from `finished_stock`.
   - **Finance (`app/finance/page.tsx`)**: Dashboard showing Total Revenue, Expenses, and Net Profit.

3. **Navigation**:
   - Added links for Purchases, Sales, and Finance.

## Status
Completed.
