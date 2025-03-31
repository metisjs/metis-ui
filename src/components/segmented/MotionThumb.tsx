import React from 'react';
import { clsx } from '@util/classNameUtils';
import useLayoutEffect from 'rc-util/es/hooks/useLayoutEffect';
import type { SegmentedValue } from '.';
import Transition from '../transition';

type ThumbReact = {
  left: number;
  right: number;
  width: number;
} | null;

export interface MotionThumbInterface {
  prefixCls: string;
  className?: string;
  containerRef: React.RefObject<HTMLDivElement>;
  value: SegmentedValue;
  getValueIndex: (value: SegmentedValue) => number;
  onMotionStart: VoidFunction;
  onMotionEnd: VoidFunction;
}

const calcThumbStyle = (targetElement: HTMLElement | null | undefined): ThumbReact =>
  targetElement
    ? {
        left: targetElement.offsetLeft,
        right:
          (targetElement.parentElement!.clientWidth as number) -
          targetElement.clientWidth -
          targetElement.offsetLeft,
        width: targetElement.clientWidth,
      }
    : null;

const toPX = (value?: number) => (value !== undefined ? `${value}px` : undefined);

export default function MotionThumb(props: MotionThumbInterface) {
  const { prefixCls, className, containerRef, value, getValueIndex, onMotionStart, onMotionEnd } =
    props;

  const [prevValue, setPrevValue] = React.useState(value);

  // =========================== Effect ===========================
  const findValueElement = (val: SegmentedValue) => {
    const index = getValueIndex(val);

    const ele = containerRef.current?.querySelectorAll<HTMLDivElement>(`.${prefixCls}-item`)[index];

    return ele?.offsetParent && ele;
  };

  const [prevStyle, setPrevStyle] = React.useState<ThumbReact>(null);
  const [nextStyle, setNextStyle] = React.useState<ThumbReact>(null);

  useLayoutEffect(() => {
    if (prevValue !== value) {
      const prev = findValueElement(prevValue);
      const next = findValueElement(value);

      const calcPrevStyle = calcThumbStyle(prev);
      const calcNextStyle = calcThumbStyle(next);

      setPrevValue(value);
      setPrevStyle(calcPrevStyle);
      setNextStyle(calcNextStyle);

      if (prev && next) {
        onMotionStart();
      } else {
        onMotionEnd();
      }
    }
  }, [value]);

  const thumbStart = React.useMemo(() => toPX(prevStyle?.left as number), [prevStyle]);
  const thumbActive = React.useMemo(() => toPX(nextStyle?.left as number), [nextStyle]);

  const afterEnter = () => {
    setPrevStyle(null);
    setNextStyle(null);
    onMotionEnd();
  };

  // =========================== Render ===========================
  // No need motion when nothing exist in queue
  if (!prevStyle || !nextStyle) {
    return null;
  }

  return (
    <Transition
      appear
      visible
      enter="transition-all duration-300 ease-in-out"
      enterFrom={{ transform: `translateX(${thumbStart})`, width: prevStyle?.width }}
      enterTo={{ transform: `translateX(${thumbActive})`, width: nextStyle?.width }}
      afterEnter={afterEnter}
    >
      {({ className: transitionCls, style }, ref) => (
        <div
          ref={ref}
          className={clsx(
            'bg-container absolute top-0.5 bottom-0.5 left-0 rounded-md shadow-sm',
            className,
            transitionCls,
          )}
          style={style}
        ></div>
      )}
    </Transition>
  );
}
