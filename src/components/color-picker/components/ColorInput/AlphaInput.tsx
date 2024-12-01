import type { FC } from 'react';
import React, { useEffect, useState } from 'react';
import { clsx, mergeSemanticCls } from '@util/classNameUtils';
import type { InputNumberProps } from '../../../input-number';
import type { AggregationColor } from '../../color';
import { generateColor, getColorAlpha } from '../../util';
import Steppers from './Steppers';

interface AlphaInputProps {
  prefixCls: string;
  className?: InputNumberProps['className'];
  value?: AggregationColor;
  onChange?: (value: AggregationColor) => void;
}

const AlphaInput: FC<AlphaInputProps> = ({ prefixCls, value, className, onChange }) => {
  const [alphaValue, setAlphaValue] = useState<AggregationColor>(generateColor(value || '#000'));

  // Update step value
  useEffect(() => {
    if (value) {
      setAlphaValue(value);
    }
  }, [value]);

  const handleAlphaChange = (step: number | null) => {
    const hsba = alphaValue.toHsb();
    hsba.a = (step || 0) / 100;
    const genColor = generateColor(hsba);
    if (!value) {
      setAlphaValue(genColor);
    }
    onChange?.(genColor);
  };

  return (
    <Steppers
      value={getColorAlpha(alphaValue)}
      prefixCls={prefixCls}
      formatter={(step) => `${step}%`}
      className={mergeSemanticCls(clsx(`${prefixCls}-alpha-input`, 'basis-11'), className)}
      onChange={handleAlphaChange}
    />
  );
};

export default AlphaInput;
