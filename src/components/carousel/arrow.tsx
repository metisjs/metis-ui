import React from 'react';
import {
  ChevronDownOutline,
  ChevronLeftOutline,
  ChevronRightOutline,
  ChevronUpOutline,
} from '@metisjs/icons';
import { clsx } from '@util/classNameUtils';
import type { CarouselArrowProps } from './interface';

const CarouselArrow = (props: CarouselArrowProps) => {
  const { prefixCls, className, vertical, prev, next, icons } = props;

  const iconPrev =
    icons && icons.hasOwnProperty('prev') ? (
      icons.prev
    ) : !vertical ? (
      <ChevronLeftOutline />
    ) : (
      <ChevronUpOutline />
    );

  const iconNext =
    icons && icons.hasOwnProperty('next') ? (
      icons.next
    ) : !vertical ? (
      <ChevronRightOutline />
    ) : (
      <ChevronDownOutline />
    );

  return (
    <>
      <div
        className={clsx(
          `${prefixCls}-arrow`,
          `${prefixCls}-arrow-${vertical ? 'top' : 'left'}`,
          'text-container absolute z-2 inline-flex items-center justify-center text-xl opacity-40 transition-opacity hover:opacity-100',
          {
            'top-1/2 left-2 -translate-y-1/2': !vertical,
            'top-2 left-1/2 -translate-x-1/2': vertical,
          },
          className,
        )}
        onClick={prev}
        role="button"
        tabIndex={0}
      >
        {iconPrev}
      </div>
      <div
        className={clsx(
          `${prefixCls}-arrow`,
          `${prefixCls}-arrow-${vertical ? 'bottom' : 'right'}`,
          'text-container absolute z-2 inline-flex items-center justify-center text-xl opacity-40 transition-opacity hover:opacity-100',
          {
            'right-2 bottom-1/2 translate-y-1/2': !vertical,
            'right-1/2 bottom-2 translate-x-1/2': vertical,
          },
          className,
        )}
        onClick={next}
        role="button"
        tabIndex={0}
      >
        {iconNext}
      </div>
    </>
  );
};

export default CarouselArrow;
