import type { Locale } from '../interface';
import { commonLocale } from './common';

const locale: Locale = {
  ...commonLocale,
  locale: 'en_US',
  today: 'Today',
  now: 'Now',
  backToToday: 'Back to today',
  ok: 'OK',
  clear: 'Clear',
  month: 'Month',
  year: 'Year',
  timeSelect: 'select time',
  dateSelect: 'select date',
  weekSelect: 'Choose a week',
  monthSelect: 'Choose a month',
  yearSelect: 'Choose a year',
  decadeSelect: 'Choose a decade',

  previousMonth: 'Previous month (PageUp)',
  nextMonth: 'Next month (PageDown)',
  previousYear: 'Last year (Control + left)',
  nextYear: 'Next year (Control + right)',
  previousDecade: 'Last decade',
  nextDecade: 'Next decade',
  previousCentury: 'Last century',
  nextCentury: 'Next century',

  placeholder: 'Select date',
  yearPlaceholder: 'Select year',
  quarterPlaceholder: 'Select quarter',
  monthPlaceholder: 'Select month',
  weekPlaceholder: 'Select week',
  timePlaceholder: 'Select time',

  rangePlaceholder: ['Start date', 'End date'],
  rangeYearPlaceholder: ['Start year', 'End year'],
  rangeQuarterPlaceholder: ['Start quarter', 'End quarter'],
  rangeMonthPlaceholder: ['Start month', 'End month'],
  rangeWeekPlaceholder: ['Start week', 'End week'],
  rangeTimePlaceholder: ['Start time', 'End time'],
};

export default locale;
