import useLayoutEffect from 'rc-util/lib/hooks/useLayoutEffect';
import React, { Fragment } from 'react';
import type { SegmentedValue } from '.';
import Transition from '../motion';

type ThumbReact = {
  left: number;
  right: number;
  width: number;
} | null;

export interface MotionThumbInterface {
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
  const { containerRef, value, getValueIndex, onMotionStart, onMotionEnd } = props;

  const [prevValue, setPrevValue] = React.useState(value);

  // =========================== Effect ===========================
  const findValueElement = (val: SegmentedValue) => {
    const index = getValueIndex(val);

    const ele = containerRef.current?.querySelectorAll<HTMLDivElement>(`.segmented-item`)[index];

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

  const show = !!prevStyle && !!nextStyle;

  console.log(show, thumbStart, thumbActive);

  return (
    <Transition
      as={Fragment}
      show={show}
      enter="transform transition-all duration-300 ease-in-out"
      enterFrom={`translate-x-[${thumbStart}] w-[56px]`}
      enterTo={`translate-x-[${thumbStart}]  w-[71px]`}
      afterEnter={afterEnter}
    >
      <div className="absolute left-0 top-0 h-full rounded-md bg-neutral-bg-container font-medium text-neutral-text" />
    </Transition>
  );
}
