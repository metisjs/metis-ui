export default {
  '*': { outlineColor: 'var(--primary)' },
  html: { WebkitTapHighlightColor: 'transparent' },
  body: { color: 'var(--text)' },
  'svg.metis-icon': { display: 'inline-block' },
  "[type='search']::-webkit-search-cancel-button, [type='search']::-webkit-search-decoration": {
    display: 'none',
    appearance: 'none',
  },
  ':where(button, [role="button"])': { cursor: 'pointer' },
  a: { color: 'var(--primary)', cursor: 'pointer' },
  'a:hover': { color: 'var(--primary-hover)', cursor: 'pointer' },
  '.popup-arrow:before': {
    clipPath:
      "path('M 0 8 A 4 4 0 0 0 2.82842712474619 6.82842712474619 L 6.585786437626905 3.0710678118654755 A 2 2 0 0 1 9.414213562373096 3.0710678118654755 L 13.17157287525381 6.82842712474619 A 4 4 0 0 0 16 8 Z')",
  },
};
