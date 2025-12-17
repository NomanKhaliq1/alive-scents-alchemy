feat(ui): optimize formula layout and add combobox

- Refactor `CreateFormula` and `EditFormula` pages to use a responsive 2-column grid layout.
- Create `Combobox` component for "Creatable Select" functionality (replacing native datalist).
- Update Formula Type inputs to use the new `Combobox` with custom "Glass" styling.
- Fix global scrollbar styling to be dark and minimal.
- Fix build errors in `Dealers` page (invalid Button props).
- Fix `ReferenceError` for toast notifications.

Phase: 22-23
Task: UI Polish
