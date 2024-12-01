import * as React from 'react';
import { clsx } from '@util/classNameUtils';
import useTimeInfo from '../../hooks/useTimeInfo';
import type { SharedPanelProps } from '../../interface';
import { fillTime } from '../../utils/dateUtil';
import DatePanel from '../DatePanel';
import TimePanel from '../TimePanel';

export default function DateTimePanel<DateType extends object = any>(
  props: SharedPanelProps<DateType>,
) {
  const { prefixCls, generateConfig, showTime, onSelect, value, pickerValue, onHover } = props;

  // =============================== Time ===============================
  const [getValidTime] = useTimeInfo(generateConfig, showTime);

  // Merge the time info from `value` or `pickerValue`
  const mergeTime = (date: DateType) => {
    if (value) {
      return fillTime(generateConfig, date, value);
    }

    return fillTime(generateConfig, date, pickerValue);
  };

  // ============================== Hover ===============================
  const onDateHover = (date: DateType) => {
    onHover?.(date ? mergeTime(date) : date);
  };

  // ============================== Select ==============================
  const onDateSelect = (date: DateType) => {
    // Merge with current time
    const cloneDate = mergeTime(date);

    onSelect(getValidTime(cloneDate, cloneDate));
  };

  // ============================== Style ==============================
  const rootCls = clsx(`${prefixCls}-datetime-panel`, 'flex');

  // ============================== Render ==============================
  return (
    <div className={rootCls}>
      <DatePanel {...props} onSelect={onDateSelect} onHover={onDateHover} />
      <TimePanel {...props} />
    </div>
  );
}
