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
    'pointer-events-none absolute z-1 block h-4 w-4 overflow-hidden',
    'before:absolute before:start-0 before:bottom-0 before:h-2 before:w-4 before:bg-(--metis-arrow-background-color) before:content-[""]',
    'after:shadow-opacity-5 after:absolute after:start-0 after:end-0 after:bottom-0 after:z-0 after:m-auto after:h-[8.970562748477143px] after:w-[8.970562748477143px] after:translate-y-1/2 after:rotate-[-135deg] after:rounded-br-[2px] after:bg-transparent after:shadow-xs after:content-[""]',
    arrowPlacement.top &&
      'in-[.placement-top]:bottom-0 in-[.placement-top]:left-1/2 in-[.placement-top]:-translate-x-1/2 in-[.placement-top]:translate-y-full in-[.placement-top]:rotate-180',
    arrowPlacement.top &&
      'in-[.placement-topLeft]:bottom-0 in-[.placement-topLeft]:left-3 in-[.placement-topLeft]:translate-y-full in-[.placement-topLeft]:rotate-180',
    arrowPlacement.top &&
      'in-[.placement-topRight]:right-3 in-[.placement-topRight]:bottom-0 in-[.placement-topRight]:translate-y-full in-[.placement-topRight]:rotate-180',
    arrowPlacement.bottom &&
      'in-[.placement-bottom]:top-0 in-[.placement-bottom]:left-1/2 in-[.placement-bottom]:-translate-x-1/2 in-[.placement-bottom]:-translate-y-full',
    arrowPlacement.bottom &&
      'in-[.placement-bottomLeft]:top-0 in-[.placement-bottomLeft]:left-3 in-[.placement-bottomLeft]:-translate-y-full',
    arrowPlacement.bottom &&
      'in-[.placement-bottomRight]:top-0 in-[.placement-bottomRight]:right-3 in-[.placement-bottomRight]:-translate-y-full',
    arrowPlacement.left &&
      'in-[.placement-left]:top-1/2 in-[.placement-left]:right-0 in-[.placement-left]:translate-x-full in-[.placement-left]:-translate-y-1/2 in-[.placement-left]:rotate-90',
    arrowPlacement.left &&
      `in-[.placement-leftTop]:right-0 ${
        limitVerticalRadius ? 'in-[.placement-leftTop]:top-2' : 'in-[.placement-leftTop]:top-3'
      } in-[.placement-leftTop]:translate-x-full in-[.placement-leftTop]:rotate-90`,
    arrowPlacement.left &&
      `in-[.placement-leftBottom]:right-0 ${
        limitVerticalRadius
          ? 'in-[.placement-leftBottom]:bottom-2'
          : 'in-[.placement-leftBottom]:bottom-3'
      } in-[.placement-leftBottom]:translate-x-full in-[.placement-leftBottom]:rotate-90`,
    arrowPlacement.right &&
      'in-[.placement-right]:top-1/2 in-[.placement-right]:left-0 in-[.placement-right]:-translate-x-full in-[.placement-right]:-translate-y-1/2 in-[.placement-right]:-rotate-90',
    arrowPlacement.right &&
      `in-[.placement-rightTop]:left-0 ${
        limitVerticalRadius ? 'in-[.placement-rightTop]:top-2' : 'in-[.placement-rightTop]:top-3'
      } in-[.placement-rightTop]:-translate-x-full in-[.placement-rightTop]:-rotate-90`,
    arrowPlacement.right &&
      `in-[.placement-rightBottom]:left-0 ${
        limitVerticalRadius
          ? 'in-[.placement-rightBottom]:bottom-2'
          : 'in-[.placement-rightBottom]:bottom-3'
      } in-[.placement-rightBottom]:-translate-x-full in-[.placement-rightBottom]:-rotate-90`,
    custom,
  );
}
