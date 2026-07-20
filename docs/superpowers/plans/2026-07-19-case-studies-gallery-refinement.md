# Case Studies Gallery Refinement Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the opening Case Studies gallery smaller, show both square images without cropping, and reduce each card to its title while leaving the detailed reader unchanged.

**Architecture:** Keep the generated-page architecture intact. Change only `renderCard` in the generator and the gallery-specific CSS, then regenerate `case-studies.html`; the case-panel renderer, switcher, and selection JavaScript remain untouched.

**Tech Stack:** Static HTML, CSS, ECMAScript modules, Node.js built-in test runner.

## Global Constraints

- Change only the opening gallery; do not change the selected case-study reader.
- Preserve all supplied case-study titles and detailed copy verbatim.
- Keep the full card clickable with its existing `data-case-link` and hash destination.
- Remove the visible card number, “Case study 01/02,” and “Read case study” text.
- Show the square source artwork in full at desktop and mobile widths.

---

### Task 1: Refine the opening gallery

**Files:**
- Modify: `tests/case-studies.test.mjs`
- Modify: `scripts/build-case-studies.mjs`
- Modify: `case-studies.css`
- Regenerate: `case-studies.html`

**Interfaces:**
- Consumes: `CASE_STUDIES` entries with `slug`, `image`, and `title` from `case-studies-content.mjs`.
- Produces: `.case-card` links containing `.case-card-media` and `.case-card-copy > strong`, with unchanged `data-case-link` and `href` values.

- [ ] **Step 1: Write the failing gallery regression test**

Add a test that scopes assertions to the markup before `<section class="reader"`:

```js
test('keeps the opening gallery compact, title-only, and uncropped', () => {
  const gallery = html.slice(
    html.indexOf('<section class="case-gallery"'),
    html.indexOf('<section class="reader"')
  );

  assert.doesNotMatch(gallery, /class="case-number"/);
  assert.doesNotMatch(gallery, /class="case-domain"/);
  assert.doesNotMatch(gallery, /class="case-link-label"/);
  assert.doesNotMatch(gallery, /Read case study/);
  assert.match(css, /\.case-gallery\s*\{[\s\S]*max-width:\s*1120px/);
  assert.match(css, /\.case-card-media\s*\{[\s\S]*aspect-ratio:\s*1\s*\/\s*1/);
  assert.match(css, /\.case-card-media img\s*\{[\s\S]*object-fit:\s*contain/);
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `node --test tests/case-studies.test.mjs`

Expected: FAIL because the current gallery still renders numbers and labels, uses a `16 / 10` frame, and uses `object-fit: cover`.

- [ ] **Step 3: Simplify the generated card markup**

Replace `renderCard` with:

```js
const renderCard = (study) => `
  <a class="case-card" data-case-link="${escapeHtml(study.slug)}"
     href="#${escapeHtml(study.slug)}">
    <span class="case-card-media">
      <img src="${escapeHtml(study.image)}" alt="" width="2048" height="2048">
    </span>
    <span class="case-card-copy">
      <strong>${escapeHtml(study.title)}</strong>
    </span>
  </a>`;
```

- [ ] **Step 4: Tighten only the gallery styling**

Apply these gallery-specific rules while leaving reader selectors unchanged:

```css
.page-intro {
  margin-bottom: 30px;
}

.page-intro h1 {
  font-size: clamp(44px, 5vw, 72px);
}

.case-gallery {
  width: 100%;
  max-width: 1120px;
  margin: 0 auto 96px;
}

.case-card-media {
  aspect-ratio: 1 / 1;
}

.case-card-media img {
  object-fit: contain;
  transition: transform 0.24s ease;
}

.case-card-copy {
  min-height: 124px;
  padding: 20px;
  justify-content: center;
}

.case-card-copy strong {
  font-size: clamp(22px, 2.1vw, 32px);
  line-height: 1.05;
}
```

Delete gallery-only cropping and removed-label rules: `.case-card:first-child .case-card-media img`, `.case-card:nth-child(2) .case-card-media img`, `.case-number`, `.case-domain`, and `.case-link-label`. Retain `.eyebrow` for the detailed reader.

In the mobile media query, use:

```css
.page-intro h1 {
  font-size: clamp(42px, 13vw, 58px);
}

.case-gallery {
  max-width: 520px;
  margin-bottom: 72px;
}

.case-card-copy {
  min-height: 112px;
  padding: 18px;
}
```

- [ ] **Step 5: Regenerate the static page**

Run: `node scripts/build-case-studies.mjs`

Expected: `case-studies.html` contains two simplified title-only gallery cards and unchanged reader panels.

- [ ] **Step 6: Run the focused and full regression suites**

Run: `node --test tests/case-studies.test.mjs`

Expected: all focused tests pass.

Run: `node --test tests/hero-cover.test.mjs tests/case-studies.test.mjs tests/case-studies-state.test.mjs`

Expected: all tests pass.

- [ ] **Step 7: Verify generated output and syntax**

Run: `node --check scripts/build-case-studies.mjs`

Expected: exit 0.

Run: `git diff --check`

Expected: exit 0.

Visually verify `case-studies.html` at 1440×900 and 390×844: both images are fully visible, the opening cards are smaller, removed labels are absent, and there is no horizontal overflow.

- [ ] **Step 8: Commit the gallery refinement**

```bash
git add tests/case-studies.test.mjs scripts/build-case-studies.mjs case-studies.css case-studies.html
git commit -m "refine case studies gallery scale"
```
