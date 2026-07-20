# Ferry Labs Case Studies Page Design

**Status:** Design direction selected; awaiting final case-study copy and images  
**Date:** 2026-07-19

## Goal

Create a dedicated Ferry Labs case-studies page that turns two customer stories into visual, credible proof of the company’s ability to build intelligent systems for the physical economy. The page should feel cinematic and editorial, remain consistent with the existing landing page, and end each story with the existing consultation CTA.

The page is a credibility and conversion surface, not a portfolio archive. It should make the operational problem, Ferry-built system, and verified outcome easy to understand without overloading the reader with decoration.

## Selected Interaction Model

Use a gallery-to-master-detail reader on a dedicated `case-studies.html` page.

1. The top of the page introduces “Selected work” and displays two large visual cards.
2. Selecting a card updates the URL hash to the case-study slug, selects that story, and moves focus to the reader.
3. The reader displays the selected story in a dominant article column.
4. A compact left rail keeps both case studies visible and lets the reader switch without leaving the page.
5. On mobile, the rail becomes a horizontal two-item switcher above the article.
6. Each hash is a stable deep link, so a story can be shared and browser Back/Forward restores the correct selection.

This hybrid is preferred over separate detail pages because it keeps two early stories connected and easy to compare. It is preferred over fully bespoke cinematic story pages because it is easier to maintain, more consistent, and less likely to overpower the evidence.

## Information Architecture

### Shared navigation

- Keep the current Ferry Labs logo and Google Sans wordmark.
- Add a `Case Studies` link on the landing page and case-studies page.
- Keep navigation visually overlaid and transparent; do not introduce a separate black header strip.
- Keep the current copyright treatment as page-level chrome without a solid footer bar.

### Case-studies introduction

- Eyebrow: `Selected work`.
- Short headline that frames the stories around intelligent systems for the physical future.
- One concise paragraph explaining that the stories cover the operational problem, the system Ferry built, and the resulting change.
- No generic customer-logo wall or unsupported traction claims.

### Visual cards

Each card contains:

- the supplied case-study image as the dominant visual;
- a two-digit sequence number;
- title;
- industry or operating domain;
- one concise, outcome-led summary;
- `Read case study` affordance;
- selected, hover, and keyboard-focus states.

Cards use subtle image scale, border, and arrow movement. They do not use glassmorphism, rotating effects, autoplay animation, or dense badges.

### Selected-story reader

The reader uses this order:

1. **Hero image** — supplied image with meaningful alt text and a restrained navy gradient for text contrast.
2. **Story header** — industry, engagement type, title, and concise summary.
3. **Impact row** — zero to three verified metrics or outcome statements. Omit this module if the supplied content has no defensible quantified results.
4. **The challenge** — the high-value operational problem and why it mattered.
5. **What Ferry built** — the system, agents, workflow, or knowledge layer created.
6. **How it works** — a restrained visual explanation of the workflow using three to five labeled steps.
7. **The result** — verified outcomes, operator change, and business significance.
8. **Optional evidence quote** — only when the user supplies an attributable, approved quotation.
9. **CTA** — a visual end-cap linking to the existing consultation booking destination.

## Visual System

The page reuses the landing page’s design language:

- near-black/navy background;
- electric blue accent;
- warm tones drawn from the supplied images;
- Geist Pixel for high-impact display titles;
- Google Sans for navigation, body copy, metadata, and CTAs;
- generous left alignment and restrained uppercase metadata;
- fine low-contrast borders instead of elevated white cards;
- the current Ferry Labs logo/wordmark and transparent page chrome.

The gallery should feel visual before it feels informational. The reader should reverse that priority: evidence and legibility come first, with imagery and diagrams supporting the narrative.

## Visual Enhancements

Visuals are limited to elements that clarify the case study:

- one supplied hero image per story;
- up to three impact tiles when claims are verified;
- one compact workflow diagram with three to five steps;
- a small inline SVG icon set for challenge, system, workflow, evidence, and outcome concepts;
- optional pull quote or evidence callout;
- subtle section numbering and rules to create editorial rhythm.

Icons use a consistent 1.5 px line weight, square or circular 32–40 px containers, and the existing blue accent. Do not use a different icon for every paragraph. Decorative AI-generated imagery is out of scope unless the user explicitly requests it after supplying the primary case-study images.

## Content Contract

The implementation stores both stories in one explicit data collection with this shape:

```js
{
  slug: string,
  number: '01' | '02',
  title: string,
  summary: string,
  industry: string,
  engagementType: string,
  heroImage: string,
  heroAlt: string,
  challenge: {
    heading: string,
    paragraphs: string[]
  },
  system: {
    heading: string,
    paragraphs: string[]
  },
  workflow: Array<{
    icon: 'source' | 'brain' | 'workflow' | 'review' | 'outcome',
    title: string,
    body: string
  }>,
  outcomes: Array<{
    value: string,
    label: string,
    evidenceStatus: 'verified' | 'reported' | 'qualitative'
  }>,
  result: {
    heading: string,
    paragraphs: string[]
  },
  quote: null | {
    text: string,
    attribution: string
  },
  cta: {
    eyebrow: string,
    title: string,
    label: string,
    href: string
  }
}
```

The `evidenceStatus` field is editorial metadata and is not shown as a badge. It prevents reported or qualitative claims from being styled as measured results. Numeric claims require verified source support. Empty optional modules are omitted rather than filled with generic copy.

## Content Intake

For each of the two stories, the user will supply:

- final or rough title;
- customer or anonymized customer label;
- industry and engagement type;
- one-sentence summary;
- challenge narrative;
- what Ferry built;
- three to five workflow steps;
- outcomes, with a note identifying which numbers are verified;
- optional approved quotation and attribution;
- hero image and meaningful image description;
- any confidentiality limits or language that must not appear;
- preferred CTA variation, if different from the existing consultation CTA.

Ferry Labs may strengthen structure, headings, scannability, diagrams, and iconography, but must not invent customers, metrics, testimonials, technical claims, or business outcomes.

## Page State and Data Flow

- With no hash, the page shows both cards and selects the first story in the reader without forcing scroll.
- Selecting a card or rail item sets `#<slug>` using browser history and renders the matching story.
- A direct hash selects the matching story at load.
- An unknown hash falls back to the first story and replaces the invalid hash without adding a history entry.
- `popstate` and `hashchange` restore the selected story.
- Card selection moves keyboard focus to the story heading. Smooth scrolling is disabled when reduced motion is requested.
- No network request, CMS, client storage, analytics dependency, or third-party runtime is required for the first two stories.

## Responsive Behavior

### Desktop

- Two equal-width cinematic cards.
- Reader uses a compact left rail and a wide article column.
- Impact outcomes display in a maximum three-column row.
- Workflow steps use a horizontal sequence when there are three or four steps and a compact grid when there are five.

### Tablet

- Cards remain two-up while space permits, then stack.
- Reader rail narrows before converting to the mobile switcher.
- Article measure remains bounded for comfortable reading.

### Mobile

- Cards stack in sequence.
- The selected-story switcher becomes two horizontal buttons above the article.
- Story image uses a deliberate focal crop supplied per image if needed.
- Impact outcomes stack.
- Workflow becomes a vertical sequence.
- CTA spans the content width.
- No horizontal scroll, side drawer, modal, or nested scroll container is introduced.

## Accessibility

- Cards and rail items are semantic buttons or links with visible focus states.
- Selection uses `aria-current` or an equivalent announced state.
- The selected-story region has a labeled heading and receives focus after user selection.
- Images have case-specific alt text; purely decorative visual lines use `aria-hidden="true"`.
- Text maintains WCAG AA contrast against gradients and images.
- With JavaScript disabled, both visual cards remain visible, the first story remains fully readable, and each card links to its corresponding hash target in the static markup.
- Motion is subtle and removed under `prefers-reduced-motion: reduce`.

## Error and Edge-Case Handling

- Missing image: show the existing navy fallback with the case number and title; preserve readable text.
- Missing optional metrics or quote: omit the complete module.
- Long title: allow natural wrapping without reducing below the defined mobile type scale.
- Unknown hash: select the first story and normalize the URL.
- More than two future stories: keep the data model extensible, but do not build pagination, search, filters, or a CMS now.

## Technical Architecture

- Preserve the dependency-free static hosting model.
- Add a standalone `case-studies.html` page using the same bundled-template pattern as `index.html`.
- Add local case-study images under `assets/case-studies/` with stable, lowercase filenames.
- Keep case-study data, state selection, and rendering in focused functions/components rather than adding all logic to the landing-page `App`.
- Reuse shared visual tokens and fonts rather than importing a new design system.
- Add the homepage navigation link without changing the cinematic hero or booking behavior.

## Verification

Implementation is complete when:

1. Both supplied case studies render from the data collection.
2. Both visual cards are keyboard accessible and select the correct story.
3. URL hashes, direct links, Back, and Forward restore the correct selection.
4. Desktop uses the master-detail rail; mobile uses the compact horizontal switcher.
5. Missing optional metrics, quote, or image do not break layout.
6. All supplied images load locally with meaningful alt text and stable dimensions.
7. The workflow diagram contains only content supplied or approved by the user.
8. The end CTA links to the existing booking destination and is keyboard accessible.
9. Homepage navigation reaches the case-studies page.
10. The page introduces no horizontal overflow or console errors at 1440×900, 1024×768, and 390×844.
11. Reduced-motion mode removes smooth scrolling and image/card motion.
12. The page visually matches the current cinematic landing page without adding solid black navigation or footer bars.

## Out of Scope

- CMS or admin editing;
- filters, search, pagination, tags, or customer-logo directories;
- more than the two supplied case studies;
- video backgrounds inside case studies;
- auto-advancing carousels;
- modals or slide-over drawers;
- invented quantitative outcomes or testimonials;
- redesigning the existing landing-page hero.
