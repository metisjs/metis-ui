import type { CSSProperties, ReactElement } from 'react';
import React, {
  forwardRef,
  useContext,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import ResizeObserver from 'rc-resize-observer';
import { useEvent } from 'rc-util';
import { clsx, getSemanticCls } from '../_util/classNameUtils';
import useInterval from '../_util/hooks/useInterval';
import { ConfigContext } from '../config-provider';
import CarouselArrow from './arrow';
import CarouselIndicator from './indicator';
import type { CarouselProps, CarouselRef } from './interface';

const DEFAULT_AUTO_PLAY_INTERVAL = 3000;

const Carousel = forwardRef<CarouselRef, CarouselProps>((props, ref) => {
  const {
    prefixCls: customizePrefixCls,
    style,
    className,
    children,
    defaultIndex = 0,
    animation = 'slide',
    trigger,
    speed = 500,
    timingFunc = 'linear',
    indicatorPosition = 'bottom',
    vertical = indicatorPosition === 'left' || indicatorPosition === 'right',
    showArrow,
    indicator = true,
    icons,
    autoPlay,
    lazy,
    onChange,
  } = props;

  const { getPrefixCls } = useContext(ConfigContext);
  const prefixCls = getPrefixCls('carousel', customizePrefixCls);

  const childrenList = React.Children.toArray(children).filter((child) =>
    React.isValidElement(child),
  ) as ReactElement[];
  const childrenLength = childrenList.length;

  const sliderWrapperRef = useRef<HTMLDivElement>(null);
  const animationTimerRef = useRef<NodeJS.Timeout>();

  const getValidIndex = (i: number) => {
    const indexNumber = +i;
    return typeof indexNumber === 'number' && !isNaN(indexNumber)
      ? (indexNumber + childrenLength) % childrenLength
      : i;
  };

  // ============================ States ===========================
  const [index, setIndex] = useState(defaultIndex);
  const [previousIndex, setPreviousIndex] = useState<number>(index);
  const [isPause, setIsPause] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [slideDirection, setSlideDirection] = useState<'positive' | 'negative'>('positive');
  const [computedStyle, setComputedStyle] = useState<{
    sliderWrapper?: CSSProperties;
    indicatorWrapper?: CSSProperties;
  }>({});

  const prevIndex = getValidIndex(index - 1);
  const nextIndex = getValidIndex(index + 1);
  const autoPlayInterval =
    typeof autoPlay === 'object' && autoPlay.interval
      ? autoPlay.interval
      : DEFAULT_AUTO_PLAY_INTERVAL;

  useEffect(() => {
    return () => {
      if (animationTimerRef.current) clearTimeout(animationTimerRef.current);
    };
  }, []);

  const [, resetInterval] = useInterval(
    () => {
      // eslint-disable-next-line @typescript-eslint/no-use-before-define
      slideTo({
        targetIndex: nextIndex,
      });
    },
    autoPlay && !isPause && childrenLength > 1 ? autoPlayInterval : undefined,
  );

  const slideTo = useEvent(
    ({
      targetIndex,
      isNegative = false,
      resetAutoPlayInterval = false,
    }: {
      targetIndex: number;
      isNegative?: boolean;
      resetAutoPlayInterval?: boolean;
    }) => {
      if (!isAnimating && targetIndex !== index) {
        setIsAnimating(true);
        setIndex(targetIndex);
        setPreviousIndex(index);
        setSlideDirection(isNegative ? 'negative' : 'positive');
        onChange?.(targetIndex, index);

        if (autoPlay && resetAutoPlayInterval) {
          resetInterval();
        }

        animationTimerRef.current = setTimeout(() => {
          setIsAnimating(false);
          animationTimerRef.current = undefined;
        }, speed);
      }
    },
  );

  const [slideToPrev, slideToNext] = [
    () =>
      slideTo({
        targetIndex: prevIndex,
        isNegative: true,
      }),

    () =>
      slideTo({
        targetIndex: nextIndex,
      }),
  ];

  useImperativeHandle(ref, () => ({
    goto: (targetIndex: number) => {
      slideTo({
        targetIndex: getValidIndex(targetIndex),
        isNegative: targetIndex < index,
        resetAutoPlayInterval: true,
      });
    },
    prev: () => slideToPrev(),
    next: () => slideToNext(),
  }));

  // ============================ Styles ===========================
  const computeStyle = () => {
    if (animation === 'card') {
      if (sliderWrapperRef.current) {
        const sliderElement = sliderWrapperRef.current.children[0];

        if (!sliderElement) {
          return;
        }

        if (!vertical) {
          const totalWidth = sliderWrapperRef.current.clientWidth;
          const sliderWidth = sliderElement.clientWidth;
          const edge = (totalWidth - sliderWidth) / 2;

          // deltaZ is TranslateZ(-Zpx) of prev/next slider's style
          // perspective / (perspective + deltaZ) = x / X
          const deltaZ = 200;
          const x = totalWidth / 2;
          const X = sliderWidth;
          // avoid getting a huge perspective value
          const perspective = x + 50 >= X ? deltaZ * 4 : (deltaZ * x) / (X - x);

          setComputedStyle({
            sliderWrapper: {
              perspective,
            },
            indicatorWrapper: {
              width: 'auto',
              left: edge,
              right: edge,
            },
          });
        } else {
          const totalHeight = sliderWrapperRef.current.clientHeight;
          const sliderHeight = sliderElement.clientHeight;
          const edge = (totalHeight - sliderHeight) / 2;

          // deltaZ is TranslateZ(-Zpx) of prev/next slider's style
          // perspective / (perspective + deltaZ) = x / X
          const deltaZ = 200;
          const y = totalHeight / 2;
          const Y = sliderHeight;
          // avoid getting a huge perspective value
          const perspective = y + 50 >= Y ? deltaZ * 4 : (deltaZ * y) / (Y - y);

          setComputedStyle({
            sliderWrapper: {
              perspective,
            },
            indicatorWrapper: {
              height: 'auto',
              top: edge,
              bottom: edge,
            },
          });
        }
      }
    } else {
      setComputedStyle({
        sliderWrapper: undefined,
        indicatorWrapper: undefined,
      });
    }
  };

  const semanticCls = getSemanticCls(className);

  const rootCls = clsx(prefixCls, 'relative', semanticCls.root);

  const wrapperCls = clsx(`${prefixCls}-${animation}`, 'relative h-full w-full overflow-hidden');

  // ============================ Render ===========================
  const eventHandlers = Object.assign(
    {},
    autoPlay && (typeof autoPlay !== 'object' || autoPlay.hoverToPause !== false)
      ? {
          onMouseEnter: () => setIsPause(true),
          onMouseLeave: () => setIsPause(false),
        }
      : null,
  );

  return (
    <ResizeObserver onResize={computeStyle}>
      <div className={rootCls} style={style} {...eventHandlers}>
        <div ref={sliderWrapperRef} style={computedStyle.sliderWrapper} className={wrapperCls}>
          {childrenList.map((child, i) => {
            const isActive = i === index;
            const isPrev = i === prevIndex;
            const isNext = i === nextIndex;
            const shouldRenderChild = !lazy || isActive || isPrev || isNext;

            if (!shouldRenderChild) {
              return null;
            }

            const {
              style: childStyle,
              className: childClassName,
              onClick: childOnClick,
            } = child.props;

            return React.cloneElement(child, {
              'aria-hidden': !isActive,
              style: Object.assign(
                {
                  transitionTimingFunction: timingFunc,
                  transitionDuration: `${speed}ms`,
                  animationTimingFunction: timingFunc,
                  animationDuration: `${speed}ms`,
                },
                childStyle,
              ),
              className: clsx(
                `${prefixCls}-item`,
                {
                  [`${prefixCls}-item-prev`]: isPrev,
                  [`${prefixCls}-item-next`]: isNext,
                  [`${prefixCls}-item-active`]: isActive,
                },
                'absolute left-0 top-0 h-full w-full overflow-hidden',
                {
                  'relative z-[1]': isActive,
                  ['invisible']: animation === 'slide' && !isActive,
                },
                isAnimating &&
                  // slide 动画
                  animation === 'slide' && [
                    slideDirection === 'positive' && {
                      'block animate-[slide-right-in]': isActive,
                      'block animate-[slide-left-out]': i === previousIndex,
                    },
                    slideDirection === 'negative' && {
                      'block animate-[slide-left-in]': isActive,
                      'block animate-[slide-right-out]': i === previousIndex,
                    },
                    // fade 动画
                    // card 动画
                  ],
                childClassName,
              ),
              onClick: (event: any) => {
                childOnClick?.(event);
                slideTo({
                  targetIndex: i,
                  isNegative: i === prevIndex,
                });
              },
            });
          })}
        </div>

        {indicator && childrenLength > 1 && (
          <div
            style={computedStyle.indicatorWrapper}
            className={clsx(
              `${prefixCls}-indicator-wrapper`,
              `${prefixCls}-indicator-wrapper-${indicatorPosition}`,
            )}
          >
            <CarouselIndicator
              prefixCls={prefixCls}
              className={semanticCls.indicator}
              count={childrenLength}
              activeIndex={index}
              position={indicatorPosition}
              trigger={trigger}
              onSelectIndex={(i) =>
                slideTo({
                  targetIndex: i,
                  isNegative: i < index,
                })
              }
            />
          </div>
        )}

        {showArrow && childrenLength > 1 && (
          <CarouselArrow
            prefixCls={prefixCls}
            className={semanticCls.arrow}
            vertical={vertical}
            icons={icons}
            prev={slideToPrev}
            next={slideToNext}
          />
        )}
      </div>
    </ResizeObserver>
  );
});

if (process.env.NODE_ENV !== 'production') {
  Carousel.displayName = 'Carousel';
}

export default Carousel;
