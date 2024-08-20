import type { FC } from 'react';
import React from 'react';
import { clsx } from '../../_util/classNameUtils';
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
        'w-6 h-6 rounded border border-border-secondary relative overflow-hidden cursor-pointer transition-all hover:border-border',
        'after:absolute after:-top-px after:-end-px after:block after:w-10 after:h-0.5 after:-rotate-45 after:origin-[calc(100%-1px)_1px] after:bg-error',
        className,
      )}
      onClick={handleClick}
    />
  );
};

export default ColorClear;
