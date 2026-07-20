# Physical Future Hero Copy Design

## Goal

Update the cinematic video hero to state Ferry Labs' physical-economy positioning in the user's exact language.

## Approved copy

Headline:

> AI for the companies building the physical future.

Supporting paragraph:

> We build intelligent systems that learn from your experts and take on the most complex work your company depends on.

## Presentation

- Replace the current headline default with the approved headline.
- Replace both current supporting paragraphs with the single approved paragraph.
- Preserve the existing headline and paragraph typography, width constraints, overlay, video, still fallback, CTA, navigation, and footer.
- Allow the browser's existing responsive text wrapping; do not insert manual line breaks into the new copy.

## Testing

- Update the copy contract test to require the exact new headline and supporting paragraph.
- Assert that the removed Stanford/Berkeley and customer-list paragraphs are no longer present in the rendered template.
- Preserve the booking destination, footer, video, fallback, and no-canvas assertions.
- Render at 1440×900 and 390×844 to confirm readable wrapping, no overlap, and no horizontal overflow.

## Scope

No CTA, visual, navigation, footer, video, or below-the-fold content changes are included.
