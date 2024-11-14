import { clsx } from './classNameUtils';

export default function getArrowClassName(options: {
  limitVerticalRadius?: boolean;
  arrowPlacement?: {
    left?: boolean;
    right?: boolean;
    top?: boolean;
    bottom?: boolean;
  };
  custom?: string;
}) {
  const {
    limitVerticalRadius,
    arrowPlacement = {
      left: true,
      right: true,
      top: true,
      bottom: true,
    },
    custom,
  } = options;

  return clsx(
    'pointer-events-none absolute z-[1] block h-4 w-4 overflow-hidden',
    'before:absolute before:bottom-0 before:start-0 before:h-2 before:w-4 before:bg-[--metis-arrow-background-color] before:content-[""]',
    'after:shadow-opacity-5 after:absolute after:bottom-0 after:end-0 after:start-0 after:z-0 after:m-auto after:h-[8.970562748477143px] after:w-[8.970562748477143px] after:translate-y-1/2 after:rotate-[-135deg] after:rounded-br-[2px] after:bg-transparent after:shadow-sm after:content-[""]',
    arrowPlacement.top &&
      '[.placement-top_&]:bottom-0 [.placement-top_&]:left-1/2 [.placement-top_&]:-translate-x-1/2 [.placement-top_&]:translate-y-full [.placement-top_&]:rotate-180',
    arrowPlacement.top &&
      '[.placement-topLeft_&]:bottom-0 [.placement-topLeft_&]:left-3 [.placement-topLeft_&]:translate-y-full [.placement-topLeft_&]:rotate-180',
    arrowPlacement.top &&
      '[.placement-topRight_&]:bottom-0 [.placement-topRight_&]:right-3 [.placement-topRight_&]:translate-y-full [.placement-topRight_&]:rotate-180',
    arrowPlacement.bottom &&
      '[.placement-bottom_&]:left-1/2 [.placement-bottom_&]:top-0 [.placement-bottom_&]:-translate-x-1/2 [.placement-bottom_&]:-translate-y-full',
    arrowPlacement.bottom &&
      '[.placement-bottomLeft_&]:left-3 [.placement-bottomLeft_&]:top-0 [.placement-bottomLeft_&]:-translate-y-full',
    arrowPlacement.bottom &&
      '[.placement-bottomRight_&]:right-3 [.placement-bottomRight_&]:top-0 [.placement-bottomRight_&]:-translate-y-full',
    arrowPlacement.left &&
      '[.placement-left_&]:right-0 [.placement-left_&]:top-1/2 [.placement-left_&]:-translate-y-1/2 [.placement-left_&]:translate-x-full [.placement-left_&]:rotate-90',
    arrowPlacement.left &&
      `[.placement-leftTop_&]:right-0 ${
        limitVerticalRadius ? '[.placement-leftTop_&]:top-2' : '[.placement-leftTop_&]:top-3'
      } [.placement-leftTop_&]:translate-x-full [.placement-leftTop_&]:rotate-90`,
    arrowPlacement.left &&
      `[.placement-leftBottom_&]:right-0 ${
        limitVerticalRadius
          ? '[.placement-leftBottom_&]:bottom-2'
          : '[.placement-leftBottom_&]:bottom-3'
      } [.placement-leftBottom_&]:translate-x-full [.placement-leftBottom_&]:rotate-90`,
    arrowPlacement.right &&
      '[.placement-right_&]:left-0 [.placement-right_&]:top-1/2 [.placement-right_&]:-translate-x-full [.placement-right_&]:-translate-y-1/2 [.placement-right_&]:-rotate-90',
    arrowPlacement.right &&
      `[.placement-rightTop_&]:left-0 ${
        limitVerticalRadius ? '[.placement-rightTop_&]:top-2' : '[.placement-rightTop_&]:top-3'
      } [.placement-rightTop_&]:-translate-x-full [.placement-rightTop_&]:-rotate-90`,
    arrowPlacement.right &&
      `[.placement-rightBottom_&]:left-0 ${
        limitVerticalRadius
          ? '[.placement-rightBottom_&]:bottom-2'
          : '[.placement-rightBottom_&]:bottom-3'
      } [.placement-rightBottom_&]:-translate-x-full [.placement-rightBottom_&]:-rotate-90`,
    custom,
  );
}
