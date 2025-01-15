import type { CSSProperties, HTMLAttributes, UIEvent } from 'react';
import React, {
  forwardRef,
  useContext,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import { clsx } from '@util/classNameUtils';
import useSemanticCls from '@util/hooks/useSemanticCls';
import ResizeObserver from 'rc-resize-observer';
import getScrollBarSize from 'rc-util/lib/getScrollBarSize';
import raf from 'rc-util/lib/raf';
import { ConfigContext } from '../config-provider';
import type { ScrollbarProps, ScrollbarRef, ScrollValues } from './interface';
import getInnerHeight from './utils/getInnerHeight';
import getInnerWidth from './utils/getInnerWidth';

const Scrollbars = (props: ScrollbarProps, ref: React.Ref<ScrollbarRef>) => {
  const {
    prefixCls: customizePrefixCls,
    autoHeight = false,
    autoHide: customizeAutoHide,
    autoHideDuration: customizeAutoHideDuration,
    autoHideTimeout: customizeAutoHideTimeout,
    children,
    className,
    onScroll,
    onScrollStart,
    onScrollStop,
    thumbMinSize: customizeThumbMinSize,
    thumbSize,
    universal = false,
    component: Component = 'div',
    renderView,
    style,
  } = props;
  const { getPrefixCls, scrollbar } = useContext(ConfigContext);
  const prefixCls = getPrefixCls('scrollbar', customizePrefixCls);
  const semanticCls = useSemanticCls(className, 'scrollbar');

  const mergedAutoHide = customizeAutoHide ?? scrollbar?.autoHide ?? true;
  const mergedAutoHideDuration = customizeAutoHideDuration ?? scrollbar?.autoHideDuration ?? 500;
  const mergedAutoHideTimeout = customizeAutoHideTimeout ?? scrollbar?.autoHideTimeout ?? 1000;
  const mergedThumbMinSize = customizeThumbMinSize ?? scrollbar?.thumbMinSize ?? 20;

  // ======================== Ref ========================
  const viewRef = useRef<HTMLDivElement>(null);
  const trackHorizontalRef = useRef<HTMLDivElement>(null);
  const trackVerticalRef = useRef<HTMLDivElement>(null);
  const thumbHorizontalRef = useRef<HTMLDivElement>(null);
  const thumbVerticalRef = useRef<HTMLDivElement>(null);

  const rafId = useRef<number>();

  const detectScrollingInterval = useRef<NodeJS.Timer>();
  const hideTracksTimeout = useRef<NodeJS.Timer>();

  const viewScrollLeft = useRef<number>();
  const viewScrollTop = useRef<number>();
  const lastViewScrollLeft = useRef<number>();
  const lastViewScrollTop = useRef<number>();
  const prevPageX = useRef<number>();
  const prevPageY = useRef<number>();

  // ======================== State ========================
  const [didMountUniversal, setDidMountUniversal] = useState(false);
  const [scrollbarWidth, setScrollbarWidth] = useState(getScrollBarSize);
  const [trackVisible, setTrackVisible] = useState(!mergedAutoHide);
  const [scrolling, setScrolling] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [trackMouseOver, setTrackMouseOver] = useState(false);

  const [thumbHorizontalStyle, setThumbHorizontalStyle] = useState<CSSProperties>();
  const [thumbVerticalStyle, setThumbVerticalStyle] = useState<CSSProperties>();

  const getValues = () => {
    const {
      scrollLeft = 0,
      scrollTop = 0,
      scrollWidth = 0,
      scrollHeight = 0,
      clientWidth = 0,
      clientHeight = 0,
    } = viewRef.current || {};

    return {
      left: scrollLeft / (scrollWidth - clientWidth) || 0,
      top: scrollTop / (scrollHeight - clientHeight) || 0,
      scrollLeft,
      scrollTop,
      scrollWidth,
      scrollHeight,
      clientWidth,
      clientHeight,
    };
  };

  const getThumbHorizontalWidth = () => {
    if (!viewRef.current) return 0;

    const { scrollWidth, clientWidth } = viewRef.current;
    const trackWidth = getInnerWidth(trackHorizontalRef.current);
    if (!scrollWidth) return 0;
    const width = Math.ceil((clientWidth / scrollWidth) * trackWidth);
    if (trackWidth === width) return 0;
    if (thumbSize) return thumbSize;
    return Math.max(width, mergedThumbMinSize);
  };

  const getThumbVerticalHeight = () => {
    if (!viewRef.current) return 0;

    const { scrollHeight, clientHeight } = viewRef.current;

    if (!scrollHeight) return 0;

    const trackHeight = getInnerHeight(trackVerticalRef.current);
    const height = Math.ceil((clientHeight / scrollHeight) * trackHeight);

    if (trackHeight === height) return 0;
    if (thumbSize) return thumbSize;

    return Math.max(height, mergedThumbMinSize);
  };

  const update = (callback?: (values: ScrollValues) => void) => {
    if (rafId.current !== undefined) raf.cancel(rafId.current);

    rafId.current = raf(() => {
      const values = getValues();

      const freshScrollbarWidth = getScrollBarSize();

      if (scrollbarWidth !== freshScrollbarWidth) {
        setScrollbarWidth(freshScrollbarWidth);
      }

      if (freshScrollbarWidth) {
        const { scrollLeft, clientWidth, scrollWidth } = values;
        const trackHorizontalWidth = getInnerWidth(trackHorizontalRef.current);

        const thumbHorizontalWidth = getThumbHorizontalWidth();
        const thumbHorizontalX =
          (scrollLeft / (scrollWidth - clientWidth)) *
          (trackHorizontalWidth - thumbHorizontalWidth);
        const thumbHorizontalStyle = {
          width: thumbHorizontalWidth,
          transform: `translateX(${thumbHorizontalX}px)`,
        };
        const { scrollTop, clientHeight, scrollHeight } = values;
        const trackVerticalHeight = getInnerHeight(trackVerticalRef.current);
        const thumbVerticalHeight = getThumbVerticalHeight();
        const thumbVerticalY =
          (scrollTop / (scrollHeight - clientHeight)) * (trackVerticalHeight - thumbVerticalHeight);
        const thumbVerticalStyle = {
          height: thumbVerticalHeight,
          transform: `translateY(${thumbVerticalY}px)`,
        };
        setThumbHorizontalStyle(thumbHorizontalStyle);
        setThumbVerticalStyle(thumbVerticalStyle);
      }
      callback?.(values);
    });
  };

  const showTracks = () => {
    clearTimeout(hideTracksTimeout.current);
    setTrackVisible(true);
  };

  const hideTracks = () => {
    if (dragging || trackMouseOver || scrolling) return;

    clearTimeout(hideTracksTimeout.current);
    hideTracksTimeout.current = setTimeout(() => {
      setTrackVisible(false);
    }, mergedAutoHideTimeout);
  };

  const handleDragEndAutoHide = () => {
    if (!mergedAutoHide) return;
    hideTracks();
  };

  const handleTrackMouseEnterAutoHide = () => {
    if (!mergedAutoHide) return;
    showTracks();
  };

  const handleTrackMouseEnter = () => {
    setTrackMouseOver(true);
    handleTrackMouseEnterAutoHide();
  };

  const handleTrackMouseLeaveAutoHide = () => {
    if (!mergedAutoHide) return;
    hideTracks();
  };

  const handleTrackMouseLeave = () => {
    setTrackMouseOver(false);
    handleTrackMouseLeaveAutoHide();
  };

  const handleScrollStartAutoHide = () => {
    if (!mergedAutoHide) return;
    showTracks();
  };

  const handleScrollStart = () => {
    if (onScrollStart) onScrollStart();
    handleScrollStartAutoHide();
  };

  const handleScrollStopAutoHide = () => {
    if (!mergedAutoHide) return;
    hideTracks();
  };

  const handleScrollStop = () => {
    if (onScrollStop) onScrollStop();
    handleScrollStopAutoHide();
  };

  const detectScrolling = () => {
    if (scrolling) return;

    setScrolling(true);
    handleScrollStart();
    detectScrollingInterval.current = setInterval(() => {
      if (
        lastViewScrollLeft.current === viewScrollLeft.current &&
        lastViewScrollTop.current === viewScrollTop.current
      ) {
        clearInterval(detectScrollingInterval.current);
        detectScrollingInterval.current = undefined;
        setScrolling(false);

        handleScrollStop();
      }
      lastViewScrollLeft.current = viewScrollLeft.current;
      lastViewScrollTop.current = viewScrollTop.current;
    }, 100);
  };

  const handleScroll = (event: UIEvent<HTMLElement>) => {
    const currentTarget = event.currentTarget;
    update((values: ScrollValues) => {
      const { scrollLeft, scrollTop } = values;

      viewScrollLeft.current = scrollLeft;
      viewScrollTop.current = scrollTop;
      event.currentTarget = currentTarget;
      onScroll?.(values, event);
    });
    detectScrolling();
  };

  const getScrollLeftForOffset = (offset: number) => {
    const { width: viewWidth } = viewRef.current!.getBoundingClientRect();
    const trackWidth = getInnerWidth(trackHorizontalRef.current);
    const thumbWidth = getThumbHorizontalWidth();
    return (offset / (trackWidth - thumbWidth)) * (viewRef.current!.scrollWidth - viewWidth);
  };

  const getScrollTopForOffset = (offset: number) => {
    const { height: viewHeight } = viewRef.current!.getBoundingClientRect();
    const trackHeight = getInnerHeight(trackVerticalRef.current);
    const thumbHeight = getThumbVerticalHeight();
    return (offset / (trackHeight - thumbHeight)) * (viewRef.current!.scrollHeight - viewHeight);
  };

  const handleHorizontalTrackMouseDown = (event: globalThis.MouseEvent) => {
    if (!viewRef.current) return;

    event.preventDefault();
    const { target, clientX } = event;
    const { left: targetLeft } = (target as HTMLDivElement).getBoundingClientRect();
    const thumbWidth = getThumbHorizontalWidth();
    const offset = Math.abs(targetLeft - clientX) - thumbWidth / 2;
    viewRef.current.scrollLeft = getScrollLeftForOffset(offset);
  };

  const handleVerticalTrackMouseDown = (event: globalThis.MouseEvent) => {
    if (!viewRef.current) return;

    event.preventDefault();
    const { target, clientY } = event;
    const { top: targetTop } = (target as HTMLDivElement).getBoundingClientRect();
    const thumbHeight = getThumbVerticalHeight();
    const offset = Math.abs(targetTop - clientY) - thumbHeight / 2;
    viewRef.current.scrollTop = getScrollTopForOffset(offset);
  };

  const handleDrag = (event: globalThis.MouseEvent) => {
    if (rafId.current !== undefined) raf.cancel(rafId.current);

    if (prevPageX.current && trackHorizontalRef.current && viewRef.current) {
      const { clientX } = event;
      const { left: trackLeft } = trackHorizontalRef.current.getBoundingClientRect();
      const thumbWidth = getThumbHorizontalWidth();
      const clickPosition = thumbWidth - prevPageX.current;
      const offset = -trackLeft + clientX - clickPosition;

      rafId.current = raf(() => {
        viewRef.current!.scrollLeft = getScrollLeftForOffset(offset);
      });
    }
    if (prevPageY.current && trackVerticalRef.current && viewRef.current) {
      const { clientY } = event;
      const { top: trackTop } = trackVerticalRef.current.getBoundingClientRect();
      const thumbHeight = getThumbVerticalHeight();
      const clickPosition = thumbHeight - prevPageY.current;
      const offset = -trackTop + clientY - clickPosition;

      rafId.current = raf(() => {
        viewRef.current!.scrollTop = getScrollTopForOffset(offset);
      });
    }

    return false;
  };

  const handleDragEnd = () => {
    setDragging(false);
    prevPageX.current = 0;
    prevPageY.current = 0;
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    teardownDragging();
    handleDragEndAutoHide();
  };

  const setupDragging = () => {
    document.body.style.userSelect = 'none';
    document.addEventListener('mousemove', handleDrag);
    document.addEventListener('mouseup', handleDragEnd);
    document.onselectstart = () => false;
  };

  const teardownDragging = () => {
    document.body.style.userSelect = 'auto';
    document.removeEventListener('mousemove', handleDrag);
    document.removeEventListener('mouseup', handleDragEnd);
    document.onselectstart = null;
  };

  const handleDragStart = (event: globalThis.MouseEvent) => {
    setDragging(true);
    event.stopImmediatePropagation();
    setupDragging();
  };

  const handleHorizontalThumbMouseDown = (event: globalThis.MouseEvent) => {
    event.preventDefault();

    handleDragStart(event);

    const { target, clientX } = event;
    const { offsetWidth } = target as HTMLDivElement;
    const { left } = (target as HTMLDivElement).getBoundingClientRect();
    prevPageX.current = offsetWidth - (clientX - left);
  };

  const handleVerticalThumbMouseDown = (event: globalThis.MouseEvent) => {
    event.preventDefault();
    handleDragStart(event);
    const { target, clientY } = event;
    const { offsetHeight } = target as HTMLDivElement;
    const { top } = (target as HTMLDivElement).getBoundingClientRect();
    prevPageY.current = offsetHeight - (clientY - top);
  };

  const handleWindowResize = () => {
    update();
  };

  // ======================== Effect ========================
  useEffect(() => {
    if (scrollbarWidth) {
      trackHorizontalRef.current?.addEventListener('mouseenter', handleTrackMouseEnter);
      trackHorizontalRef.current?.addEventListener('mouseleave', handleTrackMouseLeave);
      trackHorizontalRef.current?.addEventListener('mousedown', handleHorizontalTrackMouseDown);
      trackVerticalRef.current?.addEventListener('mouseenter', handleTrackMouseEnter);
      trackVerticalRef.current?.addEventListener('mouseleave', handleTrackMouseLeave);
      trackVerticalRef.current?.addEventListener('mousedown', handleVerticalTrackMouseDown);
      thumbHorizontalRef.current?.addEventListener('mousedown', handleHorizontalThumbMouseDown);
      thumbVerticalRef.current?.addEventListener('mousedown', handleVerticalThumbMouseDown);
      window.addEventListener('resize', handleWindowResize);
    }

    update();
    setDidMountUniversal(universal);

    return () => {
      if (scrollbarWidth) {
        trackHorizontalRef.current?.removeEventListener('mouseenter', handleTrackMouseEnter);
        trackHorizontalRef.current?.removeEventListener('mouseleave', handleTrackMouseLeave);
        trackHorizontalRef.current?.removeEventListener(
          'mousedown',
          handleHorizontalTrackMouseDown,
        );
        trackVerticalRef.current?.removeEventListener('mouseenter', handleTrackMouseEnter);
        trackVerticalRef.current?.removeEventListener('mouseleave', handleTrackMouseLeave);
        trackVerticalRef.current?.removeEventListener('mousedown', handleVerticalTrackMouseDown);
        thumbHorizontalRef.current?.removeEventListener(
          'mousedown',
          handleHorizontalThumbMouseDown,
        );
        thumbVerticalRef.current?.removeEventListener('mousedown', handleVerticalThumbMouseDown);
        window.removeEventListener('resize', handleWindowResize);
      }

      teardownDragging();
      if (rafId.current !== undefined) raf.cancel(rafId.current);
      clearTimeout(hideTracksTimeout.current);
      clearInterval(detectScrollingInterval.current);
    };
  }, []);

  // ====================== Imperative ======================
  useImperativeHandle(
    ref,
    () => ({
      view: viewRef.current ?? undefined,
      getValues,
      scrollTo: (...arg: any[]) => {
        viewRef.current?.scrollTo(...arg);
      },
    }),
    [],
  );

  // ======================== Style ========================
  const rootCls = clsx(prefixCls, 'relative h-full w-full overflow-hidden', semanticCls.root);
  const rootStyle = {
    ...style,
    ...(autoHeight && {
      height: 'auto',
      minHeight: autoHeight[0],
      maxHeight: autoHeight[1],
    }),
  };

  const viewCls = clsx(
    `${prefixCls}-view`,
    'relative block overflow-scroll',
    {
      'overflow-hidden': universal && !didMountUniversal,
      'pointer-events-none': dragging,
    },
    semanticCls.view,
  );
  const viewStyle = {
    marginRight: scrollbarWidth ? -scrollbarWidth : 0,
    marginBottom: scrollbarWidth ? -scrollbarWidth : 0,
    width: `calc(100% + ${scrollbarWidth}px)`,
    height: `calc(100% + ${scrollbarWidth}px)`,
    ...(autoHeight && {
      height: 'auto',
      minHeight:
        typeof autoHeight[0] === 'number'
          ? autoHeight[0] + scrollbarWidth
          : `calc(${autoHeight[0]} + ${scrollbarWidth}px)`,
      maxHeight:
        typeof autoHeight[1] === 'number'
          ? autoHeight[1] + scrollbarWidth
          : `calc(${autoHeight[1]} + ${scrollbarWidth}px)`,
    }),
    ...(autoHeight &&
      universal &&
      !didMountUniversal && {
        minHeight: autoHeight[0],
        maxHeight: autoHeight[1],
      }),
    ...(universal && !didMountUniversal && { marginRight: 0, marginBottom: 0 }),
  };

  const horizontalScroll =
    scrollbarWidth && thumbHorizontalStyle?.width && (!universal || !didMountUniversal);
  const verticalScroll =
    scrollbarWidth && thumbVerticalStyle?.height && (!universal || !didMountUniversal);

  const trackHorizontalCls = clsx(
    `${prefixCls}-track ${prefixCls}-track-horizontal`,
    'peer/track absolute bottom-0 left-0 right-0 z-[100] h-3 px-1 py-0.5 opacity-0 hover:h-[14px] hover:bg-scrollbar-track',
    {
      'opacity-100': trackVisible,
      hidden: !horizontalScroll,
      'right-[14px]': verticalScroll,
    },
    semanticCls.trackHorizontal,
  );

  const trackVerticalCls = clsx(
    `${prefixCls}-track ${prefixCls}-track-vertical`,
    'peer/track absolute bottom-0 right-0 top-0 z-[100] w-3 px-0.5 py-1 opacity-0 hover:w-[14px] hover:bg-scrollbar-track',
    {
      'opacity-100': trackVisible,
      hidden: !verticalScroll,
      'bottom-[14px]': horizontalScroll,
    },
    semanticCls.trackVertical,
  );

  const trackCornerCls = clsx(
    'absolute bottom-0 right-0 z-[100] h-[14px] w-[14px] peer-hover/track:bg-scrollbar-track',
    {
      'bg-scrollbar-track': trackMouseOver,
    },
  );

  const trackStyle = {
    transitionProperty: 'opacity,background-color,width',
    transitionDuration: `${mergedAutoHideDuration}ms`,
  };

  const thumbCls = clsx(
    `${prefixCls}-track-thumb`,
    'relative block h-full cursor-pointer rounded-full bg-scrollbar-thumb transition-colors',
  );

  // ======================== Render ========================
  const sharedTrackProps: HTMLAttributes<HTMLDivElement> = {
    style: trackStyle,
  };

  const view = renderView ? (
    renderView({
      ref: viewRef,
      style: viewStyle,
      className: viewCls,
      onScroll: handleScroll,
      children,
    })
  ) : (
    <Component className={viewCls} ref={viewRef} style={viewStyle} onScroll={handleScroll}>
      {children}
    </Component>
  );

  return (
    <div className={rootCls} style={rootStyle}>
      <ResizeObserver onResize={() => update()}>{view}</ResizeObserver>
      <div className={trackHorizontalCls} ref={trackHorizontalRef} {...sharedTrackProps}>
        <div
          className={clsx(thumbCls, semanticCls.thumbHorizontal)}
          ref={thumbHorizontalRef}
          style={thumbHorizontalStyle}
        ></div>
      </div>
      <div className={trackVerticalCls} ref={trackVerticalRef} {...sharedTrackProps}>
        <div
          className={clsx(thumbCls, semanticCls.thumbVertical)}
          ref={thumbVerticalRef}
          style={thumbVerticalStyle}
        ></div>
      </div>
      <div className={trackCornerCls} {...sharedTrackProps}></div>
    </div>
  );
};

export default forwardRef(Scrollbars);
