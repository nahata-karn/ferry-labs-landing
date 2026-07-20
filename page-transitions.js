(() => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const hasNativeTransition = typeof document.startViewTransition === 'function';

  if (reduceMotion || hasNativeTransition) return;

  const root = document.documentElement;
  const hasClass = (name) => (` ${root.className} `).includes(` ${name} `);
  const addClass = (name) => {
    if (!hasClass(name)) root.className = `${root.className} ${name}`.trim();
  };

  addClass('ferry-transition-fallback');

  document.addEventListener('click', (event) => {
    if (
      event.defaultPrevented ||
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey
    ) return;

    const target = event.target;
    const link = target && typeof target.closest === 'function'
      ? target.closest('a[href]')
      : null;
    if (
      !link ||
      link.target === '_blank' ||
      link.hasAttribute('download') ||
      link.origin !== window.location.origin ||
      (link.pathname === window.location.pathname &&
        link.search === window.location.search &&
        link.hash)
    ) return;

    event.preventDefault();
    if (hasClass('ferry-page-leaving')) return;

    addClass('ferry-page-leaving');
    window.setTimeout(() => window.location.assign(link.href), 180);
  }, true);
})();
