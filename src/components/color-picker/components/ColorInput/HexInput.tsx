import type { FC } from 'react';
import React, { useEffect, useState } from 'react';
import { clsx, mergeSemanticCls } from '@util/classNameUtils';
import type { InputProps } from '../../../input';
import Input from '../../../input';
import { toHexFormat, type AggregationColor } from '../../color';
import { generateColor } from '../../util';

interface HexInputProps {
  prefixCls: string;
  className?: InputProps['className'];
  value?: AggregationColor;
  onChange?: (value: AggregationColor) => void;
}

const hexReg = /(^#[\da-f]{6}$)|(^#[\da-f]{8}$)/i;
const isHexString = (hex?: string) => hexReg.test(`#${hex}`);

const HexInput: FC<HexInputProps> = ({ prefixCls, className, value, onChange }) => {
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
      className={mergeSemanticCls(
        { root: clsx(`${prefixCls}-hex-input`, 'rounded py-0.5'), input: 'text-xs' },
        className,
      )}
      value={hexValue}
      prefix="#"
      onChange={handleHexChange}
      size="small"
    />
  );
};

export default HexInput;
