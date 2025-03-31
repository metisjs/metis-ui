import * as React from 'react';
import { useContext } from '@rc-component/context';
import { clsx } from '@util/classNameUtils';
import addEventListener from 'rc-util/es/Dom/addEventListener';
import { getOffset } from 'rc-util/es/Dom/css';
import raf from 'rc-util/es/raf';
import type { ScrollbarRef, ScrollValues } from '../scrollbar';
import Scrollbar from '../scrollbar';
import TableContext from './context/TableContext';
import { useLayoutState } from './hooks/useFrame';

interface StickyScrollBarProps {
  scrollBodyRef: React.RefObject<ScrollbarRef>;
  onScroll: (values: ScrollValues, e: React.UIEvent<HTMLElement>) => void;
  offsetScroll: number;
  container: HTMLElement | Window;
}

const StickyScrollBar: React.ForwardRefRenderFunction<unknown, StickyScrollBarProps> = (
  { scrollBodyRef, onScroll, offsetScroll, container },
  ref,
) => {
  const prefixCls = useContext(TableContext, 'prefixCls');

  const {
    scrollWidth: bodyScrollWidth = 0,
    clientWidth: bodyWidth = 0,
    scrollLeft: bodyScrollLeft = 0,
  } = scrollBodyRef.current!.getValues();

  const scrollBarRef = React.useRef<ScrollbarRef>(null);

  const [visible, setVisible] = useLayoutState(false);

  const rafRef = React.useRef<number | null>(null);

  React.useEffect(
    () => () => {
      if (rafRef.current) raf.cancel(rafRef.current);
    },
    [],
  );

  const checkScrollBarVisible = () => {
    rafRef.current = raf(() => {
      if (!scrollBodyRef.current) {
        return;
      }
      const tableOffsetTop = getOffset(scrollBodyRef.current.view).top;
      const tableBottomOffset = tableOffsetTop + scrollBodyRef.current.view!.offsetHeight;
      const currentClientOffset =
        container === window
          ? document.documentElement.scrollTop + window.innerHeight
          : getOffset(container).top + (container as HTMLElement).clientHeight;

      setVisible(
        () =>
          tableBottomOffset > currentClientOffset &&
          tableOffsetTop < currentClientOffset - offsetScroll,
      );
    });
  };

  const setScrollLeft = (left: number) => {
    scrollBarRef.current?.scrollTo({ left });
  };

  React.useImperativeHandle(ref, () => ({
    setScrollLeft,
    checkScrollBarVisible,
  }));

  React.useEffect(() => {
    const onScrollListener = addEventListener(container, 'scroll', checkScrollBarVisible, false);
    const onResizeListener = addEventListener(window, 'resize', checkScrollBarVisible, false);

    return () => {
      onScrollListener.remove();
      onResizeListener.remove();
    };
  }, [container]);

  React.useEffect(() => {
    if (visible) {
      scrollBarRef.current?.scrollTo({ left: bodyScrollLeft });
    }
  }, [visible]);

  if (bodyScrollWidth <= bodyWidth || !visible) {
    return null;
  }

  return (
    <Scrollbar
      ref={scrollBarRef}
      className={clsx(`${prefixCls}-sticky-scroll-bar`, 'sticky bottom-0 z-3 h-[14px]')}
      style={{ width: bodyWidth, bottom: offsetScroll }}
      onScroll={onScroll}
    >
      <div
        className={`${prefixCls}-sticky-scroll-bar-placeholder`}
        style={{ width: bodyScrollWidth }}
      />
    </Scrollbar>
  );
};

export default React.forwardRef(StickyScrollBar);
