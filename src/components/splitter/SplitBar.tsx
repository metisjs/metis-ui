import React, { useState } from 'react';
import {
  ChevronDownOutline,
  ChevronLeftOutline,
  ChevronRightOutline,
  ChevronUpOutline,
} from '@metisjs/icons';
import type { SemanticClassName } from '@util/classNameUtils';
import { clsx } from '@util/classNameUtils';
import useSemanticCls from '@util/hooks/useSemanticCls';

export interface SplitBarProps {
  className?: SemanticClassName<{ dragger?: string; collapseBar?: string }>;
  index: number;
  active: boolean;
  prefixCls: string;
  resizable: boolean;
  startCollapsible: boolean;
  endCollapsible: boolean;
  onOffsetStart: (index: number) => void;
  onOffsetUpdate: (index: number, offsetX: number, offsetY: number) => void;
  onOffsetEnd: VoidFunction;
  onCollapse: (index: number, type: 'start' | 'end') => void;
  vertical: boolean;
  ariaNow: number;
  ariaMin: number;
  ariaMax: number;
}

function getValidNumber(num: number | undefined): number {
  return typeof num === 'number' && !Number.isNaN(num) ? Math.round(num) : 0;
}

const SplitBar: React.FC<SplitBarProps> = (props) => {
  const {
    prefixCls,
    className,
    vertical,
    index,
    active,
    ariaNow,
    ariaMin,
    ariaMax,
    resizable,
    startCollapsible,
    endCollapsible,
    onOffsetStart,
    onOffsetUpdate,
    onOffsetEnd,
    onCollapse,
  } = props;

  // ======================== Resize ========================
  const [startPos, setStartPos] = useState<[x: number, y: number] | null>(null);

  const onMouseDown: React.MouseEventHandler<HTMLDivElement> = (e) => {
    if (resizable && e.currentTarget) {
      setStartPos([e.pageX, e.pageY]);
      onOffsetStart(index);
    }
  };

  const onTouchStart: React.TouchEventHandler<HTMLDivElement> = (e) => {
    if (resizable && e.touches.length === 1) {
      const touch = e.touches[0];
      setStartPos([touch.pageX, touch.pageY]);
      onOffsetStart(index);
    }
  };

  React.useEffect(() => {
    if (startPos) {
      const onMouseMove = (e: MouseEvent) => {
        const { pageX, pageY } = e;
        const offsetX = pageX - startPos[0];
        const offsetY = pageY - startPos[1];

        onOffsetUpdate(index, offsetX, offsetY);
      };

      const onMouseUp = () => {
        setStartPos(null);
        onOffsetEnd();
      };

      const handleTouchMove = (e: TouchEvent) => {
        if (e.touches.length === 1) {
          const touch = e.touches[0];
          const offsetX = touch.pageX - startPos[0];
          const offsetY = touch.pageY - startPos[1];

          onOffsetUpdate(index, offsetX, offsetY);
        }
      };

      const handleTouchEnd = () => {
        setStartPos(null);
        onOffsetEnd();
      };

      window.addEventListener('touchmove', handleTouchMove);
      window.addEventListener('touchend', handleTouchEnd);
      window.addEventListener('mousemove', onMouseMove);
      window.addEventListener('mouseup', onMouseUp);

      return () => {
        window.removeEventListener('mousemove', onMouseMove);
        window.removeEventListener('mouseup', onMouseUp);
        window.removeEventListener('touchmove', handleTouchMove);
        window.removeEventListener('touchend', handleTouchEnd);
      };
    }
  }, [startPos]);

  // ======================== Style ========================
  const semanticCls = useSemanticCls(className);

  const rootCls = clsx(
    `${prefixCls}-bar`,
    'group/bar',
    'relative flex-none select-none',
    {
      'h-0': vertical,
      'w-0': !vertical,
    },
    semanticCls.root,
  );

  const draggerCls = clsx(
    `${prefixCls}-bar-dragger`,
    {
      [`${prefixCls}-bar-dragger-disabled`]: !resizable,
      [`${prefixCls}-bar-dragger-active`]: active,
    },
    'absolute left-1/2 top-1/2 z-[1] w-0 -translate-x-1/2 -translate-y-1/2',
    'before:absolute before:left-1/2 before:top-1/2 before:-translate-x-1/2 before:-translate-y-1/2 before:bg-border-tertiary before:transition-colors',
    'after:absolute after:left-1/2 after:top-1/2 after:-translate-x-1/2 after:-translate-y-1/2 after:bg-fill after:transition-colors',
    {
      'h-1.5 w-full cursor-row-resize before:h-0.5 before:w-full after:h-0.5 after:w-6': vertical,
      'h-full w-1.5 cursor-col-resize before:h-full before:w-0.5 after:h-6 after:w-0.5': !vertical,
    },
    {
      'z-[2] before:bg-border-secondary': active,
      'hover:before:bg-border-secondary': resizable,
      'z-0 after:hidden hover:cursor-default': !resizable,
    },
    semanticCls.dragger,
  );

  const collapseBarCls = clsx(
    `${prefixCls}-bar-collapse-bar`,
    'absolute z-[1] inline-flex cursor-pointer items-center justify-center rounded-sm bg-fill-quaternary text-base text-text-secondary opacity-0 transition-all hover:bg-fill-tertiary group-hover/bar:opacity-100',
    {
      'h-4 w-7': vertical,
      'h-7 w-4': !vertical,
    },
    active && 'opacity-100',
    semanticCls.collapseBar,
  );

  const startCollapseBarCls = clsx(`${prefixCls}-bar-collapse-bar-start`, collapseBarCls, {
    'left-auto right-1 top-1/2 -translate-y-1/2': !vertical,
    'bottom-1 left-1/2 top-auto -translate-x-1/2': vertical,
  });

  const endCollapseBarCls = clsx(`${prefixCls}-bar-collapse-bar-end`, collapseBarCls, {
    'left-1 right-auto top-1/2 -translate-y-1/2': !vertical,
    'bottom-auto left-1/2 top-1 -translate-x-1/2': vertical,
  });

  // ======================== Render ========================
  const StartIcon = vertical ? ChevronUpOutline : ChevronLeftOutline;
  const EndIcon = vertical ? ChevronDownOutline : ChevronRightOutline;

  return (
    <div
      className={rootCls}
      role="separator"
      aria-valuenow={getValidNumber(ariaNow)}
      aria-valuemin={getValidNumber(ariaMin)}
      aria-valuemax={getValidNumber(ariaMax)}
    >
      <div className={draggerCls} onMouseDown={onMouseDown} onTouchStart={onTouchStart} />

      {/* Start Collapsible */}
      {startCollapsible && (
        <div className={startCollapseBarCls} onClick={() => onCollapse(index, 'start')}>
          <StartIcon
            className={clsx(`${prefixCls}-bar-collapse-icon`, `${prefixCls}-bar-collapse-start`)}
          />
        </div>
      )}

      {/* End Collapsible */}
      {endCollapsible && (
        <div className={endCollapseBarCls} onClick={() => onCollapse(index, 'end')}>
          <EndIcon
            className={clsx(`${prefixCls}-bar-collapse-icon`, `${prefixCls}-bar-collapse-end`)}
          />
        </div>
      )}
    </div>
  );
};

export default SplitBar;
