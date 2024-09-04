import * as React from 'react';
import { clsx } from '../../../_util/classNameUtils';
import type { SharedPanelProps } from '../../interface';
import { isInRange, isSameWeek } from '../../utils/dateUtil';
import DatePanel from '../DatePanel';

export default function WeekPanel<DateType extends object = any>(
  props: SharedPanelProps<DateType>,
) {
  const { prefixCls, generateConfig, locale, value, hoverValue, hoverRangeValue } = props;

  // =============================== Row ================================
  const localeName = locale.locale;

  const rowPrefixCls = `${prefixCls}-week-panel-row`;

  const rowClassName = (currentDate: DateType) => {
    let isRangeStart = false;
    let isRangeEnd = false;
    let isRangeHover = false;
    let isHover = false;
    let isSelected = !hoverRangeValue && isSameWeek(generateConfig, localeName, value, currentDate);

    if (hoverRangeValue) {
      const [rangeStart, rangeEnd] = hoverRangeValue;

      isRangeStart = isSameWeek(generateConfig, localeName, rangeStart, currentDate);
      isRangeEnd = isSameWeek(generateConfig, localeName, rangeEnd, currentDate);
      isRangeHover =
        !isRangeStart &&
        !isRangeEnd &&
        isInRange(generateConfig, rangeStart, rangeEnd, currentDate);
    }

    if (hoverValue) {
      isHover = hoverValue.some((date) =>
        isSameWeek(generateConfig, localeName, currentDate, date),
      );
    }

    return clsx(rowPrefixCls, {
      [`${rowPrefixCls}-range-start`]: isRangeStart,
      [`${rowPrefixCls}-range-end`]: isRangeEnd,
      [`${rowPrefixCls}-range-hover`]: isRangeHover,
      [`${rowPrefixCls}-hover`]: isHover,
      [`${rowPrefixCls}-selected`]: isSelected,
    });
  };

  // ============================== Render ==============================
  return <DatePanel {...props} mode="week" panelName="week" rowClassName={rowClassName} />;
}
