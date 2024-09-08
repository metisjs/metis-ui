import React from 'react';
import type { Dayjs } from 'dayjs';
import type { DatePickerProps } from 'metis-ui';
import { clsx, DatePicker, Space } from 'metis-ui';

const App: React.FC = () => {
  const cellRender: DatePickerProps<Dayjs>['cellRender'] = (current, info) => {
    if (info.type !== 'date') {
      return info.originNode;
    }
    if (typeof current === 'number' || typeof current === 'string') {
      return <div className="ant-picker-cell-inner">{current}</div>;
    }
    return (
      <div
        className={clsx(
          'ant-picker-cell-inner',
          current.date() === 1 && 'rounded-1/2 border border-primary',
        )}
      >
        {current.date()}
      </div>
    );
  };
  return (
    <Space size={12} vertical>
      <DatePicker cellRender={cellRender} />
      <DatePicker.RangePicker cellRender={cellRender} />
    </Space>
  );
};

export default App;
