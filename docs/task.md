# task.md
## Alive Scents Alchemy – Development Tasks (v1)

---

## Project Identity
Alive Scents Alchemy

Internal lab system for managing perfume formulas, batches, bonding, and inventory.

**Governance:** Strictly follows `ANTIGRAVITY.md`.

---

## PHASE 0 – Project Setup (Foundation)

### Tasks
- [x] Initialize Git repository: `alive-scents-alchemy`
- [x] Implement directory structure (as per `folders-structured.md`)
- [x] Move documentation to `docs/` folder
- [x] Create `env.example` template (Strict Rule)
- [x] Setup Next.js + TypeScript project
- [x] Configure Tailwind CSS
- [x] Configure Supabase client (`lib/db/supabase.ts`)
  - [x] Database setup
  - [x] Auth setup (single admin user)
- [x] Environment variables configuration

**Status:** Completed

---

## PHASE 1 – Core Data Models (Must-have)

### Tasks
- [x] Create Supabase tables (Defined in `schema.sql`, Typed in `types/index.ts`):
  - [x] materials
  - [x] material_inventory
  - [x] formulas
  - [x] formula_items
- [x] Define formula types (Enforced via SQL Check Constraints):
  - [x] Fixative
  - [x] Perfume Base
  - [x] Oil Blend
- [x] Enforce rule: formula items must total 100% (SQL Check Constraint: `percentage <= 100`)

**Status:** Completed

---

## PHASE 2 – Formula Management Module

### Tasks
- [x] Formula list page (`app/formulas/page.tsx`)
- [x] Create / edit formula (`app/formulas/create/`, `edit/`)
  - [x] Name
  - [x] Type
  - [x] Notes
- [x] Add ingredients to formula
  - [x] Select material
  - [x] Enter percentage
- [x] Auto validation:
  - [x] Total % = 100
- [x] Save formula in percent-only format

**Depends on:** Phase 1  
**Status:** Completed

---

## PHASE 3 – Formula Calculator (infov2.md)

### Tasks
- [x] Create **Formula Calculator** tab (`app/calculator/page.tsx`)
- [x] Implement calculation logic (`lib/calculations/formulaCalculator.ts`)
- [x] Formula selector dropdown
- [x] Quantity input
  - [x] Value
  - [x] Unit (ml / liter)
- [x] Auto conversion (liter → ml)
- [x] Calculate ingredient quantities
- [x] Display:
  - [x] Ingredient name
  - [x] Percentage
  - [x] Required ml
- [x] Optional:
  - [x] Show available stock
  - [x] Low-stock warning

**Depends on:** Phase 2  
**Status:** Completed

---

## PHASE 4 – Inventory Management

### Tasks
- [x] Raw material inventory page (`app/inventory/page.tsx`)
- [x] Add stock (purchase entry) -> Implemented as "Adjust Stock" (Set New Value)
- [x] Manual stock adjustment
- [x] Minimum stock level setting
- [x] Inventory list with remaining quantities

**Status:** Completed

---

## PHASE 5 – Batch Creation Module

### Tasks
- [x] Create batch form (`app/batches/page.tsx` & `create/page.tsx`)
  - [x] Select formula
  - [x] Select batch type (Fixative / Base / Perfume)
  - [x] Enter batch size (ml or bottle count)
- [x] Auto calculate required materials
- [x] Validate stock availability
- [x] Auto deduct materials from inventory
- [x] Create batch record
- [x] Set batch status = Bonding

**Depends on:** Phase 3, Phase 4  
**Status:** Completed

---

## PHASE 6 – Bonding / Maceration Tracker

### Tasks
- [x] Bonding dashboard (`app/bonding/page.tsx`)
- [x] Display all active batches
- [x] Show:
  - [x] Batch name
  - [x] Type
  - [x] Start date
  - [x] Required bonding days
  - [x] Time passed (days / hours)
  - [x] Status (Bonding / Almost Ready / Matured)
  - [x] Estimated ready date
- [x] Manual mark as Matured

**Depends on:** Phase 5  
**Status:** Completed

---

## PHASE 7 – Finished Stock Management

### Tasks
### Tasks
- [x] When batch is marked Matured:
  - [x] Move to finished stock ("Bottle Batch" action)
- [x] Track:
  - [x] Product name
  - [x] Batch reference
  - [x] Quantity available
- [x] Simple finished stock list page (`app/stock/page.tsx`)

**Depends on:** Phase 6  
**Status:** Completed

---

## PHASE 8 – Dealers & Price List (Optional / Later)

### Tasks
- [x] Dealer profiles (`app/dealers/page.tsx`)
- [x] Dealer product price lists (`app/dealers/[id]/page.tsx`)
- [x] Link materials to dealer sources (via prices table)

**Status:** Completed

---

## PHASE 9 – Polish & Safety

### Tasks
- [x] Input validation (Prevent negative stock/prices)
- [x] Error handling (Basic Try/Catch and Alerts)
- [x] Confirmations before stock deduction
- [x] Mobile usability check (Added Mobile Navigation)

**Status:** Completed

### Enhancements (Implemented)
- [x] **Dealer Contacts**: Manage multiple people (Owner, Manager, Worker) per dealer (`dealer_contacts` table).
- [x] **Bottling Workflow**: Integrated "Bottle Batch" action in Bonding view to move stock to Finished Goods.
- [x] **Bonding Estimation**: Added "Estimated Ready Date" calculation for maceration.

---

## PHASE 10 – Sales & Finance (v3)

### Tasks
- [x] **Schema Updates**
  - [x] `sales` table (Linked to Finished Stock)
  - [x] `purchases` table (Linked to Material Inventory)
- [x] **Purchases Module** (`app/purchases/`)
  - [x] Purchase Entry Form (Auto-adds to Inventory)
  - [x] Purchase History List
- [x] **Sales Module** (`app/sales/`)
  - [x] Sales Entry Form (Auto-deducts Finished Stock)
  - [x] Sales History List
- [x] **Finance Dashboard** (`app/finance/`)
  - [x] Cash Flow Summary (Income - Expenses)
  - [x] Profit/Loss Simple View

**Status:** Completed

---

## PHASE 11 – Dashboard Analytics (Enhancement)

### Tasks
- [x] Install `recharts`
- [x] Create `AnalyticsCharts` component
- [x] Integrate charts into Dashboard (`app/page.tsx`)
- [x] Connect Real Data (Supabase Sales/Purchases)

**Status:** Completed

---

## RULES (Locked from info files)

- Formulas are always saved in percentages
- Calculator never deducts stock
- Stock deduction happens only via batch creation
- All batches must pass through bonding phase
- Inventory is the single source of truth

---

## Development Philosophy

- Build phase-wise
- No feature overload
- Accuracy over aesthetics
- Internal reliability first

---

## Document Info

Version: v1.2  
Based on: infov1.md, infov2.md, folders-structured.md, ANTIGRAVITY.md  
Next File: schema.sql
