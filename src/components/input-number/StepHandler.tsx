/* eslint-disable react/no-unknown-property */
import * as React from 'react';
import useMobile from '@rc-component/util/es/hooks/useMobile';
import raf from '@rc-component/util/es/raf';
import { clsx } from '@util/classNameUtils';
import type { Variant } from '../config-provider';

/**
 * When click and hold on a button - the speed of auto changing the value.
 */
const STEP_INTERVAL = 200;

/**
 * When click and hold on a button - the delay before auto changing the value.
 */
const STEP_DELAY = 600;

export interface StepHandlerProps {
  prefixCls: string;
  upNode?: React.ReactNode;
  downNode?: React.ReactNode;
  upDisabled?: boolean;
  downDisabled?: boolean;
  variant?: Variant;
  onStep: (up: boolean) => void;
  className?: string;
}

export default function StepHandler({
  prefixCls,
  upNode,
  downNode,
  upDisabled,
  downDisabled,
  variant,
  onStep,
  className,
}: StepHandlerProps) {
  // ======================== Step ========================
  const stepTimeoutRef = React.useRef<any>(null);
  const frameIds = React.useRef<number[]>([]);

  const onStepRef = React.useRef<StepHandlerProps['onStep']>(null);
  onStepRef.current = onStep;

  const onStopStep = () => {
    clearTimeout(stepTimeoutRef.current);
  };

  // We will interval update step when hold mouse down
  const onStepMouseDown = (e: React.MouseEvent, up: boolean) => {
    e.preventDefault();
    onStopStep();

    onStepRef.current?.(up);

    // Loop step for interval
    function loopStep() {
      onStepRef.current?.(up);

      stepTimeoutRef.current = setTimeout(loopStep, STEP_INTERVAL);
    }

    // First time press will wait some time to trigger loop step update
    stepTimeoutRef.current = setTimeout(loopStep, STEP_DELAY);
  };

  React.useEffect(
    () => () => {
      onStopStep();
      frameIds.current.forEach((id) => raf.cancel(id));
    },
    [],
  );

  // ======================= Render =======================
  const isMobile = useMobile();
  if (isMobile) {
    return null;
  }

  const handlerClassName = clsx(
    `${prefixCls}-handler`,
    'group-handler text-text-tertiary absolute top-0 right-0 bottom-0 flex w-6 flex-col items-stretch rounded-se-md rounded-ee-md text-sm opacity-0 transition-opacity duration-200 ease-linear select-none',
    {
      'bg-container top-px right-px bottom-px group-has-focus-within/input:top-[2px] group-has-focus-within/input:right-[2px] group-has-focus-within/input:bottom-[2px] group-has-focus-within/input:w-[calc(1.5rem-1px)]':
        variant === 'outlined',
      'bg-fill-quinary group-has-focus-within/input:bg-container group-has-focus-within/input:top-[2px] group-has-focus-within/input:right-[2px] group-has-focus-within/input:bottom-[2px] group-has-focus-within/input:w-[calc(1.5rem-2px)]':
        variant === 'filled',
      'bg-container': variant === 'borderless',
    },
    'group-hover/affix:opacity-100 group-hover/input:opacity-100',
    className,
  );

  const upClassName = clsx(
    `${prefixCls}-handler-up`,
    {
      [`${prefixCls}-handler-up-disabled`]: upDisabled,
    },
    'border-border-secondary flex h-1/2 flex-auto cursor-pointer items-center justify-center overflow-hidden border-l transition-all duration-200 ease-linear',
    {
      '*:-translate-x-[0.5px] *:translate-y-[0.5px] *:group-has-focus-within/input:translate-x-0 *:group-has-focus-within/input:translate-y-0':
        variant === 'outlined',
      '*:-translate-x-px *:translate-y-px *:group-has-focus-within/input:translate-x-0 *:group-has-focus-within/input:translate-y-0':
        variant === 'filled',
    },
    !upDisabled && 'hover:text-primary hover:h-3/5',
    upDisabled && 'text-text-quaternary cursor-not-allowed',
  );
  const downClassName = clsx(
    `${prefixCls}-handler-down`,
    {
      [`${prefixCls}-handler-down-disabled`]: downDisabled,
    },
    'border-border-secondary flex h-1/2 flex-auto cursor-pointer items-center justify-center overflow-hidden border-l transition-all duration-200 ease-linear',
    {
      '*:-translate-x-[0.5px] *:-translate-y-[0.5px] *:group-has-focus-within/input:translate-x-0 *:group-has-focus-within/input:translate-y-0':
        variant === 'outlined',
      '*:-translate-x-px *:-translate-y-px *:group-has-focus-within/input:translate-x-0 *:group-has-focus-within/input:translate-y-0':
        variant === 'filled',
    },
    !downDisabled && 'hover:text-primary hover:h-3/5',
    downDisabled && 'text-text-quaternary cursor-not-allowed',
  );

  // In Safari, When we fire onmousedown and onmouseup events in quick succession,
  // there may be a problem that the onmouseup events are executed first,
  // resulting in a disordered program execution.
  // So, we need to use requestAnimationFrame to ensure that the onmouseup event is executed after the onmousedown event.
  const safeOnStopStep = () => frameIds.current.push(raf(onStopStep));

  const sharedHandlerProps = {
    unselectable: 'on' as const,
    role: 'button',
    onMouseUp: safeOnStopStep,
    onMouseLeave: safeOnStopStep,
  };

  return (
    <div className={handlerClassName}>
      <span
        {...sharedHandlerProps}
        onMouseDown={(e) => {
          onStepMouseDown(e, true);
        }}
        aria-label="Increase Value"
        aria-disabled={upDisabled}
        className={upClassName}
      >
        {upNode}
      </span>
      <span className="bg-border-secondary h-px"></span>
      <span
        {...sharedHandlerProps}
        onMouseDown={(e) => {
          onStepMouseDown(e, false);
        }}
        aria-label="Decrease Value"
        aria-disabled={downDisabled}
        className={downClassName}
      >
        {downNode}
      </span>
    </div>
  );
}
