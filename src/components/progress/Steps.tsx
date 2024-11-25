import * as React from 'react';
import { clsx } from '../_util/classNameUtils';
import useSemanticCls from '../_util/hooks/useSemanticCls';
import type { ProgressProps } from './Progress';
import { getSize } from './utils';

interface ProgressStepsProps extends ProgressProps {
  steps: number;
  strokeColor?: string | string[];
  trailColor?: string;
}

const Steps: React.FC<ProgressStepsProps> = (props) => {
  const {
    size,
    steps,
    percent = 0,
    strokeWidth = 8,
    strokeColor,
    trailColor = null as any,
    prefixCls,
    children,
    className,
    status,
  } = props;
  const semanticCls = useSemanticCls(className, 'progress');

  const current = Math.round(steps * (percent / 100));
  const stepWidth = size === 'small' ? 2 : 14;
  const mergedSize = size ?? [stepWidth, strokeWidth];
  const [width, height] = getSize(mergedSize, 'step', { steps, strokeWidth });
  const unitWidth = width / steps;
  const styledSteps: React.ReactNode[] = new Array(steps);
  for (let i = 0; i < steps; i++) {
    const color = Array.isArray(strokeColor) ? strokeColor[i] : strokeColor;
    styledSteps[i] = (
      <div
        key={i}
        className={clsx(
          `${prefixCls}-steps-item`,
          {
            [`${prefixCls}-steps-item-active`]: i <= current - 1,
          },
          'me-[0.125rem] bg-fill-quaternary last-of-type:me-0',
          i <= current - 1 && {
            'bg-primary': true,
            'bg-success': status === 'success',
            'bg-error': status === 'exception',
          },
          semanticCls.trail,
        )}
        style={{
          backgroundColor: i <= current - 1 ? color : trailColor,
          width: unitWidth,
          height,
        }}
      />
    );
  }
  return (
    <div className={clsx(`${prefixCls}-steps-outer`, 'flex items-center')}>
      {styledSteps}
      {children}
    </div>
  );
};

export default Steps;
