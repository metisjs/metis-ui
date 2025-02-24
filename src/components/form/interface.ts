import type { AvatarProps } from '../avatar';
import type { CascaderProps } from '../cascader';
import type { CheckboxProps } from '../checkbox';
import type { DatePickerProps, RangePickerProps } from '../date-picker';
import type { ImageProps } from '../image';
import type { InputProps, PasswordProps, TextAreaProps } from '../input';
import type { InputNumberProps } from '../input-number';
import type { ProgressProps } from '../progress';
import type { RadioProps } from '../radio';
import type { RateProps } from '../rate';
import type { SegmentedProps } from '../segmented';
import type { SelectProps } from '../select';
import type { SliderRangeProps, SliderSingleProps } from '../slider';
import type { SwitchProps } from '../switch';
import type { TimeRangePickerProps } from '../time-picker';

export type {
  InternalNamePath,
  NamePath,
  Store,
  StoreValue,
  ValidateMessages,
} from 'rc-field-form/lib/interface';
export type { Options as ScrollOptions } from 'scroll-into-view-if-needed';
export type FormLabelAlign = 'left' | 'right';

export type FieldValueTypeWithFieldProps = {
  /** 文本输入框 */
  text: InputProps;
  /** 密码输入框 */
  password: PasswordProps;
  /** 金额 */
  money: InputNumberProps;
  /** 索引 */
  index: Record<string, any>;
  /** 索引带边框 */
  indexBorder: Record<string, any>;
  /** 多行文本 */
  textarea: TextAreaProps;
  /** 日期选择器 */
  date: DatePickerProps;
  /** 周选择器 */
  dateWeek: DatePickerProps;
  /** 月选择器 */
  dateMonth: DatePickerProps;
  /** 季度选择器 */
  dateQuarter: DatePickerProps;
  /** 年选择器 */
  dateYear: DatePickerProps;
  /** 日期时间选择器 */
  dateTime: DatePickerProps;
  /** 相对时间 */
  fromNow: DatePickerProps;
  /** 日期范围选择器 */
  dateRange: RangePickerProps;
  /** 日期时间范围选择器 */
  dateTimeRange: RangePickerProps;
  /** 周范围选择器 */
  dateWeekRange: RangePickerProps;
  /** 月范围选择器 */
  dateMonthRange: RangePickerProps;
  /** 季范围选择器 */
  dateQuarterRange: RangePickerProps;
  /** 年范围选择器 */
  dateYearRange: RangePickerProps;
  /** 时间选择器 */
  time: TimeRangePickerProps;
  /** 时间范围选择器 */
  timeRange: TimeRangePickerProps;
  /** 下拉选择器 */
  select: SelectProps;
  /** 复选框 */
  checkbox: CheckboxProps;
  /** 评分 */
  rate: RateProps;
  /** 滑动条 */
  slider: SliderSingleProps | SliderRangeProps;
  /** 单选框 */
  radio: RadioProps;
  /** 进度条 */
  progress: ProgressProps;
  /** 百分比输入框 */
  percent: InputNumberProps;
  /** 数字输入框 */
  digit: InputNumberProps;
  /** 头像 */
  avatar: AvatarProps;
  /** 开关 */
  switch: SwitchProps;
  /** 图片 */
  image: ImageProps | InputProps;
  /** 级联选择 */
  cascader: CascaderProps<any>;
  /** 分段器 */
  segmented: SegmentedProps;
  option: Record<string, any>;
};

export type FieldValueType = Extract<keyof FieldValueTypeWithFieldProps, any>;

export type FieldValueObject =
  | {
      type: 'progress';
      status?: 'success' | 'exception' | 'normal' | 'active';
    }
  | {
      type: 'money';
      symbol?: boolean;
      precision?: number;
    }
  | {
      type: 'percent' | 'digit';
      precision?: number;
    }
  | {
      type: 'image';
      width?: number;
    };

export type FieldValueEnumType = {
  label: React.ReactNode;
  status?: string;
  color?: string;
  disabled?: boolean;
};

export type FieldValueEnumMap = Map<
  string | number | boolean,
  FieldValueEnumType | React.ReactNode
>;

export type FieldValueEnumObj = Record<string, FieldValueEnumType | React.ReactNode>;
