import type { FC } from 'react';
import React, { useEffect, useState } from 'react';
import { clsx } from '../../../_util/classNameUtils';
import Input from '../../../input';
import { toHexFormat, type AggregationColor } from '../../color';
import { generateColor } from '../../util';

interface HexInputProps {
  prefixCls: string;
  value?: AggregationColor;
  onChange?: (value: AggregationColor) => void;
}

const hexReg = /(^#[\da-f]{6}$)|(^#[\da-f]{8}$)/i;
const isHexString = (hex?: string) => hexReg.test(`#${hex}`);

const HexInput: FC<HexInputProps> = ({ prefixCls, value, onChange }) => {
  const [hexValue, setHexValue] = useState(() =>
    value ? toHexFormat(value.toHexString()) : undefined,
  );

  // Update step value
  useEffect(() => {
    if (value) {
      setHexValue(toHexFormat(value.toHexString()));
    }
  }, [value]);

  const handleHexChange = (v: string) => {
    const originValue = v;
    setHexValue(toHexFormat(originValue));
    if (isHexString(toHexFormat(originValue, true))) {
      onChange?.(generateColor(originValue));
    }
  };

  return (
    <Input
      className={{ root: clsx(`${prefixCls}-hex-input`, 'rounded py-0.5'), input: 'text-xs' }}
      value={hexValue}
      prefix="#"
      onChange={handleHexChange}
      size="small"
    />
  );
};

export default HexInput;
