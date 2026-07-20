import { readFileSync, writeFileSync } from 'node:fs';

const path = process.argv[2] ?? 'index.html';
const outer = readFileSync(path, 'utf8');
const open = '<script type="__bundler/template">';
const start = outer.indexOf(open);
const end = outer.indexOf('</script>', start);

if (start < 0 || end < 0) {
  throw new Error('Embedded template not found');
}

let template = JSON.parse(outer.slice(start + open.length, end).trim());
const desiredNav = `const NAV = [
  { label: 'Case Studies', href: 'case-studies.html' },
  { label: 'Ferry Platform', href: 'ferry-platform.html' }
];`;
template = template.replace(/const NAV = \[[\s\S]*?\];/, desiredNav);

const navCssStart = template.indexOf('  .nav-wrap {');
const navCssEnd = template.indexOf('  /* ---------- Cinematic cover hero ---------- */', navCssStart);
if (navCssStart < 0 || navCssEnd < 0) {
  throw new Error('Landing navigation CSS not found');
}

const navCss = `  .nav-wrap {
    position: fixed;
    z-index: 50;
    top: 14px;
    left: 50%;
    width: max-content;
    max-width: calc(100% - 24px);
    transform: translateX(-50%);
  }
  .nav {
    width: auto;
    height: 64px;
    padding: 7px;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    gap: 18px;
    border: 1px solid rgba(255,255,255,0.18);
    border-radius: 18px;
    background: rgba(17,24,45,0.58);
    -webkit-backdrop-filter: blur(18px) saturate(140%);
    backdrop-filter: blur(18px) saturate(140%);
    box-shadow: 0 12px 38px rgba(2,5,20,0.24), inset 0 1px 0 rgba(255,255,255,0.08);
  }
  .brand {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    padding: 0;
    flex: 0 0 auto;
    border-radius: 11px;
    background: rgba(255,255,255,0.13);
  }
  .brand img {
    width: 30px !important;
    height: auto !important;
    display: block;
  }
  .nav-links { display: flex; align-items: center; justify-content: flex-start; gap: 18px; }
  .nav-link {
    padding: 10px 4px;
    color: rgba(255,255,255,0.76);
    font-family: 'Geist Pixel', 'Google Sans', 'Inter', sans-serif;
    font-size: 14px;
    font-weight: 400;
    letter-spacing: 0;
    text-transform: none;
    white-space: nowrap;
    transition: color .2s ease;
  }
  .nav-link:hover, .nav-link:focus-visible { color: var(--white); outline: none; }
  .nav-cta {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    padding: 12px 16px;
    border-radius: 11px;
    background: var(--orbit);
    color: var(--white);
    font-family: 'Geist Pixel', 'Google Sans', 'Inter', sans-serif;
    font-size: 14px;
    font-weight: 500;
    white-space: nowrap;
    box-shadow: inset 0 1px 0 rgba(255,255,255,0.16);
    transition: background .2s ease, transform .2s ease;
  }
  .nav-cta:hover, .nav-cta:focus-visible { background: #3a69ff; transform: translateY(-1px); outline: none; }
  .nav-cta-short { display: none; }
  @media (max-width: 540px) {
    .nav-wrap { top: 8px; width: max-content; max-width: calc(100% - 16px); }
    .nav { height: 54px; padding: 6px; gap: 8px; border-radius: 15px; }
    .brand { width: 36px; height: 36px; padding: 0; }
    .brand img { width: 27px !important; height: auto !important; }
    .nav-links { gap: 8px; }
    .nav-link { padding: 8px 1px; font-size: 11px; }
    .nav-cta { padding: 10px 12px; font-size: 12px; }
    .nav-cta-label { display: none; }
    .nav-cta-short { display: inline; }
  }

`;
template = template.slice(0, navCssStart) + navCss + template.slice(navCssEnd);

const navMarkupStart = template.indexOf('      <div className="nav-wrap">');
const navMarkupEnd = template.indexOf('\n\n      <section className="hero"', navMarkupStart);
if (navMarkupStart < 0 || navMarkupEnd < 0) {
  throw new Error('Landing navigation markup not found');
}

const navMarkup = `      <div className="nav-wrap">
        <nav className="nav" aria-label="Primary">
          <a className="brand" href="index.html" aria-label="Ferry Labs home">
            <img src="ferry-logo-mark.png" alt="" />
          </a>
          <div className="nav-links">
            {NAV.map((item) =>
            <a key={item.label} className="nav-link" href={item.href}>{item.label}</a>
            )}
            <a className="nav-cta" href={BOOKING_URL} target="_blank" rel="noopener noreferrer">
              <span className="nav-cta-label">Start deployment</span>
              <span className="nav-cta-short">Start deployment</span>
              <span aria-hidden>↗</span>
            </a>
          </div>
        </nav>
      </div>`;
template = template.slice(0, navMarkupStart) + navMarkup + template.slice(navMarkupEnd);

const heroCtaStart = template.indexOf('          <div className="cta-tiles">');
const heroCtaEnd = template.indexOf('\n          </div>', heroCtaStart);
if (heroCtaStart < 0 || heroCtaEnd < 0) {
  throw new Error('Landing hero CTA markup not found');
}

const heroCtaMarkup = `          <div className="cta-tiles">
            <button className="cta-tile primary" onClick={openBooking}>
              <span style={{ fontSize: "16px", fontFamily: "'Google Sans', 'Inter', sans-serif" }}>Start deployment</span>
              <span className="tile-arrow" aria-hidden>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="6" y1="18" x2="18" y2="6" />
                  <polyline points="9 6 18 6 18 15" />
                </svg>
              </span>
            </button>
            <a className="cta-tile secondary" href="case-studies.html">
              <span style={{ fontSize: "16px", fontFamily: "'Google Sans', 'Inter', sans-serif" }}>Case Studies</span>
              <span className="tile-arrow" aria-hidden>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="6" y1="18" x2="18" y2="6" />
                  <polyline points="9 6 18 6 18 15" />
                </svg>
              </span>
            </a>
          </div>`;
template = template.slice(0, heroCtaStart) + heroCtaMarkup + template.slice(heroCtaEnd + '\n          </div>'.length);

const heroCtaCssStart = template.indexOf('  .hero .cta-tiles {');
const heroCtaChildStart = template.indexOf('  .hero .cta-tiles > * {', heroCtaCssStart);
const heroCtaCssEnd = template.indexOf('\n  }', heroCtaChildStart) + '\n  }'.length;
if (heroCtaCssStart < 0 || heroCtaChildStart < 0 || heroCtaCssEnd < 0) {
  throw new Error('Landing hero CTA styles not found');
}

const heroCtaCss = `  .hero .cta-tiles {
    position: relative;
    z-index: 2;
    width: auto;
    max-width: none;
    margin: 30px 0 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
  .hero .cta-tiles > * {
    grid-column: auto;
    justify-self: auto;
    width: 240px;
    margin-left: 0;
  }`;
template = template.slice(0, heroCtaCssStart) + heroCtaCss + template.slice(heroCtaCssEnd);

template = template.replace('"ctaLabel": "Book a free consultation"', '"ctaLabel": "Start deployment"');

template = template.replace('    .nav-links { display: flex; gap: 18px; }', '    .nav-links { display: flex; gap: 14px; }');
template = template.replace('    .nav { padding: 0 20px; }', '    .nav { padding: 7px; }');
template = template.replace('    .nav { height: 56px; }', '    .nav { height: 54px; }');
template = template.replace('    .hero-content { padding: 52px 20px 44px; }', '    .hero-content { padding: 84px 20px 44px; }');

const serialized = JSON.stringify(template).replaceAll('</script>', '<\\/script>');
writeFileSync(
  path,
  outer.slice(0, start + open.length) + serialized + outer.slice(end)
);
