import type { Dayjs } from 'dayjs';
import generatePicker from './generate';
import dayjsGenerateConfig from './generate/config/dayjs';
import type {
  RangePickerProps as BaseRangePickerProps,
  PickerProps,
  PickerPropsWithMultiple,
} from './generate/interface';

export type DatePickerProps<ValueType = Dayjs | Dayjs> = PickerPropsWithMultiple<
  Dayjs,
  PickerProps<Dayjs>,
  ValueType
>;
export type MonthPickerProps<ValueType = Dayjs | Dayjs> = Omit<
  DatePickerProps<ValueType>,
  'picker'
>;
export type WeekPickerProps<ValueType = Dayjs | Dayjs> = Omit<DatePickerProps<ValueType>, 'picker'>;
export type RangePickerProps = BaseRangePickerProps<Dayjs>;

const DatePicker = generatePicker<Dayjs>(dayjsGenerateConfig);

export type DatePickerType = typeof DatePicker & {
  generatePicker: typeof generatePicker;
};

(DatePicker as DatePickerType).generatePicker = generatePicker;

export default DatePicker as DatePickerType;
