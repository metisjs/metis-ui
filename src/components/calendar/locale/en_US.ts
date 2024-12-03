import enUS from '../../date-picker/locale/en_US';
import type { CalendarLocale } from '../interface';

const locale: CalendarLocale = {
  ...enUS,
  headerDateFormat: 'MMMM D, YYYY',
  headerMonthFormat: 'MMMM YYYY',
  headerYearFormat: 'YYYY',
  weekDays: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  fullWeekDays: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  allDay: 'all-day',
  backToToday: 'Back to today',
  nextDay: 'Next Day',
  prevDay: 'Prev Day',
  nextWeek: 'Next week',
  prevWeek: 'Prev week',
  nextMonth: 'Next month',
  prevMonth: 'Prev month',
  nextYear: 'Next year',
  prevYear: 'Prev year',
  dayView: 'Day view',
  weekView: 'Week view',
  monthView: 'Month view',
  yearView: 'Year view',

  more: 'more',
};

export default locale;
