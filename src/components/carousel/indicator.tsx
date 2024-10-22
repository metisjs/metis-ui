import type { ReactNode } from 'react';
import React from 'react';
import { clsx } from '../_util/classNameUtils';
import type { CarouselIndicatorProps } from './interface';

const CarouselIndicator = (props: CarouselIndicatorProps) => {
  const {
    prefixCls,
    className,
    count = 2,
    activeIndex = 0,
    position = 'bottom',
    trigger = 'click',
    onSelectIndex,
  } = props;

  const indicatorContent: ReactNode[] = [];

  for (let i = 0; i < count; i++) {
    indicatorContent.push(
      <div
        key={i}
        data-index={i}
        role="button"
        className={clsx(
          `${prefixCls}-item`,
          {
            [`${prefixCls}-item-active`]: i === activeIndex,
          },
          'relative inline-block h-1 w-4 flex-auto flex-grow-0 rounded-full bg-container opacity-20 transition-all duration-300',
          {
            'w-6 opacity-100': i === activeIndex,
            'hover:opacity-65': i !== activeIndex,
          },
        )}
      />,
    );
  }

  const wrapperProps = {
    className: clsx(
      prefixCls,
      `${prefixCls}-${position}`,
      'absolute bottom-3 left-0 right-0 z-10 flex justify-center gap-2',
      className,
    ),
    [trigger === 'click' ? 'onClick' : 'onMouseMove']: (event: any) => {
      event.preventDefault();
      const dataIndex: string = event.target.getAttribute('data-index');
      if (dataIndex && +dataIndex !== activeIndex) {
        onSelectIndex?.(+dataIndex);
      }
    },
  };

  return <div {...wrapperProps}>{indicatorContent}</div>;
};

export default CarouselIndicator;
