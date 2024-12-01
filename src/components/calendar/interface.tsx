import type { Dayjs } from 'dayjs';
import type { SemanticClassName } from '../_util/classNameUtils';
import type { PresetColorType } from '../_util/colors';
import type { AnyObject, LiteralUnion, SafeKey } from '../_util/type';
import type {
  Locale as DatePickerLocal,
  DateValue,
  GenerateConfig,
} from '../date-picker/interface';
import type { DateEvent } from './util';

export interface CalendarLocale extends DatePickerLocal {
  headerDateFormat?: string;
  headerMonthFormat?: string;
  headerYearFormat?: string;

  weekDays?: string[];
  fullWeekDays?: string[];
  allDay?: string;
  backToToday?: string;

  nextDay?: string;
  prevDay?: string;
  nextWeek?: string;
  prevWeek?: string;
  nextMonth?: string;
  prevMonth?: string;
  nextYear?: string;
  prevYear?: string;

  dayView?: string;
  weekView?: string;
  monthView?: string;
  yearView?: string;
}

export type CalendarMode = 'year' | 'month' | 'week' | 'day';

export interface CalendarProps<DateType extends AnyObject = Dayjs> {
  prefixCls?: string;
  className?: string;
  style?: React.CSSProperties;
  locale?: CalendarLocale;
  headerRender?: HeaderRender<DateType>;
  value?: DateType;
  defaultValue?: DateType;
  mode?: CalendarMode;
  defaultMode?: CalendarMode;
  modeOptions?: CalendarMode[] | null;
  events?: EventType<DateType>[];
  extra?: React.ReactNode;
  lunar?: boolean;
  onChange?: (date: DateType) => void;
  onModeChange?: (mode: CalendarMode) => void;
}

export type HeaderRender<DateType> = (config: {
  value: DateType;
  type: CalendarMode;
  onChange: (date: DateType) => void;
  onTypeChange: (type: CalendarMode) => void;
}) => React.ReactNode;

export type EventType<DateType extends AnyObject = Dayjs> = {
  key?: SafeKey;
  icon?: React.ReactNode;
  title: string;
  start: DateValue<DateType>;
  end: DateValue<DateType>;
  allDay?: boolean;
  color?: LiteralUnion<PresetColorType>;
};

export interface SharedPanelProps<DateType extends object = any> {
  // Style
  prefixCls: string;
  className?: SemanticClassName;

  // Date Library
  locale: CalendarLocale;
  generateConfig: GenerateConfig<DateType>;

  // Mode
  prevMode?: CalendarMode;
  mode: CalendarMode;

  // Value
  value: DateType;

  events: Record<string, DateEvent[]>;

  lunar?: boolean;

  onChange: (date: DateType) => void;
  onModeChange: (mode: CalendarMode) => void;
}
