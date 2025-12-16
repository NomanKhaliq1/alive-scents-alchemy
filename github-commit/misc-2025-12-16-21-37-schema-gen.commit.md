# GitHub Commit
Commit Title: feat: add initial schema.sql
Commit Summary: Defines Supabase PostgreSQL schema v1. Includes tables: `materials`, `material_inventory`, `formulas`, `formula_items`, `batches`, `finished_stock`, and optional `dealers`. Enforces constraints like unique ingredients per formula and percent checks.
Task Number: N/A
Files Modified: 
- schema.sql
- history/prompts/misc/2025-12-16-21-37-schema-gen.md
- github-commit/misc-2025-12-16-21-37-schema-gen.commit.md

Reason for Change: User request to generate database schema as per project docs.

Git Commit Command:
git add .
git commit -m "feat: add initial schema.sql"
git pull --rebase origin main || true
git push origin main
