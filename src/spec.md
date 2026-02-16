# Specification

## Summary
**Goal:** Seed one additional red floral shirt item so searches for Shirt + Red + Floral reliably return a result with at least one associated shop, and the item has a valid static photo.

**Planned changes:**
- Add a new seeded item in `backend/main.mo` within `_initializeShops` with `itemType="Shirt"`, `color="Red"`, `pattern="Floral"`, a non-empty `photo` path, and at least one shop entry in its item details.
- Add a new static image file under `frontend/public/assets/generated` and set the seeded item’s `photo` field to exactly `/assets/generated/men_shirt_red_floral.dim_480x640.jpeg`.

**User-visible outcome:** Searching with filters itemType=Shirt, color=Red, pattern=Floral shows at least one result, and opening the item details shows at least one shop and a working item photo.
