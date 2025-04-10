import * as React from 'react';
import { useContext } from '@rc-component/context';
import { getDOM } from '@rc-component/util/es/Dom/findDOMNode';
import raf from '@rc-component/util/es/raf';
import { clsx } from '@util/classNameUtils';
import type { ScrollbarRef, ScrollValues } from '../scrollbar';
import Scrollbar from '../scrollbar';
import TableContext from './context/TableContext';
import { useLayoutState } from './hooks/useFrame';

interface StickyScrollBarProps {
  scrollBodyRef: React.RefObject<ScrollbarRef | null>;
  onScroll: (values: ScrollValues, e: React.UIEvent<HTMLElement>) => void;
  offsetScroll: number;
  container: HTMLElement | Window;
}

export function getOffset(node: HTMLElement | Window) {
  const element = getDOM(node);
  const box = element!.getBoundingClientRect();
  const docElem = document.documentElement;

  return {
    left:
      box.left +
      (window.pageXOffset || docElem.scrollLeft) -
      (docElem.clientLeft || document.body.clientLeft || 0),
    top:
      box.top +
      (window.pageYOffset || docElem.scrollTop) -
      (docElem.clientTop || document.body.clientTop || 0),
  };
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
      const tableOffsetTop = getOffset(scrollBodyRef.current.view!).top;
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
    window.addEventListener('resize', checkScrollBarVisible, false);
    container.addEventListener('scroll', checkScrollBarVisible, false);

    return () => {
      window.removeEventListener('resize', checkScrollBarVisible);
      container.removeEventListener('scroll', checkScrollBarVisible);
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
