# Ferry Platform Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a dedicated Ferry Platform page using the supplied copy and opening image, with subtle analog-game-style diagrams that match the landing and case-study pages.

**Architecture:** Keep the site dependency-free and static. Store immutable page copy in a focused data module, generate complete static HTML through a small build script, style the page in a dedicated stylesheet, and update the existing landing/case-study generators so all navigation points to the new page. No client-side state or JavaScript is required for the platform page.

**Tech Stack:** Static HTML, CSS, Node.js ES modules, inline SVG, Node's built-in test runner.

## Global Constraints

- Preserve every supplied heading, paragraph, bullet, and `Start a Deployment` CTA label verbatim.
- Copy the supplied 2048×2048 PNG byte-for-byte to `assets/platform/ferry-platform-opening.png`.
- Use Geist Pixel headings, Google Sans body copy, Orbit blue accents, and the existing fixed translucent navigation.
- Icons must use analog-game-style stepped geometry and local inline SVG/CSS; no external icon package.
- Opening order is navigation, centered uncropped square image, `h1`, introduction, and CTA.
- No separate `Ferry Platform` page label or title appears above the opening image.
- Both deployment CTAs use `https://calendar.app.google/t69X39w3jLLAKn3L7`.
- Do not add a framework, CMS, remote runtime, carousel, modal, animation, or decorative gradient.
- The page must remain complete and readable without JavaScript.

---

### Task 1: Immutable content, image, and static page builder

**Files:**
- Create: `ferry-platform-content.mjs`
- Create: `scripts/build-ferry-platform.mjs`
- Create: `tests/ferry-platform.test.mjs`
- Create: `assets/platform/ferry-platform-opening.png`
- Create: `ferry-platform.html`

**Interfaces:**
- Produces: `BOOKING_URL: string` and `PLATFORM_PAGE: object` from `ferry-platform-content.mjs`.
- Produces: `renderFerryPlatformPage(page = PLATFORM_PAGE): string` from `scripts/build-ferry-platform.mjs`.
- Produces: a complete static `ferry-platform.html` containing all supplied content in semantic order.

- [ ] **Step 1: Write the failing content and asset tests**

Create `tests/ferry-platform.test.mjs` with the immutable-copy, source-image, and opening-order contract:

```js
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import test from 'node:test';

import { BOOKING_URL, PLATFORM_PAGE } from '../ferry-platform-content.mjs';

const sha256 = (buffer) => createHash('sha256').update(buffer).digest('hex');

test('stores the supplied platform copy verbatim', () => {
  assert.equal(PLATFORM_PAGE.title, 'Intelligence built inside your organization.');
  assert.equal(
    PLATFORM_PAGE.intro,
    'Ferry works with your experts to modernize critical workflows and deploy intelligent systems built around your knowledge, context, and judgment.'
  );
  assert.equal(PLATFORM_PAGE.howWeWork.length, 5);
  assert.equal(PLATFORM_PAGE.includes.length, 6);
  assert.equal(PLATFORM_PAGE.ctaLabel, 'Start a Deployment');
  assert.equal(BOOKING_URL, 'https://calendar.app.google/t69X39w3jLLAKn3L7');
});

test('ships the supplied platform image byte-for-byte', () => {
  const image = readFileSync(
    new URL('../assets/platform/ferry-platform-opening.png', import.meta.url)
  );
  assert.equal(image.toString('ascii', 1, 4), 'PNG');
  assert.equal(image.readUInt32BE(16), 2048);
  assert.equal(image.readUInt32BE(20), 2048);
  assert.equal(
    sha256(image),
    'e713d2b9cb1cf7fd335aa795c90ac7128456af865d7d11e2b4611596137a499a'
  );
});

test('renders the image before the single page heading', () => {
  const html = readFileSync(new URL('../ferry-platform.html', import.meta.url), 'utf8');
  assert.equal((html.match(/<h1/g) ?? []).length, 1);
  assert.ok(html.indexOf('ferry-platform-opening.png') < html.indexOf('<h1'));
  assert.doesNotMatch(html, />Ferry Platform<\/h1>/);
  assert.equal((html.match(/>Start a Deployment<\/a>/g) ?? []).length, 2);
});
```

- [ ] **Step 2: Run the tests and verify the expected failure**

Run:

```bash
node --test tests/ferry-platform.test.mjs
```

Expected: FAIL because `ferry-platform-content.mjs` and the platform asset do not exist.

- [ ] **Step 3: Create the immutable content module**

Create `ferry-platform-content.mjs` with the exact user-supplied data:

```js
export const BOOKING_URL = 'https://calendar.app.google/t69X39w3jLLAKn3L7';

export const PLATFORM_PAGE = {
  title: 'Intelligence built inside your organization.',
  intro: 'Ferry works with your experts to modernize critical workflows and deploy intelligent systems built around your knowledge, context, and judgment.',
  ctaLabel: 'Start a Deployment',
  customByDesign: [
    'Ferry does not sell a generic agent or ask your team to adapt to a predefined product.',
    'We begin with a complex, economically valuable workflow and build the system around how your organization actually operates.'
  ],
  howWeWork: [
    ['Choose the outcome', 'We identify a critical workflow where better use of expert knowledge can create meaningful operational or economic value.', 'outcome'],
    ['Modernize the workflow', 'We redesign the process, structure fragmented information, and connect the tools and systems your team already uses.', 'workflow'],
    ['Deploy the Ferry platform', 'We deploy a context layer, agents, custom evaluations, and learning-loop infrastructure tuned to your organization.', 'platform'],
    ['Apprentice to your experts', 'The system works alongside your best operators. Their decisions, corrections, and judgment shape how it performs.', 'experts'],
    ['Improve and expand', 'Once the first workflow performs reliably, we improve it continuously and expand the platform into adjacent work.', 'improve']
  ],
  includes: [
    ['A context layer built around your organization’s knowledge', 'context'],
    ['Agents designed for your highest-value workflows', 'agents'],
    ['Custom evaluations tuned to your standards and expert judgment', 'evaluations'],
    ['Integrations with your existing software and data', 'integrations'],
    ['Interfaces for expert review, correction, and approval', 'review'],
    ['Infrastructure for controlled improvement over time', 'controlled']
  ],
  environments: [
    'Most Ferry systems are deployed inside the customer’s cloud or approved infrastructure, keeping sensitive data and system access under the customer’s control.',
    'For organizations that prefer a managed deployment, Ferry can host and operate the system in a secure, isolated environment.'
  ],
  engagement: [
    'Ferry engineers work directly with the people who understand the problem best.',
    'We stay involved through discovery, workflow modernization, deployment, evaluation, and ongoing improvement.'
  ],
  closingTitle: 'Start with the work that matters most.',
  closingBody: 'Bring us a complex workflow, a group of exceptional experts, and an outcome worth building toward.'
};
```

- [ ] **Step 4: Copy the supplied image byte-for-byte**

Run:

```bash
mkdir -p assets/platform
cp '/Users/karn/Downloads/u8954488552_satellite_company_launch_equipment_-_make_image_o_075b8062-4153-4ca7-b1fc-bdc255f83ee2_3.png' assets/platform/ferry-platform-opening.png
```

Expected: `shasum -a 256 assets/platform/ferry-platform-opening.png` begins with `e713d2b9...`.

- [ ] **Step 5: Create the minimal static builder**

Create `scripts/build-ferry-platform.mjs`. It must import `BOOKING_URL` and `PLATFORM_PAGE`, escape text with a focused `escapeHtml()` helper, render semantic sections, and export the renderer:

```js
import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { BOOKING_URL, PLATFORM_PAGE } from '../ferry-platform-content.mjs';

const escapeHtml = (value) => value
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;');

const paragraphs = (items) => items.map((item) => `<p>${escapeHtml(item)}</p>`).join('');

export function renderFerryPlatformPage(page = PLATFORM_PAGE) {
  const steps = page.howWeWork.map(([title, body, icon], index) => `
    <article class="process-step">
      <span class="step-number">${String(index + 1).padStart(2, '0')}</span>
      <span class="pixel-icon pixel-icon-${icon}" aria-hidden="true"></span>
      <h3>${escapeHtml(title)}</h3>
      <p>${escapeHtml(body)}</p>
    </article>`).join('');
  const includes = page.includes.map(([copy, icon]) => `
    <li><span class="pixel-icon pixel-icon-${icon}" aria-hidden="true"></span><span>${escapeHtml(copy)}</span></li>`).join('');

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Ferry Platform — Ferry Labs</title>
  <meta name="description" content="${escapeHtml(page.intro)}">
  <link rel="icon" href="favicon.svg" type="image/svg+xml">
  <link rel="stylesheet" href="ferry-platform.css">
</head>
<body>
  <header class="site-header">
    <a class="brand" href="index.html" aria-label="Ferry Labs home"><img src="ferry-logo-mark.png" alt=""></a>
    <nav class="site-nav" aria-label="Primary">
      <a class="header-link" href="case-studies.html">Case Studies</a>
      <a class="header-link" href="ferry-platform.html" aria-current="page">Ferry Platform</a>
      <a class="nav-cta" href="${BOOKING_URL}" target="_blank" rel="noopener noreferrer"><span class="nav-cta-label">Book a consultation</span><span class="nav-cta-short">Book a call</span><span aria-hidden="true">↗</span></a>
    </nav>
  </header>
  <main class="platform-page">
    <section class="platform-hero">
      <img class="platform-hero-image" src="assets/platform/ferry-platform-opening.png" alt="A pixel-art satellite rises above an ornate futuristic structure and blue-white landscape beneath a vast moon.">
      <h1>${escapeHtml(page.title)}</h1>
      <p>${escapeHtml(page.intro)}</p>
      <a class="primary-cta" href="${BOOKING_URL}" target="_blank" rel="noopener noreferrer">${escapeHtml(page.ctaLabel)} <span aria-hidden="true">↗</span></a>
    </section>
    <section class="editorial-section custom-section"><div><h2>Custom by design</h2>${paragraphs(page.customByDesign)}</div><div class="custom-schematic" aria-hidden="true"></div></section>
    <section class="editorial-section process-section"><h2>How we work</h2><div class="process-rail">${steps}</div></section>
    <section class="editorial-section includes-section"><h2>What every deployment includes</h2><ul class="includes-grid">${includes}</ul></section>
    <section class="editorial-section environment-section"><h2>Your environment or ours.</h2><div class="environment-diagram" aria-hidden="true"></div><div class="environment-copy">${paragraphs(page.environments)}</div></section>
    <section class="editorial-section engagement-section"><div><h2>How we engage</h2>${paragraphs(page.engagement)}</div><div class="engagement-schematic" aria-hidden="true"></div></section>
    <section class="closing-cta"><h2>${escapeHtml(page.closingTitle)}</h2><p>${escapeHtml(page.closingBody)}</p><a class="primary-cta" href="${BOOKING_URL}" target="_blank" rel="noopener noreferrer">${escapeHtml(page.ctaLabel)} <span aria-hidden="true">↗</span></a></section>
  </main>
  <footer class="site-footer">© ${new Date().getFullYear()} Ferry Labs, San Francisco</footer>
</body>
</html>`;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  writeFileSync(new URL('../ferry-platform.html', import.meta.url), renderFerryPlatformPage());
}
```

- [ ] **Step 6: Generate the page and run the task tests**

Run:

```bash
node scripts/build-ferry-platform.mjs
node --test tests/ferry-platform.test.mjs
```

Expected: all Task 1 tests PASS.

- [ ] **Step 7: Commit the content and static page**

```bash
git add ferry-platform-content.mjs scripts/build-ferry-platform.mjs tests/ferry-platform.test.mjs assets/platform/ferry-platform-opening.png ferry-platform.html
git commit -m "add Ferry Platform page content"
```

---

### Task 2: Analog-game visual system and subtle diagrams

**Files:**
- Create: `ferry-platform.css`
- Modify: `scripts/build-ferry-platform.mjs`
- Modify: `ferry-platform.html`
- Modify: `tests/ferry-platform.test.mjs`

**Interfaces:**
- Consumes: semantic classes rendered by `renderFerryPlatformPage()`.
- Produces: a responsive dark editorial page, pixel-icon SVG markup, and local CSS-only schematics.

- [ ] **Step 1: Add failing visual-system tests**

Append to `tests/ferry-platform.test.mjs`:

```js
const html = readFileSync(new URL('../ferry-platform.html', import.meta.url), 'utf8');
const css = readFileSync(new URL('../ferry-platform.css', import.meta.url), 'utf8');

test('uses the Ferry visual system and analog-game icon language', () => {
  assert.match(css, /@font-face[\s\S]*Geist Pixel/);
  assert.match(css, /@font-face[\s\S]*Google Sans/);
  assert.match(css, /--orbit:\s*#2a5bff/i);
  assert.match(html, /shape-rendering="crispEdges"/);
  assert.ok((html.match(/class="pixel-icon/g) ?? []).length >= 11);
  assert.doesNotMatch(html, /unpkg|jsdelivr|fontawesome|lucide/i);
});

test('keeps the opening image square, centered, and uncropped', () => {
  assert.match(css, /\.platform-hero-image\s*\{[\s\S]*width:\s*min\(100%,\s*432px\)/);
  assert.match(css, /\.platform-hero-image\s*\{[\s\S]*object-fit:\s*contain/);
  assert.match(css, /\.platform-hero-image\s*\{[\s\S]*margin:\s*0 auto/);
});

test('defines responsive workflow, capability, and deployment diagrams', () => {
  assert.match(css, /\.process-rail\s*\{[\s\S]*grid-template-columns:/);
  assert.match(css, /\.includes-grid\s*\{[\s\S]*grid-template-columns:/);
  assert.match(css, /\.environment-copy\s*\{[\s\S]*grid-template-columns:/);
  assert.match(css, /@media \(max-width:\s*760px\)/);
  assert.match(css, /@media \(prefers-reduced-motion:\s*reduce\)/);
});
```

- [ ] **Step 2: Run tests and verify the visual tests fail**

Run:

```bash
node --test tests/ferry-platform.test.mjs
```

Expected: FAIL because `ferry-platform.css` and crisp-edge icon markup do not exist.

- [ ] **Step 3: Add a focused pixel-icon renderer**

In `scripts/build-ferry-platform.mjs`, replace empty icon spans with `pixelIcon(name)` output. The helper must render local inline SVG using an exact icon class and `shape-rendering="crispEdges"`:

```js
const iconPaths = {
  outcome: '<path d="M8 4h8v2h4v8h-4v2H8v-2H4V6h4zM10 8h4v4h-4z"/>',
  workflow: '<path d="M3 5h6v5H3zM15 5h6v5h-6zM9 16h6v5H9zM9 7h6v2H9zM11 9h2v7h-2z"/>',
  platform: '<path d="M4 5h16v4H4zM6 11h12v4H6zM8 17h8v4H8z"/>',
  experts: '<path d="M4 5h6v6H4zM14 5h6v6h-6zM2 14h10v6H2zM12 14h10v6H12z"/>',
  improve: '<path d="M3 18h4v3H3zM9 14h4v7H9zM15 9h4v12h-4zM4 6h2v2H4zM6 4h10v2H6zM16 6h2v2h-2z"/>',
  context: '<path d="M4 4h5v5H4zM15 4h5v5h-5zM9 15h6v6H9zM9 6h6v2H9zM11 8h2v7h-2z"/>',
  agents: '<path d="M4 4h16v16H4zM7 8h2v2H7zM15 8h2v2h-2zM8 14h8v2H8z"/>',
  evaluations: '<path d="M4 4h16v16H4zM7 8h2v2H7zM11 8h6v2h-6zM7 13h2v2H7zM11 13h6v2h-6z"/>',
  integrations: '<path d="M3 7h7v4H3zM14 7h7v4h-7zM8 15h8v4H8zM10 8h4v2h-4zM11 10h2v5h-2z"/>',
  review: '<path d="M4 4h16v16H4zM7 12l3 3 7-7 2 2-9 9-5-5z"/>',
  controlled: '<path d="M5 18h4v3H5zM10 14h4v7h-4zM15 10h4v11h-4zM4 5h16v3H4z"/>'
};

const pixelIcon = (name) => `<svg class="pixel-icon pixel-icon-${name}" viewBox="0 0 24 24" aria-hidden="true" shape-rendering="crispEdges">${iconPaths[name]}</svg>`;
```

Render the custom, environment, and engagement schematics from similarly simple local SVG rectangles and stepped paths. Do not add labels or claims.

- [ ] **Step 4: Create the complete page stylesheet**

Create `ferry-platform.css` with:

- local `@font-face` rules for `Geist Pixel` and `Google Sans`;
- existing tokens (`--bg: #070a12`, `--panel: #0d1220`, `--white`, `--muted`, `--line`, `--orbit: #2a5bff`);
- the current 64 px fixed translucent navigation and 40×40 logo tile;
- `.platform-page` with top padding that clears the fixed navigation;
- `.platform-hero-image { width: min(100%, 432px); aspect-ratio: 1; object-fit: contain; margin: 0 auto; }`;
- centered bounded hero copy and compact CTA;
- editorial section borders and readable copy measure;
- a five-column `.process-rail` with stepped connector pseudo-elements;
- a responsive `.includes-grid` with two or three columns and flat bordered cells;
- two-column `.environment-copy` and `.engagement-section`;
- pixel SVG fill/stroke treatment using off-white and Orbit blue;
- `@media (max-width: 1000px)` to convert the workflow to a vertical rail before text compresses;
- `@media (max-width: 760px)` to stack grids, preserve the compact navigation, and remove horizontal overflow;
- `@media (prefers-reduced-motion: reduce)` to disable transitions and smooth scrolling.

The CSS must not use external URLs, decorative gradients, large shadows, or generic rounded white cards.

- [ ] **Step 5: Regenerate and run the visual tests**

Run:

```bash
node scripts/build-ferry-platform.mjs
node --test tests/ferry-platform.test.mjs
```

Expected: all platform tests PASS.

- [ ] **Step 6: Commit the visual system**

```bash
git add ferry-platform.css ferry-platform.html scripts/build-ferry-platform.mjs tests/ferry-platform.test.mjs
git commit -m "style Ferry Platform editorial page"
```

---

### Task 3: Cross-page Ferry Platform navigation

**Files:**
- Modify: `scripts/add-case-studies-nav.mjs`
- Modify: `scripts/build-case-studies.mjs`
- Modify: `index.html`
- Modify: `case-studies.html`
- Modify: `tests/hero-cover.test.mjs`
- Modify: `tests/case-studies.test.mjs`
- Modify: `tests/ferry-platform.test.mjs`

**Interfaces:**
- Consumes: `ferry-platform.html` from Task 1.
- Produces: consistent links to `ferry-platform.html` from every page.

- [ ] **Step 1: Write failing cross-page navigation tests**

Update the landing assertion in `tests/hero-cover.test.mjs`:

```js
assert.match(landingTemplate, /label:\s*'Ferry Platform',[\s\S]*href:\s*'ferry-platform\.html'/);
assert.doesNotMatch(landingTemplate, /case-studies\.html#selected-case-study/);
```

Update `tests/case-studies.test.mjs`:

```js
assert.match(html, /class="header-link" href="ferry-platform\.html">Ferry Platform<\/a>/);
```

Append to `tests/ferry-platform.test.mjs`:

```js
test('marks Ferry Platform as the current navigation destination', () => {
  assert.match(html, /href="ferry-platform\.html" aria-current="page">Ferry Platform<\/a>/);
  assert.match(html, /href="case-studies\.html">Case Studies<\/a>/);
});
```

- [ ] **Step 2: Run tests and verify stale links fail**

Run:

```bash
node --test tests/hero-cover.test.mjs tests/case-studies.test.mjs tests/ferry-platform.test.mjs
```

Expected: FAIL because landing and case studies still point Ferry Platform to the case-study reader.

- [ ] **Step 3: Update the two existing generators**

In `scripts/add-case-studies-nav.mjs`, change:

```js
{ label: 'Ferry Platform', href: 'case-studies.html#selected-case-study' }
```

to:

```js
{ label: 'Ferry Platform', href: 'ferry-platform.html' }
```

In `scripts/build-case-studies.mjs`, change the Ferry Platform anchor to:

```html
<a class="header-link" href="ferry-platform.html">Ferry Platform</a>
```

- [ ] **Step 4: Regenerate all static pages and run navigation tests**

Run:

```bash
node scripts/add-case-studies-nav.mjs
node scripts/build-case-studies.mjs
node scripts/build-ferry-platform.mjs
node --test tests/hero-cover.test.mjs tests/case-studies.test.mjs tests/ferry-platform.test.mjs
```

Expected: all navigation and platform tests PASS.

- [ ] **Step 5: Commit cross-page navigation**

```bash
git add index.html case-studies.html scripts/add-case-studies-nav.mjs scripts/build-case-studies.mjs tests/hero-cover.test.mjs tests/case-studies.test.mjs tests/ferry-platform.test.mjs
git commit -m "link site navigation to Ferry Platform"
```

---

### Task 4: Accessibility, responsive verification, and final QA

**Files:**
- Modify: `tests/ferry-platform.test.mjs`
- Modify if verification finds a defect: `ferry-platform.css`, `scripts/build-ferry-platform.mjs`, `ferry-platform.html`

**Interfaces:**
- Consumes: the complete static platform page and shared site navigation.
- Produces: automated accessibility guards and visual evidence at desktop, tablet, and mobile sizes.

- [ ] **Step 1: Add final semantic and dependency tests**

Append:

```js
test('is semantic, dependency-free, and readable without JavaScript', () => {
  assert.equal((html.match(/<h1/g) ?? []).length, 1);
  assert.equal((html.match(/<h2/g) ?? []).length, 6);
  assert.doesNotMatch(html, /<script/i);
  assert.doesNotMatch(html, /https?:\/\/(?!calendar\.app\.google)/i);
  assert.match(html, /aria-current="page"/);
  assert.match(html, /alt="A pixel-art satellite rises/);
});
```

- [ ] **Step 2: Run the complete automated suite**

Run:

```bash
node --test tests/hero-cover.test.mjs tests/case-studies.test.mjs tests/case-studies-state.test.mjs tests/ferry-platform.test.mjs
git diff --check
```

Expected: all tests PASS and `git diff --check` emits no output.

- [ ] **Step 3: Verify the page in the local browser at desktop**

Open `http://127.0.0.1:4174/ferry-platform.html` at 1440×900 and verify:

- nav is fixed and translucent;
- image is centered, square, 432 px maximum, and uncropped;
- no label appears above the image;
- title, intro, and opening CTA are centered;
- process rail and capability grid are legible;
- icons read as crisp analog-game schematics;
- no console errors or horizontal overflow.

- [ ] **Step 4: Verify tablet and mobile layouts**

At 1024×768 and 390×844 verify:

- workflow converts before text becomes compressed;
- capability grid and environment paths stack as specified;
- compact nav fits without overflow;
- both CTAs are visible and usable;
- there is no horizontal page scroll.

- [ ] **Step 5: Verify links and keyboard focus**

Use the visible navigation to move between landing, case studies, and platform. Tab through the platform page and confirm the logo, navigation links, opening CTA, and closing CTA all receive visible focus.

- [ ] **Step 6: Run fresh final verification and commit any QA fixes**

Run:

```bash
node --test tests/hero-cover.test.mjs tests/case-studies.test.mjs tests/case-studies-state.test.mjs tests/ferry-platform.test.mjs
git diff --check
git status --short
```

Expected: all tests PASS, diff check is clean, and only intentional QA changes remain. If QA required edits, commit them with:

```bash
git add ferry-platform.css ferry-platform.html scripts/build-ferry-platform.mjs tests/ferry-platform.test.mjs
git commit -m "polish Ferry Platform responsive layout"
```
