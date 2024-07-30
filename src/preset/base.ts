export default {
  html: { WebkitTapHighlightColor: 'transparent' },
  body: { color: 'hsla(var(--text))' },
  svg: { display: 'inline-block' },
  "[type='search']::-webkit-search-cancel-button, [type='search']::-webkit-search-decoration": {
    display: 'none',
    appearance: 'none',
  },
  'a:not(.metis-btn)': { color: 'hsla(var(--primary))' },
  'a:not(.metis-btn):hover': { color: 'hsla(var(--primary-hover))' },
  '.metis-btn-icon-only.metis-btn-compact-item': {
    flex: 'none',
  },
  '.metis-btn-compact-item.metis-btn-primary:not([disabled]) + .metis-btn-compact-item.metis-btn-primary:not([disabled]):before':
    {
      position: 'absolute',
      insetInlineStart: '-1px',
      display: 'inline-block',
      width: '1px',
      height: '100%',
      backgroundColor: 'hsla(var(--primary-hover))',
      content: '""',
    },
  '.metis-btn-compact-vertical-item.metis-btn-primary:not([disabled]) + .metis-btn-compact-vertical-item.metis-btn-primary:not([disabled]):before':
    {
      position: 'absolute',
      insetInlineStart: '-1px',
      display: 'inline-block',
      width: '100%',
      height: '1px',
      backgroundColor: 'hsla(var(--primary-hover))',
      content: '""',
    },
  '.popup-arrow::before': {
    clipPath:
      "path('M 0 8 A 4 4 0 0 0 2.82842712474619 6.82842712474619 L 6.585786437626905 3.0710678118654755 A 2 2 0 0 1 9.414213562373096 3.0710678118654755 L 13.17157287525381 6.82842712474619 A 4 4 0 0 0 16 8 Z')",
  },
};
