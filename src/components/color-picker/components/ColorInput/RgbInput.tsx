import type { FC } from 'react';
import React, { useEffect, useState } from 'react';
import type { AggregationColor } from '../../color';
import type { RGB } from '../../interface';
import { generateColor } from '../../util';
import Steppers from './Steppers';

interface RgbInputProps {
  prefixCls: string;
  value?: AggregationColor;
  onChange?: (value: AggregationColor) => void;
}

const RgbInput: FC<RgbInputProps> = ({ prefixCls, value, onChange }) => {
  const rgbInputPrefixCls = `${prefixCls}-rgb-input`;
  const [rgbValue, setRgbValue] = useState<AggregationColor>(generateColor(value || '#000'));

  // Update step value
  useEffect(() => {
    if (value) {
      setRgbValue(value);
    }
  }, [value]);

  const handleRgbChange = (step: number | null, type: keyof RGB) => {
    const rgb = rgbValue.toRgb();
    rgb[type] = step || 0;
    const genColor = generateColor(rgb);
    if (!value) {
      setRgbValue(genColor);
    }
    onChange?.(genColor);
  };

  return (
    <div className={rgbInputPrefixCls}>
      <Steppers
        max={255}
        min={0}
        value={Number(rgbValue.toRgb().r)}
        prefixCls={prefixCls}
        className={rgbInputPrefixCls}
        onChange={(step) => handleRgbChange(Number(step), 'r')}
      />
      <Steppers
        max={255}
        min={0}
        value={Number(rgbValue.toRgb().g)}
        prefixCls={prefixCls}
        className={rgbInputPrefixCls}
        onChange={(step) => handleRgbChange(Number(step), 'g')}
      />
      <Steppers
        max={255}
        min={0}
        value={Number(rgbValue.toRgb().b)}
        prefixCls={prefixCls}
        className={rgbInputPrefixCls}
        onChange={(step) => handleRgbChange(Number(step), 'b')}
      />
    </div>
  );
};

export default RgbInput;
