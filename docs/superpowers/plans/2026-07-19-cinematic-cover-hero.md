# Cinematic Cover Hero Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the animated hero wave with the approved full-bleed astronaut-city artwork while preserving the existing Ferry Labs copy, booking flow, navigation, and footer.

**Architecture:** Keep the dependency-free generated `index.html` architecture. Add the supplied PNG as a normal repository asset, add a Node built-in regression test that inspects the embedded template, and use a deterministic rewrite script to update the embedded CSS/JSX and remove the complete `FloorGrid` implementation without manually editing the 2.5 MB JSON line.

**Tech Stack:** Static HTML, embedded React/JSX, CSS, Node.js built-in test runner, Node.js built-in filesystem APIs.

## Global Constraints

- Preserve the sticky Ferry Labs navigation, logo, exact current headline, both supporting paragraphs, consultation CTA label, Google Calendar destination, locations, and footer copyright.
- Store the supplied artwork locally as `cover-hero.png`; add no runtime network dependency.
- Remove the `.floor-grid` element, `FloorGrid` component, animation loop, and wave-specific CSS completely.
- Use a full-bleed static cover with a restrained navy overlay; add no animation, parallax, or motion replacement.
- Desktop framing must preserve the planet, central city, and foreground astronauts; mobile framing must retain the astronauts and central architecture without horizontal overflow.
- Keep the existing generated single-file site architecture; do not refactor unrelated components or marketing copy.

---

## File Structure

- Create `cover-hero.png`: the production hero artwork supplied by the user.
- Create `tests/hero-cover.test.mjs`: automated structural, content-preservation, accessibility, and asset checks using only Node built-ins.
- Create `scripts/rewrite-cinematic-hero.mjs`: deterministic updater for the JSON-encoded template inside `index.html`.
- Modify `index.html`: replace the wave hero with the responsive cinematic cover.

### Task 1: Add the cover contract and implement the cinematic hero

**Files:**
- Create: `cover-hero.png`
- Create: `tests/hero-cover.test.mjs`
- Create: `scripts/rewrite-cinematic-hero.mjs`
- Modify: `index.html:197`

**Interfaces:**
- Consumes: the JSON string inside `<script type="__bundler/template">` in `index.html` and the user-supplied PNG at `/var/folders/6r/d7w9jvv15mx46hkm93ttf0qh0000gn/T/codex-clipboard-a01be8b3-b833-4a06-ac6c-a357ccd987ac.png`.
- Produces: a local `/cover-hero.png` asset, `.hero-cover-art` image layer, `.hero-content` content container, responsive cover CSS, and an `index.html` template with no `FloorGrid` code or `.floor-grid` markup.

- [x] **Step 1: Write the failing regression test**

Create `tests/hero-cover.test.mjs`:

```js
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const outer = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const templateMatch = outer.match(
  /<script type="__bundler\/template">\s*([\s\S]*?)\s*<\/script>/
);

assert.ok(templateMatch, 'embedded template payload exists');
const template = JSON.parse(templateMatch[1]);

test('uses the local cinematic cover with accessible copy', () => {
  assert.match(template, /className="hero-cover-art"/);
  assert.match(template, /src="cover-hero\.png"/);
  assert.match(
    template,
    /alt="Two astronauts overlook a futuristic city beneath a colossal planet\."/
  );
  assert.match(template, /className="hero-content"/);
  assert.match(template, /\.hero-cover-art\s*\{/);
  assert.match(template, /object-fit:\s*cover/);
  assert.match(template, /linear-gradient/);
});

test('removes the animated floor grid completely', () => {
  assert.doesNotMatch(template, /function FloorGrid/);
  assert.doesNotMatch(template, /<FloorGrid/);
  assert.doesNotMatch(template, /\.floor-grid/);
});

test('preserves the current conversion content and booking destination', () => {
  assert.match(
    template,
    /Turn your expert knowledge\\ninto autonomous agents\./
  );
  assert.match(
    template,
    /Founded by <u>Stanford<\/u> and <u>Berkeley<\/u> graduates/
  );
  assert.match(
    template,
    /Customers include frontier companies in space, data centers, robotics, and energy\./
  );
  assert.match(template, /Book a free consultation/);
  assert.match(template, /https:\/\/calendar\.app\.google\/t69X39w3jLLAKn3L7/);
  assert.match(template, /San Francisco/);
  assert.match(template, /New York/);
});

test('includes explicit desktop and mobile framing', () => {
  assert.match(template, /min-height:\s*calc\(100svh - 64px\)/);
  assert.match(template, /@media \(max-width: 880px\)/);
  assert.match(template, /@media \(max-width: 540px\)/);
  assert.match(template, /object-position:\s*52% center/);
});

test('ships the expected 2544 by 1904 PNG asset', () => {
  const png = readFileSync(new URL('../cover-hero.png', import.meta.url));
  assert.equal(png.toString('ascii', 1, 4), 'PNG');
  assert.equal(png.readUInt32BE(16), 2544);
  assert.equal(png.readUInt32BE(20), 1904);
});
```

- [x] **Step 2: Run the test and verify the intended RED state**

Run:

```bash
node --test tests/hero-cover.test.mjs
```

Expected: FAIL because `className="hero-cover-art"` is absent, `FloorGrid` is still present, and `cover-hero.png` does not exist.

- [x] **Step 3: Add the exact supplied cover asset**

Run:

```bash
cp /var/folders/6r/d7w9jvv15mx46hkm93ttf0qh0000gn/T/codex-clipboard-a01be8b3-b833-4a06-ac6c-a357ccd987ac.png cover-hero.png
```

Expected: `cover-hero.png` is a 2544×1904 PNG and is byte-identical to the supplied image.

- [x] **Step 4: Create the deterministic embedded-template rewrite**

Create `scripts/rewrite-cinematic-hero.mjs`:

```js
import { readFileSync, writeFileSync } from 'node:fs';

const indexPath = process.argv[2] ?? 'index.html';
const outer = readFileSync(indexPath, 'utf8');
const openTag = '<script type="__bundler/template">';
const openIndex = outer.indexOf(openTag);
assertFound(openIndex, 'embedded template opening tag');
const payloadStart = outer.indexOf('\n', openIndex + openTag.length) + 1;
const payloadEnd = outer.indexOf('</script>', payloadStart);
assertFound(payloadStart - 1, 'embedded template payload start');
assertFound(payloadEnd, 'embedded template closing tag');

let template = JSON.parse(outer.slice(payloadStart, payloadEnd).trim());

function assertFound(index, label) {
  if (index < 0) throw new Error(`Could not find ${label}`);
}

function replaceBetween(source, startMarker, endMarker, replacement, label) {
  const start = source.indexOf(startMarker);
  const end = source.indexOf(endMarker, start + startMarker.length);
  assertFound(start, `${label} start`);
  assertFound(end, `${label} end`);
  if (source.indexOf(startMarker, start + startMarker.length) !== -1) {
    throw new Error(`${label} start marker is not unique`);
  }
  return source.slice(0, start) + replacement + source.slice(end);
}

function replaceExact(source, before, after, label) {
  const start = source.indexOf(before);
  assertFound(start, label);
  if (source.indexOf(before, start + before.length) !== -1) {
    throw new Error(`${label} is not unique`);
  }
  return source.slice(0, start) + after + source.slice(start + before.length);
}

const heroStyles = `  /* ---------- Cinematic cover hero ---------- */
  .hero {
    position: relative;
    z-index: 1;
    width: 100%;
    max-width: none;
    min-height: calc(100svh - 64px);
    margin: 0;
    padding: 0;
    overflow: hidden;
    isolation: isolate;
    display: flex;
    background: var(--void);
  }
  .hero-cover-art {
    position: absolute;
    inset: 0;
    z-index: -3;
    width: 100%;
    height: 100%;
    display: block;
    object-fit: cover;
    object-position: center 54%;
  }
  .hero::before {
    content: '';
    position: absolute;
    inset: 0;
    z-index: -2;
    background:
      linear-gradient(90deg, rgba(2,5,24,0.94) 0%, rgba(3,8,31,0.76) 31%, rgba(4,11,40,0.18) 66%, rgba(3,8,28,0.06) 100%),
      linear-gradient(180deg, rgba(2,5,22,0.62) 0%, rgba(2,5,22,0.08) 48%, rgba(2,5,22,0.38) 100%);
    pointer-events: none;
  }
  .hero::after {
    content: '';
    position: absolute;
    inset: auto 0 0;
    z-index: -1;
    height: 22%;
    background: linear-gradient(180deg, transparent, rgba(10,10,11,0.52));
    pointer-events: none;
  }
  .hero-content {
    width: min(1280px, 100%);
    min-height: inherit;
    margin: 0 auto;
    padding: clamp(72px, 10vh, 116px) 32px 64px;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-start;
  }
  .hero-grid {
    display: block;
    width: 100%;
    max-width: 700px;
  }
  .hero-copy {
    max-width: 560px;
    margin-top: 30px;
  }
  .headline {
    font-family: 'Geist Pixel', 'Inter', sans-serif;
    font-size: clamp(36px, 5vw, 66px);
    font-weight: 300;
    letter-spacing: -0.025em;
    line-height: 1.02;
    color: var(--white);
    margin: 0;
    text-wrap: balance;
    white-space: pre-line;
    text-shadow: 0 2px 28px rgba(1,4,20,0.48);
  }
  .lede {
    font-family: 'Google Sans', 'Inter', sans-serif;
    font-size: 16px;
    line-height: 1.58;
    text-align: left;
    color: var(--white);
    margin: 0;
    text-wrap: pretty;
    font-weight: 400;
    white-space: pre-line;
    text-shadow: 0 1px 18px rgba(1,4,20,0.72);
  }
  .hero .cta-tiles {
    position: relative;
    z-index: 2;
    width: auto;
    max-width: none;
    margin: 30px 0 0;
    padding: 0;
    display: flex;
    justify-content: flex-start !important;
  }
  .hero .cta-tiles > * {
    grid-column: auto;
    justify-self: auto;
    margin-left: 0;
  }
  @media (max-width: 880px) {
    .hero { min-height: calc(100svh - 64px); }
    .hero-content { padding: 72px 24px 56px; }
    .hero-grid { max-width: 640px; }
    .hero-cover-art { object-position: 52% center; }
    .hero::before {
      background:
        linear-gradient(90deg, rgba(2,5,24,0.94) 0%, rgba(3,8,31,0.72) 55%, rgba(4,11,40,0.18) 100%),
        linear-gradient(180deg, rgba(2,5,22,0.68) 0%, rgba(2,5,22,0.08) 50%, rgba(2,5,22,0.48) 100%);
    }
  }
  @media (max-width: 540px) {
    .hero { min-height: calc(100svh - 56px); }
    .hero-content { padding: 52px 20px 44px; }
    .hero-grid h1 { font-size: clamp(30px, 9vw, 42px) !important; }
    .hero-copy { margin-top: 24px; }
    .hero .lede { font-size: 15px !important; line-height: 1.5; }
    .hero .lede br { display: none; }
    .hero .cta-tiles { margin-top: 24px; }
    .hero-cover-art { object-position: 52% center; }
    .hero::before {
      background:
        linear-gradient(90deg, rgba(2,5,24,0.94) 0%, rgba(3,8,31,0.72) 70%, rgba(4,11,40,0.25) 100%),
        linear-gradient(180deg, rgba(2,5,22,0.78) 0%, rgba(2,5,22,0.12) 55%, rgba(2,5,22,0.55) 100%);
    }
  }

`;

template = replaceBetween(
  template,
  '  /* ---------- Hero ---------- */',
  '  /* ---------- Spherical grid (closing) ---------- */',
  heroStyles,
  'hero styles'
);

template = replaceBetween(
  template,
  'function FloorGrid({ accent }) {',
  'const LOGOS = [',
  '',
  'FloorGrid component'
);

template = replaceExact(
  template,
  `    .hero { padding: 80px 24px 100px; }
    .hero-grid { grid-template-columns: 1fr; gap: 32px; width: auto; max-width: 100%; }
    .hero-grid > div { min-width: 0; max-width: 100%; }
    .hero-grid h1, .hero-grid h2, .hero-grid p { max-width: 100% !important; width: auto !important; }
    .floor-grid { height: 340px; margin-top: 0; }
`,
  '',
  'legacy tablet hero overrides'
);

template = replaceExact(
  template,
  '    .hero { padding: 60px 20px 80px; }\n',
  '',
  'legacy mobile hero padding'
);

const heroMarkup = `      <section className="hero" data-screen-label="Hero">
        <img
          className="hero-cover-art"
          src="cover-hero.png"
          alt="Two astronauts overlook a futuristic city beneath a colossal planet."
        />
        <div className="hero-content">
          <div className="hero-grid">
            <div>
              <h1 className="headline" style={{ maxWidth: "680px", textAlign: "left" }}>{tweaks.headline}</h1>
            </div>
            <div className="hero-copy">
              <p className="lede">Founded by <u>Stanford</u> and <u>Berkeley</u> graduates who have led<br />elite engineering and research teams at frontier AI labs.</p>
              <p className="lede" style={{ marginTop: "18px" }}>Customers include frontier companies in space, data centers, robotics, and energy.</p>
            </div>
          </div>

          <div className="cta-tiles">
            <button className="cta-tile primary" onClick={openBooking}>
              <span style={{ fontSize: "16px", fontFamily: "'Google Sans', 'Inter', sans-serif" }}>{tweaks.ctaLabel}</span>
              <span className="tile-arrow" aria-hidden>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="6" y1="18" x2="18" y2="6" />
                  <polyline points="9 6 18 6 18 15" />
                </svg>
              </span>
            </button>
          </div>
        </div>
      </section>

`;

template = replaceBetween(
  template,
  '      <section className="hero" data-screen-label="Hero">',
  '      <footer className="meta-strip"',
  heroMarkup,
  'hero markup'
);

const serializedTemplate = JSON.stringify(template).replace(
  /<\/script>/gi,
  '<\\/script>'
);

const updated =
  outer.slice(0, payloadStart) +
  serializedTemplate +
  '\n  ' +
  outer.slice(payloadEnd);

writeFileSync(indexPath, updated);
```

- [x] **Step 5: Run the rewrite against the generated page**

Run:

```bash
node scripts/rewrite-cinematic-hero.mjs index.html
```

Expected: exit 0; the embedded template contains the cinematic hero markup and no `FloorGrid` component.

- [x] **Step 6: Run the regression test and verify GREEN**

Run:

```bash
node --test tests/hero-cover.test.mjs
```

Expected: 5 tests pass, 0 fail.

- [x] **Step 7: Check source integrity and stage only implementation files**

Run:

```bash
git diff --check
git status --short
```

Expected: no whitespace errors. Modified/created tracked work is limited to `index.html`, `cover-hero.png`, `tests/hero-cover.test.mjs`, `scripts/rewrite-cinematic-hero.mjs`, and this plan; `.superpowers/` remains an untracked local brainstorming artifact and is not staged.

- [x] **Step 8: Commit the automated implementation**

```bash
git add index.html cover-hero.png tests/hero-cover.test.mjs scripts/rewrite-cinematic-hero.mjs docs/superpowers/plans/2026-07-19-cinematic-cover-hero.md
git commit -m "Replace animated hero wave with cinematic cover"
```

### Task 2: Verify and tune the rendered desktop and mobile experience

**Files:**
- Modify if validation exposes an issue: `scripts/rewrite-cinematic-hero.mjs`
- Modify if validation exposes an issue: `index.html:197`
- Test: `tests/hero-cover.test.mjs`

**Interfaces:**
- Consumes: the static page served from the repository root and the `.hero-cover-art`, `.hero-content`, `.hero-grid`, `.hero-copy`, and `.cta-tiles` contracts created in Task 1.
- Produces: verified desktop and mobile layouts with no browser errors, no overflow, readable text, recognizable artwork framing, and unchanged CTA behavior.

- [ ] **Step 1: Serve the local page**

Run from the repository root:

```bash
python3 -m http.server 4173 --bind 127.0.0.1
```

Expected: `http://127.0.0.1:4173/` returns HTTP 200.

- [ ] **Step 2: Inspect the desktop viewport**

Open `http://127.0.0.1:4173/` at 1440×900 and verify:

- the hero fills the initial viewport beneath the 64 px navigation;
- the headline, both paragraphs, and CTA are readable over the navy overlay;
- the planet, central city, and both foreground astronauts remain recognizable;
- the footer begins after the hero and does not cover the CTA;
- there is no canvas element in the hero.

- [ ] **Step 3: Inspect the mobile viewport**

Set the viewport to 390×844, reload, and verify:

- there is no horizontal overflow;
- the 56 px mobile navigation, headline, copy, and CTA do not overlap;
- the astronauts and central architecture remain recognizable within the cover crop;
- the footer follows the hero without covering the CTA.

- [ ] **Step 4: Check browser logs and DOM contracts**

Verify the browser console contains no errors or warnings introduced by the change. Confirm exactly one hero CTA is present, its text is “Book a free consultation,” its image source ends in `/cover-hero.png`, its image natural dimensions are 2544×1904, and the hero contains no `canvas`.

- [ ] **Step 5: If visual tuning is needed, update the rewrite source first**

Change the exact CSS string in `scripts/rewrite-cinematic-hero.mjs`, then make the matching mechanical change in the embedded template. Do not directly diverge `index.html` from the rewrite source. Re-run:

```bash
node --test tests/hero-cover.test.mjs
```

Expected: 5 tests pass, 0 fail after every adjustment.

- [ ] **Step 6: Run the full final verification**

Run:

```bash
node --test tests/hero-cover.test.mjs
git diff --check
git status --short --branch
```

Expected: 5 tests pass, 0 fail; no whitespace errors; the branch contains only the intended committed work plus the untracked `.superpowers/` brainstorming session.

- [ ] **Step 7: Commit any visual-tuning adjustment**

If Task 2 changed tracked files:

```bash
git add index.html scripts/rewrite-cinematic-hero.mjs tests/hero-cover.test.mjs
git commit -m "Tune cinematic hero framing"
```

If no tracked files changed, do not create an empty commit.
