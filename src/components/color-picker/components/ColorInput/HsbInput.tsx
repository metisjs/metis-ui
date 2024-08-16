import type { FC } from 'react';
import React, { useEffect, useState } from 'react';
import { AggregationColor } from '../../color';
import { HSB } from '../../interface';
import { generateColor, getRoundNumber } from '../../util';
import Steppers from './Steppers';

interface HsbInputProps {
  prefixCls: string;
  value?: AggregationColor;
  onChange?: (value: AggregationColor) => void;
}

const HsbInput: FC<HsbInputProps> = ({ prefixCls, value, onChange }) => {
  const hsbInputPrefixCls = `${prefixCls}-hsb-input`;
  const [hsbValue, setHsbValue] = useState<AggregationColor>(generateColor(value || '#000'));

  // Update step value
  useEffect(() => {
    if (value) {
      setHsbValue(value);
    }
  }, [value]);

  const handleHsbChange = (step: number, type: keyof HSB) => {
    const hsb = hsbValue.toHsb();
    hsb[type] = type === 'h' ? step : (step || 0) / 100;
    const genColor = generateColor(hsb);
    if (!value) {
      setHsbValue(genColor);
    }
    onChange?.(genColor);
  };

  return (
    <div className={hsbInputPrefixCls}>
      <Steppers
        max={360}
        min={0}
        value={Number(hsbValue.toHsb().h)}
        prefixCls={prefixCls}
        className={hsbInputPrefixCls}
        formatter={(step) => getRoundNumber(step || 0).toString()}
        onChange={(step) => handleHsbChange(Number(step), 'h')}
      />
      <Steppers
        max={100}
        min={0}
        value={Number(hsbValue.toHsb().s) * 100}
        prefixCls={prefixCls}
        className={hsbInputPrefixCls}
        formatter={(step) => `${getRoundNumber(step || 0)}%`}
        onChange={(step) => handleHsbChange(Number(step), 's')}
      />
      <Steppers
        max={100}
        min={0}
        value={Number(hsbValue.toHsb().b) * 100}
        prefixCls={prefixCls}
        className={hsbInputPrefixCls}
        formatter={(step) => `${getRoundNumber(step || 0)}%`}
        onChange={(step) => handleHsbChange(Number(step), 'b')}
      />
    </div>
  );
};

export default HsbInput;
