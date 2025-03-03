import type { FC } from 'react';
import React, { useEffect, useState } from 'react';
import { clsx, mergeSemanticCls } from '@util/classNameUtils';
import type { InputNumberProps } from '../../../input-number';
import type { AggregationColor } from '../../color';
import type { HSB } from '../../interface';
import { generateColor, getRoundNumber } from '../../util';
import Steppers from './Steppers';

interface HsbInputProps {
  prefixCls: string;
  className?: InputNumberProps['className'];
  value?: AggregationColor;
  onChange?: (value: AggregationColor) => void;
}

const HsbInput: FC<HsbInputProps> = ({ prefixCls, className, value, onChange }) => {
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

  const stepperCls = mergeSemanticCls(clsx(hsbInputPrefixCls, 'w-0 flex-1 basis-1/3'), className);

  return (
    <div className={clsx(hsbInputPrefixCls, 'flex gap-1')}>
      <Steppers
        max={360}
        min={0}
        value={Number(hsbValue.toHsb().h)}
        prefixCls={prefixCls}
        className={stepperCls}
        formatter={(step) => getRoundNumber(step || 0).toString()}
        onChange={(step) => handleHsbChange(Number(step), 'h')}
      />
      <Steppers
        max={100}
        min={0}
        value={Number(hsbValue.toHsb().s) * 100}
        prefixCls={prefixCls}
        className={stepperCls}
        formatter={(step) => `${getRoundNumber(step || 0)}%`}
        onChange={(step) => handleHsbChange(Number(step), 's')}
      />
      <Steppers
        max={100}
        min={0}
        value={Number(hsbValue.toHsb().b) * 100}
        prefixCls={prefixCls}
        className={stepperCls}
        formatter={(step) => `${getRoundNumber(step || 0)}%`}
        onChange={(step) => handleHsbChange(Number(step), 'b')}
      />
    </div>
  );
};

export default HsbInput;
