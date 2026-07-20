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
    'Scaling a $4B project portfolio without scaling senior headcount.'
  );
  assert.equal(
    CASE_STUDIES[1].title,
    'Making spacecraft engineering move at production speed.'
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
  assert.equal((html.match(/class="case-card"/g) ?? []).length, 2);
  assert.equal((html.match(/class="case-panel"/g) ?? []).length, 2);
  assert.match(html, /id="energy-transmission"/);
  assert.match(html, /id="spacecraft-engineering"/);
  assert.match(html, /Scaling a \$4B project portfolio/);
  assert.match(html, /A \$2\.3B satellite-platform manufacturer/);
  assert.match(html, /\$XXXM in estimated additional revenue/);
});

test('keeps the opening gallery compact, title-only, and uncropped', () => {
  const gallery = html.slice(
    html.indexOf('<section class="case-gallery"'),
    html.indexOf('<section class="reader"')
  );

  assert.doesNotMatch(gallery, /class="case-number"/);
  assert.doesNotMatch(gallery, /class="case-domain"/);
  assert.doesNotMatch(gallery, /class="case-link-label"/);
  assert.doesNotMatch(gallery, /Read case study/);
  assert.match(css, /\.case-gallery\s*\{[\s\S]*max-width:\s*952px/);
  assert.match(css, /\.page-intro h1\s*\{[\s\S]*text-align:\s*center/);
  assert.match(css, /\.case-card-media\s*\{[\s\S]*aspect-ratio:\s*1\s*\/\s*1/);
  assert.match(css, /\.case-card-media img\s*\{[\s\S]*object-fit:\s*contain/);
});

test('renders accessible local imagery and conversion links', () => {
  assert.match(html, /src="assets\/case-studies\/transmission-infrastructure\.png"/);
  assert.match(html, /src="assets\/case-studies\/spacecraft-engineering\.png"/);
  assert.match(html, /alt="A pixel-art transmission network/);
  assert.match(html, /alt="A pixel-art spacecraft stands/);
  assert.match(html, /href="https:\/\/calendar\.app\.google\/t69X39w3jLLAKn3L7"/);
  assert.match(html, /Book a free consultation/);
});

test('keeps every story section and bullet visible in static markup', () => {
  assert.equal((html.match(/>Company<\/h3>/g) ?? []).length, 2);
  assert.equal((html.match(/>The problem<\/h3>/g) ?? []).length, 2);
  assert.equal((html.match(/>The Ferry platform<\/h3>/g) ?? []).length, 2);
  assert.equal((html.match(/>Impact<\/h3>/g) ?? []).length, 2);
  assert.match(html, /Find and validate evidence from previous projects/);
  assert.match(html, /Preserve design intent across iterations/);
});

const css = readFileSync(new URL('../case-studies.css', import.meta.url), 'utf8');

test('uses the Ferry visual system and master-detail layout', () => {
  assert.match(css, /@font-face[\s\S]*Geist Pixel/);
  assert.match(css, /@font-face[\s\S]*Google Sans/);
  assert.match(css, /--orbit:\s*#2a5bff/i);
  assert.match(css, /\.case-gallery\s*\{[\s\S]*grid-template-columns:\s*repeat\(2,/);
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
  assert.doesNotMatch(css, /backdrop-filter/);
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
  assert.match(landingTemplate, /AI for the companies building the physical future\./);
  assert.match(landingTemplate, /Book a free consultation/);
  assert.match(landingTemplate, /Ferry Labs, San Francisco/);
});
