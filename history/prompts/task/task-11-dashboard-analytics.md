
# Phase 11: Dashboard Analytics

## Task Description
Add visual charts to the main dashboard to display key performance indicators (KPIs) and trends, as requested by the user.

## Changes
1. **Dependencies**: Installed `recharts`.
2. **Components**:
   - `components/dashboard/AnalyticsCharts.tsx`: Client component rendering AreaChart (Sales) and BarChart (Top Products).
3. **Pages**:
   - `app/page.tsx`: Converted to Server Component. Fetches Sales/Purchases for last 30 days. Passes aggregated data to charts.

## Status
Completed.
