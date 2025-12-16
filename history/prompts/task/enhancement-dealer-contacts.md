
# Enhancement: Dealer Contacts

## Task Description
Add ability to track multiple contacts (people) for a specific dealer, including their roles (Owner, Worker, etc).

## User Request
"Dealers k sath ye b ho k unky kis worker kia kisi bandy ka name ho or number ho to wo b save kr sky like owner, worker, helper etc"

## Changes
1. **Schema**:
   - Added `dealer_contacts` table (name, role, phone, dealer_id).

2. **UI (`app/dealers/[id]/page.tsx`)**:
   - Successfully refactored the page to fetch and display contacts.
   - Added "Key People" section.
   - Added Form to "Add Person" (Name, Role, Phone).
   - Roles include: Owner, Manager, Worker, Helper, Sales.

## Status
Completed.
