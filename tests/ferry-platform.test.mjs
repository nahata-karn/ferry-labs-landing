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
