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
