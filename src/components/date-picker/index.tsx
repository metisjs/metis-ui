import type { Dayjs } from 'dayjs';
import type { AnyObject } from '../_util/type';
import generatePicker from './generate';
import dayjsGenerateConfig from './generate/config/dayjs';
import type { RangePickerProps as BaseRangePickerProps, PickerProps, PickerRef } from './interface';

export type DatePickerProps<
  DateType extends AnyObject = Dayjs | Dayjs,
  MultipleType extends boolean = false,
> = PickerProps<DateType, MultipleType> & React.RefAttributes<PickerRef>;
export type MonthPickerProps<
  DateType extends AnyObject = Dayjs | Dayjs,
  MultipleType extends boolean = false,
> = Omit<DatePickerProps<DateType, MultipleType>, 'picker'>;
export type WeekPickerProps<
  DateType extends AnyObject = Dayjs | Dayjs,
  MultipleType extends boolean = false,
> = Omit<DatePickerProps<DateType, MultipleType>, 'picker'>;
export type RangePickerProps = BaseRangePickerProps<Dayjs>;

const DatePicker = generatePicker<Dayjs>(dayjsGenerateConfig);

export type DatePickerType = typeof DatePicker & {
  generatePicker: typeof generatePicker;
};

(DatePicker as DatePickerType).generatePicker = generatePicker;

export default DatePicker as DatePickerType;
