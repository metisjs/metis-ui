import React from 'react';
import {
  ChevronDownOutline,
  ChevronLeftOutline,
  ChevronRightOutline,
  ChevronUpOutline,
} from '@metisjs/icons';
import { clsx } from '../_util/classNameUtils';
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
          'absolute z-[2] inline-flex items-center justify-center text-xl text-container opacity-40 transition-opacity hover:opacity-100',
          {
            'left-2 top-1/2 -translate-y-1/2': !vertical,
            'left-1/2 top-2 -translate-x-1/2': vertical,
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
          'absolute z-[2] inline-flex items-center justify-center text-xl text-container opacity-40 transition-opacity hover:opacity-100',
          {
            'bottom-1/2 right-2 translate-y-1/2': !vertical,
            'bottom-2 right-1/2 translate-x-1/2': vertical,
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
