import React from 'react';
import { clsx } from '@util/classNameUtils';
import type { SafeKey } from '@util/type';
import type { DateEvent } from '../../../util';

interface AllDayEventProps extends DateEvent {
  prefixCls: string;
  eventKey: SafeKey;
}

const AllDayEvent = (props: AllDayEventProps) => {
  const { prefixCls, title } = props;

  const rootCls = clsx(`${prefixCls}-all-day-event`, 'flex flex-col');
  return <div className={rootCls}>{title}</div>;
};

export default AllDayEvent;
