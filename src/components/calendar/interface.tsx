import type { SemanticClassName } from '@util/classNameUtils';
import type { PresetColorType } from '@util/colors';
import type { AnyObject, LiteralUnion, SafeKey } from '@util/type';
import type { Dayjs } from 'dayjs';
import type {
  Locale as DatePickerLocal,
  DateValue,
  GenerateConfig,
} from '../date-picker/interface';
import type { HeaderClassName } from './Header';
import type { AllDayEventProps } from './Panel/components/AllDayEvent';
import type { TimeEventProps } from './Panel/components/TimeEvent';
import type { DayPanelClassName } from './Panel/DayPanel';
import type { MonthPanelClassName } from './Panel/MonthPanel';
import type { WeekPanelClassName } from './Panel/WeekPanel';
import type { YearPanelClassName } from './Panel/YearPanel';

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

  more?: string;
}

export type CalendarMode = 'year' | 'month' | 'week' | 'day';

export type EventSelectHandler = (selectedKeys: SafeKey[]) => void;

export type EventRender<DateType extends AnyObject = Dayjs> = (
  props: TimeEventProps<DateType> | AllDayEventProps<DateType>,
  DefaultEvent: React.ComponentType<TimeEventProps<DateType> | AllDayEventProps<DateType>>,
) => React.ReactElement;

export interface CalendarProps<DateType extends AnyObject = Dayjs> {
  prefixCls?: string;
  className?: SemanticClassName<{
    header?: HeaderClassName;
    yearPanel?: YearPanelClassName;
    monthPanel?: MonthPanelClassName;
    weekPanel?: WeekPanelClassName;
    dayPanel?: DayPanelClassName;
  }>;
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
  selectedEventKeys?: SafeKey[];
  eventRender?: EventRender<DateType>;
  onChange?: (date: DateType) => void;
  onModeChange?: (mode: CalendarMode) => void;
  onEventSelectChange?: EventSelectHandler;
}

export type HeaderRender<DateType> = (config: {
  value: DateType;
  mode: CalendarMode;
  modeOptions: CalendarMode[];
  onChange: (date: DateType) => void;
  onModeChange: (mode: CalendarMode) => void;
}) => React.ReactNode;

export interface SharedPanelProps<DateType extends object = any> {
  // Style
  prefixCls: string;

  // Date Library
  locale: CalendarLocale;
  generateConfig: GenerateConfig<DateType>;

  // Mode
  prevMode?: CalendarMode;
  mode: CalendarMode;

  // Value
  value: DateType;

  selectedEventKeys?: SafeKey[];

  allDayEventRecord: Record<string, AllDayEventType<DateType>[]>;
  timeEventRecord: Record<string, TimeEventType<DateType>[]>;

  lunar?: boolean;

  eventRender?: EventRender<DateType>;

  onChange: (date: DateType) => void;
  onModeChange: (mode: CalendarMode) => void;
  onEventClick: (
    event: EventType<DateType>,
    domEvent: React.MouseEvent<HTMLDivElement, MouseEvent>,
  ) => void;
}

export type EventType<DateType extends AnyObject = Dayjs> = {
  key: SafeKey;
  icon?: React.ReactNode;
  title: string;
  start: DateValue<DateType>;
  end: DateValue<DateType>;
  allDay?: boolean;
  color?: LiteralUnion<PresetColorType>;
  [key: string]: any;
};

export interface AllDayEventType<DateType extends AnyObject = Dayjs>
  extends Pick<EventType<DateType>, 'key' | 'icon' | 'title' | 'allDay' | 'color'> {
  /* YYYYMMDD */
  dateKey: string;
  date: DateType;
  rangeStart: boolean;
  rangeEnd: boolean;
  /* event duration in current week*/
  duration: number;
  index: number;
  outOfView?: boolean;
  data: EventType<DateType>;
}

export type TimeEventGroup = {
  key: string;
  column: number;
  parent: { group: TimeEventGroup; offset: number; span: number; unindent?: boolean } | null;
  path: string[];
};

export interface TimeEventType<DateType extends AnyObject = Dayjs>
  extends Pick<EventType<DateType>, 'key' | 'icon' | 'title' | 'allDay' | 'color'> {
  /* YYYYMMDD */
  dateKey: string;
  date: DateType;
  start: { hour: number; minute: number };
  end: { hour: number; minute: number };
  rangeStart: boolean;
  rangeEnd: boolean;
  index: number;
  outOfView?: boolean;
  data: EventType<DateType>;

  /* Layout info in Time-grid view */
  group: TimeEventGroup;
  offset: number;
  span: number;
}
