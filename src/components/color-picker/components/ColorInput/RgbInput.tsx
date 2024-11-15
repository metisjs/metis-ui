import type { FC } from 'react';
import React, { useEffect, useState } from 'react';
import { clsx, mergeSemanticCls } from '../../../_util/classNameUtils';
import type { InputNumberProps } from '../../../input-number';
import type { AggregationColor } from '../../color';
import type { RGB } from '../../interface';
import { generateColor } from '../../util';
import Steppers from './Steppers';

interface RgbInputProps {
  prefixCls: string;
  className?: InputNumberProps['className'];
  value?: AggregationColor;
  onChange?: (value: AggregationColor) => void;
}

const RgbInput: FC<RgbInputProps> = ({ prefixCls, className, value, onChange }) => {
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

  const stepperCls = mergeSemanticCls(clsx(rgbInputPrefixCls, 'w-0 flex-1 basis-1/3'), className);

  return (
    <div className={clsx(rgbInputPrefixCls, 'flex gap-1')}>
      <Steppers
        max={255}
        min={0}
        value={Number(rgbValue.toRgb().r)}
        prefixCls={prefixCls}
        className={stepperCls}
        onChange={(step) => handleRgbChange(Number(step), 'r')}
      />
      <Steppers
        max={255}
        min={0}
        value={Number(rgbValue.toRgb().g)}
        prefixCls={prefixCls}
        className={stepperCls}
        onChange={(step) => handleRgbChange(Number(step), 'g')}
      />
      <Steppers
        max={255}
        min={0}
        value={Number(rgbValue.toRgb().b)}
        prefixCls={prefixCls}
        className={stepperCls}
        onChange={(step) => handleRgbChange(Number(step), 'b')}
      />
    </div>
  );
};

export default RgbInput;
