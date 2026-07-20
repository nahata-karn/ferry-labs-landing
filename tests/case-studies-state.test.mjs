import assert from 'node:assert/strict';
import test from 'node:test';
import { hashFor, normalizeSlug } from '../case-studies-state.mjs';

const slugs = ['energy-transmission', 'spacecraft-engineering'];

test('normalizes direct hashes and defaults to the first story', () => {
  assert.equal(normalizeSlug('', slugs), 'energy-transmission');
  assert.equal(normalizeSlug('#energy-transmission', slugs), 'energy-transmission');
  assert.equal(normalizeSlug('#spacecraft-engineering', slugs), 'spacecraft-engineering');
  assert.equal(normalizeSlug('#unknown', slugs), 'energy-transmission');
});

test('creates stable hash URLs', () => {
  assert.equal(hashFor('energy-transmission'), '#energy-transmission');
  assert.equal(hashFor('spacecraft-engineering'), '#spacecraft-engineering');
});
