# Specification

## Summary
**Goal:** Seed exactly one new Women’s blue floral dress item in the backend dataset and add a matching static photo asset that the item references.

**Planned changes:**
- Update `backend/main.mo` (`_initializeShops`) to seed one new `#women` ClothingItem with `itemType = "Dress"`, `color = "Blue"`, and `pattern = "Floral"`, and ensure at least one seeded shop carries it so `getItemDetails` returns a non-empty shops list.
- Add a new static image file at `frontend/public/assets/generated/women_blue_floral_dress.dim_480x640.jpeg` and set the seeded item’s `photo` field to exactly `/assets/generated/women_blue_floral_dress.dim_480x640.jpeg`.

**User-visible outcome:** Searching Women → Dress → Blue → Floral returns the newly seeded dress, and its details page/response includes a working photo URL and at least one shop that carries it.
