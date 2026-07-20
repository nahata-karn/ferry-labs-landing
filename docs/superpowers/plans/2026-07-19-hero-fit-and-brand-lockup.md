# Hero Fit and Brand Lockup Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Widen and left-align the hero copy, force the page composition to fit one viewport, and add a Google Sans Ferry Labs wordmark beside the logo.

**Architecture:** Add the viewport rules and wider hero contracts to the existing cinematic hero style string in `scripts/rewrite-cinematic-hero.mjs`. Add the brand span in the same hero markup source, then mechanically synchronize those exact source strings into `index.html` so generated output remains aligned.

**Tech Stack:** Static HTML, React JSX in the embedded template, CSS flex layout and viewport units, Node.js built-in test runner, browser responsive inspection.

## Global Constraints

- The desktop content inset is `clamp(32px, 5vw, 72px)`.
- `.hero-grid` is 900 px wide, `.hero-copy` is 760 px wide, and the headline inline max width is 860 px.
- `html`, `body`, and `#app` fit `100svh` with overflow hidden; `.hero` flexes into the space between nav and footer with `min-height: 0`.
- The visible wordmark is exactly `Ferry Labs` and uses `'Google Sans', 'Inter', sans-serif`.
- Preserve exact approved copy, video, poster, CTA, booking URL, footer, and no-canvas behavior.

---

### Task 1: Add failing layout and brand contracts

**Files:**
- Modify: `tests/hero-cover.test.mjs`
- Modify: `scripts/rewrite-cinematic-hero.mjs`
- Modify mechanically: `index.html`

**Interfaces:**
- Consumes: the current cinematic video hero and existing `.brand`/`.brand-name` CSS contract.
- Produces: testable viewport-fit CSS, wider left copy bounds, two-line headline width, and visible brand-name markup.

- [x] **Step 1: Extend the existing contract test before production changes**

Add these assertions to the existing copy/layout test file:

```js
test('fits the hero to the viewport and expands the left content lockup', () => {
  assert.match(template, /html, body\s*\{[\s\S]*overflow:\s*hidden/);
  assert.match(template, /#app\s*\{[\s\S]*height:\s*100svh/);
  assert.match(template, /\.hero\s*\{[\s\S]*flex:\s*1 1 auto/);
  assert.match(template, /\.hero\s*\{[\s\S]*min-height:\s*0/);
  assert.match(template, /padding:\s*clamp\(72px, 10vh, 116px\) clamp\(32px, 5vw, 72px\) 24px/);
  assert.match(template, /\.hero-grid\s*\{[\s\S]*max-width:\s*900px/);
  assert.match(template, /\.hero-copy\s*\{[\s\S]*max-width:\s*760px/);
  assert.match(template, /maxWidth: "860px"/);
});

test('renders the Ferry Labs wordmark beside the logo', () => {
  assert.match(template, /className="brand-name">Ferry Labs<\/span>/);
  assert.match(template, /\.brand-name\s*\{[\s\S]*font-family:\s*'Google Sans'/);
});
```

- [x] **Step 2: Run the test and confirm RED**

Run:

```bash
node --test tests/hero-cover.test.mjs
```

Expected: the two new layout/brand tests fail while the existing seven video, copy, CTA, and asset tests pass.

- [x] **Step 3: Add the viewport and width rules to the rewrite source**

Add these declarations to `heroStyles` in `scripts/rewrite-cinematic-hero.mjs`:

```css
  html,
  body {
    height: 100%;
    overflow: hidden;
  }
  #app {
    height: 100svh;
    min-height: 0;
    overflow: hidden;
  }
  .hero {
    flex: 1 1 auto;
    min-height: 0;
    height: auto;
  }
  .hero-content {
    width: 100%;
    box-sizing: border-box;
    min-height: 0;
    padding: clamp(72px, 10vh, 116px) clamp(32px, 5vw, 72px) 24px;
  }
  .hero-grid { max-width: 900px; }
  .hero-copy { max-width: 760px; }
  .brand-name { font-family: 'Google Sans', 'Inter', sans-serif; }
```

Keep the existing mobile `.hero-content` padding override so the 20 px narrow-screen inset remains intact.

- [x] **Step 4: Add the wordmark and widen the headline in the rewrite source**

In `heroMarkup`, add the span immediately after the logo image and change the headline inline width:

```jsx
            <img src="ferry-logo.png" alt="Ferry Labs" style={{ height: "42px", width: "auto", display: "block" }} />
            <span className="brand-name">Ferry Labs</span>
```

Change the headline style to:

```jsx
<h1 className="headline" style={{ maxWidth: "860px", textAlign: "left" }}>{tweaks.headline}</h1>
```

- [x] **Step 5: Synchronize the embedded template mechanically**

Decode the JSON inside `script[type="__bundler/template"]`, replace the exact current hero style string and hero markup string with the updated values from `scripts/rewrite-cinematic-hero.mjs`, serialize the JSON while escaping closing script tags as `<\\/script>`, and write only the embedded payload back to `index.html`.

- [x] **Step 6: Run GREEN checks**

Run:

```bash
node --test tests/hero-cover.test.mjs
node --check scripts/rewrite-cinematic-hero.mjs
git diff --check
```

Expected: 9 tests pass, 0 fail; syntax and whitespace checks exit 0.

- [x] **Step 7: Commit the layout implementation**

```bash
git add index.html scripts/rewrite-cinematic-hero.mjs tests/hero-cover.test.mjs docs/superpowers/plans/2026-07-19-hero-fit-and-brand-lockup.md
git commit -m "Fit hero layout and add Ferry Labs wordmark"
```

---

### Task 2: Verify viewport fit and responsive composition

**Files:**
- Modify if validation exposes an issue: `scripts/rewrite-cinematic-hero.mjs`
- Modify mechanically if validation exposes an issue: `index.html`
- Test: `tests/hero-cover.test.mjs`

**Interfaces:**
- Consumes: viewport-fit rules, widened copy bounds, 860 px headline width, brand-name span, and existing video hero.
- Produces: a responsive hero that shows the footer inside one viewport with no scrollbars.

- [ ] **Step 1: Reload the feature preview**

Reload `http://127.0.0.1:4174/` after the static-file changes.

- [ ] **Step 2: Inspect desktop at 1440×900**

Confirm the copy begins around 72 px from the left edge, the headline wraps to two lines, the paragraph uses the wider left column, “Ferry Labs” appears beside the logo in Google Sans, the footer is visible, and `document.documentElement.scrollHeight === document.documentElement.clientHeight` with no horizontal overflow.

- [ ] **Step 3: Inspect mobile at 390×844**

Confirm the 20 px inset, readable natural wrapping, brand lockup, video playback, footer visibility, and zero vertical/horizontal overflow at the mobile viewport.

- [ ] **Step 4: Check DOM and browser logs**

Confirm one heading, one supporting paragraph, one CTA, one video, one fallback image, one wordmark, no canvas, and no new console errors. The pre-existing Babel standalone development warning is allowed.

- [ ] **Step 5: Run final verification**

Run:

```bash
node --test tests/hero-cover.test.mjs
node --check scripts/rewrite-cinematic-hero.mjs
git diff --check
git status --short --branch
```

Expected: 9 tests pass, all checks exit 0, and the branch is clean after the verification record commit.
