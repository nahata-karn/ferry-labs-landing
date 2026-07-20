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
  assert.equal((html.match(/>Start a Deployment <span/g) ?? []).length, 2);
});

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
  assert.match(css, /@media \(max-width:\s*1100px\)/);
  assert.match(css, /@media \(max-width:\s*760px\)/);
  assert.match(css, /@media \(prefers-reduced-motion:\s*reduce\)/);
});

test('marks Ferry Platform as the current navigation destination', () => {
  assert.match(
    html,
    /href="ferry-platform\.html" aria-current="page">Ferry Platform<\/a>/
  );
  assert.match(html, /href="case-studies\.html">Case Studies<\/a>/);
});

test('renders every supplied content block without rewriting it', () => {
  const suppliedCopy = [
    PLATFORM_PAGE.title,
    PLATFORM_PAGE.intro,
    ...PLATFORM_PAGE.customByDesign,
    ...PLATFORM_PAGE.howWeWork.flatMap(([title, body]) => [title, body]),
    ...PLATFORM_PAGE.includes.map(([copy]) => copy),
    ...PLATFORM_PAGE.environments,
    ...PLATFORM_PAGE.engagement,
    PLATFORM_PAGE.closingTitle,
    PLATFORM_PAGE.closingBody
  ];

  for (const copy of suppliedCopy) {
    assert.ok(html.includes(copy), `missing supplied copy: ${copy}`);
  }
});

test('is semantic, dependency-free, and readable without JavaScript', () => {
  assert.equal((html.match(/<h1/g) ?? []).length, 1);
  assert.equal((html.match(/<h2/g) ?? []).length, 6);
  assert.doesNotMatch(html, /<script/i);
  assert.doesNotMatch(html, /https?:\/\/(?!calendar\.app\.google)/i);
  assert.match(html, /aria-current="page"/);
  assert.match(html, /alt="A pixel-art satellite rises/);
});
