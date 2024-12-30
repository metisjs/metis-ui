import * as React from 'react';
import { useContext } from '@rc-component/context';
import classNames from 'classnames';
import addEventListener from 'rc-util/lib/Dom/addEventListener';
import { getOffset } from 'rc-util/lib/Dom/css';
import getScrollBarSize from 'rc-util/lib/getScrollBarSize';
import raf from 'rc-util/lib/raf';
import TableContext from './context/TableContext';
import { useLayoutState } from './hooks/useFrame';

interface StickyScrollBarProps {
  scrollBodyRef: React.RefObject<HTMLDivElement>;
  onScroll: (params: { scrollLeft?: number }) => void;
  offsetScroll: number;
  container: HTMLElement | Window;
}

const StickyScrollBar: React.ForwardRefRenderFunction<unknown, StickyScrollBarProps> = (
  { scrollBodyRef, onScroll, offsetScroll, container },
  ref,
) => {
  const prefixCls = useContext(TableContext, 'prefixCls');
  const bodyScrollWidth = scrollBodyRef.current?.scrollWidth || 0;
  const bodyWidth = scrollBodyRef.current?.clientWidth || 0;
  const scrollBarWidth = bodyScrollWidth && bodyWidth * (bodyWidth / bodyScrollWidth);

  const scrollBarRef = React.useRef<HTMLDivElement>();
  const [scrollState, setScrollState] = useLayoutState<{
    scrollLeft: number;
    isHiddenScrollBar: boolean;
  }>({
    scrollLeft: 0,
    isHiddenScrollBar: true,
  });
  const rafRef = React.useRef<number | null>(null);

  React.useEffect(
    () => () => {
      raf.cancel(rafRef.current);
    },
    [],
  );

  const checkScrollBarVisible = () => {
    rafRef.current = raf(() => {
      if (!scrollBodyRef.current) {
        return;
      }
      const tableOffsetTop = getOffset(scrollBodyRef.current).top;
      const tableBottomOffset = tableOffsetTop + scrollBodyRef.current.offsetHeight;
      const currentClientOffset =
        container === window
          ? document.documentElement.scrollTop + window.innerHeight
          : getOffset(container).top + (container as HTMLElement).clientHeight;

      if (
        tableBottomOffset <= currentClientOffset ||
        tableOffsetTop >= currentClientOffset - offsetScroll
      ) {
        setScrollState((state) => ({
          ...state,
          isHiddenScrollBar: true,
        }));
      } else {
        setScrollState((state) => ({
          ...state,
          isHiddenScrollBar: false,
        }));
      }
    });
  };

  const setScrollLeft = (left: number) => {
    setScrollState((state) => {
      return {
        ...state,
        scrollLeft: (left / bodyScrollWidth) * bodyWidth || 0,
      };
    });
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
    if (!scrollState.isHiddenScrollBar) {
      setScrollState((state) => {
        const bodyNode = scrollBodyRef.current;
        if (!bodyNode) {
          return state;
        }
        return {
          ...state,
          scrollLeft: (bodyNode.scrollLeft / bodyNode.scrollWidth) * bodyNode.clientWidth,
        };
      });
    }
  }, [scrollState.isHiddenScrollBar]);

  if (bodyScrollWidth <= bodyWidth || !scrollBarWidth || scrollState.isHiddenScrollBar) {
    return null;
  }

  return (
    <div
      style={{
        height: getScrollBarSize(),
        width: bodyWidth,
        bottom: offsetScroll,
      }}
      className={`${prefixCls}-sticky-scroll`}
    >
      <div
        onMouseDown={onMouseDown}
        ref={scrollBarRef}
        className={classNames(`${prefixCls}-sticky-scroll-bar`, {
          [`${prefixCls}-sticky-scroll-bar-active`]: isActive,
        })}
        style={{
          width: `${scrollBarWidth}px`,
          transform: `translate3d(${scrollState.scrollLeft}px, 0, 0)`,
        }}
      />
    </div>
  );
};

export default React.forwardRef(StickyScrollBar);
