import type {
  Options as RequestOptions,
  Service as RequestService,
} from 'ahooks/lib/useRequest/src/types';
import type { AvatarProps } from '../avatar';
import type { CascaderProps } from '../cascader';
import type { CheckboxProps } from '../checkbox';
import type { DatePickerProps, RangePickerProps } from '../date-picker';
import type { InputProps, PasswordProps, TextAreaProps } from '../input';
import type { InputNumberProps } from '../input-number';
import type { RadioProps } from '../radio';
import type { RateProps } from '../rate';
import type { SegmentedProps } from '../segmented';
import type { SelectProps } from '../select';
import type { SliderRangeProps, SliderSingleProps } from '../slider';
import type { SwitchProps } from '../switch';
import type { TimeRangePickerProps } from '../time-picker';
import type { FieldCascaderProps } from './Field/Cascader';
import type { FieldDatePickerProps } from './Field/DatePicker';
import type { FieldDateRangePickerProps } from './Field/DateRangePicker';
import type { FieldDigitProps } from './Field/Digit';
import type { FieldFromNowProps } from './Field/FromNow';
import type { FieldImageProps } from './Field/Image';
import type { FieldMoneyProps } from './Field/Money';
import type { FieldPasswordProps } from './Field/Password';
import type { FieldPercentProps } from './Field/Percent';
import type { FieldProgressProps } from './Field/Progress';
import type { FieldTagProps } from './Field/Tag';
import type { FieldTimePickerProps } from './Field/TimePicker';
import type { FieldTimeRangePickerProps } from './Field/TimeRangePicker';

export type {
  InternalNamePath,
  NamePath,
  Store,
  StoreValue,
  ValidateMessages,
} from 'rc-field-form/lib/interface';
export type { Options as ScrollOptions } from 'scroll-into-view-if-needed';
export type FormLabelAlign = 'left' | 'right';

type BaseFieldProps<T> = Omit<T, 'text' | 'editorProps'>;

export type FieldValueTypeWithFieldProps = {
  /** 文本输入框 */
  text: never;
  /** 密码输入框 */
  password: BaseFieldProps<FieldPasswordProps>;
  /** 金额 */
  money: BaseFieldProps<FieldMoneyProps>;
  /** 索引 */
  index: never;
  /** 索引带边框 */
  indexBorder: never;
  /** 多行文本 */
  textarea: never;
  /** 日期选择器 */
  date: BaseFieldProps<FieldDatePickerProps>;
  /** 周选择器 */
  dateWeek: BaseFieldProps<FieldDatePickerProps>;
  /** 月选择器 */
  dateMonth: BaseFieldProps<FieldDatePickerProps>;
  /** 季度选择器 */
  dateQuarter: BaseFieldProps<FieldDatePickerProps>;
  /** 年选择器 */
  dateYear: BaseFieldProps<FieldDatePickerProps>;
  /** 日期时间选择器 */
  dateTime: BaseFieldProps<FieldDatePickerProps>;
  /** 相对时间 */
  fromNow: BaseFieldProps<FieldFromNowProps>;
  /** 日期范围选择器 */
  dateRange: BaseFieldProps<FieldDateRangePickerProps>;
  /** 日期时间范围选择器 */
  dateTimeRange: BaseFieldProps<FieldDateRangePickerProps>;
  /** 周范围选择器 */
  dateWeekRange: BaseFieldProps<FieldDateRangePickerProps>;
  /** 月范围选择器 */
  dateMonthRange: BaseFieldProps<FieldDateRangePickerProps>;
  /** 季范围选择器 */
  dateQuarterRange: BaseFieldProps<FieldDateRangePickerProps>;
  /** 年范围选择器 */
  dateYearRange: BaseFieldProps<FieldDateRangePickerProps>;
  /** 时间选择器 */
  time: BaseFieldProps<FieldTimePickerProps>;
  /** 时间范围选择器 */
  timeRange: BaseFieldProps<FieldTimeRangePickerProps>;
  /** 下拉选择器 */
  select: never;
  /** 复选框 */
  checkbox: never;
  /** 评分 */
  rate: never;
  /** 滑动条 */
  slider: never;
  /** 单选框 */
  radio: never;
  /** 进度条 */
  progress: BaseFieldProps<FieldProgressProps>;
  /** 百分比输入框 */
  percent: BaseFieldProps<FieldPercentProps>;
  /** 数字输入框 */
  digit: BaseFieldProps<FieldDigitProps>;
  /** 头像 */
  avatar: Partial<AvatarProps>;
  /** 开关 */
  switch: never;
  /** 图片 */
  image: BaseFieldProps<FieldImageProps>;
  /** 级联选择 */
  cascader: BaseFieldProps<FieldCascaderProps>;
  /** 分段器 */
  segmented: never;
  /** 标签 */
  tag: BaseFieldProps<FieldTagProps>;
  option: never;
};

export type FieldValueTypeWithEditorProps = {
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
  progress: InputNumberProps;
  /** 百分比输入框 */
  percent: InputNumberProps;
  /** 数字输入框 */
  digit: InputNumberProps;
  /** 头像 */
  avatar: InputProps;
  /** 开关 */
  switch: SwitchProps;
  /** 图片 */
  image: InputProps;
  /** 级联选择 */
  cascader: CascaderProps<any>;
  /** 分段器 */
  segmented: SegmentedProps;
  /** 标签 */
  tag: SelectProps;
  option: Record<string, any>;
};

export type FieldValueType = Extract<keyof FieldValueTypeWithFieldProps, any>;

export type FieldValueObject<T extends FieldValueType = FieldValueType> = {
  type: T;
} & FieldValueTypeWithFieldProps[T];

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

export type RequestDataType = {
  label?: React.ReactNode;
  value?: string | number | boolean;
  status?: string;
  color?: string;
  disabled?: boolean;
  [key: string]: any;
};

export type FieldValueEnumRequestType = {
  request: RequestService<{ data: RequestDataType[] }, any[]>;
} & Omit<RequestOptions<{ data: RequestDataType[] }, any[]>, 'manual'> & {
    fieldNames: {
      value?: keyof RequestDataType;
      label?: keyof RequestDataType;
      status?: keyof RequestDataType;
      color?: keyof RequestDataType;
      disabled?: keyof RequestDataType;
    };
  };
