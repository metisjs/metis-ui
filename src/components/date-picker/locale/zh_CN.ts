import type { Locale } from '../interface';
import { commonLocale } from './common';

const locale: Locale = {
  ...commonLocale,
  locale: 'zh_CN',
  today: '今天',
  now: '此刻',
  ok: '确定',
  day: '日',
  week: '周',
  month: '月',
  year: '年',

  yearFormat: 'YYYY年',
  cellDateFormat: 'D',
  monthBeforeYear: false,

  shortMonths: [
    '一月',
    '二月',
    '三月',
    '四月',
    '五月',
    '六月',
    '七月',
    '八月',
    '九月',
    '十月',
    '十一月',
    '十二月',
  ],

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
