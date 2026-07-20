# Video Cover Hero Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the still-only cinematic hero with the supplied autoplaying background video while retaining the still artwork as the poster and reduced-motion fallback.

**Architecture:** The generated page keeps an image and a native video in the same absolute full-bleed media layer. The image is always available behind the video; CSS hides the video for reduced-motion visitors. The existing rewrite source and embedded template remain synchronized through exact mechanical replacements.

**Tech Stack:** Static HTML, React JSX in the embedded template, CSS media queries, native HTML5 video, Node.js built-in test runner.

## Global Constraints

- The local video filename is exactly `cover-hero.mp4` and is copied without transcoding.
- Preserve `cover-hero.png` as the poster, load-failure fallback, and reduced-motion image.
- Preserve all current hero copy, booking URL, navigation, footer, and no-canvas behavior.
- The video is decorative: `autoPlay`, `muted`, `loop`, `playsInline`, `preload="metadata"`, `aria-hidden="true"`, and no controls.
- Under `@media (prefers-reduced-motion: reduce)`, the video is hidden.

---

### Task 1: Add the local video media layer

**Files:**
- Create: `cover-hero.mp4`
- Modify: `tests/hero-cover.test.mjs`
- Modify: `scripts/rewrite-cinematic-hero.mjs`
- Modify mechanically: `index.html`

**Interfaces:**
- Consumes: the current `.hero`, `.hero-cover-art`, `.hero-content`, and `cover-hero.png` contracts.
- Produces: `.hero-cover-video`, `cover-hero.mp4`, and a native video element whose fallback remains `cover-hero.png`.

- [x] **Step 1: Write the failing video contract tests**

Add `sourceVideoPath` and these assertions to `tests/hero-cover.test.mjs`:

```js
const sourceVideoPath =
  '/Users/karn/Downloads/u8954488552_create_a_futuristic_image_of_astronauts_building__e595c0d8-9da3-4f54-84c6-366e8c901297_0.mp4';

test('uses a decorative local video with a still fallback', () => {
  assert.match(template, /<video[\s\S]*className="hero-cover-video"/);
  assert.match(template, /autoPlay/);
  assert.match(template, /muted/);
  assert.match(template, /loop/);
  assert.match(template, /playsInline/);
  assert.match(template, /preload="metadata"/);
  assert.match(template, /poster="cover-hero\.png"/);
  assert.match(template, /aria-hidden="true"/);
  assert.match(template, /<source src="cover-hero\.mp4" type="video\/mp4" \/>/);
  assert.doesNotMatch(template, /<video[^>]*controls/);
  assert.match(template, /@media \(prefers-reduced-motion: reduce\)/);
  assert.match(template, /\.hero-cover-video\s*\{\s*display:\s*none/);
});

test('ships the supplied MP4 byte for byte', () => {
  const shipped = readFileSync(new URL('../cover-hero.mp4', import.meta.url));
  const source = readFileSync(sourceVideoPath);
  assert.ok(shipped.length > 0);
  assert.deepEqual(shipped, source);
});
```

- [x] **Step 2: Run the test and confirm the RED state**

Run:

```bash
node --test tests/hero-cover.test.mjs
```

Expected: the new video element and MP4 assertions fail while the existing five tests continue to pass.

- [x] **Step 3: Copy the supplied video asset**

Copy `/Users/karn/Downloads/u8954488552_create_a_futuristic_image_of_astronauts_building__e595c0d8-9da3-4f54-84c6-366e8c901297_0.mp4` to repository-root `cover-hero.mp4`, then verify the source and destination are byte-identical with `cmp -s`.

- [x] **Step 4: Add the video CSS to the rewrite source**

Update the media selector and add the reduced-motion rule in `scripts/rewrite-cinematic-hero.mjs`:

```css
  .hero-cover-art,
  .hero-cover-video {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    display: block;
    object-fit: cover;
    object-position: center 54%;
  }
  .hero-cover-art { z-index: -4; }
  .hero-cover-video { z-index: -3; }

  @media (max-width: 880px) {
    .hero-cover-art,
    .hero-cover-video { object-position: 52% center; }
  }

  @media (prefers-reduced-motion: reduce) {
    .hero-cover-video { display: none; }
  }
```

Repeat the combined responsive selector at the 540 px breakpoint.

- [x] **Step 5: Add the video markup to the rewrite source**

Keep the image first, then place the video immediately before `.hero-content`:

```jsx
        <img
          className="hero-cover-art"
          src="cover-hero.png"
          alt="Two astronauts overlook a futuristic city beneath a colossal planet."
        />
        <video
          className="hero-cover-video"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster="cover-hero.png"
          aria-hidden="true"
        >
          <source src="cover-hero.mp4" type="video/mp4" />
        </video>
```

- [x] **Step 6: Synchronize the embedded template mechanically**

Decode the JSON inside `script[type="__bundler/template"]`, replace the exact current media CSS and image-only JSX with the updated strings from `scripts/rewrite-cinematic-hero.mjs`, serialize the JSON while escaping closing script tags as `<\\/script>`, and write the payload back to `index.html`. Do not edit unrelated generated content.

- [x] **Step 7: Run the GREEN checks**

Run:

```bash
node --test tests/hero-cover.test.mjs
node --check scripts/rewrite-cinematic-hero.mjs
git diff --check
```

Expected: 7 tests pass, 0 fail; syntax and whitespace checks exit 0.

- [x] **Step 8: Commit the video implementation**

```bash
git add cover-hero.mp4 index.html scripts/rewrite-cinematic-hero.mjs tests/hero-cover.test.mjs docs/superpowers/plans/2026-07-19-video-cover-hero.md
git commit -m "Add video background to cinematic hero"
```

---

### Task 2: Verify playback and responsive fallback

**Files:**
- Modify if validation exposes an issue: `scripts/rewrite-cinematic-hero.mjs`
- Modify mechanically if validation exposes an issue: `index.html`
- Test: `tests/hero-cover.test.mjs`

**Interfaces:**
- Consumes: `cover-hero.mp4`, `.hero-cover-video`, `.hero-cover-art`, and the current hero DOM.
- Produces: verified desktop and mobile video playback with still-image fallback and no regression to the CTA or page layout.

- [x] **Step 1: Reload the existing local feature preview**

Use `http://127.0.0.1:4174/` and reload after the static-file changes.

- [x] **Step 2: Inspect desktop at 1440×900**

Verify the video has `readyState >= 2`, `paused === false`, `muted === true`, `loop === true`, fills the hero, and preserves readable copy, the planet, city, and astronauts. Confirm the hero has one video, one fallback image, one CTA, no canvas, and no horizontal overflow.

- [x] **Step 3: Inspect mobile at 390×844**

Verify autoplay remains active and muted, the crop retains the astronauts and architecture, copy and CTA do not overlap, the footer follows the hero, and the document has no horizontal overflow.

- [x] **Step 4: Verify the reduced-motion fallback**

Confirm the stylesheet includes the reduced-motion rule, the still image remains in the DOM beneath the video, and the still has the existing accessible alt text. Browser emulation is not required when the selected browser cannot override media preferences.

- [x] **Step 5: Check browser logs**

Confirm there are no new video, media, React, or asset-loading errors. The repository’s pre-existing Babel standalone development warning is not introduced by this change.

- [x] **Step 6: Run final verification**

Run:

```bash
node --test tests/hero-cover.test.mjs
node --check scripts/rewrite-cinematic-hero.mjs
git diff --check
git status --short --branch
```

Expected: 7 tests pass, all checks exit 0, and the branch is clean after any verification record commit.
