# Case Studies Gallery Refinement

## Goal

Make the opening Case Studies gallery feel smaller and calmer while preserving the supplied artwork in full. This pass changes only the opening gallery; the selected case-study reader below it is out of scope.

## Approved direction

Use compact square cards in the existing two-column desktop and single-column mobile gallery.

- Reduce the “Case Studies” page-title scale.
- Reduce the overall gallery width and card-title scale.
- Give each card a square media frame matching the square source artwork.
- Display each image at its natural full composition without cropping.
- Keep only the case-study title below each image.
- Remove the visible card number, “Case study 01/02,” and “Read case study” text.
- Preserve each complete card as the clickable target and retain its existing hash-selection behavior.

## Responsive behavior

On desktop, the two cards remain side by side in a centered, narrower gallery. On mobile, they stack at the full available content width. The artwork remains square and uncropped at every breakpoint.

## Accessibility and content

The card titles remain in the accessible link names. Decorative gallery images keep empty alt text because the title already identifies each destination. All supplied case-study copy and all detailed-reader markup remain unchanged.

## Verification

- Regression tests confirm the gallery no longer renders the removed labels or numbers.
- CSS tests confirm square media and uncropped image treatment.
- Browser checks confirm both images are fully visible, cards are smaller, and desktop/mobile layouts have no horizontal overflow.
