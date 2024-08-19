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
  return <div className={clsx(`${prefixCls}-clear`, 'w-6 h-6', className)} onClick={handleClick} />;
};

export default ColorClear;
