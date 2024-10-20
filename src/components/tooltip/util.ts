import type * as React from 'react';
import type { PresetColorType } from '../_util/colors';
import { getPresetColorCls, isPresetColor } from '../_util/colors';

export function parseColor(color?: string) {
  const isInternalColor = isPresetColor(color);

  let mergedColor = color;

  if (color && isInternalColor) {
    mergedColor = getPresetColorCls(color as PresetColorType, {
      rawColor: true,
    });
  }

  const overlayStyle: React.CSSProperties = {
    // @ts-ignore
    '--metis-arrow-background-color': mergedColor,
  };
  const arrowStyle: React.CSSProperties = {
    // @ts-ignore
    '--metis-arrow-background-color': mergedColor,
  };

  return { overlayStyle, arrowStyle };
}
