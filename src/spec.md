# Specification

## Summary
**Goal:** Make Men-category search filters explicitly suggest/select “Shirt”, “Red”, and “Floral” so users can easily run that search.

**Planned changes:**
- Update the Men-category Search UI to include a selectable/suggested item type option: **Shirt**.
- Update the Search UI to include a selectable/suggested color option: **Red**.
- Update the Search UI to include a selectable/suggested pattern option: **Floral**.
- Ensure selecting these options and running search navigates to Results with `itemType=Shirt`, `color=Red`, `pattern=Floral` in the query/search params.

**User-visible outcome:** On the Search page, users can pick suggested filters (Shirt, Red, Floral) and run a Men search that opens Results with those filters applied.
