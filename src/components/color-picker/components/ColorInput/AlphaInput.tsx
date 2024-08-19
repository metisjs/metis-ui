import type { FC } from 'react';
import React, { useEffect, useState } from 'react';
import { clsx } from '../../../_util/classNameUtils';
import type { AggregationColor } from '../../color';
import { generateColor, getColorAlpha } from '../../util';
import Steppers from './Steppers';

interface AlphaInputProps {
  prefixCls: string;
  value?: AggregationColor;
  onChange?: (value: AggregationColor) => void;
}

const AlphaInput: FC<AlphaInputProps> = ({ prefixCls, value, onChange }) => {
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

  const cls = clsx(`${prefixCls}-alpha-input`, 'basis-12');

  return (
    <Steppers
      value={getColorAlpha(alphaValue)}
      prefixCls={prefixCls}
      formatter={(step) => `${step}%`}
      className={cls}
      onChange={handleAlphaChange}
    />
  );
};

export default AlphaInput;
