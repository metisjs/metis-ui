import type { SemanticClassName } from '@util/classNameUtils';
import type { InputStatus } from '@util/statusUtils';
import type { AnyObject, RequiredWith } from '@util/type';
import type { Dayjs } from 'dayjs';
import type { Variant } from '../config-provider';
import type { SizeType } from '../config-provider/SizeContext';
import type { AlignType, BuildInPlacements } from '../trigger';
import type { PresetPanelClassName } from './PickerInput/Popup/PresetPanel';
import type { InternalRangePickerProps } from './PickerInput/RangePicker';
import type { InternalPickerProps } from './PickerInput/SinglePicker';

export type GenerateConfig<DateType> = {
  // Get
  get: (config: string | number) => DateType;
  getWeekDay: (value: DateType) => number;
  getMillisecond: (value: DateType) => number;
  getSecond: (value: DateType) => number;
  getMinute: (value: DateType) => number;
  getHour: (value: DateType) => number;
  getDate: (value: DateType) => number;
  getMonth: (value: DateType) => number;
  getYear: (value: DateType) => number;
  getNow: () => DateType;
  getFixedDate: (fixed: string) => DateType;
  getEndDate: (value: DateType) => DateType;
  getTimestamp: (value: DateType) => number;

  // difference
  diffDate: (date1: DateType, date2: DateType) => number;

  // Set
  addYear: (value: DateType, diff: number) => DateType;
  addMonth: (value: DateType, diff: number) => DateType;
  addDate: (value: DateType, diff: number) => DateType;
  setYear: (value: DateType, year: number) => DateType;
  setMonth: (value: DateType, month: number) => DateType;
  setDate: (value: DateType, date: number) => DateType;
  setHour: (value: DateType, hour: number) => DateType;
  setMinute: (value: DateType, minute: number) => DateType;
  setSecond: (value: DateType, second: number) => DateType;
  setMillisecond: (value: DateType, millisecond: number) => DateType;

  // Compare
  isAfter: (date1: DateType, date2: DateType) => boolean;
  isValidate: (date: DateType) => boolean;

  locale: {
    getWeekFirstDay: (locale: string) => number;
    getWeekFirstDate: (locale: string, value: DateType) => DateType;
    getWeek: (locale: string, value: DateType) => number;

    format: (locale: string, date: DateType, format: string) => string;

    /** Should only return validate date instance */
    parse: (locale: string, text: string, formats: string[]) => DateType | null;

    /** A proxy for getting locale with moment or other locale library */
    getShortWeekDays?: (locale: string) => string[];
    /** A proxy for getting locale with moment or other locale library */
    getShortMonths?: (locale: string) => string[];
    /** A proxy for getting locale with moment or other locale library */
    getFullMonths?: (locale: string) => string[];
  };
};

export type NullableDateType<DateType> = DateType | null | undefined;

export type Locale = {
  locale: string;

  // ======================================================
  // ==                      Format                      ==
  // ======================================================

  // ==================== Input Format ====================
  /** Input field formatter like YYYY-MM-DD HH:mm:ss */
  fieldDateTimeFormat?: string;
  /** Input field formatter like YYYY-MM-DD */
  fieldDateFormat?: string;
  /** Input field formatter like HH:mm:ss */
  fieldTimeFormat?: string;
  /** Input field formatter like YYYY-MM */
  fieldMonthFormat?: string;
  /** Input field formatter like YYYY */
  fieldYearFormat?: string;
  /** Input field formatter like wwww-go */
  fieldWeekFormat?: string;
  /** Input field formatter like YYYY-Q */
  fieldQuarterFormat?: string;

  // ===================== Date Panel =====================
  // Header Format
  /** Display month before year in date panel header */
  monthBeforeYear?: boolean;
  /** year format in header panel */
  yearFormat?: string;
  /** month format in header panel */
  monthFormat?: string;

  // Cell format
  /** year format in body panel */
  cellYearFormat?: string;
  /** quarter format in body panel */
  cellQuarterFormat?: string;
  /** day format in body panel */
  cellDateFormat?: string;
  /** meridiem format in body panel */
  cellMeridiemFormat?: string;

  // ======================================================
  // ==                       MISC                       ==
  // ======================================================
  today: string;
  now: string;
  ok: string;
  day: string;
  week: string;
  month: string;
  year: string;

  shortWeekDays?: string[];
  shortMonths?: string[];

  placeholder: string;
  yearPlaceholder?: string;
  quarterPlaceholder?: string;
  monthPlaceholder?: string;
  weekPlaceholder?: string;
  timePlaceholder?: string;

  rangeYearPlaceholder?: [string, string];
  rangeQuarterPlaceholder?: [string, string];
  rangeMonthPlaceholder?: [string, string];
  rangeWeekPlaceholder?: [string, string];
  rangePlaceholder?: [string, string];
  rangeTimePlaceholder?: [string, string];
};

export type FilledLocale = RequiredWith<
  Locale,
  | 'fieldDateTimeFormat'
  | 'fieldDateFormat'
  | 'fieldTimeFormat'
  | 'fieldMonthFormat'
  | 'fieldYearFormat'
  | 'fieldWeekFormat'
  | 'fieldQuarterFormat'
  | 'yearFormat'
  | 'cellYearFormat'
  | 'cellQuarterFormat'
  | 'cellDateFormat'
>;

export type Placement = 'bottomLeft' | 'bottomRight' | 'topLeft' | 'topRight';

export type PanelMode = 'time' | 'date' | 'week' | 'month' | 'quarter' | 'year' | 'decade';

export type InternalMode = PanelMode | 'datetime';

export type PickerMode = Exclude<PanelMode, 'datetime' | 'decade'>;

export type DateValue<DateType> = DateType | string | number;

export type DisabledDate<DateType = any> = (
  date: DateType,
  info: {
    type: PanelMode;
    /**
     * Only work in RangePicker.
     * Tell the first date user selected on this range selection.
     * This is not care about what field user click.
     */
    from?: DateType | null;
  },
) => boolean;

export interface BaseInfo {
  range?: 'start' | 'end';
}

export interface CellRenderInfo extends BaseInfo {
  prefixCls: string;
  // The cell wrapper element
  originNode: React.ReactElement;
  disabled?: boolean;
  hover?: boolean;
  inRange?: boolean;
  rangeStart?: boolean;
  rangeEnd?: boolean;
  selected?: boolean;
  today?: boolean;
  inView?: boolean;
  type: PanelMode;
  locale?: Locale;
  subType?: 'hour' | 'minute' | 'second' | 'millisecond' | 'meridiem';
}

export type CellRender<DateType, CurrentType = DateType | number | string> = (
  current: CurrentType,
  info: CellRenderInfo,
) => React.ReactNode;

export interface ValueDate<DateType = any> {
  label: React.ReactNode;
  value: DateType | (() => DateType);
}

// ========================== Time ==========================
export interface DisabledTimes {
  disabledHours?: () => number[];
  disabledMinutes?: (hour: number) => number[];
  disabledSeconds?: (hour: number, minute: number) => number[];
  disabledMilliseconds?: (hour: number, minute: number, second: number) => number[];
}

export interface SharedTimeProps<DateType extends object = any> {
  /** Only work in picker is `time` */
  format?: string;
  /** Only work in picker is `time` */
  showNow?: boolean;
  /** Only work in picker is `time` */
  showHour?: boolean;
  /** Only work in picker is `time` */
  showMinute?: boolean;
  /** Only work in picker is `time` */
  showSecond?: boolean;
  /** Only work in picker is `time` */
  showMillisecond?: boolean;
  /** Only work in picker is `time` */
  use12Hours?: boolean;
  /** Only work in picker is `time` */
  hourStep?: IntRange<1, 23>;
  /** Only work in picker is `time` */
  minuteStep?: IntRange<1, 59>;
  /** Only work in picker is `time` */
  secondStep?: IntRange<1, 59>;
  /**
   * Only work in picker is `time`.
   * Note that too small step will cause performance issue.
   */
  millisecondStep?: IntRange<1, 999>;
  /** Only work in picker is `time` */
  hideDisabledOptions?: boolean;

  /** Set default value template when empty selection */
  defaultOpenValue?: DateValue<DateType>;

  /** Only work in picker is `time` */
  disabledTime?: (date: DateType) => DisabledTimes;

  /** Only work in picker is `time` */
  changeOnScroll?: boolean;
}

export type RangeTimeProps<DateType extends object = any> = Omit<
  SharedTimeProps<DateType>,
  'defaultValue' | 'defaultOpenValue' | 'disabledTime'
> & {
  defaultOpenValue?: DateValue<DateType>[];

  disabledTime?: (
    date: DateType,
    range: 'start' | 'end',
    info: { from?: DateType },
  ) => DisabledTimes;
};

// ======================= Components =======================
export type OnPanelChange<DateType> = (value: DateType, mode: PanelMode) => void;

export type LimitDate<DateType extends object = any> =
  | DateType
  | ((info: {
      /**
       * Tell the first date user selected on this range selection.
       * This is not care about what field user click.
       */
      from?: DateType;
    }) => DateType | null | undefined);

export interface SharedPanelProps<DateType extends object = any> {
  // Style
  prefixCls: string;
  className?: SemanticClassName<{
    header?: string;
    body?: string;
    cell?: SemanticClassName<
      { inner?: string },
      {
        disabled?: boolean;
        hover?: boolean;
        inRange?: boolean;
        rangeStart?: boolean;
        rangeEnd?: boolean;
        selected?: boolean;
        today?: boolean;
        inView?: boolean;
      }
    >;
    column?: string;
  }>;

  // Date Library
  locale: FilledLocale;
  generateConfig: GenerateConfig<DateType>;

  // Value
  pickerValue: DateType;
  onPickerValueChange: (date: DateType) => void;
  value?: DateType;
  /**
   * Should trigger when user select the cell.
   * PickerPanel will mark as `value` in single mode,
   * Or toggle `values` in multiple mode.
   */
  onSelect: (date: DateType) => void;

  /**
   * Used for `multiple` mode.
   * When not `multiple`, it will be `[value]`.
   */
  values?: DateType[];

  // Mode
  onModeChange: (mode: PanelMode, date?: DateType) => void;

  // Limitation
  disabledDate?: DisabledDate<DateType>;
  minDate?: DateType;
  maxDate?: DateType;

  // Render
  cellRender?: CellRender<DateType>;

  // Hover
  /** @private Only used for RangePicker passing. */
  hoverRangeValue: [start: DateType, end: DateType] | null;
  /** @private Only used for SinglePicker passing. */
  hoverValue: DateType[] | null;
  onHover?: (value: DateType | null) => void;

  // Time
  /**
   * Only used for `date` mode.
   */
  showTime?: SharedTimeProps<DateType>;

  // Week
  /**
   * Only used for `date` mode.
   */
  showWeek?: boolean;

  // Icons
  prevIcon?: React.ReactNode;
  nextIcon?: React.ReactNode;
  superPrevIcon?: React.ReactNode;
  superNextIcon?: React.ReactNode;
}

export type Components<DateType extends object = any> = Partial<
  Record<InternalMode, React.ComponentType<SharedPanelProps<DateType>>> & {
    input?: React.ComponentType<any> | string;
  }
>;

// ========================= Picker =========================
export type CustomFormat<DateType> = (value: DateType) => string;

export type FormatType<DateType = any> = string | CustomFormat<DateType>;

export type SharedHTMLAttrs = Omit<
  React.InputHTMLAttributes<HTMLDivElement>,
  | 'value'
  | 'defaultValue'
  | 'onChange'
  | 'placeholder'
  | 'id'
  | 'onInvalid'
  | 'disabled'
  | 'onFocus'
  | 'onBlur'
  | 'onSelect'
  | 'min'
  | 'max'
  | 'onKeyDown'
  | 'size'
  | 'className'
>;

export type PickerFocusEventHandler = (e: React.FocusEvent<HTMLElement>, info: BaseInfo) => void;

export type LegacyOnKeyDown = (
  event: React.KeyboardEvent<HTMLElement>,
  preventDefault: VoidFunction,
) => void;

export interface SharedPickerProps<DateType extends object = any>
  extends SharedHTMLAttrs,
    Pick<
      SharedPanelProps<DateType>,
      // Icon
      'prevIcon' | 'nextIcon' | 'superPrevIcon' | 'superNextIcon'
    > {
  // Styles
  prefixCls: string;
  className?: SemanticClassName<
    {
      popup?: string;
      input?: string;
      suffix?: string;
      clear?: string;
      item?: string;
      presets?: PresetPanelClassName;
      panel?: SharedPanelProps<any>['className'];
      footer?: string;
    },
    { open?: boolean; disabled?: boolean }
  >;
  style?: React.CSSProperties;

  size?: SizeType;
  status?: InputStatus;
  variant?: Variant;

  // Config
  locale: Locale;
  generateConfig: GenerateConfig<DateType>;

  // Picker
  picker?: PickerMode;
  /** Only work when picker is `date` or `time` */
  showTime?: boolean | SharedTimeProps<DateType>;
  /** Only work when picker is `date` */
  showWeek?: boolean;
  /**
   * Config the input field parse and format.
   * When set `format.type`, it will force user input type with your input,
   * it's only support basic format mask: YYYY, MM, DD, HH, mm, ss, SSS.
   * Once use config mode, it must be fill with format your config.
   */
  format?:
    | FormatType<DateType>
    | FormatType<DateType>[]
    | {
        format: string;
        type?: 'mask';
      };

  // Icons
  suffixIcon?: React.ReactNode;
  allowClear?:
    | boolean
    | {
        clearIcon?: React.ReactNode;
      };

  // Active
  onFocus?: PickerFocusEventHandler;
  onBlur?: PickerFocusEventHandler;
  onKeyDown?: LegacyOnKeyDown;

  inputReadOnly?: boolean;

  // range
  /** Default will always order of selection after submit */
  order?: boolean;

  // Disabled
  disabledDate?: DisabledDate<DateType>;
  /** Limit the selectable range. This will limit picker navigation also */
  minDate?: DateValue<DateType>;
  /** Limit the selectable range. This will limit picker navigation also */
  maxDate?: DateValue<DateType>;

  // Open
  defaultOpenValue?: DateValue<DateType>;
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  popupAlign?: AlignType;
  getPopupContainer?: (node: HTMLElement) => HTMLElement;

  // Popup
  placement?: Placement;
  builtinPlacements?: BuildInPlacements;

  /**
   * By default. Only `time` or `datetime` show the confirm button in panel.
   * `true` to make every picker need confirm.
   * `false` to trigger change on every time panel closed by the mode = picker.
   */
  needConfirm?: boolean;

  /**
   * When user input invalidate date, keep it in the input field.
   * This is only used for strong a11y requirement which do not want modify after blur.
   */
  preserveInvalidOnBlur?: boolean;

  // Render
  components?: Components<DateType>;
  cellRender?: CellRender<DateType>;
  /**
   * When use `date` picker,
   * Show the button to set current datetime.
   */
  showNow?: boolean;
  panelRender?: (originPanel: React.ReactNode) => React.ReactNode;
  renderExtraFooter?: (mode: PanelMode) => React.ReactNode;

  popupZIndex?: number;
}

// picker
export interface PickerRef {
  nativeElement: HTMLDivElement;
  focus: (options?: FocusOptions) => void;
  blur: VoidFunction;
}

// rangePicker
export interface RangePickerRef extends Omit<PickerRef, 'focus'> {
  focus: (index?: number | (FocusOptions & { index?: number })) => void;
}

// ======================== Selector ========================
export interface OpenConfig {
  index?: number;
  /**
   * Keep open if prev state is open but set close within the same frame.
   * This is used for RangePicker input switch to another one.
   */
  inherit?: boolean;
  /**
   * By default. Close popup will delay for one frame. `force` will trigger immediately.
   */
  force?: boolean;
}

export type OnOpenChange = (open: boolean, config?: OpenConfig) => void;
export interface SelectorProps<DateType = any> extends SharedHTMLAttrs {
  picker: PickerMode;

  clearIcon?: React.ReactNode;
  suffixIcon?: React.ReactNode;
  className?: SemanticClassName<{
    input?: string;
    item?: string;
    placeholder?: string;
    clear?: string;
    activeBar?: string;
    suffix?: string;
  }>;
  style?: React.CSSProperties;
  /** Add `-placeholder` className as a help info */
  activeHelp?: boolean;
  focused: boolean;
  onFocus: (event: React.FocusEvent<HTMLInputElement>, index?: number) => void;
  onBlur: (event: React.FocusEvent<HTMLInputElement>, index?: number) => void;
  /** Trigger by `enter` key */
  onSubmit: VoidFunction;
  onKeyDown?: LegacyOnKeyDown;
  locale: Locale;
  generateConfig: GenerateConfig<DateType>;

  // Click
  onClick: React.MouseEventHandler<HTMLDivElement>;

  // Clear
  onClear: VoidFunction;

  // Change
  format: FormatType<DateType>[];
  /**
   * Convert with user typing for the format template.
   * This will force align the input with template mask.
   */
  maskFormat?: string;
  onInputChange: VoidFunction;
  onInvalid: (valid: boolean, index?: number) => void;
  /** When user input invalidate date, keep it in the input field */
  /**
   * By default value in input field will be reset with previous valid value when blur.
   * Set to `false` will keep invalid text in input field when blur.
   */
  preserveInvalidOnBlur?: boolean;

  // Open
  open: boolean;
  /** Trigger when need open by selector */
  onOpenChange: OnOpenChange;

  // Invalidate
  inputReadOnly?: boolean;
}

// ========================== MISC ==========================
// https://stackoverflow.com/a/39495173; need TypeScript >= 4.5
type Enumerate<N extends number, Acc extends number[] = []> = Acc['length'] extends N
  ? Acc[number]
  : Enumerate<N, [...Acc, Acc['length']]>;

export type IntRange<F extends number, T extends number> = Exclude<Enumerate<T>, Enumerate<F>>;

export type ReplaceListType<List, Type> = {
  [P in keyof List]: Type;
};

type InjectDefaultProps<Props> = Omit<Props, 'generateConfig' | 'hideHeader'>;

type GetValueType<DateType, MultipleType extends boolean = false> = false extends MultipleType
  ? DateType
  : DateType[];

export type PickerProps<
  DateType extends AnyObject = Dayjs,
  MultipleType extends boolean = false,
> = Omit<
  InjectDefaultProps<InternalPickerProps<DateType>>,
  'multiple' | 'defaultValue' | 'value' | 'onChange' | 'onCalendarChange' | 'onOk'
> & {
  multiple?: MultipleType;
  defaultValue?: GetValueType<DateValue<DateType>, MultipleType> | null;
  value?: GetValueType<DateValue<DateType>, MultipleType> | null;
  onChange?: (
    dateString: GetValueType<string, MultipleType>,
    date: GetValueType<DateType, MultipleType> | null,
  ) => void;
  onCalendarChange?: (
    dateString: GetValueType<string, MultipleType>,
    date: GetValueType<DateType, MultipleType>,
    info: BaseInfo,
  ) => void;
  onOk?: (date: GetValueType<DateType, MultipleType>) => void;
};

export type RangePickerProps<DateType extends AnyObject = any> = Omit<
  InjectDefaultProps<InternalRangePickerProps<DateType>>,
  'prefixCls'
> & {
  prefixCls?: string;
};

export type GenericTimePickerProps<
  DateType extends AnyObject = any,
  MultipleType extends boolean = false,
> = Omit<PickerProps<DateType, MultipleType>, 'picker' | 'showTime'>;
