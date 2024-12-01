import type { ReactNode } from 'react';
import React from 'react';
import { clsx, getSemanticCls } from '@util/classNameUtils';
import useSemanticCls from '@util/hooks/useSemanticCls';
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

  const semanticCls = useSemanticCls(className);

  const indicatorContent: ReactNode[] = [];

  for (let i = 0; i < count; i++) {
    const active = i === activeIndex;
    const itemCls = getSemanticCls(semanticCls.item, { active });

    indicatorContent.push(
      <div
        key={i}
        data-index={i}
        role="button"
        className={clsx(
          `${prefixCls}-item`,
          {
            [`${prefixCls}-item-active`]: active,
          },
          'relative inline-block h-1 w-4 flex-auto flex-grow-0 rounded-full bg-container opacity-20 transition-all duration-300',
          {
            'w-6 opacity-100': active,
            'hover:opacity-65': !active,
            'h-4 w-1': position === 'right' || position === 'left',
            'h-5': (position === 'right' || position === 'left') && active,
          },
          position === 'outer' && {
            'bg-fill opacity-40': true,
            'opacity-100': active,
            'hover:opacity-85': i !== activeIndex,
          },
          itemCls.root,
        )}
      />,
    );
  }

  const wrapperProps = {
    className: clsx(
      prefixCls,
      `${prefixCls}-${position}`,
      'absolute z-10 flex justify-center gap-2',
      {
        'left-0 right-0 top-3': position === 'top',
        'bottom-3 left-0 right-0': position === 'bottom',
        'bottom-0 left-3 top-0 flex-col': position === 'left',
        'bottom-0 right-3 top-0 flex-col': position === 'right',
        'relative h-9 items-center': position === 'outer',
      },
      semanticCls.root,
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
