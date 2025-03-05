import type {
  Options as RequestOptions,
  Service as RequestService,
} from 'ahooks/lib/useRequest/src/types';
import type { AvatarProps } from '../avatar';
import type { CascaderProps } from '../cascader';
import type { CheckboxProps } from '../checkbox';
import type { DatePickerProps, RangePickerProps } from '../date-picker';
import type { ImageProps } from '../image';
import type { InputProps, PasswordProps, TextAreaProps } from '../input';
import type { InputNumberProps } from '../input-number';
import type { RadioProps } from '../radio';
import type { RateProps } from '../rate';
import type { SegmentedProps } from '../segmented';
import type { SelectProps } from '../select';
import type { SliderRangeProps, SliderSingleProps } from '../slider';
import type { SwitchProps } from '../switch';
import type { TimePickerProps, TimeRangePickerProps } from '../time-picker';
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
  text: { read: void; edit: InputProps };
  /** 密码输入框 */
  password: { read: BaseFieldProps<FieldPasswordProps>; edit: PasswordProps };
  /** 金额 */
  money: { read: BaseFieldProps<FieldMoneyProps>; edit: InputNumberProps };
  /** 索引 */
  index: { read: void; edit: void };
  /** 索引带边框 */
  indexBorder: { read: void; edit: void };
  /** 多行文本 */
  textarea: { read: void; edit: TextAreaProps };
  /** 日期选择器 */
  date: { read: BaseFieldProps<FieldDatePickerProps>; edit: DatePickerProps };
  /** 周选择器 */
  dateWeek: { read: BaseFieldProps<FieldDatePickerProps>; edit: DatePickerProps };
  /** 月选择器 */
  dateMonth: { read: BaseFieldProps<FieldDatePickerProps>; edit: DatePickerProps };
  /** 季度选择器 */
  dateQuarter: { read: BaseFieldProps<FieldDatePickerProps>; edit: DatePickerProps };
  /** 年选择器 */
  dateYear: { read: BaseFieldProps<FieldDatePickerProps>; edit: DatePickerProps };
  /** 日期时间选择器 */
  dateTime: { read: BaseFieldProps<FieldDatePickerProps>; edit: DatePickerProps };
  /** 相对时间 */
  fromNow: { read: BaseFieldProps<FieldFromNowProps>; edit: DatePickerProps };
  /** 日期范围选择器 */
  dateRange: { read: BaseFieldProps<FieldDateRangePickerProps>; edit: RangePickerProps };
  /** 日期时间范围选择器 */
  dateTimeRange: { read: BaseFieldProps<FieldDateRangePickerProps>; edit: RangePickerProps };
  /** 周范围选择器 */
  dateWeekRange: { read: BaseFieldProps<FieldDateRangePickerProps>; edit: RangePickerProps };
  /** 月范围选择器 */
  dateMonthRange: { read: BaseFieldProps<FieldDateRangePickerProps>; edit: RangePickerProps };
  /** 季范围选择器 */
  dateQuarterRange: { read: BaseFieldProps<FieldDateRangePickerProps>; edit: RangePickerProps };
  /** 年范围选择器 */
  dateYearRange: { read: BaseFieldProps<FieldDateRangePickerProps>; edit: RangePickerProps };
  /** 时间选择器 */
  time: { read: BaseFieldProps<FieldTimePickerProps>; edit: TimePickerProps };
  /** 时间范围选择器 */
  timeRange: { read: BaseFieldProps<FieldTimeRangePickerProps>; edit: TimeRangePickerProps };
  /** 下拉选择器 */
  select: { read: void; edit: SelectProps };
  /** 复选框 */
  checkbox: { read: void; edit: CheckboxProps };
  /** 评分 */
  rate: { read: void; edit: RateProps };
  /** 滑动条 */
  slider: { read: void; edit: SliderSingleProps | SliderRangeProps };
  /** 单选框 */
  radio: { read: void; edit: RadioProps };
  /** 进度条 */
  progress: { read: BaseFieldProps<FieldProgressProps>; edit: InputNumberProps };
  /** 百分比输入框 */
  percent: { read: BaseFieldProps<FieldPercentProps>; edit: InputNumberProps };
  /** 数字输入框 */
  digit: { read: BaseFieldProps<FieldDigitProps>; edit: InputNumberProps };
  /** 头像 */
  avatar: { read: Partial<AvatarProps>; edit: InputProps };
  /** 开关 */
  switch: { read: void; edit: SwitchProps };
  /** 图片 */
  image: { read: BaseFieldProps<FieldImageProps>; edit: InputProps };
  /** 级联选择 */
  cascader: { read: BaseFieldProps<FieldCascaderProps>; edit: CascaderProps };
  /** 分段器 */
  segmented: { read: void; edit: SegmentedProps };
  /** 标签 */
  tag: { read: BaseFieldProps<FieldTagProps>; edit: SelectProps };
  /** table action */
  action: { read: void; edit: void };
};

export type FieldValueType = keyof FieldValueTypeWithFieldProps;

export type FieldValueObject<T extends FieldValueType = FieldValueType> = {
  type: T;
} & FieldValueTypeWithFieldProps[T]['read'];

export type FieldStatusType = 'success' | 'warning' | 'error' | 'default' | 'processing';

export type FieldValueEnumType = {
  label: React.ReactNode;
  status?: FieldStatusType;
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
  status?: FieldStatusType;
  color?: string;
  disabled?: boolean;
  [key: string]: any;
};

export type FieldValueEnumRequestType = {
  request: RequestService<{ data: RequestDataType[] }, any[]>;
} & Omit<RequestOptions<{ data: RequestDataType[] }, any[]>, 'manual'> & {
    fieldNames?: {
      value?: keyof RequestDataType;
      label?: keyof RequestDataType;
      status?: keyof RequestDataType;
      color?: keyof RequestDataType;
      disabled?: keyof RequestDataType;
    };
  };
