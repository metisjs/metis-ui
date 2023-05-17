import useLayoutEffect from 'rc-util/lib/hooks/useLayoutEffect';
import React, { Fragment } from 'react';
import type { SegmentedValue } from '.';
import Transition from '../transition';

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

const toPX = (value: number) => (value !== undefined ? `${value}px` : undefined);

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

  // =========================== Motion ===========================
  const onAppearStart = () => {
    return {
      transform: `translateX(var(--thumb-start-left))`,
      width: `var(--thumb-start-width)`,
    };
  };
  const onAppearActive = () => {
    return {
      transform: `translateX(var(--thumb-active-left))`,
      width: `var(--thumb-active-width)`,
    };
  };
  const onVisibleChanged = () => {
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
      as={Fragment}
      show
      enter="transform transition duration-[400ms]"
      enterFrom="opacity-0 rotate-[-120deg] scale-50"
      enterTo="opacity-100 rotate-0 scale-100"
      leave="transform duration-200 transition ease-in-out"
      leaveFrom="opacity-100 rotate-0 scale-100 "
      leaveTo="opacity-0 scale-95 "
    >
      <div className="absolute inset-0 h-full rounded-md bg-neutral-bg-container font-medium text-neutral-text shadow" />
    </Transition>
    // <CSSMotion
    //   visible
    //   motionName={motionName}
    //   motionAppear
    //   onAppearStart={onAppearStart}
    //   onAppearActive={onAppearActive}
    //   onVisibleChanged={onVisibleChanged}
    // >
    //   {({ className: motionClassName, style: motionStyle }, ref) => {
    //     const mergedStyle = {
    //       ...motionStyle,
    //       '--thumb-start-left': thumbStart,
    //       '--thumb-start-width': toPX(prevStyle?.width),
    //       '--thumb-active-left': thumbActive,
    //       '--thumb-active-width': toPX(nextStyle?.width),
    //     } as React.CSSProperties;

    //     const motionProps = {
    //       ref: composeRef(thumbRef, ref),
    //       style: mergedStyle,
    //       className: classNames(
    //         'absolute inset-0 h-full bg-neutral-bg-container font-medium text-neutral-text shadow rounded-md',
    //         motionClassName,
    //       ),
    //     };

    //     if (process.env.NODE_ENV === 'test') {
    //       (motionProps as any)['data-test-style'] = JSON.stringify(mergedStyle);
    //     }

    //     return <div {...motionProps} />;
    //   }}
    // </CSSMotion>
  );
}
