export function normalizeSlug(hash, validSlugs) {
  const requested = decodeURIComponent(String(hash).replace(/^#/, ''));
  return validSlugs.includes(requested) ? requested : validSlugs[0];
}

export function hashFor(slug) {
  return `#${encodeURIComponent(slug)}`;
}
