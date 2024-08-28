import type { Locale } from '../interface';
import { commonLocale } from './common';

const locale: Locale = {
  ...commonLocale,
  locale: 'zh_CN',
  today: '今天',
  now: '此刻',
  backToToday: '返回今天',
  ok: '确定',
  timeSelect: '选择时间',
  dateSelect: '选择日期',
  weekSelect: '选择周',
  clear: '清除',
  month: '月',
  year: '年',
  previousMonth: '上个月 (翻页上键)',
  nextMonth: '下个月 (翻页下键)',
  monthSelect: '选择月份',
  yearSelect: '选择年份',
  decadeSelect: '选择年代',

  previousYear: '上一年 (Control键加左方向键)',
  nextYear: '下一年 (Control键加右方向键)',
  previousDecade: '上一年代',
  nextDecade: '下一年代',
  previousCentury: '上一世纪',
  nextCentury: '下一世纪',

  yearFormat: 'YYYY年',
  cellDateFormat: 'D',
  monthBeforeYear: false,

  placeholder: '请选择日期',
  yearPlaceholder: '请选择年份',
  quarterPlaceholder: '请选择季度',
  monthPlaceholder: '请选择月份',
  weekPlaceholder: '请选择周',
  timePlaceholder: '请选择时间',

  rangePlaceholder: ['开始日期', '结束日期'],
  rangeYearPlaceholder: ['开始年份', '结束年份'],
  rangeMonthPlaceholder: ['开始月份', '结束月份'],
  rangeQuarterPlaceholder: ['开始季度', '结束季度'],
  rangeWeekPlaceholder: ['开始周', '结束周'],
  rangeTimePlaceholder: ['开始时间', '结束时间'],
};

export default locale;
