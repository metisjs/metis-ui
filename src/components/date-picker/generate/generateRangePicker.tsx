import * as React from 'react';
import { forwardRef } from 'react';
import type { Dayjs } from 'dayjs';
import ContextIsolator from '../../_util/ContextIsolator';
import type { AnyObject } from '../../_util/type';
import type { GenerateConfig, PickerRef, RangePickerProps } from '../interface';
import InternalRangePicker from '../PickerInput/RangePicker';

const generateRangePicker = <DateType extends AnyObject = Dayjs>(
  generateConfig: GenerateConfig<DateType>,
) => {
  const RangePicker = forwardRef<PickerRef, RangePickerProps<DateType>>((props, ref) => {
    return (
      <ContextIsolator space>
        <InternalRangePicker<DateType> ref={ref} {...props} generateConfig={generateConfig} />
      </ContextIsolator>
    );
  }) as unknown as (
    props: RangePickerProps<DateType> & React.RefAttributes<PickerRef>,
  ) => React.ReactElement;

  return RangePicker;
};

export default generateRangePicker;
