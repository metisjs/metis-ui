import * as React from 'react';
import { forwardRef } from 'react';
import ContextIsolator from '../../_util/ContextIsolator';
import type { AnyObject } from '../../_util/type';
import type { GenerateConfig, PickerRef, RangePickerProps } from '../interface';
import InternalRangePicker from '../PickerInput/RangePicker';

const generateRangePicker = <DateType extends AnyObject = AnyObject>(
  generateConfig: GenerateConfig<DateType>,
) => {
  const RangePicker = forwardRef<PickerRef, RangePickerProps<DateType>>((props, ref) => {
    return (
      <ContextIsolator space>
        <InternalRangePicker<DateType> ref={ref} {...props} generateConfig={generateConfig} />
      </ContextIsolator>
    );
  });

  return RangePicker;
};

export default generateRangePicker;
