import type { Dayjs } from 'dayjs';
import dayjsGenerateConfig from '../date-picker/generate/config/dayjs';
import generateCalendar from './generateCalendar';
import type { CalendarProps } from './interface';

const Calendar = generateCalendar<Dayjs>(dayjsGenerateConfig);

export type CalendarType = typeof Calendar & {
  generateCalendar: typeof generateCalendar;
};

(Calendar as CalendarType).generateCalendar = generateCalendar;

export type { CalendarProps };
export default Calendar as CalendarType;
