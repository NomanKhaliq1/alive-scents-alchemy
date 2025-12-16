# ANTIGRAVITY.md
## Alive Scents Alchemy – Antigravity Operating Instructions

---

## Project Identity

Project Name: **Alive Scents Alchemy**

This is an internal perfumery lab system used to manage:
- Fixatives formulas
- Perfume base (alcohol/water) formulas
- Perfume oil blend formulas
- Universal formula calculator (percent → ml / liter)
- Batch creation
- Bonding / maceration tracking
- Automatic inventory deduction
- Finished stock management

This is NOT a demo project.
This is a long-term internal control system for a perfume brand.

Accuracy, structure, and discipline are more important than speed.

---

## Tech Stack (LOCKED – Non-negotiable)

- Next.js (App Router)
- TypeScript
- TailwindCSS
- Supabase (PostgreSQL + Auth)

Do NOT suggest:
- Neon
- Separate backend (FastAPI, NestJS, etc)
- Random services
- Different frameworks

---

## Folder Structure Rule (CRITICAL)

Folder structure is STRICTLY locked.

- No file may be created outside the predefined structure
- No temporary files
- No random utilities
- No auto-scaffolding

If a new file is required:
- You MUST explain why
- You MUST ask for confirmation
- Do NOT create it automatically

Breaking folder discipline is considered a failure.

---

## Documentation Is Source of Truth

All features and rules are already documented.

You must strictly follow these files:
- `docs/infov1.md`
- `docs/infov2.md`
- `docs/task.md`

Do NOT:
- Redesign features
- Add new features
- Modify scope
- Make assumptions

If something is unclear, ASK.

---

## Environment Variables Rule

- All environment variables must be declared in `env.example` first
- Never assume environment variables
- Never hardcode secrets
- Never add env keys silently

If a new env variable is needed:
- Explain why
- Propose its name
- Wait for approval

---

## Your Role (Antigravity)

Your role is NOT to take over the project.

Your role is to:
- Read `task.md`
- Identify the NEXT logical step only
- Explain what should be done next
- Ask before creating files
- Wait for confirmation

You must work step-by-step.

Do NOT jump ahead.
Do NOT batch multiple phases together.

---

## Workflow Expectation

Each session, you should:
1. Read `task.md`
2. Propose the next task
3. Explain the change
4. Ask for permission to proceed

Example:
> “Next step is Phase 1 – Core Data Models.  
> I need to create X file in Y location.  
> Should I proceed?”

---

## Absolute Restrictions

You are NOT allowed to:
- Auto-generate project structure
- Add helpers “for later”
- Create placeholder code
- Optimize prematurely
- Assume UI or UX decisions

Follow the plan. Nothing extra.

---

## Core Philosophy

- One source of truth
- Percent-based formulas only
- Calculator = planning, not execution
- Batch creation = only place for stock deduction
- Bonding time is a first-class concept
- Inventory accuracy over convenience

---

## Final Instruction

If you are unsure:
- STOP
- ASK

If something conflicts with docs:
- STOP
- ASK

Control remains with the project owner.
