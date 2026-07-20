import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const outer = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const templateMatch = outer.match(
  /<script type="__bundler\/template">\s*([\s\S]*?)\s*<\/script>/
);

assert.ok(templateMatch, 'embedded template payload exists');
const template = JSON.parse(templateMatch[1]);
const sourceVideoPath =
  '/Users/karn/Downloads/u8954488552_create_a_futuristic_image_of_astronauts_building__e595c0d8-9da3-4f54-84c6-366e8c901297_0.mp4';

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
  assert.match(template, /Book a free consultation/);
  assert.match(template, /https:\/\/calendar\.app\.google\/t69X39w3jLLAKn3L7/);
  assert.match(template, /className="meta-strip"/);
  assert.match(template, /Ferry Labs, San Francisco/);
  assert.match(template, /position: absolute; z-index: 3/);
  assert.doesNotMatch(template, /New York/);
});

test('includes explicit desktop and mobile framing', () => {
  assert.match(template, /#app\s*\{[\s\S]*height:\s*100svh/);
  assert.match(template, /\.hero\s*\{[\s\S]*flex:\s*1 1 auto/);
  assert.match(template, /\.hero\s*\{[\s\S]*min-height:\s*0/);
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

test('fits the hero to the viewport and expands the left content lockup', () => {
  assert.match(template, /html, body\s*\{[\s\S]*overflow:\s*hidden/);
  assert.match(template, /#app\s*\{[\s\S]*height:\s*100svh/);
  assert.match(template, /\.hero\s*\{[\s\S]*flex:\s*1 1 auto/);
  assert.match(template, /\.hero\s*\{[\s\S]*min-height:\s*0/);
  const heroStylesStart = template.indexOf(
    '/* ---------- Cinematic cover hero ---------- */'
  );
  const heroStylesEnd = template.indexOf('@media (max-width: 880px)', heroStylesStart);
  const heroBaseStyles = template.slice(heroStylesStart, heroStylesEnd);
  assert.doesNotMatch(heroBaseStyles, /min-height:\s*calc\(100svh/);
  assert.match(
    template,
    /padding:\s*clamp\(116px, 15vh, 164px\) clamp\(32px, 5vw, 72px\) 24px/
  );
  assert.match(template, /\.hero-grid\s*\{[\s\S]*max-width:\s*900px/);
  assert.match(template, /\.hero-copy\s*\{[\s\S]*max-width:\s*760px/);
  assert.match(template, /maxWidth: "860px"/);
});

test('renders the Ferry Labs wordmark beside the logo', () => {
  assert.match(template, /className="brand-name">Ferry Labs<\/span>/);
  assert.match(
    template,
    /\.brand-name\s*\{[\s\S]*font-family:\s*'Google Sans'/
  );
});
