import { AggregationColor, Color } from './color';
import type { ColorGenInput, ColorValueType, HSBAColorType, TransformOffset } from './interface';

export const generateColor = (
  color: ColorGenInput<AggregationColor> | Exclude<ColorValueType, null>,
): AggregationColor => {
  if (color instanceof AggregationColor) {
    return color;
  }
  return new AggregationColor(color);
};

export const getRoundNumber = (value: number) => Math.round(Number(value || 0));

export const getColorAlpha = (color: AggregationColor) => getRoundNumber(color.toHsb().a * 100);

export const genHueColor = (color: AggregationColor, hue: number) => {
  const hsba = color.toHsb();
  hsba.h = hue;
  return generateColor(hsba);
};

export const genAlphaColor = (color: AggregationColor, alpha?: number) => {
  const hsba = color.toHsb();
  hsba.a = alpha ?? 1;
  return generateColor(hsba);
};

export const calculateColor = (props: {
  offset: TransformOffset;
  containerRef: React.RefObject<HTMLDivElement | null>;
  targetRef: React.RefObject<HTMLDivElement | null>;
  color: AggregationColor;
  type?: HSBAColorType;
}): AggregationColor => {
  const { offset, targetRef, containerRef, color, type } = props;
  const { width, height } = containerRef.current!.getBoundingClientRect();
  const { width: targetWidth, height: targetHeight } = targetRef.current!.getBoundingClientRect();
  const centerOffsetX = targetWidth / 2;
  const centerOffsetY = targetHeight / 2;
  const saturation = (offset.x + centerOffsetX) / width;
  const bright = 1 - (offset.y + centerOffsetY) / height;
  const hsb = color.toHsb();
  const alphaOffset = saturation;
  const hueOffset = ((offset.x + centerOffsetX) / width) * 360;

  if (type) {
    switch (type) {
      case 'hue':
        return generateColor({
          ...hsb,
          h: hueOffset <= 0 ? 0 : hueOffset,
        });
      case 'alpha':
        return generateColor({
          ...hsb,
          a: alphaOffset <= 0 ? 0 : alphaOffset,
        });
    }
  }

  return generateColor({
    h: hsb.h,
    s: saturation <= 0 ? 0 : saturation,
    b: bright >= 1 ? 1 : bright,
    a: hsb.a,
  });
};

export const calcOffset = (color: AggregationColor, type?: HSBAColorType) => {
  const hsb = color.toHsb();

  switch (type) {
    case 'hue':
      return {
        x: (hsb.h / 360) * 100,
        y: 50,
      };
    case 'alpha':
      return {
        x: hsb.a * 100,
        y: 50,
      };

    // Picker panel
    default:
      return {
        x: hsb.s * 100,
        y: (1 - hsb.b) * 100,
      };
  }
};

/**
 * Get percent position color. e.g. [10%-#fff, 20%-#000], 15% => #888
 */
export const getGradientPercentColor = (
  colors: { percent: number; color: string }[],
  percent: number,
): string => {
  const filledColors = [
    {
      percent: 0,
      color: colors[0].color,
    },
    ...colors,
    {
      percent: 100,
      color: colors[colors.length - 1].color,
    },
  ];

  for (let i = 0; i < filledColors.length - 1; i += 1) {
    const startPtg = filledColors[i].percent;
    const endPtg = filledColors[i + 1].percent;
    const startColor = filledColors[i].color;
    const endColor = filledColors[i + 1].color;

    if (startPtg <= percent && percent <= endPtg) {
      const dist = endPtg - startPtg;
      if (dist === 0) {
        return startColor;
      }

      const ratio = ((percent - startPtg) / dist) * 100;
      const startRcColor = new Color(startColor);
      const endRcColor = new Color(endColor);

      return startRcColor.mix(endRcColor, ratio).toRgbString();
    }
  }

  return '';
};

export function sortColors(colors: { percent: number; color: string }[]) {
  return [...colors].sort((a, b) => a.percent - b.percent);
}
