/* eslint-disable react/no-unknown-property */
import useMobile from 'rc-util/lib/hooks/useMobile';
import raf from 'rc-util/lib/raf';
import * as React from 'react';
import { clsx } from '../_util/classNameUtils';

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
  onStep: (up: boolean) => void;
}

export default function StepHandler({
  prefixCls,
  upNode,
  downNode,
  upDisabled,
  downDisabled,
  onStep,
}: StepHandlerProps) {
  // ======================== Step ========================
  const stepTimeoutRef = React.useRef<any>();
  const frameIds = React.useRef<number[]>([]);

  const onStepRef = React.useRef<StepHandlerProps['onStep']>();
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
    'group-handler absolute right-[2px] top-[2px] flex h-[calc(100%-4px)] w-6 select-none flex-col items-stretch rounded-ee-md rounded-se-md bg-neutral-bg-container text-sm text-neutral-text-tertiary opacity-0 transition-opacity duration-200 ease-linear',
    'group-hover/affix:opacity-100 group-hover/input:opacity-100',
  );

  const upClassName = clsx(
    `${prefixCls}-handler-up`,
    {
      [`${prefixCls}-handler-up-disabled`]: upDisabled,
    },
    'flex h-1/2 flex-auto cursor-pointer items-center justify-center overflow-hidden border-l border-neutral-border-secondary transition-all duration-200 ease-linear',
    !upDisabled && 'hover:h-3/5 hover:text-primary',
    upDisabled && 'cursor-not-allowed',
  );
  const downClassName = clsx(
    `${prefixCls}-handler-down`,
    {
      [`${prefixCls}-handler-down-disabled`]: downDisabled,
    },
    'flex h-1/2 flex-auto cursor-pointer items-center justify-center overflow-hidden border-l border-t border-neutral-border-secondary transition-all duration-200 ease-linear',
    !downDisabled && 'hover:h-3/5 hover:text-primary',
    downDisabled && 'cursor-not-allowed',
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
