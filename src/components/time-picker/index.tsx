import * as React from 'react';
import type { Dayjs } from 'dayjs';
import type { InputStatus } from '../_util/statusUtils';
import type { AnyObject } from '../_util/type';
import DatePicker from '../date-picker';
import type { GenericTimePickerProps, PickerRef, RangePickerProps } from '../date-picker/interface';
import useVariant from '../form/hooks/useVariant';

export type PickerTimeProps<
  DateType extends AnyObject,
  MultipleType extends boolean = false,
> = GenericTimePickerProps<DateType, MultipleType>;

export type RangePickerTimeProps<DateType extends AnyObject> = Omit<
  RangePickerProps<DateType>,
  'showTime' | 'picker'
>;

const { TimePicker: InternalTimePicker, RangePicker: InternalRangePicker } = DatePicker;

export interface TimePickerLocale {
  placeholder?: string;
  rangePlaceholder?: [string, string];
}

export interface TimeRangePickerProps extends Omit<RangePickerTimeProps<Dayjs>, 'picker'> {
  popupClassName?: string;
}

const RangePicker = React.forwardRef<PickerRef, TimeRangePickerProps>((props, ref) => (
  <InternalRangePicker {...props} picker="time" mode={undefined} ref={ref} />
));

export interface TimePickerProps extends Omit<PickerTimeProps<Dayjs>, 'picker'> {
  status?: InputStatus;
  popupClassName?: string;
  rootClassName?: string;
}

const TimePicker = React.forwardRef<PickerRef, TimePickerProps>(
  ({ variant, ...restProps }, ref) => {
    const [mergedVariant] = useVariant(variant);

    return <InternalTimePicker {...restProps} mode={undefined} ref={ref} variant={mergedVariant} />;
  },
);

if (process.env.NODE_ENV !== 'production') {
  TimePicker.displayName = 'TimePicker';
}

type MergedTimePicker = typeof TimePicker & {
  RangePicker: typeof RangePicker;
};

(TimePicker as MergedTimePicker).RangePicker = RangePicker;

export default TimePicker as MergedTimePicker;
