# Cross-page Transitions Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a restrained, accessible cross-document fade between the Landing, Case Studies, and Ferry Platform pages.

**Architecture:** Each page opts into the native same-origin View Transitions API through CSS. The existing landing-page mutation script owns the embedded landing styles, while the two dedicated page stylesheets own their page transitions; shared duration, easing, navigation naming, and reduced-motion behavior remain identical across all three outputs.

**Tech Stack:** Static HTML, CSS View Transitions API, Node.js build scripts, Node test runner.

## Global Constraints

- Fade duration is 260 milliseconds.
- Do not add translation, scaling, blur, or JavaScript navigation interception.
- Keep the sticky navigation visually anchored with `view-transition-name: ferry-nav`.
- Disable transition animation under `prefers-reduced-motion: reduce`.
- Preserve all content, layout, URLs, browser-history behavior, and CTA behavior.

---

### Task 1: Shared cross-page transition

**Files:**
- Modify: `tests/page-transitions.test.mjs`
- Modify: `scripts/add-case-studies-nav.mjs`
- Modify: `case-studies.css`
- Modify: `ferry-platform.css`
- Generated: `index.html`

**Interfaces:**
- Consumes: the embedded landing template and the standalone Case Studies and Ferry Platform stylesheets.
- Produces: identical cross-document transition contracts on all three pages.

- [ ] **Step 1: Write the failing test**

```js
test('all first-party pages opt into the same accessible transition', () => {
  for (const source of [landingTemplate, caseStudiesCss, platformCss]) {
    assert.match(source, /@view-transition\s*\{\s*navigation:\s*auto/);
    assert.match(source, /animation-duration:\s*260ms/);
    assert.match(source, /prefers-reduced-motion:\s*reduce/);
  }
  assert.match(landingTemplate, /view-transition-name:\s*ferry-nav/);
  assert.match(caseStudiesCss, /view-transition-name:\s*ferry-nav/);
  assert.match(platformCss, /view-transition-name:\s*ferry-nav/);
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `node --test tests/page-transitions.test.mjs`

Expected: FAIL because none of the three pages currently contains `@view-transition`.

- [ ] **Step 3: Implement the shared transition contract**

Add the following contract to the landing template source and both standalone stylesheets, assigning the existing sticky navigation wrapper on each page to `ferry-nav`:

```css
@view-transition {
  navigation: auto;
}

::view-transition-old(root),
::view-transition-new(root) {
  animation-duration: 260ms;
  animation-timing-function: cubic-bezier(0.22, 1, 0.36, 1);
}

::view-transition-old(root) { animation-name: ferry-page-out; }
::view-transition-new(root) { animation-name: ferry-page-in; }

@keyframes ferry-page-out { to { opacity: 0; } }
@keyframes ferry-page-in { from { opacity: 0; } }
```

Inside the existing reduced-motion media query, set both transition pseudo-elements to `animation: none !important`.

- [ ] **Step 4: Regenerate the landing page and verify the focused test passes**

Run: `node scripts/add-case-studies-nav.mjs && node --test tests/page-transitions.test.mjs`

Expected: PASS.

- [ ] **Step 5: Run complete verification**

Run: `node --test tests/hero-cover.test.mjs tests/case-studies.test.mjs tests/case-studies-state.test.mjs tests/ferry-platform.test.mjs tests/page-transitions.test.mjs && git diff --check`

Expected: all tests pass and `git diff --check` produces no output.

- [ ] **Step 6: Commit**

```bash
git add tests/page-transitions.test.mjs scripts/add-case-studies-nav.mjs index.html case-studies.css ferry-platform.css
git commit -m "smooth cross-page navigation"
```
