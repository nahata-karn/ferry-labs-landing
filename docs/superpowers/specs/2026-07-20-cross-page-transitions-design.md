# Cross-page transition design

## Goal

Make navigation between the Landing, Case Studies, and Ferry Platform pages feel continuous rather than like three abrupt document loads.

## Motion

- Use the browser's native same-origin cross-document View Transitions API.
- Fade the outgoing page out and the incoming page in over 260 milliseconds.
- Use a restrained ease curve with no translation, scaling, blur, or decorative motion.
- Give each page's sticky navigation the same transition name so it remains visually anchored while the page content changes.
- Keep the existing dark background consistent throughout the transition so no white flash appears between documents.

## Compatibility and accessibility

- Browsers without cross-document view transitions use a small dependency-free fallback that fades the current document out, performs the same-origin navigation, and fades the destination in.
- The fallback ignores modified clicks, downloads, external links, new-tab links, and same-document hashes so native browser behavior remains intact.
- Under `prefers-reduced-motion: reduce`, disable transition animations entirely.
- Navigation URLs, browser history, open-in-new-tab behavior, and booking links remain unchanged.

## Scope

The transition applies to the three first-party pages only:

- `index.html`
- `case-studies.html`
- `ferry-platform.html`

The fallback is implemented once in `page-transitions.js` and loaded by all three pages.

No content, layout, copy, or CTA behavior changes are included.

## Verification

- Static tests confirm all three pages opt into cross-document transitions.
- Static tests confirm the shared navigation transition name and reduced-motion override.
- Browser verification covers Landing → Case Studies → Ferry Platform at the local deployment URL.
