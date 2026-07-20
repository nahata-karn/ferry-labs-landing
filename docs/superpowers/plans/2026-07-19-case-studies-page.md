# Ferry Labs Case Studies Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a dedicated, visual case-studies page containing the two supplied stories, using the approved gallery-to-master-detail interaction while preserving every supplied word exactly.

**Architecture:** Keep the site dependency-free. Store the supplied PNGs as local assets, keep the immutable story copy in a focused ES module, generate semantic static markup for both stories, and add a small progressive-enhancement module for hash-based selection, focus, and Back/Forward behavior. Update the bundled landing-page navigation through a deterministic rewrite script rather than manually editing its 2.5 MB JSON payload.

**Tech Stack:** Static HTML, CSS, vanilla JavaScript ES modules, Node.js built-in filesystem/crypto/test APIs, existing Google Sans and Geist Pixel font files.

## Global Constraints

- Reproduce the supplied copy exactly; do not rewrite, soften, qualify, omit, or add wording.
- Preserve the strings `$4B`, `$2.3B`, `10x`, and `$XXXM` exactly as supplied.
- Use the approved option B: two visual cards opening a same-page master-detail reader with a compact case selector.
- Use the two supplied 2048×2048 PNG files byte-for-byte; do not recolor, regenerate, crop destructively, or place text inside the image files.
- Keep the existing near-black/navy, electric-blue, warm-gold, Geist Pixel, Google Sans, transparent-header, and overlaid-copyright design language.
- Add only restrained inline line icons and one workflow visual per case study; no carousel, modal, video, parallax, or decorative animation.
- Keep the current consultation URL: `https://calendar.app.google/t69X39w3jLLAKn3L7`.
- Preserve the landing-page cinematic hero, logo lockup, copy, video, CTA, and viewport fit.
- Support keyboard selection, deep links, Back/Forward, reduced motion, meaningful image alt text, and no horizontal overflow.
- Add no packages, remote assets, CMS, analytics dependency, or runtime fetch.

---

## File Structure

- Create `assets/case-studies/transmission-infrastructure.png` — exact first supplied image.
- Create `assets/case-studies/spacecraft-engineering.png` — exact second supplied image.
- Create `case-studies-content.mjs` — immutable copy and display metadata for both stories.
- Create `scripts/build-case-studies.mjs` — deterministic semantic-page generator.
- Create `case-studies.html` — generated static case-studies page.
- Create `case-studies.css` — visual system, cards, reader, icons, and responsive behavior.
- Create `case-studies-state.mjs` — pure hash/selection helpers.
- Create `case-studies.js` — progressive enhancement for selection, history, focus, and scroll.
- Create `scripts/add-case-studies-nav.mjs` — deterministic landing-page navigation patch.
- Create `tests/case-studies.test.mjs` — content, assets, markup, accessibility, and responsive contract.
- Create `tests/case-studies-state.test.mjs` — pure interaction-state tests.
- Modify `index.html` — add the `Case Studies` navigation link through the rewrite script.

## Interfaces

```js
// case-studies-content.mjs
export const BOOKING_URL: string;
export const CASE_STUDIES: CaseStudy[];

// case-studies-state.mjs
export function normalizeSlug(hash: string, validSlugs: string[]): string;
export function hashFor(slug: string): string;

// scripts/build-case-studies.mjs
export function renderCaseStudiesPage(studies: CaseStudy[]): string;
```

`CaseStudy` is an internal JavaScript object with `slug`, `number`, `title`, `company`, `problem`, `platform`, `impact`, `workflow`, `image`, and `imageAlt` fields. All prose-bearing values come directly from the screenshots.

---

### Task 1: Lock the supplied content and image assets

**Files:**
- Create: `assets/case-studies/transmission-infrastructure.png`
- Create: `assets/case-studies/spacecraft-engineering.png`
- Create: `case-studies-content.mjs`
- Create: `tests/case-studies.test.mjs`

**Interfaces:**
- Consumes: the four supplied files at their exact local paths.
- Produces: `CASE_STUDIES`, `BOOKING_URL`, two stable local image paths, and regression tests that prevent copy drift.

- [ ] **Step 1: Write the failing content and asset tests**

Create `tests/case-studies.test.mjs`:

```js
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import test from 'node:test';

import { BOOKING_URL, CASE_STUDIES } from '../case-studies-content.mjs';

const sha256 = (buffer) => createHash('sha256').update(buffer).digest('hex');

test('ships exactly two immutable case studies', () => {
  assert.equal(CASE_STUDIES.length, 2);
  assert.equal(
    CASE_STUDIES[0].title,
    'Scaling a $4B project portfolio without scaling senior headcount.'
  );
  assert.equal(
    CASE_STUDIES[1].title,
    'Making spacecraft engineering move at production speed.'
  );
  assert.match(CASE_STUDIES[0].impact[0], /^10x less senior operator time per bid,/);
  assert.match(CASE_STUDIES[0].impact[1], /^\$XXXM in estimated additional revenue/);
  assert.match(CASE_STUDIES[1].company[0], /^A \$2\.3B satellite-platform manufacturer/);
});

test('keeps the existing consultation destination', () => {
  assert.equal(
    BOOKING_URL,
    'https://calendar.app.google/t69X39w3jLLAKn3L7'
  );
});

test('ships both supplied 2048px PNGs byte-for-byte', () => {
  const transmission = readFileSync(
    new URL('../assets/case-studies/transmission-infrastructure.png', import.meta.url)
  );
  const spacecraft = readFileSync(
    new URL('../assets/case-studies/spacecraft-engineering.png', import.meta.url)
  );

  assert.equal(transmission.toString('ascii', 1, 4), 'PNG');
  assert.equal(spacecraft.toString('ascii', 1, 4), 'PNG');
  assert.equal(transmission.readUInt32BE(16), 2048);
  assert.equal(transmission.readUInt32BE(20), 2048);
  assert.equal(spacecraft.readUInt32BE(16), 2048);
  assert.equal(spacecraft.readUInt32BE(20), 2048);
  assert.equal(
    sha256(transmission),
    '2a179d553a265d15611d499ebdf4b4a19c8bac206d614e8bd05996915b1d1ecc'
  );
  assert.equal(
    sha256(spacecraft),
    'fcd79c77a9def25567a2610be4299f7bfee6254599dd942be3f096d8d4f418e7'
  );
});
```

- [ ] **Step 2: Run the tests and verify the intended RED state**

Run:

```bash
node --test tests/case-studies.test.mjs
```

Expected: FAIL with `ERR_MODULE_NOT_FOUND` for `case-studies-content.mjs` and missing asset errors.

- [ ] **Step 3: Copy the supplied image bytes to stable production paths**

Run:

```bash
mkdir -p assets/case-studies
cp '/Users/karn/Downloads/u8954488552_energy_transmission_infrastructure_-_optimistic_-_c7de3e84-4bac-49e0-a5fe-1eaeb1cdafff_3.png' assets/case-studies/transmission-infrastructure.png
cp '/Users/karn/Downloads/u8954488552_satellite_company_launch_equipment_-_make_image_o_075b8062-4153-4ca7-b1fc-bdc255f83ee2_1.png' assets/case-studies/spacecraft-engineering.png
```

Expected: both destination files exist and retain the hashes asserted above.

- [ ] **Step 4: Create the immutable content module**

Create `case-studies-content.mjs`:

```js
export const BOOKING_URL =
  'https://calendar.app.google/t69X39w3jLLAKn3L7';

export const CASE_STUDIES = [
  {
    slug: 'energy-transmission',
    number: '01',
    title: 'Scaling a $4B project portfolio without scaling senior headcount.',
    image: 'assets/case-studies/transmission-infrastructure.png',
    imageAlt:
      'A pixel-art transmission network stretches across a mountainous blue landscape.',
    company: [
      'An energy transmission developer operating across six TSOs, with a lean team of senior experts responsible for winning and delivering complex infrastructure projects.'
    ],
    problem: {
      paragraphs: [
        'Winning a major transmission project requires the company to bring together engineering, routing, cost, schedule, permitting, commercial risk, and prior-experience evidence.',
        'A submission can exceed 300 pages, with critical information distributed across Microsoft Word, Excel, Smartsheet, Primavera P6, Microsoft Project, GIS, engineering models, schedules, studies, attachments, and historical projects.',
        'Senior operators must manually:'
      ],
      bullets: [
        'Find and validate evidence from previous projects',
        'Reconcile conflicting facts across workstreams',
        'Translate technical decisions into a competitive argument',
        'Keep costs, dates, routes, and claims consistent throughout the submission',
        'Review every output for accuracy and strategic strength'
      ],
      closing:
        'The limiting factor is not market opportunity. It is the amount of senior expertise required to pursue each opportunity.'
    },
    platform: {
      intro:
        'Ferry is deploying a private intelligence system inside the company’s environment. The platform includes:',
      bullets: [
        'A context layer connecting project data, documents, decisions, and prior experience',
        'Agents that research, synthesize evidence, and execute critical bid workflows',
        'Custom evaluations tuned to the company’s standards, knowledge, and expert judgment',
        'A learning loop that turns expert corrections into better performance on every project'
      ]
    },
    workflow: [
      { icon: 'source', label: 'A context layer connecting project data, documents, decisions, and prior experience' },
      { icon: 'research', label: 'Agents that research, synthesize evidence, and execute critical bid workflows' },
      { icon: 'evaluation', label: 'Custom evaluations tuned to the company’s standards, knowledge, and expert judgment' },
      { icon: 'learning', label: 'A learning loop that turns expert corrections into better performance on every project' }
    ],
    impact: [
      '10x less senior operator time per bid, enabling the existing team to pursue more opportunities',
      '$XXXM in estimated additional revenue from increased bid capacity and improved win conversion'
    ]
  },
  {
    slug: 'spacecraft-engineering',
    number: '02',
    title: 'Making spacecraft engineering move at production speed.',
    image: 'assets/case-studies/spacecraft-engineering.png',
    imageAlt:
      'A pixel-art spacecraft stands beside a snow-covered mountain beneath a blue sky.',
    company: [
      'A $2.3B satellite-platform manufacturer building configurable spacecraft for commercial and national-security missions.',
      'The company is bringing a productized manufacturing model to an industry traditionally dominated by slow, bespoke engineering programs.'
    ],
    problem: {
      paragraphs: [
        'Every spacecraft must fit propulsion, avionics, power, payloads, and deployable structures within strict launch-defined constraints for mass, volume, stiffness, and mechanical interfaces.',
        'The engineering workflow spans CAD and finite-element analysis tools, component libraries, parts lists, vendor specifications, simulation outputs, and physical test results.',
        'When a component becomes unavailable, a vibration test fails, or the launch envelope changes, engineers must manually:'
      ],
      bullets: [
        'Identify every part of the design affected by the change',
        'Reconfigure components within the available volume',
        'Redesign structural panels and mechanical interfaces',
        'Update the underlying CAD geometry',
        'Re-run structural analysis and validate the revised design',
        'Preserve design intent across iterations'
      ],
      closing:
        'The initial design is not the bottleneck. The limiting factor is repeatedly bringing the spacecraft back to a valid design as requirements and physical constraints change.'
    },
    platform: {
      intro:
        'Ferry is developing an engineering intelligence system that works across the company’s existing design and analysis tools. The platform includes:',
      bullets: [
        'A context layer connecting requirements, components, geometry, constraints, and test results',
        'Agents that generate geometry, propagate changes, and execute redesign workflows',
        'Custom evaluations tuned to the company’s engineering standards, design rules, and mission constraints',
        'A learning loop that incorporates engineering review, simulation, and physical testing into future iterations'
      ]
    },
    workflow: [
      { icon: 'source', label: 'A context layer connecting requirements, components, geometry, constraints, and test results' },
      { icon: 'geometry', label: 'Agents that generate geometry, propagate changes, and execute redesign workflows' },
      { icon: 'evaluation', label: 'Custom evaluations tuned to the company’s engineering standards, design rules, and mission constraints' },
      { icon: 'learning', label: 'A learning loop that incorporates engineering review, simulation, and physical testing into future iterations' }
    ],
    impact: [
      'Compress the design-test-redesign cycle, reducing the expert time required to produce a validated iteration',
      'Increase engineering and production throughput, enabling the same team to support more spacecraft and missions'
    ]
  }
];
```

- [ ] **Step 5: Run the tests and verify GREEN**

Run:

```bash
node --test tests/case-studies.test.mjs
```

Expected: PASS for content count, immutable strings, booking URL, image dimensions, and hashes.

- [ ] **Step 6: Commit the content contract**

```bash
git add assets/case-studies case-studies-content.mjs tests/case-studies.test.mjs
git commit -m "feat: add case study content and artwork"
```

---

### Task 2: Generate the semantic case-studies page

**Files:**
- Create: `scripts/build-case-studies.mjs`
- Create: `case-studies.html`
- Modify: `tests/case-studies.test.mjs`

**Interfaces:**
- Consumes: `CASE_STUDIES` and `BOOKING_URL` from Task 1.
- Produces: deterministic semantic markup containing the gallery, both full stories, reader switcher, workflow visuals, CTA, logo lockup, and copyright.

- [ ] **Step 1: Add failing semantic-page tests**

Append to `tests/case-studies.test.mjs`:

```js
const html = readFileSync(new URL('../case-studies.html', import.meta.url), 'utf8');

test('renders the gallery and both complete stories', () => {
  assert.match(html, /<main[^>]*class="case-studies"/);
  assert.equal((html.match(/class="case-card/g) ?? []).length, 2);
  assert.equal((html.match(/class="case-panel/g) ?? []).length, 2);
  assert.match(html, /id="energy-transmission"/);
  assert.match(html, /id="spacecraft-engineering"/);
  assert.match(html, /Scaling a \$4B project portfolio/);
  assert.match(html, /A \$2\.3B satellite-platform manufacturer/);
  assert.match(html, /\$XXXM in estimated additional revenue/);
});

test('renders accessible local imagery and conversion links', () => {
  assert.match(html, /src="assets\/case-studies\/transmission-infrastructure\.png"/);
  assert.match(html, /src="assets\/case-studies\/spacecraft-engineering\.png"/);
  assert.match(html, /alt="A pixel-art transmission network/);
  assert.match(html, /alt="A pixel-art spacecraft stands/);
  assert.match(html, /href="https:\/\/calendar\.app\.google\/t69X39w3jLLAKn3L7"/);
  assert.match(html, /Book a free consultation/);
});

test('keeps every story section and bullet visible in static markup', () => {
  assert.equal((html.match(/>Company<\/h3>/g) ?? []).length, 2);
  assert.equal((html.match(/>The problem<\/h3>/g) ?? []).length, 2);
  assert.equal((html.match(/>The Ferry platform<\/h3>/g) ?? []).length, 2);
  assert.equal((html.match(/>Impact<\/h3>/g) ?? []).length, 2);
  assert.match(html, /Find and validate evidence from previous projects/);
  assert.match(html, /Preserve design intent across iterations/);
});
```

- [ ] **Step 2: Run the tests and verify RED**

Run:

```bash
node --test tests/case-studies.test.mjs
```

Expected: FAIL because `case-studies.html` does not exist.

- [ ] **Step 3: Create the deterministic page generator**

Create `scripts/build-case-studies.mjs` with these complete rendering boundaries:

```js
import { writeFileSync } from 'node:fs';
import { BOOKING_URL, CASE_STUDIES } from '../case-studies-content.mjs';

const escapeHtml = (value) => String(value)
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;');

const renderParagraphs = (paragraphs) =>
  paragraphs.map((text) => `<p>${escapeHtml(text)}</p>`).join('\n');

const renderBullets = (items, className = 'story-list') =>
  `<ul class="${className}">${items.map((item) =>
    `<li>${escapeHtml(item)}</li>`).join('')}</ul>`;

const renderWorkflow = (study) => `
  <ol class="workflow" aria-label="${escapeHtml(study.title)} workflow">
    ${study.workflow.map((step, index) => `
      <li class="workflow-step">
        <span class="workflow-icon icon-${escapeHtml(step.icon)}" aria-hidden="true"></span>
        <span class="workflow-number">0${index + 1}</span>
        <span>${escapeHtml(step.label)}</span>
      </li>`).join('')}
  </ol>`;

const renderCard = (study) => `
  <a class="case-card" data-case-link="${escapeHtml(study.slug)}"
     href="#${escapeHtml(study.slug)}">
    <span class="case-card-media">
      <img src="${escapeHtml(study.image)}" alt="" width="2048" height="2048">
      <span class="case-number">${study.number}</span>
    </span>
    <span class="case-card-copy">
      <span class="case-domain">Case study ${study.number}</span>
      <strong>${escapeHtml(study.title)}</strong>
      <span class="case-link-label">Read case study <span aria-hidden="true">↗</span></span>
    </span>
  </a>`;

const renderPanel = (study) => `
  <article class="case-panel" id="${escapeHtml(study.slug)}"
           data-case-panel="${escapeHtml(study.slug)}" tabindex="-1">
    <figure class="case-hero">
      <img src="${escapeHtml(study.image)}" alt="${escapeHtml(study.imageAlt)}"
           width="2048" height="2048">
      <figcaption>${escapeHtml(study.number)} / 02</figcaption>
    </figure>
    <header class="story-header">
      <p class="eyebrow">Case study ${study.number}</p>
      <h2>${escapeHtml(study.title)}</h2>
    </header>
    <section class="story-section">
      <h3>Company</h3>
      ${renderParagraphs(study.company)}
    </section>
    <section class="story-section">
      <h3>The problem</h3>
      ${renderParagraphs(study.problem.paragraphs)}
      ${renderBullets(study.problem.bullets)}
      <p>${escapeHtml(study.problem.closing)}</p>
    </section>
    <section class="story-section platform-section">
      <h3>The Ferry platform</h3>
      <p>${escapeHtml(study.platform.intro)}</p>
      ${renderBullets(study.platform.bullets, 'platform-list')}
      ${renderWorkflow(study)}
    </section>
    <section class="story-section impact-section">
      <h3>Impact</h3>
      ${renderBullets(study.impact, 'impact-list')}
    </section>
    <aside class="case-cta">
      <a href="${BOOKING_URL}" target="_blank" rel="noopener noreferrer">
        Book a free consultation <span aria-hidden="true">↗</span>
      </a>
    </aside>
  </article>`;

export function renderCaseStudiesPage(studies = CASE_STUDIES) {
  const cards = studies.map(renderCard).join('\n');
  const panels = studies.map(renderPanel).join('\n');
  const switcher = studies.map((study) => `
    <a href="#${escapeHtml(study.slug)}" class="case-switch"
       data-case-link="${escapeHtml(study.slug)}">
      <span>${study.number}</span>${escapeHtml(study.title)}
    </a>`).join('\n');

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Case Studies — Ferry Labs</title>
  <meta name="description" content="Selected Ferry Labs work across energy infrastructure and spacecraft engineering.">
  <link rel="icon" href="favicon.svg" type="image/svg+xml">
  <link rel="stylesheet" href="case-studies.css">
  <script>document.documentElement.classList.add('js')</script>
  <script type="module" src="case-studies.js"></script>
</head>
<body>
  <header class="site-header">
    <a class="brand" href="index.html" aria-label="Ferry Labs home">
      <img src="ferry-logo.png" alt="" width="34" height="34">
      <span>Ferry Labs</span>
    </a>
    <a class="header-link" href="case-studies.html" aria-current="page">Case Studies</a>
  </header>
  <main class="case-studies">
    <header class="page-intro">
      <h1>Case Studies</h1>
    </header>
    <section class="case-gallery" aria-label="Case studies">${cards}</section>
    <section class="reader" id="selected-case-study" aria-label="Selected case study">
      <nav class="case-switcher" aria-label="Choose a case study">${switcher}</nav>
      <div class="case-reader">${panels}</div>
    </section>
  </main>
  <footer class="site-footer">© ${new Date().getFullYear()} Ferry Labs, San Francisco</footer>
</body>
</html>`;
}

const output = new URL('../case-studies.html', import.meta.url);
writeFileSync(output, renderCaseStudiesPage());
```

- [ ] **Step 4: Generate the page and verify GREEN**

Run:

```bash
node scripts/build-case-studies.mjs
node --test tests/case-studies.test.mjs
```

Expected: `case-studies.html` is generated and all content/markup tests pass.

- [ ] **Step 5: Commit the semantic page**

```bash
git add scripts/build-case-studies.mjs case-studies.html tests/case-studies.test.mjs
git commit -m "feat: generate semantic case studies page"
```

---

### Task 3: Apply the Ferry Labs visual system

**Files:**
- Create: `case-studies.css`
- Modify: `tests/case-studies.test.mjs`

**Interfaces:**
- Consumes: class names generated by Task 2 and existing local font files.
- Produces: two cinematic cards, desktop master-detail reader, mobile switcher, restrained workflow icons, visual impact treatment, transparent page chrome, and reduced-motion behavior.

- [ ] **Step 1: Add failing visual-contract tests**

Append to `tests/case-studies.test.mjs`:

```js
const css = readFileSync(new URL('../case-studies.css', import.meta.url), 'utf8');

test('uses the Ferry visual system and master-detail layout', () => {
  assert.match(css, /@font-face[\s\S]*Geist Pixel/);
  assert.match(css, /@font-face[\s\S]*Google Sans/);
  assert.match(css, /--orbit:\s*#2a5bff/i);
  assert.match(css, /\.case-gallery\s*\{[\s\S]*grid-template-columns:\s*repeat\(2,/);
  assert.match(css, /\.reader\s*\{[\s\S]*grid-template-columns:/);
  assert.match(css, /\.case-switcher\s*\{[\s\S]*position:\s*sticky/);
  assert.match(css, /@media \(max-width:\s*760px\)/);
  assert.match(css, /@media \(prefers-reduced-motion:\s*reduce\)/);
});

test('uses restrained local visual enhancement', () => {
  assert.match(css, /\.workflow-icon/);
  assert.match(css, /\.icon-source/);
  assert.match(css, /\.icon-geometry/);
  assert.match(css, /\.impact-list/);
  assert.doesNotMatch(css, /backdrop-filter/);
  assert.doesNotMatch(css, /animation:\s*[^n]/);
});
```

- [ ] **Step 2: Run the tests and verify RED**

Run:

```bash
node --test tests/case-studies.test.mjs
```

Expected: FAIL because `case-studies.css` does not exist.

- [ ] **Step 3: Create the visual stylesheet**

Create `case-studies.css` with these exact layout contracts:

```css
@font-face { font-family:'Geist Pixel'; src:url('fonts/GeistPixel.ttf') format('truetype'); font-display:swap; }
@font-face { font-family:'Google Sans'; src:url('fonts/GoogleSans-Regular.ttf') format('truetype'); font-display:swap; }
@font-face { font-family:'Google Sans'; src:url('fonts/GoogleSans-SemiBold.ttf') format('truetype'); font-weight:600; font-display:swap; }

:root { --void:#05060a; --panel:#0b1020; --white:#f7f8ff; --mist:rgba(247,248,255,.64); --line:rgba(255,255,255,.12); --orbit:#2a5bff; }
* { box-sizing:border-box; }
html { color-scheme:dark; scroll-behavior:smooth; }
body { margin:0; min-width:320px; overflow-x:hidden; background:var(--void); color:var(--white); font-family:'Google Sans',system-ui,sans-serif; }
a { color:inherit; text-decoration:none; }
.site-header { position:absolute; inset:0 0 auto; z-index:10; height:64px; padding:0 clamp(24px,5vw,72px); display:flex; align-items:center; justify-content:space-between; }
.brand { display:flex; align-items:center; gap:10px; font-size:17px; }
.brand img { width:auto; height:34px; }
.header-link,.eyebrow,.case-domain,.case-number,.workflow-number { text-transform:uppercase; letter-spacing:.16em; font-size:11px; }
.header-link { color:var(--mist); }
.header-link:hover,.header-link:focus-visible { color:var(--white); }
.case-studies { width:min(1440px,100%); margin:0 auto; padding:clamp(116px,15vh,164px) clamp(24px,5vw,72px) 88px; }
.page-intro { display:grid; grid-template-columns:minmax(0,1.2fr) minmax(280px,.8fr); gap:40px; align-items:end; margin-bottom:42px; }
.page-intro h1,.story-header h2 { font-family:'Geist Pixel','Google Sans',sans-serif; font-weight:400; letter-spacing:-.025em; text-wrap:balance; }
.page-intro h1 { max-width:920px; margin:12px 0 0; font-size:clamp(44px,6vw,82px); line-height:.98; }
.eyebrow { margin:0; color:#86a0ff; }
.case-gallery { display:grid; grid-template-columns:repeat(2,minmax(0,1fr)); gap:18px; margin-bottom:96px; }
.case-card { display:flex; min-width:0; flex-direction:column; border:1px solid var(--line); background:var(--panel); transition:border-color .2s ease,transform .2s ease; }
.case-card:hover,.case-card:focus-visible,.case-card[aria-current='true'] { border-color:rgba(88,122,255,.92); transform:translateY(-3px); outline:none; }
.case-card-media { position:relative; aspect-ratio:16/10; overflow:hidden; background:#0b1737; }
.case-card-media:after,.case-hero:after { content:''; position:absolute; inset:0; background:linear-gradient(180deg,transparent 52%,rgba(2,5,18,.48)); pointer-events:none; }
.case-card-media img,.case-hero img { display:block; width:100%; height:100%; object-fit:cover; }
.case-card-media img { transition:transform .24s ease; }
.case-card:hover img { transform:scale(1.02); }
.case-number { position:absolute; z-index:1; top:18px; right:18px; }
.case-card-copy { min-height:168px; padding:22px; display:flex; flex-direction:column; gap:12px; }
.case-card-copy strong { max-width:620px; font-family:'Geist Pixel','Google Sans',sans-serif; font-size:clamp(24px,2.6vw,38px); line-height:1.03; font-weight:400; }
.case-domain { color:#86a0ff; }
.case-link-label { margin-top:auto; color:var(--mist); }
.reader { display:grid; grid-template-columns:minmax(190px,240px) minmax(0,1fr); gap:clamp(28px,4vw,64px); align-items:start; }
.case-switcher { position:sticky; top:28px; display:grid; gap:10px; }
.case-switch { padding:14px; display:grid; grid-template-columns:32px 1fr; gap:8px; border:1px solid var(--line); color:var(--mist); font-size:13px; line-height:1.35; }
.case-switch[aria-current='true'],.case-switch:hover,.case-switch:focus-visible { color:var(--white); border-color:var(--orbit); background:rgba(42,91,255,.1); outline:none; }
.js .case-panel { display:none; }
.js .case-panel[aria-hidden='false'] { display:block; }
.case-panel[hidden] { display:none; }
.case-hero { position:relative; height:min(58vw,620px); margin:0; overflow:hidden; background:#0b1737; }
.case-hero img { object-position:center 52%; }
.case-hero figcaption { position:absolute; z-index:1; left:24px; bottom:20px; font-size:11px; letter-spacing:.16em; }
.story-header { padding:36px 0 28px; border-bottom:1px solid var(--line); }
.story-header h2 { max-width:980px; margin:12px 0 0; font-size:clamp(38px,5vw,68px); line-height:1; }
.story-section { display:grid; grid-template-columns:minmax(160px,240px) minmax(0,760px); gap:clamp(24px,5vw,72px); padding:52px 0; border-bottom:1px solid var(--line); }
.story-section h3 { margin:0; font-family:'Geist Pixel','Google Sans',sans-serif; font-size:26px; font-weight:400; }
.story-section p,.story-section ul { grid-column:2; margin:0 0 20px; font-size:17px; line-height:1.65; color:rgba(247,248,255,.8); }
.story-list,.platform-list { padding-left:20px; }
.story-list li,.platform-list li { margin:0 0 12px; padding-left:6px; }
.workflow { grid-column:1/-1; list-style:none; margin:28px 0 0; padding:0; display:grid; grid-template-columns:repeat(4,minmax(0,1fr)); border:1px solid var(--line); }
.workflow-step { min-height:190px; padding:20px; display:flex; flex-direction:column; gap:14px; border-right:1px solid var(--line); font-size:14px; line-height:1.45; }
.workflow-step:last-child { border-right:0; }
.workflow-icon { width:38px; height:38px; border:1px solid rgba(107,139,255,.55); position:relative; }
.workflow-icon:before,.workflow-icon:after { content:''; position:absolute; background:#86a0ff; }
.icon-source:before { width:18px; height:2px; left:9px; top:11px; box-shadow:0 7px 0 #86a0ff,0 14px 0 #86a0ff; }
.icon-research:before,.icon-geometry:before { width:16px; height:16px; border:2px solid #86a0ff; background:transparent; left:8px; top:7px; }
.icon-research:after,.icon-geometry:after { width:10px; height:2px; transform:rotate(45deg); right:4px; bottom:7px; }
.icon-evaluation:before { width:18px; height:12px; left:9px; top:13px; clip-path:polygon(0 45%,35% 100%,100% 0,88% 0,35% 80%,12% 38%); }
.icon-learning:before { width:20px; height:20px; left:8px; top:8px; border:2px solid #86a0ff; border-radius:50%; background:transparent; }
.impact-list { grid-column:1/-1; list-style:none; padding:0; display:grid; grid-template-columns:repeat(2,minmax(0,1fr)); gap:14px; }
.impact-list li { min-height:150px; margin:0; padding:22px; border:1px solid rgba(92,128,255,.46); background:linear-gradient(145deg,rgba(42,91,255,.15),rgba(10,16,34,.7)); font-size:clamp(20px,2.2vw,30px); line-height:1.2; color:var(--white); }
.case-cta { margin-top:48px; padding:clamp(28px,5vw,60px); background:var(--orbit); }
.case-cta a { width:100%; display:flex; align-items:center; justify-content:space-between; gap:24px; font-family:'Geist Pixel','Google Sans',sans-serif; font-size:clamp(28px,4vw,54px); line-height:1; }
.site-footer { padding:24px clamp(24px,5vw,72px); text-align:right; color:rgba(255,255,255,.36); font-size:11px; letter-spacing:.16em; text-transform:uppercase; }
@media (max-width:900px) { .reader { grid-template-columns:1fr; } .case-switcher { position:static; grid-template-columns:repeat(2,minmax(0,1fr)); } .story-section { grid-template-columns:1fr; } .story-section p,.story-section ul { grid-column:1; } .workflow { grid-template-columns:repeat(2,minmax(0,1fr)); } }
@media (max-width:760px) { .site-header { padding:0 20px; } .case-studies { padding:104px 20px 64px; } .page-intro { grid-template-columns:1fr; } .case-gallery { grid-template-columns:1fr; margin-bottom:64px; } .case-switcher { overflow-x:auto; } .case-hero { height:74vw; min-height:300px; } .workflow,.impact-list { grid-template-columns:1fr; } .workflow-step { min-height:0; border-right:0; border-bottom:1px solid var(--line); } .case-cta { align-items:flex-start; flex-direction:column; } }
@media (prefers-reduced-motion:reduce) { html { scroll-behavior:auto; } .case-card,.case-card-media img { transition:none; } .case-card:hover { transform:none; } }
```

- [ ] **Step 4: Run tests and verify GREEN**

Run:

```bash
node --test tests/case-studies.test.mjs
```

Expected: all content, asset, semantic, and visual-contract tests pass.

- [ ] **Step 5: Commit the visual system**

```bash
git add case-studies.css tests/case-studies.test.mjs
git commit -m "feat: style cinematic case studies reader"
```

---

### Task 4: Add hash selection, focus, and browser history

**Files:**
- Create: `case-studies-state.mjs`
- Create: `case-studies.js`
- Create: `tests/case-studies-state.test.mjs`
- Modify: `tests/case-studies.test.mjs`

**Interfaces:**
- Consumes: `data-case-link`, `data-case-panel`, `#selected-case-study`, and the two content slugs.
- Produces: deterministic slug normalization, selected state, `aria-current`, panel visibility, focus movement, smooth scroll, direct hashes, and Back/Forward restoration.

- [ ] **Step 1: Write failing pure-state tests**

Create `tests/case-studies-state.test.mjs`:

```js
import assert from 'node:assert/strict';
import test from 'node:test';
import { hashFor, normalizeSlug } from '../case-studies-state.mjs';

const slugs = ['energy-transmission', 'spacecraft-engineering'];

test('normalizes direct hashes and defaults to the first story', () => {
  assert.equal(normalizeSlug('', slugs), 'energy-transmission');
  assert.equal(normalizeSlug('#energy-transmission', slugs), 'energy-transmission');
  assert.equal(normalizeSlug('#spacecraft-engineering', slugs), 'spacecraft-engineering');
  assert.equal(normalizeSlug('#unknown', slugs), 'energy-transmission');
});

test('creates stable hash URLs', () => {
  assert.equal(hashFor('energy-transmission'), '#energy-transmission');
  assert.equal(hashFor('spacecraft-engineering'), '#spacecraft-engineering');
});
```

- [ ] **Step 2: Run the state test and verify RED**

Run:

```bash
node --test tests/case-studies-state.test.mjs
```

Expected: FAIL with `ERR_MODULE_NOT_FOUND` for `case-studies-state.mjs`.

- [ ] **Step 3: Implement the pure state helpers**

Create `case-studies-state.mjs`:

```js
export function normalizeSlug(hash, validSlugs) {
  const requested = decodeURIComponent(String(hash).replace(/^#/, ''));
  return validSlugs.includes(requested) ? requested : validSlugs[0];
}

export function hashFor(slug) {
  return `#${encodeURIComponent(slug)}`;
}
```

- [ ] **Step 4: Add the DOM enhancement**

Create `case-studies.js`:

```js
import { hashFor, normalizeSlug } from './case-studies-state.mjs';

const panels = [...document.querySelectorAll('[data-case-panel]')];
const links = [...document.querySelectorAll('[data-case-link]')];
const reader = document.querySelector('#selected-case-study');
const slugs = panels.map((panel) => panel.dataset.casePanel);
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)');

function selectCase(slug, { focus = false, scroll = false } = {}) {
  const selected = normalizeSlug(`#${slug}`, slugs);
  panels.forEach((panel) => {
    const active = panel.dataset.casePanel === selected;
    panel.hidden = !active;
    panel.setAttribute('aria-hidden', String(!active));
  });
  links.forEach((link) => {
    if (link.dataset.caseLink === selected) {
      link.setAttribute('aria-current', 'true');
    } else {
      link.removeAttribute('aria-current');
    }
  });

  const panel = panels.find((item) => item.dataset.casePanel === selected);
  if (scroll) {
    reader.scrollIntoView({
      block: 'start',
      behavior: reduceMotion.matches ? 'auto' : 'smooth'
    });
  }
  if (focus) panel.focus({ preventScroll: true });
}

links.forEach((link) => {
  link.addEventListener('click', (event) => {
    event.preventDefault();
    const slug = link.dataset.caseLink;
    history.pushState({ caseStudy: slug }, '', hashFor(slug));
    selectCase(slug, { focus: true, scroll: true });
  });
});

window.addEventListener('popstate', () => {
  selectCase(normalizeSlug(location.hash, slugs));
});

const initial = normalizeSlug(location.hash, slugs);
if (location.hash && location.hash !== hashFor(initial)) {
  history.replaceState({ caseStudy: initial }, '', hashFor(initial));
}
selectCase(initial);
```

- [ ] **Step 5: Add structural interaction assertions**

Append to `tests/case-studies.test.mjs`:

```js
const behavior = readFileSync(new URL('../case-studies.js', import.meta.url), 'utf8');

test('enhances static stories with accessible hash navigation', () => {
  assert.match(behavior, /history\.pushState/);
  assert.match(behavior, /addEventListener\('popstate'/);
  assert.match(behavior, /aria-current/);
  assert.match(behavior, /scrollIntoView/);
  assert.match(behavior, /prefers-reduced-motion/);
  assert.match(html, /data-case-link="energy-transmission"/);
  assert.match(html, /data-case-link="spacecraft-engineering"/);
  assert.match(html, /tabindex="-1"/);
});
```

- [ ] **Step 6: Run both test files and verify GREEN**

Run:

```bash
node --test tests/case-studies.test.mjs tests/case-studies-state.test.mjs
```

Expected: all tests pass.

- [ ] **Step 7: Commit the interaction**

```bash
git add case-studies.js case-studies-state.mjs tests/case-studies.test.mjs tests/case-studies-state.test.mjs
git commit -m "feat: add accessible case study selection"
```

---

### Task 5: Link the landing page and complete browser verification

**Files:**
- Create: `scripts/add-case-studies-nav.mjs`
- Modify: `index.html`
- Modify: `tests/case-studies.test.mjs`

**Interfaces:**
- Consumes: the JSON string inside `<script type="__bundler/template">` in `index.html`.
- Produces: one visible `Case Studies` link on desktop and mobile without changing the hero, brand, footer overlay, or booking CTA.

- [ ] **Step 1: Add the failing landing-page navigation test**

Append to `tests/case-studies.test.mjs`:

```js
const landingOuter = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const landingMatch = landingOuter.match(
  /<script type="__bundler\/template">\s*([\s\S]*?)\s*<\/script>/
);
assert.ok(landingMatch, 'landing-page embedded template exists');
const landingTemplate = JSON.parse(landingMatch[1]);

test('links to case studies without changing landing conversion copy', () => {
  assert.match(landingTemplate, /label:\s*'Case Studies'/);
  assert.match(landingTemplate, /href:\s*'case-studies\.html'/);
  assert.match(landingTemplate, /AI for the companies building the physical future\./);
  assert.match(landingTemplate, /Book a free consultation/);
  assert.match(landingTemplate, /Ferry Labs, San Francisco/);
});
```

- [ ] **Step 2: Run the test and verify RED**

Run:

```bash
node --test tests/case-studies.test.mjs
```

Expected: FAIL because the embedded `NAV` array is still empty.

- [ ] **Step 3: Create the deterministic navigation rewrite**

Create `scripts/add-case-studies-nav.mjs`:

```js
import { readFileSync, writeFileSync } from 'node:fs';

const path = process.argv[2] ?? 'index.html';
const outer = readFileSync(path, 'utf8');
const open = '<script type="__bundler/template">';
const start = outer.indexOf(open);
const end = outer.indexOf('</script>', start);
if (start < 0 || end < 0) throw new Error('Embedded template not found');

let template = JSON.parse(outer.slice(start + open.length, end).trim());
const before = 'const NAV = [];';
const after = `const NAV = [
  { label: 'Case Studies', href: 'case-studies.html' }
];`;
if (!template.includes(before)) throw new Error('Empty NAV declaration not found');
template = template.replace(before, after);
template = template.replace(
  '    .nav-links { display: none; }',
  '    .nav-links { display: flex; gap: 18px; }'
);

const serialized = JSON.stringify(template).replaceAll('</script>', '<\\/script>');
writeFileSync(path, outer.slice(0, start + open.length) + serialized + outer.slice(end));
```

- [ ] **Step 4: Apply the rewrite and run all automated checks**

Run:

```bash
node scripts/add-case-studies-nav.mjs
node scripts/build-case-studies.mjs
node --test tests/hero-cover.test.mjs tests/case-studies.test.mjs tests/case-studies-state.test.mjs
node --check scripts/add-case-studies-nav.mjs
node --check scripts/build-case-studies.mjs
node --check case-studies.js
node --check case-studies-state.mjs
git diff --check
```

Expected: all tests and syntax checks pass; `git diff --check` prints no output.

- [ ] **Step 5: Verify desktop behavior at 1440×900**

Open `http://127.0.0.1:4174/case-studies.html` and confirm:

- both visual cards are visible and use the supplied artwork;
- clicking case 02 selects its article, updates the hash to `#spacecraft-engineering`, scrolls to the reader, and focuses the article;
- clicking case 01 reverses selection and updates the hash to `#energy-transmission`;
- Back and Forward restore the selected story;
- the left switcher remains visible while reading;
- all supplied copy—including `$4B`, `$2.3B`, `10x`, and `$XXXM`—appears unchanged;
- the CTA opens the existing booking URL in a new tab;
- there is no solid black navigation or footer bar and no horizontal overflow.

- [ ] **Step 6: Verify tablet and mobile behavior**

At 1024×768 and 390×844, confirm:

- cards and article text do not overflow;
- the left rail becomes the two-item horizontal switcher;
- both images retain useful focal crops;
- workflow steps and impact panels stack cleanly;
- keyboard focus remains visible;
- reduced-motion mode removes smooth scrolling, image scaling, and card translation;
- the landing page remains one viewport tall and its mobile `Case Studies` link is visible.

- [ ] **Step 7: Commit the completed case-studies page**

```bash
git add index.html case-studies.html case-studies.css case-studies.js case-studies-state.mjs case-studies-content.mjs scripts/add-case-studies-nav.mjs scripts/build-case-studies.mjs tests/case-studies.test.mjs tests/case-studies-state.test.mjs assets/case-studies
git commit -m "feat: add Ferry Labs case studies page"
```

## Final Verification Gate

Before claiming completion, run:

```bash
node scripts/build-case-studies.mjs
node --test tests/hero-cover.test.mjs tests/case-studies.test.mjs tests/case-studies-state.test.mjs
node --check scripts/add-case-studies-nav.mjs
node --check scripts/build-case-studies.mjs
node --check case-studies.js
node --check case-studies-state.mjs
git diff --check
git status --short --branch
```

Expected: all tests pass, every syntax check exits zero, generated output is stable on a second build, `git diff --check` is clean, and only intentional case-study changes are present.
