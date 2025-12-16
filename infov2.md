# infov2.md
## Formula Calculator & Batch Planning Feature (v2)

---

## Feature Overview

This feature introduces a **universal formula calculator** that works for:

- Fixatives formulas
- Perfume base / perfume water formulas
- Perfume oil blend formulas
- Any future formula type

All formulas are saved **only in percentages**.  
Users can input any desired quantity (ml or liter), and the app will automatically calculate the required amount of each ingredient.

This feature is designed for **planning and accuracy**, not direct stock deduction.

---

## Core Concept (Locked)

> **Formula = Percent-based (always)**  
> **Quantity = User input (ml / liter)**  
> **Result = Auto-calculated ingredient amounts**

Percent formulas are reusable forever.  
ML values are calculated dynamically per use.

---

## Formula Calculator Tab

### Purpose
- Quickly calculate ingredient quantities
- Plan batches before production
- Avoid manual math errors
- Check feasibility before creating a batch

---

## User Flow

### Step 1: Select Formula
User selects any saved formula from dropdown:
- Alive Glow – Fixative
- Alive Anchor – Fixative
- Perfume Base v1
- Obsidian – Oil Blend
- Any future formula

---

### Step 2: Enter Quantity
User inputs:
- Quantity value (number)
- Unit:
  - ml
  - liter

Example inputs:
- `100 ml`
- `1 liter`

---

### Step 3: Auto Calculation
The system:
- Converts liters to ml (1 L = 1000 ml)
- Reads formula percentages
- Calculates exact required quantity for each ingredient

---

## Example Calculation

### Saved Formula: Alive Glow – Fixative
- Ambroxan: 20%
- Iso E Super: 15%
- Galaxolide: 25%
- DPG: 40%

### Input: 100 ml
Output:
- Ambroxan: 20 ml
- Iso E Super: 15 ml
- Galaxolide: 25 ml
- DPG: 40 ml

### Input: 1 liter
Output:
- Ambroxan: 200 ml
- Iso E Super: 150 ml
- Galaxolide: 250 ml
- DPG: 400 ml

---

## Supported Formula Types

The same calculator works for:
- Fixatives
- Perfume bases / alcohol blends
- Oil blends
- Final perfume formulas

No separate logic per formula type.

---

## Inventory Awareness (Optional Enhancement)

The calculator can optionally display:
- Required quantity
- Available stock

Example:
- Ambroxan: Required 200 ml
- Available: 150 ml ❌

This allows users to identify shortages **before batch creation**.

---

## Important Rules (Locked)

### Rule 1: Percent-only Storage
- All formulas are stored in percentages
- No formula stores ml values

### Rule 2: Calculator Is Non-destructive
- Calculator does NOT deduct stock
- Stock deduction only happens during **Batch Creation**

### Rule 3: Single Source of Truth
- Calculator reads from the same formulas used by batches
- No duplicate or temporary formulas

---

## Relation to Batch System

The calculator is a **planning tool**, not a production tool.

Flow:
Save Formula (%)
→ Formula Calculator (ml / L)
→ Check Stock (optional)
→ Create Batch
→ Auto Stock Deduction
→ Bonding / Maceration  


---

## UI Suggestions (High-level)

- Left panel:
  - Formula selector
  - Quantity input
  - Unit selector

- Right panel:
  - Ingredient list
  - Percentage
  - Calculated ml
  - Optional stock status

---

## Design Philosophy

- Eliminate manual calculations
- Reduce production errors
- Make perfumery repeatable and scalable
- Keep formulas reusable across any batch size

---

## Document Info

Version: v2  
Status: Feature locked  
Depends on: Formula Module, Inventory Module  
Next Step: Batch Creation integration
