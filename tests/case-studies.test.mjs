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
    'Scaling a $4B energy transmission portfolio without scaling senior headcount.'
  );
  assert.equal(
    CASE_STUDIES[1].title,
    'Compressing the spacecraft design-test-redesign cycle.'
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

const html = readFileSync(new URL('../case-studies.html', import.meta.url), 'utf8');

test('renders the gallery and both complete stories', () => {
  assert.match(html, /<main[^>]*class="case-studies"/);
  assert.equal((html.match(/class="case-panel"/g) ?? []).length, 2);
  assert.doesNotMatch(html, /class="case-gallery"/);
  assert.match(html, /<section class="reader"/);
  assert.match(html, /id="energy-transmission"/);
  assert.match(html, /id="spacecraft-engineering"/);
  assert.match(html, /Scaling a \$4B energy transmission portfolio/);
  assert.match(html, /A \$2\.3B satellite-platform manufacturer/);
  assert.match(html, /\$XXXM in estimated additional revenue/);
});

test('starts directly with the detailed reader and side selector', () => {
  assert.doesNotMatch(html, /class="case-card/);
  assert.doesNotMatch(html, /<header class="page-intro">/);
  assert.doesNotMatch(html, />Case Studies<\/h1>/);
  assert.doesNotMatch(html, /Case study 0[12]/);
  assert.match(html, /class="case-switch"[\s\S]*<img src="assets\/case-studies\/transmission-infrastructure\.png"/);
  assert.match(css, /\.reader\s*\{[\s\S]*grid-template-columns:/);
  assert.match(css, /\.case-switch img\s*\{[\s\S]*height:\s*64px/);
  assert.match(css, /\.impact-list\s*\{[\s\S]*list-style:\s*disc/);
  assert.doesNotMatch(css, /\.impact-list li\s*\{[\s\S]*min-height:\s*170px/);
  assert.match(css, /\.case-hero\s*\{[\s\S]*max-width|\.case-hero\s*\{[\s\S]*width:\s*min\(100%,\s*432px/);
  assert.match(css, /\.case-hero\s*\{[\s\S]*margin:\s*0 auto/);
  assert.match(css, /\.story-header h2\s*\{[\s\S]*text-align:\s*center/);
  assert.match(css, /\.case-cta a\s*\{[\s\S]*font-size:\s*16px/);
});

test('renders accessible local imagery and conversion links', () => {
  assert.match(html, /src="assets\/case-studies\/transmission-infrastructure\.png"/);
  assert.match(html, /src="assets\/case-studies\/spacecraft-engineering\.png"/);
  assert.match(html, /alt="A pixel-art transmission network/);
  assert.match(html, /alt="A pixel-art spacecraft stands/);
  assert.match(html, /href="https:\/\/calendar\.app\.google\/t69X39w3jLLAKn3L7"/);
  assert.match(html, /Book a free consultation/);
  assert.match(html, />Ferry Platform<\/a>/);
  assert.match(html, /class="nav-cta"[\s\S]*Book a consultation[\s\S]*Book a call/);
});

test('keeps every story section and bullet visible in static markup', () => {
  assert.equal((html.match(/>Company<\/h3>/g) ?? []).length, 2);
  assert.equal((html.match(/>The problem<\/h3>/g) ?? []).length, 2);
  assert.equal((html.match(/>Ferry platform<\/h3>/g) ?? []).length, 2);
  assert.equal((html.match(/>Impact<\/h3>/g) ?? []).length, 2);
  assert.match(html, /Find and validate evidence from previous projects/);
  assert.match(html, /Preserve design intent across iterations/);
});

const css = readFileSync(new URL('../case-studies.css', import.meta.url), 'utf8');

test('uses the Ferry visual system and master-detail layout', () => {
  assert.match(css, /@font-face[\s\S]*Geist Pixel/);
  assert.match(css, /@font-face[\s\S]*Google Sans/);
  assert.match(css, /--orbit:\s*#2a5bff/i);
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
  assert.match(css, /backdrop-filter:\s*blur\(18px\)/);
  assert.match(css, /\.site-header\s*\{[\s\S]*position:\s*fixed/);
  assert.match(css, /\.header-link\s*\{[\s\S]*font-family:\s*'Geist Pixel'/);
  assert.match(html, /<a class="brand"[^>]*>\s*<img[^>]*>\s*<\/a>/);
  assert.match(css, /\.brand\s*\{[\s\S]*width:\s*40px/);
  assert.match(css, /\.brand img\s*\{[\s\S]*mix-blend-mode:\s*screen/);
  assert.doesNotMatch(css, /animation:\s*[^n]/);
});

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

const landingOuter = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const landingMatch = landingOuter.match(
  /<script type="__bundler\/template">\s*([\s\S]*?)\s*<\/script>/
);
assert.ok(landingMatch, 'landing-page embedded template exists');
const landingTemplate = JSON.parse(landingMatch[1]);

test('links to case studies without changing landing conversion copy', () => {
  assert.match(landingTemplate, /label:\s*'Case Studies'/);
  assert.match(landingTemplate, /href:\s*'case-studies\.html'/);
  assert.match(landingTemplate, /label:\s*'Ferry Platform'/);
  assert.match(landingTemplate, /className="nav-cta"/);
  assert.match(landingTemplate, /nav-cta-short">Book a call/);
  assert.match(landingTemplate, /AI for the companies building the physical future\./);
  assert.match(landingTemplate, /Book a free consultation/);
  assert.match(landingTemplate, /Ferry Labs, San Francisco/);
});
