# Ferry Platform Page Design

**Status:** Approved visual direction; awaiting written-spec review  
**Date:** 2026-07-20

## Goal

Create a dedicated `ferry-platform.html` page that explains how Ferry modernizes a high-value expert workflow, deploys an organization-specific intelligence system, and improves it under expert supervision. The page should feel like the same product as the cinematic landing page and editorial case-study reader: dark, restrained, pixel-art-led, and precise.

This is a platform explanation and conversion page, not a generic AI architecture page. It must preserve the supplied copy verbatim and use diagrams only to clarify the operating model.

## Approved Direction

Use the approved **Editorial deployment story** composition.

1. Open with the supplied square image, centered and uncropped.
2. Follow it with the centered title, introduction, and compact CTA.
3. Explain the bespoke model in `Custom by design` with one quiet system-building schematic.
4. Present `How we work` as a five-step connected sequence.
5. Present `What every deployment includes` as a restrained two-by-three capability grid.
6. Present `Your environment or ours.` as a two-path deployment diagram.
7. Keep `How we engage` editorial and human-led.
8. Close with the supplied statement and the same compact CTA.

There is no separate `Ferry Platform` page title, eyebrow, or introductory label above the opening image.

## Shared Navigation

- Reuse the fixed translucent navigation pill from the landing and case-study pages.
- The logo remains the transparent Ferry mark inside the small square tile.
- `Case Studies` links to `case-studies.html`.
- `Ferry Platform` links to `ferry-platform.html` and receives `aria-current="page"` on this page.
- The navigation CTA keeps its current label and booking destination.
- Update the landing and case-study navigation so their `Ferry Platform` links also point to the new page.

## Opening Composition

- The 2048×2048 supplied image appears first beneath the fixed navigation.
- Display size matches the case-study hero: `min(100%, 432px)` on desktop, centered.
- Preserve the full square with `object-fit: contain`; do not crop or place copy over the image.
- Use a fine low-contrast border and no card shadow.
- Place the title below the image, centered, with a bounded measure and Geist Pixel.
- Place the supplied introduction below the title in Google Sans.
- Use the compact blue CTA dimensions already established on the landing and case-study pages.

### Opening copy

> Intelligence built inside your organization.

> Ferry works with your experts to modernize critical workflows and deploy intelligent systems built around your knowledge, context, and judgment.

CTA: `Start a Deployment`

## Section Design

### Custom by design

Keep the heading and both supplied paragraphs in a narrow editorial column. Beside or beneath the copy, render a quiet three-part schematic: an expert-work glyph, a structured-context glyph, and a deployed-system glyph connected by stepped pixel lines. The schematic is decorative and contains no invented marketing copy.

Copy:

> Ferry does not sell a generic agent or ask your team to adapt to a predefined product.

> We begin with a complex, economically valuable workflow and build the system around how your organization actually operates.

### How we work

Render the five stages as a connected sequence with `01` through `05`, exact headings, exact body copy, and one analog-game-style glyph per stage. Desktop uses a horizontal rail when it fits comfortably; tablet and mobile use a vertical rail. The connector is a stepped one-pixel path, not a smooth gradient or timeline animation.

1. **Choose the outcome**  
   We identify a critical workflow where better use of expert knowledge can create meaningful operational or economic value.
2. **Modernize the workflow**  
   We redesign the process, structure fragmented information, and connect the tools and systems your team already uses.
3. **Deploy the Ferry platform**  
   We deploy a context layer, agents, custom evaluations, and learning-loop infrastructure tuned to your organization.
4. **Apprentice to your experts**  
   The system works alongside your best operators. Their decisions, corrections, and judgment shape how it performs.
5. **Improve and expand**  
   Once the first workflow performs reliably, we improve it continuously and expand the platform into adjacent work.

### What every deployment includes

Use a restrained two-by-three grid with fine borders. Each cell contains one small analog-game-style glyph and the exact supplied line. The cells remain flat and low-contrast; they are not large glowing product cards.

- A context layer built around your organization’s knowledge
- Agents designed for your highest-value workflows
- Custom evaluations tuned to your standards and expert judgment
- Integrations with your existing software and data
- Interfaces for expert review, correction, and approval
- Infrastructure for controlled improvement over time

### Your environment or ours.

Use a split schematic with a shared Ferry-system glyph feeding two bounded deployment zones. The two text columns use the supplied paragraphs without shortening them. The customer-environment path is visually primary; the managed path is secondary but equal in legibility.

> Most Ferry systems are deployed inside the customer’s cloud or approved infrastructure, keeping sensitive data and system access under the customer’s control.

> For organizations that prefer a managed deployment, Ferry can host and operate the system in a secure, isolated environment.

### How we engage

Use a simple editorial two-column composition: copy on one side and a small engineers-with-experts pixel schematic on the other. Do not turn the engagement stages into a second process timeline.

> Ferry engineers work directly with the people who understand the problem best.

> We stay involved through discovery, workflow modernization, deployment, evaluation, and ongoing improvement.

### Closing CTA

Use a restrained end-cap separated by a fine rule. Keep the statement large but below hero scale. The button uses the same compact blue CTA as the opening.

> Start with the work that matters most.

> Bring us a complex workflow, a group of exceptional experts, and an outcome worth building toward.

CTA: `Start a Deployment`

## Visual System

The page must reuse the current Ferry design language:

- near-black/navy page background;
- Orbit blue for CTAs and selected accents;
- warm cream and pale blue sampled from the supplied image;
- Geist Pixel for hero and section headings;
- Google Sans for body copy, navigation, and buttons;
- centered square primary image;
- generous negative space, fine borders, and flat surfaces;
- no solid black header/footer bars;
- no gradients used as decorative effects;
- no glass cards beyond the existing translucent navigation.

## Analog-Game Icon Language

Icons are a hard design constraint, not an optional flourish.

- Build icons as inline SVG or CSS using a visible square grid and `shape-rendering: crispEdges` where appropriate.
- Use stepped corners, block pixels, simple crosshairs, small node clusters, terminal-like frames, and single-pixel connector paths.
- Use a limited palette: off-white, muted blue, Orbit blue, and at most one warm accent sampled from the image.
- Keep icons approximately 28–40 px within 40–48 px containers.
- Prefer silhouette and schematic readability over detail.
- Do not use generic rounded SaaS line icons, glossy 3D symbols, emoji, stock icon libraries, or unrelated decorative illustrations.
- Motion is unnecessary. Hover may shift a pixel accent or border color only; reduced-motion mode removes any transition.

Suggested motifs:

- outcome: target reticle;
- workflow modernization: connected blocks with a routing path;
- platform deployment: stacked context layers;
- expert apprenticeship: two operator profiles with a correction signal;
- improvement: ascending stepped graph with a replay loop;
- context: indexed nodes;
- agents: bounded cursor/worker glyph;
- evaluations: check matrix;
- integrations: ports and connectors;
- review: approve/correct control panel;
- controlled improvement: version ladder with a gate;
- environments: two isolated terminal frames connected to one source.

## Image Asset

- Original source: `u8954488552_satellite_company_launch_equipment_-_make_image_o_075b8062-4153-4ca7-b1fc-bdc255f83ee2_3.png`
- Original dimensions: 2048×2048
- Original SHA-256: `e713d2b9cb1cf7fd335aa795c90ac7128456af865d7d11e2b4611596137a499a`
- Shipped path: `assets/platform/ferry-platform-opening.png`
- Alt text: `A pixel-art satellite rises above an ornate futuristic structure and blue-white landscape beneath a vast moon.`
- Copy the source byte-for-byte; do not recolor, crop, sharpen, or regenerate it.

## Content Contract

- All supplied wording is immutable.
- Implementation may change hierarchy, spacing, grouping, and responsive presentation only.
- Do not rewrite headings, paragraphs, list items, or CTA labels.
- Do not add performance claims, customer claims, metrics, testimonials, evidence-status labels, or technical vendor names.
- Decorative diagrams may use section numbers and existing headings, but may not introduce new marketing assertions.

## Responsive Behavior

### Desktop

- Opening image remains 432×432 px maximum.
- Article sections use a maximum page width near the case-study reader and a bounded copy measure.
- The five-stage workflow uses a horizontal connected rail if every stage remains readable.
- The deployment-includes grid is two columns by three rows or three columns by two rows depending on the final measure.
- Environment and engagement sections use two columns.

### Tablet

- Opening image remains centered and uncropped.
- Workflow may switch to a vertical rail before copy becomes compressed.
- Capability grid remains two columns.
- Environment and engagement sections stack when their copy measure becomes narrow.

### Mobile

- Preserve the existing compact fixed navigation behavior.
- Opening image uses the full content width without cropping.
- Title, introduction, and CTA remain centered.
- Workflow becomes a vertical connected rail.
- Capability grid becomes one column.
- Environment paths and engagement content stack.
- No horizontal scroll, nested scroll region, side drawer, or carousel.

## Accessibility

- The page has one semantic `h1`: `Intelligence built inside your organization.`
- Section headings follow in `h2` order.
- The opening image has meaningful alt text; diagram-only SVGs are `aria-hidden="true"`.
- Text contrast meets WCAG AA against the dark background.
- Both CTAs are keyboard accessible links with visible focus states and the existing booking destination.
- The current navigation exposes the active page with `aria-current="page"`.
- The content remains complete and readable without JavaScript.
- Reduced-motion mode removes hover transitions and any smooth scrolling.

## Technical Architecture

- Preserve the dependency-free static site model.
- Add `ferry-platform.html` as fully rendered static markup.
- Add `ferry-platform.css` for page-specific layout and icons.
- Add `scripts/build-ferry-platform.mjs` so generated markup remains reproducible.
- Add the supplied image under `assets/platform/`.
- Reuse existing fonts, tokens, navigation treatment, logo mark, CTA destination, and footer conventions.
- Update every `Ferry Platform` navigation link to the new page.
- Do not add a framework, CMS, external icon package, analytics dependency, or remote runtime.

## Error and Edge Cases

- Missing image: retain the square frame with a dark fallback and keep all text readable.
- Long copy: allow natural section growth; do not truncate, clamp, or hide prose.
- Narrow viewport: switch diagrams to vertical compositions before they overflow.
- Font failure: use existing system fallbacks without changing hierarchy.
- JavaScript failure: no content or navigation functionality is lost.

## Verification

Implementation is complete when:

1. The supplied image ships locally, byte-for-byte, at 2048×2048.
2. The page opens with the centered square image before the `h1`.
3. Every supplied heading, paragraph, list item, and CTA label appears verbatim.
4. Both `Start a Deployment` CTAs use the existing booking destination.
5. Landing, case-study, and platform navigation link correctly among all pages.
6. The platform navigation item is current on the platform page.
7. The five-step sequence and six deployment capabilities render with analog-game-style local icons.
8. The environment diagram visibly communicates customer-hosted and Ferry-managed paths without adding claims.
9. The page introduces no horizontal overflow or console errors at 1440×900, 1024×768, and 390×844.
10. Keyboard focus is visible and heading order is valid.
11. The complete page remains usable without JavaScript.
12. Automated tests cover copy immutability, image integrity, navigation, CTA destinations, responsive rules, and the absence of external icon dependencies.

## Out of Scope

- rewriting or shortening supplied copy;
- additional platform claims, metrics, or testimonials;
- product screenshots or interactive demos;
- animated architecture diagrams;
- video backgrounds;
- generic stock icons or external icon libraries;
- CMS, search, filters, tabs, carousels, modals, or accordions;
- changes to the landing-page hero or case-study content.
