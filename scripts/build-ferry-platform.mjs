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

export function renderFerryPlatformPage(page = PLATFORM_PAGE) {
  const steps = page.howWeWork.map(([title, body, icon], index) => `
        <article class="process-step">
          <span class="step-number">${String(index + 1).padStart(2, '0')}</span>
          <span class="pixel-icon pixel-icon-${icon}" aria-hidden="true"></span>
          <h3>${escapeHtml(title)}</h3>
          <p>${escapeHtml(body)}</p>
        </article>`).join('');

  const includes = page.includes.map(([copy, icon]) => `
        <li>
          <span class="pixel-icon pixel-icon-${icon}" aria-hidden="true"></span>
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
  <link rel="stylesheet" href="ferry-platform.css">
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
      <div>
        <h2>Custom by design</h2>
        ${paragraphs(page.customByDesign)}
      </div>
      <div class="custom-schematic" aria-hidden="true"></div>
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
      <h2>Your environment or ours.</h2>
      <div class="environment-diagram" aria-hidden="true"></div>
      <div class="environment-copy">${paragraphs(page.environments)}</div>
    </section>

    <section class="editorial-section engagement-section">
      <div>
        <h2>How we engage</h2>
        ${paragraphs(page.engagement)}
      </div>
      <div class="engagement-schematic" aria-hidden="true"></div>
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
