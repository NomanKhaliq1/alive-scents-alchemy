feat: implement toast notification system

- **UI**:
  - Created `Toast` component and context.
  - Added `useToast` hook.
  - Styled for dark mode transparency.

- **Refactor**:
  - Removed all `alert()` calls in Formula Create/Edit flows.
  - Replaced with `toast.success()` and `toast.error()`.
  
- **Layout**:
  - Added `ToastProvider` to root layout.
