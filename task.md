# task.md
## Alive Scents Alchemy – Development Tasks (v1)

---

## Project Name
Alive Scents Alchemy

Internal lab system for managing perfume formulas, batches, bonding, and inventory.

---

## PHASE 0 – Project Setup (Foundation)

### Tasks
- [ ] Initialize Git repository: `alive-scents-alchemy`
- [ ] Implement directory structure (as per `folders-structured.md`)
- [ ] Move documentation to `docs/` folder
- [ ] Setup Next.js + TypeScript project
- [ ] Configure Tailwind CSS
- [ ] Setup Supabase project
  - [ ] Database
  - [ ] Auth (single admin user initially)
- [ ] Environment variables configuration

**Status:** Pending

---

## PHASE 1 – Core Data Models (Must-have)

### Tasks
- [ ] Create Supabase tables:
  - [ ] materials
  - [ ] material_inventory
  - [ ] formulas
  - [ ] formula_items
- [ ] Define formula types:
  - [ ] Fixative
  - [ ] Perfume Base
  - [ ] Oil Blend
- [ ] Enforce rule: formula items must total 100%

**Status:** Pending

---

## PHASE 2 – Formula Management Module

### Tasks
- [ ] Formula list page
- [ ] Create / edit formula
  - [ ] Name
  - [ ] Type
  - [ ] Notes
- [ ] Add ingredients to formula
  - [ ] Select material
  - [ ] Enter percentage
- [ ] Auto validation:
  - [ ] Total % = 100
- [ ] Save formula in percent-only format

**Depends on:** Phase 1  
**Status:** Pending

---

## PHASE 3 – Formula Calculator (infov2.md)

### Tasks
- [ ] Create **Formula Calculator** tab
- [ ] Formula selector dropdown
- [ ] Quantity input
  - [ ] Value
  - [ ] Unit (ml / liter)
- [ ] Auto conversion (liter → ml)
- [ ] Calculate ingredient quantities
- [ ] Display:
  - [ ] Ingredient name
  - [ ] Percentage
  - [ ] Required ml
- [ ] Optional:
  - [ ] Show available stock
  - [ ] Low-stock warning

**Depends on:** Phase 2  
**Status:** Pending

---

## PHASE 4 – Inventory Management

### Tasks
- [ ] Raw material inventory page
- [ ] Add stock (purchase entry)
- [ ] Manual stock adjustment
- [ ] Minimum stock level setting
- [ ] Inventory list with remaining quantities

**Status:** Pending

---

## PHASE 5 – Batch Creation Module

### Tasks
- [ ] Create batch form
  - [ ] Select formula
  - [ ] Select batch type (Fixative / Base / Perfume)
  - [ ] Enter batch size (ml or bottle count)
- [ ] Auto calculate required materials
- [ ] Validate stock availability
- [ ] Auto deduct materials from inventory
- [ ] Create batch record
- [ ] Set batch status = Bonding

**Depends on:** Phase 3, Phase 4  
**Status:** Pending

---

## PHASE 6 – Bonding / Maceration Tracker

### Tasks
- [ ] Bonding dashboard
- [ ] Display all active batches
- [ ] Show:
  - [ ] Batch name
  - [ ] Type
  - [ ] Start date
  - [ ] Required bonding days
  - [ ] Time passed (days / hours)
  - [ ] Status (Bonding / Almost Ready / Matured)
- [ ] Manual mark as Matured

**Depends on:** Phase 5  
**Status:** Pending

---

## PHASE 7 – Finished Stock Management

### Tasks
- [ ] When batch is marked Matured:
  - [ ] Move to finished stock
- [ ] Track:
  - [ ] Product name
  - [ ] Batch reference
  - [ ] Quantity available
- [ ] Simple finished stock list page

**Depends on:** Phase 6  
**Status:** Pending

---

## PHASE 8 – Dealers & Price List (Optional / Later)

### Tasks
- [ ] Dealer profiles
- [ ] Dealer product price lists
- [ ] Price history tracking
- [ ] Link materials to dealer sources

**Status:** Backlog

---

## PHASE 9 – Polish & Safety

### Tasks
- [ ] Input validation
- [ ] Error handling
- [ ] Confirmations before stock deduction
- [ ] Basic UI consistency
- [ ] Mobile usability check

**Status:** Pending

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

Version: v1.1  
Based on: infov1.md, infov2.md, folders-structured.md  
Next File: schema.sql
