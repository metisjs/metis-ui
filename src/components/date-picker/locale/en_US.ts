import type { Locale } from '../interface';
import { commonLocale } from './common';

const locale: Locale = {
  ...commonLocale,
  locale: 'en_US',
  today: 'Today',
  now: 'Now',
  ok: 'OK',
  day: 'Day',
  week: 'Week',
  month: 'Month',
  year: 'Year',

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
