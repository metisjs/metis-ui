export default {
  html: { WebkitTapHighlightColor: 'transparent' },
  body: { color: 'hsla(var(--text))' },
  'svg.metis-icon': { display: 'inline-block' },
  "[type='search']::-webkit-search-cancel-button, [type='search']::-webkit-search-decoration": {
    display: 'none',
    appearance: 'none',
  },
  a: { color: 'hsla(var(--primary))', cursor: 'pointer' },
  'a:hover': { color: 'hsla(var(--primary-hover))', cursor: 'pointer' },
};
