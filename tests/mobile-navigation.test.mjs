import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const landingOuter = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const landingMatch = landingOuter.match(
  /<script type="__bundler\/template">\s*([\s\S]*?)\s*<\/script>/
);
assert.ok(landingMatch, 'landing template exists');
const landingTemplate = JSON.parse(landingMatch[1]);
const caseStudiesHtml = readFileSync(new URL('../case-studies.html', import.meta.url), 'utf8');
const platformHtml = readFileSync(new URL('../ferry-platform.html', import.meta.url), 'utf8');
const caseStudiesCss = readFileSync(new URL('../case-studies.css', import.meta.url), 'utf8');
const platformCss = readFileSync(new URL('../ferry-platform.css', import.meta.url), 'utf8');
const transitions = readFileSync(new URL('../page-transitions.js', import.meta.url), 'utf8');

test('same-origin navigation captures logo clicks before app handlers', () => {
  assert.match(transitions, /document\.addEventListener\('click',[\s\S]*?,\s*true\)/);
});

test('all site headers fit within a narrow viewport', () => {
  for (const source of [landingTemplate, caseStudiesCss, platformCss]) {
    assert.match(source, /width:\s*calc\(100%\s*-\s*16px\)/);
    assert.match(source, /\.site-nav|\.nav-links[\s\S]*flex:\s*1/);
  }
});

test('case-study selector becomes a single-column mobile control', () => {
  assert.match(caseStudiesHtml, /case-studies\.css\?v=20260720-mobile/);
  assert.match(platformHtml, /ferry-platform\.css\?v=20260720-mobile/);
  assert.match(caseStudiesCss, /\.case-switcher\s*\{[\s\S]*grid-template-columns:\s*1fr/);
  assert.match(caseStudiesCss, /\.case-switch\s*\{[\s\S]*min-width:\s*0/);
  assert.match(caseStudiesCss, /\.case-switch img\s*\{[\s\S]*width:\s*52px[\s\S]*height:\s*52px/);
});
