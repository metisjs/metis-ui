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

  const arrowClass = clsx(`${prefixCls}-arrow`, className);

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
    <div className={arrowClass}>
      <div
        className={`${prefixCls}-arrow-${vertical ? 'top' : 'left'}`}
        onClick={prev}
        role="button"
        tabIndex={0}
      >
        {iconPrev}
      </div>
      <div
        className={`${prefixCls}-arrow-${vertical ? 'bottom' : 'right'}`}
        onClick={next}
        role="button"
        tabIndex={0}
      >
        {iconNext}
      </div>
    </div>
  );
};

export default CarouselArrow;
