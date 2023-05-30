import type * as React from 'react';

export function parseColor(color?: string) {
  const overlayStyle: React.CSSProperties = {};
  const arrowStyle: React.CSSProperties = {};

  if (color) {
    overlayStyle.background = color;
    // @ts-ignore
    arrowStyle['--meta-arrow-background-color'] = color;
  }

  return { overlayStyle, arrowStyle };
}
