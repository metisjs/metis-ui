export default {
  html: { WebkitTapHighlightColor: 'transparent' },
  svg: { display: 'inline-block' },
  'a:not(.meta-btn)': { color: 'hsla(var(--primary))' },
  'a:not(.meta-btn):hover': { color: 'hsla(var(--primary-hover))' },
  '.meta-input-prefix > svg.meta-icon, .meta-input-suffix > svg.meta-icon': {
    color: 'hsla(var(--neutral-text-tertiary))',
    fontSize: '1.25rem',
  },
  '.meta-input-prefix.meta-input-prefix-small > svg.meta-icon, .meta-input-suffix.meta-input-prefix-small > svg.meta-icon':
    { fontSize: '1rem' },
};
