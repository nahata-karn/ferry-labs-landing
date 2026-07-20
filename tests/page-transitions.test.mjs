import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import test from 'node:test';

const landingOuter = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const landingMatch = landingOuter.match(
  /<script type="__bundler\/template">\s*([\s\S]*?)\s*<\/script>/
);

assert.ok(landingMatch, 'landing-page embedded template exists');

const landingTemplate = JSON.parse(landingMatch[1]);
const caseStudiesCss = readFileSync(new URL('../case-studies.css', import.meta.url), 'utf8');
const platformCss = readFileSync(new URL('../ferry-platform.css', import.meta.url), 'utf8');
const caseStudiesHtml = readFileSync(new URL('../case-studies.html', import.meta.url), 'utf8');
const platformHtml = readFileSync(new URL('../ferry-platform.html', import.meta.url), 'utf8');
const fallbackUrl = new URL('../page-transitions.js', import.meta.url);
const fallback = existsSync(fallbackUrl) ? readFileSync(fallbackUrl, 'utf8') : '';

test('all first-party pages opt into the same cross-document fade', () => {
  for (const source of [landingTemplate, caseStudiesCss, platformCss]) {
    assert.match(source, /@view-transition\s*\{\s*navigation:\s*auto/);
    assert.match(source, /animation-duration:\s*260ms/);
    assert.match(source, /cubic-bezier\(0\.22,\s*1,\s*0\.36,\s*1\)/);
  }
});

test('the sticky navigation remains anchored across pages', () => {
  assert.match(landingTemplate, /\.nav-wrap\s*\{[\s\S]*view-transition-name:\s*ferry-nav/);
  assert.match(caseStudiesCss, /\.site-header\s*\{[\s\S]*view-transition-name:\s*ferry-nav/);
  assert.match(platformCss, /\.site-header\s*\{[\s\S]*view-transition-name:\s*ferry-nav/);
});

test('reduced-motion users receive an instant page change', () => {
  for (const source of [landingTemplate, caseStudiesCss, platformCss]) {
    assert.match(source, /@media \(prefers-reduced-motion:\s*reduce\)/);
    assert.match(
      source,
      /::view-transition-old\(root\),[\s\S]*::view-transition-new\(root\)[\s\S]*animation:\s*none\s*!important/
    );
  }
});

test('unsupported browsers load the shared same-origin navigation fallback', () => {
  for (const source of [landingTemplate, caseStudiesHtml, platformHtml]) {
    assert.match(source, /src="page-transitions\.js"/);
  }

  assert.match(fallback, /document\.startViewTransition/);
  assert.match(fallback, /prefers-reduced-motion:\s*reduce/);
  assert.match(fallback, /event\.metaKey/);
  assert.match(fallback, /link\.origin !== window\.location\.origin/);
  assert.match(fallback, /ferry-page-leaving/);
  assert.match(fallback, /root\.className/);
  assert.doesNotMatch(fallback, /classList/);
});
