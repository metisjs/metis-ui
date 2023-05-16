import classNames from 'classnames';
import CSSMotion from 'rc-motion';
import useLayoutEffect from 'rc-util/lib/hooks/useLayoutEffect';
import { composeRef } from 'rc-util/lib/ref';
import * as React from 'react';
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
  motionName: string;
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
  const { containerRef, value, getValueIndex, motionName, onMotionStart, onMotionEnd } = props;

  const thumbRef = React.useRef<HTMLDivElement>(null);
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
    <CSSMotion
      visible
      motionName={motionName}
      motionAppear
      onAppearStart={onAppearStart}
      onAppearActive={onAppearActive}
      onVisibleChanged={onVisibleChanged}
    >
      {({ className: motionClassName, style: motionStyle }, ref) => {
        const mergedStyle = {
          ...motionStyle,
          '--thumb-start-left': thumbStart,
          '--thumb-start-width': toPX(prevStyle?.width),
          '--thumb-active-left': thumbActive,
          '--thumb-active-width': toPX(nextStyle?.width),
        } as React.CSSProperties;

        const motionProps = {
          ref: composeRef(thumbRef, ref),
          style: mergedStyle,
          className: classNames(`thumb`, motionClassName),
        };

        if (process.env.NODE_ENV === 'test') {
          (motionProps as any)['data-test-style'] = JSON.stringify(mergedStyle);
        }

        return <div {...motionProps} />;
      }}
    </CSSMotion>
  );
}
