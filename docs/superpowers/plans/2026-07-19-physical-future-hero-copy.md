# Physical Future Hero Copy Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the hero headline and both supporting paragraphs with the user's exact physical-future headline and single supporting sentence.

**Architecture:** The headline remains driven by `TWEAK_DEFAULTS.headline`, so the rewrite source will add an exact replacement for that default. The hero markup will keep its existing structure but reduce `.hero-copy` to one paragraph. The generated `index.html` payload will receive only the same two mechanical string replacements.

**Tech Stack:** Static HTML, React JSX in the embedded template, Node.js built-in test runner.

## Global Constraints

- Headline is exactly `AI for the companies building the physical future.`
- Supporting paragraph is exactly `We build intelligent systems that learn from your experts and take on the most complex work your company depends on.`
- Remove both prior Stanford/Berkeley and customer-list paragraphs.
- Preserve the video, still fallback, overlay, CTA, booking URL, navigation, footer, and no-canvas behavior.
- Do not insert manual line breaks into the new copy.

---

### Task 1: Replace the hero copy contracts

**Files:**
- Modify: `tests/hero-cover.test.mjs`
- Modify: `scripts/rewrite-cinematic-hero.mjs`
- Modify mechanically: `index.html`

**Interfaces:**
- Consumes: `TWEAK_DEFAULTS.headline`, `.hero-copy`, and the current embedded template payload.
- Produces: the exact approved headline and one exact `.lede` paragraph.

- [x] **Step 1: Update the copy test first**

Replace the old headline and paragraph assertions inside `preserves the current conversion content and booking destination` with:

```js
  assert.match(
    template,
    /AI for the companies building the physical future\./
  );
  assert.match(
    template,
    /We build intelligent systems that learn from your experts and take on the most complex work your company depends on\./
  );
  assert.doesNotMatch(template, /Founded by <u>Stanford<\/u>/);
  assert.doesNotMatch(
    template,
    /Customers include frontier companies in space, data centers, robotics, and energy\./
  );
```

Keep the CTA label, booking URL, city, video, fallback, and no-canvas assertions unchanged.

- [x] **Step 2: Run the test and confirm RED**

Run:

```bash
node --test tests/hero-cover.test.mjs
```

Expected: the copy contract test fails because the new headline and paragraph are absent; the remaining six tests pass.

- [x] **Step 3: Add the headline replacement to the rewrite source**

Add this exact replacement after the legacy mobile hero cleanup in `scripts/rewrite-cinematic-hero.mjs`:

```js
template = replaceExact(
  template,
  '  "headline": "Turn your expert knowledge\\ninto autonomous agents.",',
  '  "headline": "AI for the companies building the physical future.",',
  'hero headline default'
);
```

- [x] **Step 4: Replace both old paragraphs in the rewrite source**

Inside `heroMarkup`, replace the existing `.hero-copy` contents with:

```jsx
            <div className="hero-copy">
              <p className="lede">We build intelligent systems that learn from your experts and take on the most complex work your company depends on.</p>
            </div>
```

- [x] **Step 5: Synchronize the generated template mechanically**

Decode the JSON inside `script[type="__bundler/template"]`, replace the exact old `TWEAK_DEFAULTS.headline` source string and exact old two-paragraph `.hero-copy` block with the new strings from Steps 3 and 4, serialize the JSON while escaping closing script tags as `<\\/script>`, and write only the embedded payload back to `index.html`.

- [x] **Step 6: Run GREEN checks**

Run:

```bash
node --test tests/hero-cover.test.mjs
node --check scripts/rewrite-cinematic-hero.mjs
git diff --check
```

Expected: 7 tests pass, 0 fail; syntax and whitespace checks exit 0.

- [x] **Step 7: Commit the copy implementation**

```bash
git add index.html scripts/rewrite-cinematic-hero.mjs tests/hero-cover.test.mjs docs/superpowers/plans/2026-07-19-physical-future-hero-copy.md
git commit -m "Update hero physical future positioning"
```

---

### Task 2: Verify the responsive copy layout

**Files:**
- Modify if validation exposes a layout issue: `scripts/rewrite-cinematic-hero.mjs`
- Modify mechanically if validation exposes a layout issue: `index.html`
- Test: `tests/hero-cover.test.mjs`

**Interfaces:**
- Consumes: the new `TWEAK_DEFAULTS.headline`, single `.lede` paragraph, and existing video hero.
- Produces: verified desktop and mobile text wrapping without overlap or overflow.

- [ ] **Step 1: Reload the feature preview**

Reload `http://127.0.0.1:4174/` after the static-file changes.

- [ ] **Step 2: Inspect desktop at 1440×900**

Confirm the exact headline and paragraph are visible, the headline wraps naturally within the existing 680 px maximum, the CTA remains below the paragraph, the video continues playing muted, and the page has no horizontal overflow.

- [ ] **Step 3: Inspect mobile at 390×844**

Confirm both exact strings fit within the 350 px content width, the headline, paragraph, and CTA do not overlap, the footer follows the hero, the video remains visible, and there is no horizontal overflow.

- [ ] **Step 4: Check DOM and browser logs**

Confirm the hero contains one heading, one supporting paragraph, one CTA, one video, one fallback image, no canvas, and no new console errors or warnings. The pre-existing Babel standalone development warning is allowed.

- [ ] **Step 5: Run final verification**

Run:

```bash
node --test tests/hero-cover.test.mjs
node --check scripts/rewrite-cinematic-hero.mjs
git diff --check
git status --short --branch
```

Expected: 7 tests pass, checks exit 0, and the branch is clean after the verification record commit.
