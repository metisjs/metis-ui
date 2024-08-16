import type { FC } from 'react';
import React, { useEffect, useState } from 'react';
import { clsx } from '../../../_util/classNameUtils';
import type { InputNumberProps } from '../../../input-number';
import InputNumber from '../../../input-number';

interface SteppersProps {
  prefixCls: string;
  value?: number;
  min?: number;
  max?: number;
  onChange?: (value: number | null) => void;
  className?: string;
  prefix?: (prefixCls: string) => React.ReactNode;
  formatter?: InputNumberProps<number>['formatter'];
}

const Steppers: FC<SteppersProps> = ({
  prefixCls,
  min = 0,
  max = 100,
  value,
  onChange,
  className,
  formatter,
}) => {
  const steppersPrefixCls = `${prefixCls}-steppers`;
  const [stepValue, setStepValue] = useState(value);

  // Update step value
  useEffect(() => {
    if (!Number.isNaN(value)) {
      setStepValue(value);
    }
  }, [value]);

  return (
    <InputNumber
      className={clsx(steppersPrefixCls, className)}
      min={min}
      max={max}
      value={stepValue}
      formatter={formatter}
      size="small"
      onChange={(step) => {
        if (!value) {
          setStepValue(step || 0);
        }
        onChange?.(step);
      }}
    />
  );
};

export default Steppers;
