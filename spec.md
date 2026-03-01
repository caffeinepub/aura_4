# Specification

## Summary
**Goal:** Ensure every clothing item shown in search results uses an item-relevant local image (no generic fallback) by aligning backend seed photo paths with existing static assets.

**Planned changes:**
- Update all seeded `ClothingItem` entries in `backend/main.mo` so `photo` is non-empty, starts with `/assets/generated/`, and exactly matches an existing filename (including extension and any `.dim_<WxH>` suffix).
- Add any missing static image files under `frontend/public/assets/generated/` for the filenames referenced by seeded items.

**User-visible outcome:** Search Results displays a relevant photo for every returned seeded item, with no missing images or fallback hanger due to empty/invalid photo paths.
