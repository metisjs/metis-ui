import { clsx } from './classNameUtils';

export const MAX_VERTICAL_CONTENT_RADIUS = 8;

export function getArrowOffset(options: { contentRadius: number; limitVerticalRadius?: boolean }) {
  const maxVerticalContentRadius = MAX_VERTICAL_CONTENT_RADIUS;
  const { contentRadius, limitVerticalRadius } = options;
  const dropdownArrowOffset = contentRadius > 12 ? contentRadius + 2 : 12;
  const dropdownArrowOffsetVertical = limitVerticalRadius
    ? maxVerticalContentRadius
    : dropdownArrowOffset;
  return { dropdownArrowOffset, dropdownArrowOffsetVertical };
}

export default function getArrowClassName(options: {
  showArrowCls?: string;
  contentRadius?: number;
  limitVerticalRadius?: boolean;
  arrowPlacement?: {
    left?: boolean;
    right?: boolean;
    top?: boolean;
    bottom?: boolean;
  };
}) {
  const {
    contentRadius = 8,
    limitVerticalRadius,
    arrowPlacement = {
      left: true,
      right: true,
      top: true,
      bottom: true,
    },
  } = options;

  const { dropdownArrowOffsetVertical, dropdownArrowOffset } = getArrowOffset({
    contentRadius,
    limitVerticalRadius,
  });

  return clsx(
    'pointer-events-none absolute z-[1] block h-4 w-4 overflow-hidden',
    'before:absolute before:bottom-0 before:start-0 before:h-2 before:w-4 before:bg-[--meta-arrow-background-color] before:content-[""]',
    arrowPlacement.top &&
      '[.placement-top_&]:bottom-0 [.placement-top_&]:left-1/2 [.placement-top_&]:-translate-x-1/2 [.placement-top_&]:translate-y-full [.placement-top_&]:rotate-180',
    arrowPlacement.top &&
      '[.placement-topLeft_&]:bottom-0 [.placement-topLeft_&]:left-1/2 [.placement-topLeft_&]:translate-y-full [.placement-topLeft_&]:rotate-180',
    arrowPlacement.top &&
      '[.placement-topRight_&]:bottom-0 [.placement-topRight_&]:right-1/2 [.placement-topRight_&]:translate-y-full [.placement-topRight_&]:rotate-180',
  );
}
