# infov1.md
## Perfume Management App – Feature Specification (v1)

---

## Project Overview

This app is a **personal perfume management system** designed to handle the complete perfumery workflow, including:

- Raw materials tracking
- Formula management (fixatives, bases, blends)
- Batch creation
- Bonding / maceration monitoring
- Automatic inventory deduction
- Finished stock management
- Dealer & price reference

The goal is to replace manual notes, memory-based tracking, and errors with a **single, reliable system**.

---

## Core Modules & Features

---

## 1. Dealers & Price List Module

- Create dealer profiles
  - Name
  - City / source
  - Contact (optional)
  - Personal notes (quality, reliability)

- Dealer products list
  - Product name
  - Product code (if any)
  - Grade (Type / Super / Ultra)
  - Pack size (1kg, 900g, etc)
  - Price (PKR)
  - Last updated date

- Price history
  - Automatic log when price changes
  - Ability to compare old vs new prices

---

## 2. Materials & Inventory Module

### Raw Materials Inventory
Tracks all consumables:
- Perfume oils
- Fixatives
- Alcohol / perfume water
- Solvents and additives

Each material stores:
- Material name
- Category (Oil / Fixative / Base / Solvent)
- Dealer source
- Current stock quantity (ml / g)
- Minimum reorder level
- Notes

Stock updates:
- Manual add (new purchase)
- Auto deduction (when used in batch)

---

## 3. Formulas Module

All formulas are reusable components and saved in three categories.

### A. Fixatives Formulas
- Formula name
- Type: Fixative
- Ingredient list (% and ml auto-calculated)
- Default bonding days
- Notes / observations

### B. Perfume Water / Base Formulas
- Formula name
- Type: Base
- Alcohol %, water %, stabilizers
- Default bonding days
- Notes

### C. Perfume Oil / Blend Formulas
- Formula name (e.g. Obsidian)
- Concentration target
- Ingredient oils with %
- Bottle sizes supported (50ml, 100ml, etc)
- Depends on:
  - Fixatives
  - Base formulas
- Notes & feedback

---

## 4. Batch Creation Module

Used whenever something is produced.

Batch creation includes:
- Select formula
- Select batch type:
  - Fixative batch
  - Base batch
  - Final perfume batch
- Batch size (ml or bottle count)
- Select source components (which fixative/base batch)

On batch creation:
- Required quantities are auto-calculated
- Raw materials are auto-deducted from inventory
- Batch enters **Bonding** state

---

## 5. Bonding / Maceration Tracker

Dedicated dashboard to monitor all active batches.

For each batch:
- Batch name / ID
- Batch type (Fixative / Base / Perfume)
- Start date
- Required bonding days
- Time passed (days + hours)
- Status:
  - 🔴 Bonding
  - 🟡 Almost Ready
  - 🟢 Matured

Purpose:
- See everything currently bonding in one place
- Know exactly what is ready or nearing completion
- Avoid over-aging or forgotten batches

---

## 6. Finished Stock Module

- When a batch reaches maturity:
  - It can be marked as **Ready**
  - Automatically moved to finished stock

Finished stock tracks:
- Product name
- Batch reference
- Quantity available (bottles / ml)
- Cost per unit (future phase)
- Selling price (future phase)

---

## 7. Automatic Inventory Logic (Core Feature)

- Creating any batch automatically:
  - Deducts used oils
  - Deducts fixatives
  - Deducts alcohol / base

- Inventory always reflects:
  - Real remaining stock
  - What is available for next batch

No manual stock guessing required.

---

## 8. Future Enhancements (Not MVP)

- Low-stock alerts
- Cost per bottle calculation
- Profit & margin tracking
- Export formulas / batches to PDF or Excel
- Multi-user roles
- Mobile app / PWA

---

## Core Design Principles (Locked)

- One source of truth
- No duplicate formulas
- Everything batch-linked
- Time-based bonding visibility
- Inventory accuracy over assumptions

---

## Document Info

Version: v1  
Status: Feature definition locked  
Next Step: Database schema & task breakdown
