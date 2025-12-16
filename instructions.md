# INSTRUCTIONS.md — Autonomous Codex Behavior Manual (Ultra Edition)

# Project: Alive Scents Alchemy

# Purpose:
Define EXACT behavior, execution rules, and fail-safe constraints for the Codex Agent
working on the Alive Scents Alchemy project.

Codex MUST obey EVERY rule in this file with ZERO deviation.

──────────────────────────────────────────────────────────────

# 1. GENERAL BEHAVIOR RULES

Codex MUST:

- Follow a strict spec-driven workflow.
- Treat `infov1.md`, `infov2.md`, and `task.md` as the SINGLE source of truth.
- Execute tasks ONLY when explicitly triggered by the user.
- NEVER create files outside the defined folder structure.
- NEVER create files unless explicitly instructed.
- NEVER skip, merge, reorder, or invent tasks.
- Maintain deterministic, predictable output.
- STOP after every task until further instruction.

If Codex encounters missing or ambiguous details:

- It MUST STOP and ask for clarification before proceeding.

──────────────────────────────────────────────────────────────

# 2. TASK EXECUTION RULES (CORE LOOP)

Codex may ONLY perform a task when the user says:

`Proceed with Task <number>`

When this command is received, Codex MUST:

1. Re-read `infov1.md`
2. Re-read `infov2.md`
3. Re-read `task.md`
4. Re-read this `INSTRUCTIONS.md`
5. Execute ONLY the exact requested task
6. Update `task.md`:
   - Mark ONLY the executed task as `[x]`
   - MUST NOT modify any untouched tasks

Codex MUST NOT:

- Run the next task automatically
- Modify task ordering
- Combine multiple tasks
- Execute partial tasks

──────────────────────────────────────────────────────────────

# 3. FILE & FOLDER SAFETY RULES (CRITICAL)

Codex MUST:

- Respect the existing folder structure at ALL times.
- NEVER create files in random or unspecified locations.
- NEVER refactor folders unless explicitly instructed.
- NEVER rename files unless explicitly instructed.

Allowed files ONLY when explicitly requested:
- `infov*.md`
- `task.md`
- `schema.sql`
- Code files strictly within approved directories

If file creation is unclear:
- Codex MUST STOP and ask before creating anything.

──────────────────────────────────────────────────────────────

# 4. HISTORY FILE RULES (EVERY MESSAGE LOGGED)

Every user message MUST generate a history log.

### File Placement

- **Task-based messages**:
  `history/prompts/task/task-<number>-<short-name>.md`

- **General / discussion messages**:
  `history/prompts/misc/<timestamp>-<topic>.md`

### History File MUST Include:

- Timestamp
- User message
- Codex response summary
- Task reference (if any)
- High-level reasoning summary (NO chain-of-thought)
- What changed in the project (if anything)

Codex MUST NOT expose internal chain-of-thought.

──────────────────────────────────────────────────────────────

# 5. GITHUB COMMIT SYSTEM RULES

Every user interaction MUST produce a GitHub commit file.

### File Placement

- **Task-based commits**:
  `github-commit/task-<number>-<short-name>.commit.md`

- **Misc commits**:
  `github-commit/misc-<timestamp>-<topic>.commit.md`

### Commit File MUST Include:

- Commit Title
- Commit Summary
- Task Number (if applicable)
- Files Modified
- Reason for Change
- Ready-to-copy Git commit message
- Ready-to-copy Git commit description

──────────────────────────────────────────────────────────────

# 5.1 AUTOMATIC GIT PUSH RULES

Codex MUST ensure all git actions follow this sequence:

1. Ensure repository is initialized
2. Ensure remote is set to:
   https://github.com/NomanKhaliq1/alive-scents-alchemy.git
3. Execute:
   ```bash
   git add .
   git commit -m "<Commit Title>"
   git pull --rebase origin main || true
   git push origin main

Safety Rules:

If commit is empty, Codex MUST create a dummy change file if instructed.

Rebase is ALWAYS preferred over merge.

If push fails, Codex MUST retry once and then STOP.

──────────────────────────────────────────────────────────────

6. USER INTERACTION RULES (MANDATORY STOP)

After EVERY task execution, Codex MUST:

STOP all execution

Respond ONLY with:
“Task <number> completed. Waiting for next command.”

Wait silently until the next explicit instruction

──────────────────────────────────────────────────────────────

7. ERROR & CONFLICT HANDLING

If Codex detects:

Missing specifications

Conflicting instructions

Undefined behavior

Scope creep beyond Alive Scents Alchemy

Codex MUST STOP and respond with:

“More details required. Please clarify before I continue.”

Codex MUST NOT:

Guess

Assume

Auto-correct specs

Override user decisions

──────────────────────────────────────────────────────────────

8. OUTPUT FORMAT RULES

Codex output MUST be:

Minimal

Structured

Deterministic

Professional

Free of unnecessary commentary

No creative deviations.
No verbosity.
No speculative language.

──────────────────────────────────────────────────────────────

9. FINAL AUTHORITY RULE

If INSTRUCTIONS.md conflicts with any other file:
INSTRUCTIONS.md ALWAYS wins.


---

### ✅ What I’ve done (summary)
- Same **Codex Ultra discipline**
- Adjusted for **Alive Scents Alchemy**
- Folder-structure safety explicitly enforced
- Git repo already wired to your provided link
- No assumptions, no automation creep

### 🔒 What’s next (only when YOU say)
- `Proceed with Task 0` → Project setup  
- `Proceed with Task 1` → Core data models  
- Or: “Modify instructions for X edge-case”

Tumne system **proper engineering mindset** se lock kiya hai.  
Jab tum bolo **Proceed**, tab hi agla move hoga.
