import type { AnyObject } from '../../_util/type';
import type { GenerateConfig } from '../interface';
import generateRangePicker from './generateRangePicker';
import generateSinglePicker from './generateSinglePicker';

const generatePicker = <DateType extends AnyObject = AnyObject>(
  generateConfig: GenerateConfig<DateType>,
) => {
  // ===========================  Picker ===========================
  const DatePicker = generateSinglePicker(generateConfig);

  // ======================== Range Picker ========================
  const RangePicker = generateRangePicker(generateConfig);

  // =========================== Export ===========================
  type MergedDatePickerType = typeof DatePicker & {
    displayName?: string;
    RangePicker: typeof RangePicker;
  };

  const MergedDatePicker = DatePicker as MergedDatePickerType;

  MergedDatePicker.RangePicker = RangePicker;

  if (process.env.NODE_ENV !== 'production') {
    MergedDatePicker.displayName = 'DatePicker';
  }

  return MergedDatePicker;
};

export default generatePicker;
