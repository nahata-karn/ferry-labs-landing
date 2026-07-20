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
  context: '<path d="M4 4h5v5H4zM15 4h5v5h-5zM9 15h6v6H9zM9 6h6v2H9zM11 8h2v7h-2z"/>',
  agents: '<path d="M4 4h16v16H4zM7 8h2v2H7zM15 8h2v2h-2zM8 14h8v2H8z"/>',
  evaluations: '<path d="M4 4h16v16H4zM7 8h2v2H7zM11 8h6v2h-6zM7 13h2v2H7zM11 13h6v2h-6z"/>',
  integrations: '<path d="M3 7h7v4H3zM14 7h7v4h-7zM8 15h8v4H8zM10 8h4v2h-4zM11 10h2v5h-2z"/>',
  review: '<path d="M4 4h16v16H4zM7 12l3 3 7-7 2 2-9 9-5-5z"/>',
  controlled: '<path d="M5 18h4v3H5zM10 14h4v7h-4zM15 10h4v11h-4zM4 5h16v3H4z"/>'
};

const pixelIcon = (name) => `<svg class="pixel-icon pixel-icon-${name}" viewBox="0 0 24 24" aria-hidden="true" shape-rendering="crispEdges">${iconPaths[name]}</svg>`;

const engagementSchematic = `<svg class="system-schematic engagement-schematic" viewBox="0 0 520 240" aria-hidden="true" shape-rendering="crispEdges">
  <g class="schematic-muted"><rect x="36" y="44" width="152" height="152"/><rect x="332" y="44" width="152" height="152"/></g>
  <g class="schematic-accent">
    <rect x="84" y="72" width="56" height="48"/><rect x="64" y="136" width="96" height="36"/>
    <rect x="380" y="72" width="56" height="48"/><rect x="360" y="136" width="96" height="36"/>
    <path d="M188 104h48V88l24 32-24 32v-16h-48zM332 136h-48v16l-24-32 24-32v16h48z"/>
  </g>
</svg>`;

export function renderFerryPlatformPage(page = PLATFORM_PAGE) {
  const steps = page.howWeWork.map(([title, body, icon], index) => `
        <article class="process-step">
          <span class="step-number">${String(index + 1).padStart(2, '0')}</span>
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
        <span class="nav-cta-label">Book a consultation</span>
        <span class="nav-cta-short">Book a call</span>
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
      <div class="engagement-schematic-wrap">${engagementSchematic}</div>
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
