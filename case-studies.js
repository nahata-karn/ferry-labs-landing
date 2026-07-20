import { hashFor, normalizeSlug } from './case-studies-state.mjs';

const panels = [...document.querySelectorAll('[data-case-panel]')];
const links = [...document.querySelectorAll('[data-case-link]')];
const reader = document.querySelector('#selected-case-study');
const slugs = panels.map((panel) => panel.dataset.casePanel);
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)');

function selectCase(slug, { focus = false, scroll = false } = {}) {
  const selected = normalizeSlug(`#${slug}`, slugs);

  panels.forEach((panel) => {
    const active = panel.dataset.casePanel === selected;
    panel.hidden = !active;
    panel.setAttribute('aria-hidden', String(!active));
  });

  links.forEach((link) => {
    if (link.dataset.caseLink === selected) {
      link.setAttribute('aria-current', 'true');
    } else {
      link.removeAttribute('aria-current');
    }
  });

  const panel = panels.find((item) => item.dataset.casePanel === selected);
  if (scroll) {
    reader.scrollIntoView({
      block: 'start',
      behavior: reduceMotion.matches ? 'auto' : 'smooth'
    });
  }
  if (focus) panel.focus({ preventScroll: true });
}

links.forEach((link) => {
  link.addEventListener('click', (event) => {
    event.preventDefault();
    const slug = link.dataset.caseLink;
    history.pushState({ caseStudy: slug }, '', hashFor(slug));
    selectCase(slug, { focus: true, scroll: true });
  });
});

const restoreFromLocation = () => {
  selectCase(normalizeSlug(location.hash, slugs));
};

window.addEventListener('popstate', restoreFromLocation);
window.addEventListener('hashchange', restoreFromLocation);

const initial = normalizeSlug(location.hash, slugs);
if (location.hash && location.hash !== hashFor(initial)) {
  history.replaceState({ caseStudy: initial }, '', hashFor(initial));
}
selectCase(initial);
