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
