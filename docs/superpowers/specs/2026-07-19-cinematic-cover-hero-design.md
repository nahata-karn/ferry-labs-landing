# Cinematic Cover Hero Design

**Status:** Approved direction  
**Date:** 2026-07-19

## Goal

Replace the animated 3D wave in the Ferry Labs landing-page hero with the user-supplied pixel-art scene of two astronauts overlooking a futuristic city beneath a large planet. The artwork should become the primary visual identity of the initial viewport while preserving the existing landing-page content and booking flow.

## Selected Direction

Use a full-bleed cinematic cover. The image fills the hero beneath the sticky navigation, and the existing headline, supporting copy, and consultation CTA sit over the darker upper-left portion of the artwork. A restrained navy gradient protects text legibility without flattening the image's blue, cyan, and warm-gold palette.

The alternatives considered were an editorial image panel below the copy and a split-screen layout. The full-bleed cover was selected because it makes the supplied artwork feel integral to the brand and preserves more of its scale.

## Page Structure

The page remains a dependency-free static site delivered from `index.html`.

- Keep the sticky Ferry Labs navigation and logo.
- Keep the current headline: “Turn your expert knowledge into autonomous agents.”
- Keep both current supporting paragraphs.
- Keep the “Book a free consultation” CTA and its existing Google Calendar destination.
- Keep the San Francisco / New York footer and copyright treatment.
- Replace the `.floor-grid` canvas region with a semantic hero artwork layer.
- Remove the `FloorGrid` React component, its animation loop, and wave-specific CSS instead of leaving dormant code.

## Artwork Treatment

Copy the supplied PNG into the repository as `cover-hero.png` and render it as an image inside the hero rather than embedding another large binary payload into `index.html`.

The image layer uses `object-fit: cover` and fills the hero. Desktop positioning prioritizes the central city while keeping the foreground astronauts visible. Mobile positioning shifts the focal point to retain the astronauts and central architecture despite the narrower crop.

The image is meaningful brand imagery, so its accessible description will be: “Two astronauts overlook a futuristic city beneath a colossal planet.” The page must remain legible if the image fails to load: its existing near-black background and gradient remain behind the text.

## Content and Visual Hierarchy

On desktop, the hero content is left-aligned in a bounded column over the darker sky and lunar area. The headline remains the dominant typographic element. The two supporting paragraphs follow with the existing type treatment, and the primary CTA moves into the same content cluster so the conversion path is visually connected to the message.

The overlay combines:

- a stronger navy-to-transparent horizontal gradient behind the content;
- a softer top-to-bottom gradient to support the navigation and headline;
- a subtle lower-edge gradient so the footer transition feels deliberate.

The overlay must not recolor the entire image or obscure the large planet and city.

## Responsive Behavior

Desktop and tablet use a hero that fills at least the available initial viewport beneath the navigation. The cover image spans edge to edge, while the content aligns to the site's existing maximum-width grid.

On mobile:

- the hero becomes taller when needed to fit the headline, copy, and CTA without overlap;
- the content remains left-aligned with reduced horizontal padding;
- the image focal point shifts to keep the astronauts and central city visible;
- text receives a slightly stronger local gradient for contrast;
- the footer follows the hero without covering the CTA or artwork.

No animated replacement, parallax, or motion effect is introduced.

## Interaction and Error Handling

The only hero interaction remains the consultation CTA. It keeps the current toast feedback and opens the existing booking URL in a new tab with `noopener,noreferrer`.

If the image cannot load, the hero falls back to the existing near-black page background. All copy and the CTA must remain visible and usable. There are no new network dependencies or runtime data flows.

## Verification

Implementation is complete when all of the following hold:

1. The supplied artwork fills the hero and loads from a local repository asset.
2. No `.floor-grid` element, `FloorGrid` component, hero canvas, or animation loop remains.
3. The logo, headline, both supporting paragraphs, CTA label, booking URL, locations, and copyright remain intact.
4. Desktop framing preserves the planet, central city, and foreground astronauts while maintaining readable text contrast.
5. Mobile framing keeps the headline, copy, CTA, astronauts, and central architecture usable and recognizable without horizontal overflow.
6. The page renders without browser console errors or warnings introduced by the change.
7. The CTA remains uniquely identifiable and retains its current behavior.

## Scope

This change is limited to the hero artwork and the layout adjustments required to integrate it. It does not rewrite marketing copy, redesign the logo or footer, add new sections, change the booking provider, or restructure the bundled static-site architecture.
