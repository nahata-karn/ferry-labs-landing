import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

import { BOOKING_URL, PLATFORM_PAGE } from '../ferry-platform-content.mjs';

const escapeHtml = (value) => value
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;');

const paragraphs = (items) => items
  .map((item) => `<p>${escapeHtml(item)}</p>`)
  .join('');

const iconPaths = {
  outcome: '<path d="M8 4h8v2h4v8h-4v2H8v-2H4V6h4zM10 8h4v4h-4z"/>',
  workflow: '<path d="M3 5h6v5H3zM15 5h6v5h-6zM9 16h6v5H9zM9 7h6v2H9zM11 9h2v7h-2z"/>',
  platform: '<path d="M4 5h16v4H4zM6 11h12v4H6zM8 17h8v4H8z"/>',
  experts: '<path d="M4 5h6v6H4zM14 5h6v6h-6zM2 14h10v6H2zM12 14h10v6H12z"/>',
  improve: '<path d="M3 18h4v3H3zM9 14h4v7H9zM15 9h4v12h-4zM4 6h2v2H4zM6 4h10v2H6zM16 6h2v2h-2z"/>',
  archive: '<path d="M4 5h16v4H4zM6 11h12v8H6zM9 13h6v2H9z"/>',
  agent: '<path d="M6 7h12v12H6zM10 3h4v2h-4zM4 11h2v4H4zM18 11h2v4h-2zM9 11h2v2H9zM13 11h2v2h-2zM10 16h4v1h-4z"/>',
  target: '<path d="M10 3h4v4h-4zM6 7h12v4H6zM3 11h18v4H3zM6 15h12v4H6zM10 19h4v2h-4z"/>',
  bridge: '<path d="M3 16h18v3H3zM5 12h4v4H5zM15 12h4v4h-4zM8 8h8v3H8zM10 5h4v3h-4z"/>',
  approval: '<path d="M4 4h16v16H4zM7 12l3 3 7-7 2 2-9 9-5-5z"/>',
  upgrade: '<path d="M4 18h4v3H4zM10 14h4v7h-4zM16 9h4v12h-4zM5 5h10V3l4 4-4 4V9H5z"/>'
};

const pixelIcon = (name) => `<svg class="pixel-icon pixel-icon-${name}" viewBox="0 0 24 24" aria-hidden="true" shape-rendering="crispEdges">${iconPaths[name]}</svg>`;

export function renderFerryPlatformPage(page = PLATFORM_PAGE) {
  const steps = page.howWeWork.map(([title, body, icon]) => `
        <article class="process-step">
          ${pixelIcon(icon)}
          <h3>${escapeHtml(title)}</h3>
          <p>${escapeHtml(body)}</p>
        </article>`).join('');

  const includes = page.includes.map(([copy, icon]) => `
        <li>
          ${pixelIcon(icon)}
          <span>${escapeHtml(copy)}</span>
        </li>`).join('');

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Ferry Platform — Ferry Labs</title>
  <meta name="description" content="${escapeHtml(page.intro)}">
  <link rel="icon" href="favicon.svg" type="image/svg+xml">
  <link rel="stylesheet" href="ferry-platform.css?v=20260720">
</head>
<body>
  <header class="site-header">
    <a class="brand" href="index.html" aria-label="Ferry Labs home">
      <img src="ferry-logo-mark.png" alt="">
    </a>
    <nav class="site-nav" aria-label="Primary">
      <a class="header-link" href="case-studies.html">Case Studies</a>
      <a class="header-link" href="ferry-platform.html" aria-current="page">Ferry Platform</a>
      <a class="nav-cta" href="${BOOKING_URL}" target="_blank" rel="noopener noreferrer">
        <span class="nav-cta-label">Start deployment</span>
        <span class="nav-cta-short">Start deployment</span>
        <span aria-hidden="true">↗</span>
      </a>
    </nav>
  </header>
  <main class="platform-page">
    <section class="platform-hero">
      <img class="platform-hero-image" src="assets/platform/ferry-platform-opening.png" alt="A pixel-art satellite rises above an ornate futuristic structure and blue-white landscape beneath a vast moon.">
      <h1>${escapeHtml(page.title)}</h1>
      <p>${escapeHtml(page.intro)}</p>
      <a class="primary-cta" href="${BOOKING_URL}" target="_blank" rel="noopener noreferrer">${escapeHtml(page.ctaLabel)} <span aria-hidden="true">↗</span></a>
    </section>

    <section class="editorial-section custom-section">
      <div class="section-copy">
        <h2>Custom by design</h2>
        ${paragraphs(page.customByDesign)}
      </div>
      <figure class="section-image section-image-custom">
        <img src="assets/platform/custom-by-design.png" alt="" loading="lazy">
      </figure>
    </section>

    <section class="editorial-section process-section">
      <h2>How we work</h2>
      <div class="process-rail">${steps}
      </div>
    </section>

    <section class="editorial-section includes-section">
      <h2>What every deployment includes</h2>
      <ul class="includes-grid">${includes}
      </ul>
    </section>

    <section class="editorial-section environment-section">
      <figure class="section-image section-image-environment">
        <img src="assets/platform/environment.png" alt="" loading="lazy">
      </figure>
      <div class="environment-copy">
        <h2>Your environment or ours.</h2>
        ${paragraphs(page.environments)}
      </div>
    </section>

    <section class="editorial-section engagement-section">
      <div>
        <h2>How we engage</h2>
        ${paragraphs(page.engagement)}
      </div>
      <figure class="section-image section-image-engagement">
        <img src="assets/platform/how-we-engage.png" alt="" loading="lazy">
      </figure>
    </section>

    <section class="closing-cta">
      <h2>${escapeHtml(page.closingTitle)}</h2>
      <p>${escapeHtml(page.closingBody)}</p>
      <a class="primary-cta" href="${BOOKING_URL}" target="_blank" rel="noopener noreferrer">${escapeHtml(page.ctaLabel)} <span aria-hidden="true">↗</span></a>
    </section>
  </main>
  <footer class="site-footer">© ${new Date().getFullYear()} Ferry Labs, San Francisco</footer>
</body>
</html>`;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  writeFileSync(new URL('../ferry-platform.html', import.meta.url), renderFerryPlatformPage());
}
