import type { Dayjs } from 'dayjs';
import type { AnyObject } from '../../_util/type';
import type { GenerateConfig } from '../interface';
import generateRangePicker from './generateRangePicker';
import generateSinglePicker from './generateSinglePicker';

const generatePicker = <DateType extends AnyObject = Dayjs>(
  generateConfig: GenerateConfig<DateType>,
) => {
  // ===========================  Picker ===========================
  const { DatePicker, TimePicker } = generateSinglePicker<DateType>(generateConfig);

  // ======================== Range Picker ========================
  const RangePicker = generateRangePicker<DateType>(generateConfig);

  // =========================== Export ===========================
  type MergedDatePickerType = typeof DatePicker & {
    displayName?: string;
    TimePicker: typeof TimePicker;
    RangePicker: typeof RangePicker;
  };

  const MergedDatePicker = DatePicker as MergedDatePickerType;

  MergedDatePicker.RangePicker = RangePicker;
  MergedDatePicker.TimePicker = TimePicker;

  if (process.env.NODE_ENV !== 'production') {
    MergedDatePicker.displayName = 'DatePicker';
  }

  return MergedDatePicker;
};

export default generatePicker;
