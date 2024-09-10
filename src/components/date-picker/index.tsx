import type { Dayjs } from 'dayjs';
import generatePicker from './generate';
import dayjsGenerateConfig from './generate/config/dayjs';
import type { RangePickerProps as BaseRangePickerProps, PickerProps, PickerRef } from './interface';

export type DatePickerProps<MultipleType extends boolean = false> = PickerProps<
  Dayjs,
  MultipleType
> &
  React.RefAttributes<PickerRef>;
export type MonthPickerProps<MultipleType extends boolean = false> = Omit<
  DatePickerProps<MultipleType>,
  'picker'
>;
export type WeekPickerProps<MultipleType extends boolean = false> = Omit<
  DatePickerProps<MultipleType>,
  'picker'
>;
export type RangePickerProps = BaseRangePickerProps<Dayjs>;

const DatePicker = generatePicker<Dayjs>(dayjsGenerateConfig);

export type DatePickerType = typeof DatePicker & {
  generatePicker: typeof generatePicker;
};

(DatePicker as DatePickerType).generatePicker = generatePicker;

export default DatePicker as DatePickerType;
