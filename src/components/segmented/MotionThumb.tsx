import useLayoutEffect from 'rc-util/lib/hooks/useLayoutEffect';
import React from 'react';
import type { SegmentedValue } from '.';

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
    <div>1234</div>
    // <Motion
    //   visible
    //   appearActiveCls="will-change-transform will-change-[width] transition-all duration-[5000ms]"
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

    //     // It's little ugly which should be refactor when @umi/test update to latest jsdom
    //     const motionProps = {
    //       ref,
    //       style: mergedStyle,
    //       className: classNames(
    //         `absolute left-0 top-0 h-full rounded-md bg-neutral-bg-container font-medium text-neutral-text will-change-transform will-change-[width] transition-all duration-[5000ms]`,
    //         motionClassName,
    //       ),
    //     };

    //     console.log(mergedStyle, motionClassName);

    //     if (process.env.NODE_ENV === 'test') {
    //       (motionProps as any)['data-test-style'] = JSON.stringify(mergedStyle);
    //     }

    //     return <div {...motionProps} />;
    //   }}
    // </Motion>
  );
}
