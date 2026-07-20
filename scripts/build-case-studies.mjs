import { writeFileSync } from 'node:fs';
import { BOOKING_URL, CASE_STUDIES } from '../case-studies-content.mjs';

const escapeHtml = (value) => String(value)
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;');

const renderParagraphs = (paragraphs) =>
  paragraphs.map((text) => `<p>${escapeHtml(text)}</p>`).join('\n');

const renderBullets = (items, className = 'story-list') =>
  `<ul class="${className}">${items.map((item) =>
    `<li>${escapeHtml(item)}</li>`).join('')}</ul>`;

const renderWorkflow = (study) => `
  <ol class="workflow" aria-label="${escapeHtml(study.title)} workflow">
    ${study.workflow.map((step, index) => `
      <li class="workflow-step">
        <span class="workflow-icon icon-${escapeHtml(step.icon)}" aria-hidden="true"></span>
        <span class="workflow-number">0${index + 1}</span>
        <span>${escapeHtml(step.label)}</span>
      </li>`).join('')}
  </ol>`;

const renderPanel = (study) => `
  <article class="case-panel" id="${escapeHtml(study.slug)}"
           data-case-panel="${escapeHtml(study.slug)}" tabindex="-1">
    <figure class="case-hero">
      <img src="${escapeHtml(study.image)}" alt="${escapeHtml(study.imageAlt)}"
           width="2048" height="2048">
    </figure>
    <header class="story-header">
      <h2>${escapeHtml(study.title)}</h2>
    </header>
    <section class="story-section">
      <h3>Company</h3>
      <div class="story-copy">${renderParagraphs(study.company)}</div>
    </section>
    <section class="story-section">
      <h3>The problem</h3>
      <div class="story-copy">
        ${renderParagraphs(study.problem.paragraphs)}
        ${renderBullets(study.problem.bullets)}
        <p>${escapeHtml(study.problem.closing)}</p>
      </div>
    </section>
    <section class="story-section platform-section">
      <h3>Ferry platform</h3>
      <div class="story-copy">
        <p>${escapeHtml(study.platform.intro)}</p>
      </div>
      ${renderWorkflow(study)}
    </section>
    <section class="story-section impact-section">
      <h3>Impact</h3>
      ${renderBullets(study.impact, 'impact-list')}
    </section>
    <aside class="case-cta">
      <a href="${BOOKING_URL}" target="_blank" rel="noopener noreferrer">
        Book a free consultation <span aria-hidden="true">↗</span>
      </a>
    </aside>
  </article>`;

export function renderCaseStudiesPage(studies = CASE_STUDIES) {
  const panels = studies.map(renderPanel).join('\n');
  const switcher = studies.map((study) => `
    <a href="#${escapeHtml(study.slug)}" class="case-switch"
       data-case-link="${escapeHtml(study.slug)}">
      <img src="${escapeHtml(study.image)}" alt="" width="2048" height="2048">
      <span>${escapeHtml(study.title)}</span>
    </a>`).join('\n');

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Case Studies — Ferry Labs</title>
  <meta name="description" content="Selected Ferry Labs case studies.">
  <link rel="icon" href="favicon.svg" type="image/svg+xml">
  <link rel="stylesheet" href="case-studies.css">
  <script>document.documentElement.classList.add('js')</script>
  <script type="module" src="case-studies.js"></script>
</head>
<body>
  <header class="site-header">
    <a class="brand" href="index.html" aria-label="Ferry Labs home">
      <img src="ferry-logo.png" alt="" width="34" height="34">
      <span>Ferry Labs</span>
    </a>
    <a class="header-link" href="case-studies.html" aria-current="page">Case Studies</a>
  </header>
  <main class="case-studies">
    <section class="reader" id="selected-case-study" aria-label="Selected case study">
      <nav class="case-switcher" aria-label="Choose a case study">${switcher}</nav>
      <div class="case-reader">${panels}</div>
    </section>
  </main>
  <footer class="site-footer">© ${new Date().getFullYear()} Ferry Labs, San Francisco</footer>
</body>
</html>`;
}

const output = new URL('../case-studies.html', import.meta.url);
writeFileSync(output, renderCaseStudiesPage());
