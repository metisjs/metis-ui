import type { AnyObject } from '../../_util/type';
import type { GenerateConfig } from '../interface';
import generateRangePicker from './generateRangePicker';
import generateSinglePicker from './generateSinglePicker';

const generatePicker = <DateType extends AnyObject = AnyObject>(
  generateConfig: GenerateConfig<DateType>,
) => {
  // ===========================  Picker ===========================
  const { DatePicker, TimePicker } = generateSinglePicker(generateConfig);

  // ======================== Range Picker ========================
  const RangePicker = generateRangePicker(generateConfig);

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
