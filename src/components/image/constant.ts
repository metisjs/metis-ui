import type { ImageElementProps } from './interface';

export const COMMON_PROPS: (keyof Omit<ImageElementProps, 'src'>)[] = [
  'crossOrigin',
  'decoding',
  'draggable',
  'loading',
  'referrerPolicy',
  'sizes',
  'srcSet',
  'useMap',
  'alt',
];

/** Scale the ratio base */
export const BASE_SCALE_RATIO = 1;
/** The maximum zoom ratio when the mouse zooms in, adjustable */
export const WHEEL_MAX_SCALE_RATIO = 1;
