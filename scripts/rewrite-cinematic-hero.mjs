import { readFileSync, writeFileSync } from 'node:fs';

const indexPath = process.argv[2] ?? 'index.html';
const outer = readFileSync(indexPath, 'utf8');
const openTag = '<script type="__bundler/template">';
const openIndex = outer.indexOf(openTag);
assertFound(openIndex, 'embedded template opening tag');
const payloadStart = outer.indexOf('\n', openIndex + openTag.length) + 1;
const payloadEnd = outer.indexOf('</script>', payloadStart);
assertFound(payloadStart - 1, 'embedded template payload start');
assertFound(payloadEnd, 'embedded template closing tag');

let template = JSON.parse(outer.slice(payloadStart, payloadEnd).trim());

function assertFound(index, label) {
  if (index < 0) throw new Error(`Could not find ${label}`);
}

function replaceBetween(source, startMarker, endMarker, replacement, label) {
  const start = source.indexOf(startMarker);
  const end = source.indexOf(endMarker, start + startMarker.length);
  assertFound(start, `${label} start`);
  assertFound(end, `${label} end`);
  if (source.indexOf(startMarker, start + startMarker.length) !== -1) {
    throw new Error(`${label} start marker is not unique`);
  }
  return source.slice(0, start) + replacement + source.slice(end);
}

function replaceExact(source, before, after, label) {
  const start = source.indexOf(before);
  assertFound(start, label);
  if (source.indexOf(before, start + before.length) !== -1) {
    throw new Error(`${label} is not unique`);
  }
  return source.slice(0, start) + after + source.slice(start + before.length);
}

const heroStyles = `  /* ---------- Cinematic cover hero ---------- */
  html,
  body {
    height: 100%;
    overflow: hidden;
  }
  #app {
    height: 100svh;
    min-height: 0;
    overflow: hidden;
  }
  .hero {
    position: relative;
    z-index: 1;
    flex: 1 1 auto;
    min-height: 0;
    height: auto;
    width: 100%;
    max-width: none;
    min-height: calc(100svh - 64px);
    margin: 0;
    padding: 0;
    overflow: hidden;
    isolation: isolate;
    display: flex;
    background: var(--void);
  }
  .hero-cover-art,
  .hero-cover-video {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    display: block;
    object-fit: cover;
    object-position: center 54%;
  }
  .hero-cover-art { z-index: -4; }
  .hero-cover-video { z-index: -3; }
  .hero::before {
    content: '';
    position: absolute;
    inset: 0;
    z-index: -2;
    background:
      linear-gradient(90deg, rgba(2,5,24,0.94) 0%, rgba(3,8,31,0.76) 31%, rgba(4,11,40,0.18) 66%, rgba(3,8,28,0.06) 100%),
      linear-gradient(180deg, rgba(2,5,22,0.62) 0%, rgba(2,5,22,0.08) 48%, rgba(2,5,22,0.38) 100%);
    pointer-events: none;
  }
  .hero::after {
    content: '';
    position: absolute;
    inset: auto 0 0;
    z-index: -1;
    height: 22%;
    background: linear-gradient(180deg, transparent, rgba(10,10,11,0.52));
    pointer-events: none;
  }
  .hero-content {
    width: 100%;
    box-sizing: border-box;
    min-height: 0;
    margin: 0 auto;
    padding: clamp(72px, 10vh, 116px) clamp(32px, 5vw, 72px) 24px;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-start;
  }
  .hero-grid {
    display: block;
    width: 100%;
    max-width: 900px;
  }
  .hero-copy {
    max-width: 760px;
    margin-top: 30px;
  }
  .brand-name { font-family: 'Google Sans', 'Inter', sans-serif; }
  .headline {
    font-family: 'Geist Pixel', 'Inter', sans-serif;
    font-size: clamp(36px, 5vw, 66px);
    font-weight: 300;
    letter-spacing: -0.025em;
    line-height: 1.02;
    color: var(--white);
    margin: 0;
    text-wrap: balance;
    white-space: pre-line;
    text-shadow: 0 2px 28px rgba(1,4,20,0.48);
  }
  .lede {
    font-family: 'Google Sans', 'Inter', sans-serif;
    font-size: 16px;
    line-height: 1.58;
    text-align: left;
    color: var(--white);
    margin: 0;
    text-wrap: pretty;
    font-weight: 400;
    white-space: pre-line;
    text-shadow: 0 1px 18px rgba(1,4,20,0.72);
  }
  .hero .cta-tiles {
    position: relative;
    z-index: 2;
    width: auto;
    max-width: none;
    margin: 30px 0 0;
    padding: 0;
    display: flex;
    justify-content: flex-start !important;
  }
  .hero .cta-tiles > * {
    grid-column: auto;
    justify-self: auto;
    margin-left: 0;
  }
  @media (max-width: 880px) {
    .hero { min-height: calc(100svh - 64px); }
    .hero-content { padding: 72px 24px 56px; }
    .hero-grid { max-width: 640px; }
    .hero-cover-art,
    .hero-cover-video { object-position: 52% center; }
    .hero::before {
      background:
        linear-gradient(90deg, rgba(2,5,24,0.94) 0%, rgba(3,8,31,0.72) 55%, rgba(4,11,40,0.18) 100%),
        linear-gradient(180deg, rgba(2,5,22,0.68) 0%, rgba(2,5,22,0.08) 50%, rgba(2,5,22,0.48) 100%);
    }
  }
  @media (max-width: 540px) {
    .hero { min-height: calc(100svh - 56px); }
    .hero-content { padding: 52px 20px 44px; }
    .hero-grid h1 { font-size: clamp(30px, 9vw, 42px) !important; }
    .hero-copy { margin-top: 24px; }
    .hero .lede { font-size: 15px !important; line-height: 1.5; }
    .hero .lede br { display: none; }
    .hero .cta-tiles { margin-top: 24px; }
    .hero-cover-art,
    .hero-cover-video { object-position: 52% center; }
    .hero::before {
      background:
        linear-gradient(90deg, rgba(2,5,24,0.94) 0%, rgba(3,8,31,0.72) 70%, rgba(4,11,40,0.25) 100%),
        linear-gradient(180deg, rgba(2,5,22,0.78) 0%, rgba(2,5,22,0.12) 55%, rgba(2,5,22,0.55) 100%);
    }
  }
  @media (prefers-reduced-motion: reduce) {
    .hero-cover-video { display: none; }
  }

`;

template = replaceBetween(
  template,
  '  /* ---------- Hero ---------- */',
  '  /* ---------- Spherical grid (closing) ---------- */',
  heroStyles,
  'hero styles'
);

template = replaceBetween(
  template,
  'function FloorGrid({ accent }) {',
  'const LOGOS = [',
  '',
  'FloorGrid component'
);

template = replaceExact(
  template,
  `    .hero { padding: 80px 24px 100px; }
    .hero-grid { grid-template-columns: 1fr; gap: 32px; width: auto; max-width: 100%; }
    .hero-grid > div { min-width: 0; max-width: 100%; }
    .hero-grid h1, .hero-grid h2, .hero-grid p { max-width: 100% !important; width: auto !important; }
    .floor-grid { height: 340px; margin-top: 0; }
`,
  '',
  'legacy tablet hero overrides'
);

template = replaceExact(
  template,
  '    .hero { padding: 60px 20px 80px; }\n',
  '',
  'legacy mobile hero padding'
);

template = replaceExact(
  template,
  '  "headline": "Turn your expert knowledge\\ninto autonomous agents.",',
  '  "headline": "AI for the companies building the physical future.",',
  'hero headline default'
);

template = replaceExact(
  template,
  `              <div className="brand">
                <img src="ferry-logo.png" alt="Ferry Labs" style={{ height: "42px", width: "auto", display: "block" }} />
              </div>`,
  `          <div className="brand">
            <img src="ferry-logo.png" alt="Ferry Labs" style={{ height: "42px", width: "auto", display: "block" }} />
            <span className="brand-name">Ferry Labs</span>
          </div>`,
  'Ferry Labs brand wordmark'
);

const heroMarkup = `      <section className="hero" data-screen-label="Hero">
        <img
          className="hero-cover-art"
          src="cover-hero.png"
          alt="Two astronauts overlook a futuristic city beneath a colossal planet."
        />
        <video
          className="hero-cover-video"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster="cover-hero.png"
          aria-hidden="true"
        >
          <source src="cover-hero.mp4" type="video/mp4" />
        </video>
        <div className="hero-content">
          <div className="hero-grid">
            <div>
                  <h1 className="headline" style={{ maxWidth: "860px", textAlign: "left" }}>{tweaks.headline}</h1>
            </div>
            <div className="hero-copy">
              <p className="lede">We build intelligent systems that learn from your experts and take on the most complex work your company depends on.</p>
            </div>
          </div>

          <div className="cta-tiles">
            <button className="cta-tile primary" onClick={openBooking}>
              <span style={{ fontSize: "16px", fontFamily: "'Google Sans', 'Inter', sans-serif" }}>{tweaks.ctaLabel}</span>
              <span className="tile-arrow" aria-hidden>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="6" y1="18" x2="18" y2="6" />
                  <polyline points="9 6 18 6 18 15" />
                </svg>
              </span>
            </button>
          </div>
        </div>
      </section>

`;

template = replaceBetween(
  template,
  '      <section className="hero" data-screen-label="Hero">',
  '      <footer className="meta-strip"',
  heroMarkup,
  'hero markup'
);

const serializedTemplate = JSON.stringify(template).replace(
  /<\/script>/gi,
  '<\\/script>'
);

const updated =
  outer.slice(0, payloadStart) +
  serializedTemplate +
  '\n  ' +
  outer.slice(payloadEnd);

writeFileSync(indexPath, updated);
