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
    timingFunc = 'cubic-bezier(0.34, 0.69, 0.1, 1)',
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
          });
        } else {
          const totalHeight = sliderWrapperRef.current.clientHeight;
          const sliderHeight = sliderElement.clientHeight;

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
          });
        }
      }
    } else {
      setComputedStyle({
        sliderWrapper: undefined,
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
                animation === 'card' && [
                  !vertical && [
                    'left-1/2 w-3/5 -translate-x-1/2 opacity-0 -translate-z-[25rem]',
                    {
                      '-translate-x-1/2 opacity-100 translate-z-0': isActive,
                      '-translate-x-full cursor-pointer opacity-40 -translate-z-[12.5rem]': isPrev,
                      'translate-x-0 cursor-pointer opacity-40 -translate-z-[12.5rem]': isNext,
                    },
                  ],
                  vertical && [
                    'top-1/2 !h-3/5 -translate-y-1/2 opacity-0 -translate-z-[25rem]',
                    {
                      '-translate-y-1/2 opacity-100 translate-z-0': isActive,
                      '-translate-y-full cursor-pointer opacity-40 -translate-z-[12.5rem]': isPrev,
                      'translate-y-0 cursor-pointer opacity-40 -translate-z-[12.5rem]': isNext,
                    },
                  ],
                ],
                isAnimating && [
                  // slide 动画
                  animation === 'slide' && [
                    slideDirection === 'positive' && [
                      !vertical && {
                        'block animate-[slide-right-in]': isActive,
                        'visible block animate-[slide-left-out]': i === previousIndex,
                      },
                      vertical && {
                        'block animate-[slide-bottom-in]': isActive,
                        'visible block animate-[slide-top-out]': i === previousIndex,
                      },
                    ],
                    slideDirection === 'negative' && [
                      !vertical && {
                        'block animate-[slide-left-in]': isActive,
                        'visible block animate-[slide-right-out]': i === previousIndex,
                      },
                      vertical && {
                        'block animate-[slide-top-in]': isActive,
                        'visible block animate-[slide-bottom-out]': i === previousIndex,
                      },
                    ],
                  ],
                  // card 动画
                ],
                // fade 动画
                animation === 'fade' && {
                  'opacity-0': !isActive,
                  'opacity-100': isActive,
                },
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
