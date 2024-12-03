import zhCN from '../../date-picker/locale/zh_CN';
import type { CalendarLocale } from '../interface';

const locale: CalendarLocale = {
  ...zhCN,
  headerDateFormat: 'YYYY年M月D日',
  headerMonthFormat: 'YYYY年M月',
  headerYearFormat: 'YYYY年',
  weekDays: ['周日', '周一', '周二', '周三', '周四', '周五', '周六'],
  fullWeekDays: ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'],
  allDay: '全天',
  backToToday: '返回今天',
  nextDay: '下一天',
  prevDay: '上一天',
  nextWeek: '下一周',
  prevWeek: '上一周',
  nextMonth: '下一月',
  prevMonth: '上一月',
  nextYear: '下一年',
  prevYear: '上一年',
  dayView: '日视图',
  weekView: '周视图',
  monthView: '月视图',
  yearView: '年视图',

  more: '个',
};

export default locale;
