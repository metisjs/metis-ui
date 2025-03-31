import type { FC } from 'react';
import React from 'react';
import { clsx } from '@util/classNameUtils';
import type { AggregationColor } from '../color';
import { generateColor } from '../util';

interface ColorClearProps {
  prefixCls: string;
  value?: AggregationColor;
  onChange?: (value: AggregationColor) => void;
  className?: string;
}

const ColorClear: FC<ColorClearProps> = ({ prefixCls, value, className, onChange }) => {
  const handleClick = () => {
    if (onChange && value && !value.cleared) {
      const hsba = value.toHsb();
      hsba.a = 0;
      const genColor = generateColor(hsba);
      genColor.cleared = true;

      onChange(genColor);
    }
  };
  return (
    <div
      className={clsx(
        `${prefixCls}-clear`,
        'border-border-secondary hover:border-border relative h-6 w-6 cursor-pointer overflow-hidden rounded-sm border transition-all',
        'after:bg-error after:absolute after:-end-px after:-top-px after:block after:h-0.5 after:w-10 after:origin-[calc(100%-1px)_1px] after:-rotate-45',
        className,
      )}
      onClick={handleClick}
    />
  );
};

export default ColorClear;
