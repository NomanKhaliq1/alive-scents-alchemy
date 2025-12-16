# infov3.md
## Batch Lifecycle, Sales & Cash Flow Rules (v3)

---

## Purpose of This Document

This document defines the **complete production-to-sales lifecycle** for Alive Scents Alchemy.

It clarifies:
- When batch quantity decreases
- What gets consumed vs what gets sold
- How sales, purchases, and cash flow are tracked
- How rebatching decisions are made

This document overrides assumptions and interpretations.
It is the final authority on lifecycle behavior.

---

## Core Business Loop (Locked)

> **Buy → Make → Bond → Stock → Sell → Cash → Rebatch**

Every feature and screen in the system must fit into this loop.

---

## Batch Types (Three Distinct Categories)

### 1. Fixatives Batches
- Purpose: Input material for perfume production
- Lifecycle:
  - Created
  - Bonding
  - Matured
  - Available
- Quantity decreases when:
  - Used in a **perfume batch**
- Quantity never decreases due to:
  - Sales
- Fixative batches are **never sold**

---

### 2. Base / Perfume Water Batches
- Purpose: Dilution / carrier for perfumes
- Lifecycle:
  - Created
  - Bonding
  - Matured
  - Available
- Quantity decreases when:
  - Used in a **perfume batch**
- Quantity never decreases due to:
  - Sales
- Base batches are **never sold**

---

### 3. Perfume Batches (Final Product)
- Purpose: Product sold to customers
- Lifecycle:
  - Created
  - Bonding
  - Matured
  - Finished Stock
- Quantity decreases when:
  - Perfume is **sold**
- Quantity never decreases due to:
  - Being used in another batch
- Perfume batches are **never consumed**, only sold

---

## Golden Lifecycle Rule (Locked)

> **Upstream batches are consumed.  
Final perfume batches are sold.**

This rule must never be violated.

---

## Quantity Reduction Rules

### Fixatives / Base
- Reduced only during:
  - Perfume batch creation
- Reduction is exact and calculated from formula usage

### Perfume
- Reduced only during:
  - Sales entry
- Reduction reflects real-world sales

---

## Sales System Behavior

### When a Sale Is Recorded
User must enter:
- Perfume name
- Batch ID
- Quantity sold (bottles / ml)
- Selling price
- Date

System automatically:
- Reduces perfume batch quantity
- Creates a sale record
- Adds revenue to cash flow

A batch is considered **finished** only when quantity reaches zero.

---

## Purchase System Behavior

### When a Purchase Is Recorded
User must enter:
- Item purchased (oil, fixative, base, packaging, etc.)
- Quantity
- Cost
- Date

System automatically:
- Adds quantity to inventory
- Subtracts cost from cash balance
- Records purchase history

---

## Cash Flow Tracking

### Cash In
- Total sales revenue
- Revenue per perfume
- Revenue per batch

### Cash Out
- Raw material purchases
- Packaging purchases
- Any production-related expense

---

## Financial Visibility (Must Be Available)

System must be able to show:
- Opening balance
- Total spent
- Total earned
- Current cash balance
- Net profit or loss

---

## Rebatch Decision Logic

Before creating a new perfume batch, the system should allow the user to check:
- Remaining finished stock
- Sales velocity of previous batch
- Available fixatives
- Available base
- Available cash

Rebatching should be **data-driven**, not guess-based.

---

## UI Separation Rules (Locked)

### Batches Section
- All Batches
- Fixatives
- Bases
- Perfumes

### Bonding Section
- Shows batches currently bonding
- Filterable by batch type

### Finished Stock
- Shows **only perfume batches**
- Displays available quantity

### Sales
- Shows sales history
- Allows new sales entry

### Purchases
- Shows purchase history
- Allows new purchase entry

### Finance Dashboard
- Cash summary
- Spend vs earn overview

---

## Absolute Restrictions

- Perfume batches must never be consumed by other batches
- Fixative or base batches must never be sold
- Quantity changes must always be logged
- Manual quantity edits without records are not allowed

---

## Final Principle

> **Production creates stock.  
Sales create cash.  
Cash enables production.**

Breaking this loop breaks the system.

---

## Document Info

Version: v3  
Status: Lifecycle rules locked  
Depends on: infov1.md, infov2.md  
Next Step: Schema alignment & Antigravity sync
