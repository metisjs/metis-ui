export default {
  html: { WebkitTapHighlightColor: 'transparent' },
  svg: { display: 'inline-block' },
  "[type='search']::-webkit-search-cancel-button, [type='search']::-webkit-search-decoration": {
    display: 'none',
    appearance: 'none',
  },
  'a:not(.meta-btn)': { color: 'hsla(var(--primary))' },
  'a:not(.meta-btn):hover': { color: 'hsla(var(--primary-hover))' },
  '.meta-btn-icon-only.meta-btn-compact-item': {
    flex: 'none',
  },
  '.meta-btn-compact-item.meta-btn-primary:not([disabled]) + .meta-btn-compact-item.meta-btn-primary:not([disabled]):before':
    {
      position: 'absolute',
      insetInlineStart: '-1px',
      display: 'inline-block',
      width: '1px',
      height: '100%',
      backgroundColor: 'hsla(var(--primary-hover))',
      content: '""',
    },
  '.meta-btn-compact-vertical-item.meta-btn-primary:not([disabled]) + .meta-btn-compact-vertical-item.meta-btn-primary:not([disabled]):before':
    {
      position: 'absolute',
      insetInlineStart: '-1px',
      display: 'inline-block',
      width: '100%',
      height: '1px',
      backgroundColor: 'hsla(var(--primary-hover))',
      content: '""',
    },
  '.meta-input-prefix.meta-input-prefix-large > svg.meta-icon, .meta-input-suffix.meta-input-suffix-large > svg.meta-icon':
    { fontSize: '1.25rem' },
  '.meta-input-prefix > svg.meta-icon, .meta-input-suffix > svg.meta-icon': {
    color: 'hsla(var(--neutral-text-tertiary))',
    fontSize: '1rem',
  },
  '.meta-input-prefix.meta-input-prefix-small > svg.meta-icon, .meta-input-suffix.meta-input-suffix-small > svg.meta-icon':
    { fontSize: '1rem' },
  '[class*="meta-"][class*="-arrow"]::before': {
    clipPath:
      "path('M 0 8 A 4 4 0 0 0 2.82842712474619 6.82842712474619 L 6.585786437626905 3.0710678118654755 A 2 2 0 0 1 9.414213562373096 3.0710678118654755 L 13.17157287525381 6.82842712474619 A 4 4 0 0 0 16 8 Z')",
  },
};
