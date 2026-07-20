# Hero Fit and Brand Lockup Design

## Goal

Make the current cinematic hero feel wider and more left-aligned, fit the full landing composition inside one viewport without scrolling, and show a Google Sans “Ferry Labs” wordmark beside the logo.

## Chosen approach

Use the existing flex column (`#app` → navigation → hero → footer) as the viewport contract. Set the app and document to `100svh` with overflow clipped, let the hero flex into the remaining space, and remove its minimum viewport height. This keeps navigation and footer visible while preventing a second vertical scroll region.

## Hero layout

- Change the desktop content start from the centered max-width inset to `clamp(32px, 5vw, 72px)`.
- Widen `.hero-grid` to 900 px and `.hero-copy` to 760 px.
- Raise the headline inline max width to 860 px so the current title resolves to two desktop lines.
- Keep the existing mobile padding, typography clamp, video crop, overlay, CTA, and fallback image behavior.
- At mobile widths, preserve the existing 20 px side inset and allow natural wrapping.

## Viewport and brand

- Set `html`, `body`, and `#app` to a full small viewport height with overflow hidden.
- Make `.hero` a flexible child with `min-height: 0` so the footer remains inside the viewport.
- Add a `.brand-name` span beside the logo, explicitly using `'Google Sans', 'Inter', sans-serif` with the existing 17 px sizing.
- Preserve the logo’s accessible `alt="Ferry Labs"`; the wordmark is visible brand text, not a second image.

## Testing

- Add DOM/CSS assertions for the wider left-aligned bounds, two-line desktop width contract, viewport-fit rules, and brand-name markup/font.
- Preserve all current copy, video, fallback, CTA, booking URL, no-canvas, and responsive assertions.
- Render at 1440×900 and 390×844; verify the document scroll height equals the viewport height, the new title is two lines on desktop, the copy starts farther left, the footer remains visible, and no horizontal or vertical overflow occurs.
