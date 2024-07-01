import type { CircleProps } from './Circle';
import type { ProgressProps } from './Progress';

export function validProgress(progress?: number) {
  if (!progress || progress < 0) {
    return 0;
  }
  if (progress > 100) {
    return 100;
  }
  return progress;
}

export const getPercentage = ({ percent, success }: ProgressProps) => {
  const realSuccessPercent = validProgress(success?.percent);
  return [realSuccessPercent, validProgress(validProgress(percent) - realSuccessPercent)];
};

export const getStrokeColor = ({
  success = {},
  strokeColor,
  status,
}: Partial<CircleProps>): (string | Record<PropertyKey, string>)[] => {
  const { strokeColor: successColor } = success;

  let statusStrokeColor;
  switch (status) {
    case 'success':
      statusStrokeColor = 'hsla(var(--success))';
      break;
    case 'exception':
      statusStrokeColor = 'hsla(var(--error))';
      break;

    default:
      statusStrokeColor = 'hsla(var(--primary))';
      break;
  }
  return [successColor || 'hsla(var(--success))', strokeColor || statusStrokeColor];
};

export const getSize = (
  size: ProgressProps['size'],
  type: ProgressProps['type'] | 'step',
  extra?: {
    steps?: number;
  },
): [number, number] => {
  let width = -1;
  let height = -1;
  if (type === 'step') {
    const steps = extra!.steps!;
    if (typeof size === 'string' || typeof size === 'undefined') {
      width = size === 'small' ? 2 : 14;
      height = 8;
    } else if (typeof size === 'number') {
      [width, height] = [size, size];
    } else {
      [width = 14, height = 8] = (Array.isArray(size) ? size : [size.width, size.height]) as [
        number,
        number,
      ];
    }

    width *= steps;
  } else if (type === 'line') {
    if (typeof size === 'string' || typeof size === 'undefined') {
      height = size === 'small' ? 6 : 8;
    } else if (typeof size === 'number') {
      [width, height] = [size, size];
    } else {
      [width = -1, height = 8] = (Array.isArray(size) ? size : [size.width, size.height]) as [
        number,
        number,
      ];
    }
  } else if (type === 'circle' || type === 'dashboard') {
    if (typeof size === 'string' || typeof size === 'undefined') {
      [width, height] = size === 'small' ? [60, 60] : [120, 120];
    } else if (typeof size === 'number') {
      [width, height] = [size, size];
    } else if (Array.isArray(size)) {
      width = (size[0] ?? size[1] ?? 120) as number;
      height = (size[0] ?? size[1] ?? 120) as number;
    }
  }
  return [width, height];
};
