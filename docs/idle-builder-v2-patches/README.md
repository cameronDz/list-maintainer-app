# idle-builder-v2 — Pending Changes

These files document the two bug fixes that need to be applied to the
`cameronDz/idle-builder-v2` repository.

## Summary of Changes

### Fix 1 — Per-resource cost color indicators
**Problem:** When ANY resource was unaffordable the entire cost row turned red,
making it impossible to tell which specific resources were missing.

**Fix:** Each resource is checked individually. Only the specific resources the
player doesn't have enough of turn red.

**File changed:** `src/components/BuildingSelector.tsx`
**Patch:** `0001-fix-per-resource-cost-colors.diff`

### Fix 2 — Building detail modal
**Problem:** The ▶ Start, Finish, and ✔ Complete action buttons were inline
on every grid cell, cluttering the grid UI.

**Enhancement:** Clicking any occupied building (in any state — idle, building,
or complete) now opens a `BuildingDetailModal` with the relevant action button.
Grid cells show only a small text hint ("tap to start", time remaining, "✔ Done").

**New files:**
- `src/components/BuildingDetailModal.tsx` → copy `BuildingDetailModal.tsx`
- `src/components/BuildingDetailModal.module.css` → copy `BuildingDetailModal.module.css`

**Files changed:**
- `src/components/GridCell.tsx` → apply `0002-building-detail-modal.diff`
- `src/components/GridCell.module.css` → apply `0003-grid-updates.diff`
- `src/components/Grid.tsx` → apply `0003-grid-updates.diff`

## How to Apply

1. Clone or open `cameronDz/idle-builder-v2`
2. Copy the two new files:
   - `BuildingDetailModal.tsx` → `src/components/BuildingDetailModal.tsx`
   - `BuildingDetailModal.module.css` → `src/components/BuildingDetailModal.module.css`
3. Apply the patches (the diff sections in each `.patch` file show exactly what
   lines to add/remove in each existing source file)
4. Run `pnpm install && pnpm run build` to verify

## Visual Result

**Before:** All cost resources turn red when any one is unaffordable.
**After:** Only the specific missing resources appear in red.

**Before:** Start/Finish/Complete buttons cluttered on each grid cell.
**After:** Clicking a building opens a clean detail modal with the action.
