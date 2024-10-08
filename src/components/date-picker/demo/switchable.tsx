import React, { useState } from 'react';
import type { DatePickerProps, TimePickerProps } from 'metis-ui';
import { DatePicker, Select, Space, TimePicker } from 'metis-ui';
import type { PickerMode } from 'metis-ui/es/date-picker/interface';

const PickerWithType = ({
  type,
  onChange,
}: {
  type: PickerMode;
  onChange: TimePickerProps['onChange'] | DatePickerProps['onChange'];
}) => {
  if (type === 'time') return <TimePicker onChange={onChange} />;
  if (type === 'date') return <DatePicker onChange={onChange} />;
  return <DatePicker picker={type} onChange={onChange} />;
};

const App: React.FC = () => {
  const [type, setType] = useState<PickerMode>('time');

  return (
    <Space>
      <Select<PickerMode>
        value={type}
        options={[
          { value: 'time', label: 'Time' },
          { value: 'date', label: 'Date' },
          { value: 'week', label: 'Week' },
          { value: 'month', label: 'Month' },
          { value: 'quarter', label: 'Quarter' },
          { value: 'year', label: 'Year' },
        ]}
        onChange={setType}
        className="w-28"
      ></Select>
      <PickerWithType type={type} onChange={(value) => console.log(value)} />
    </Space>
  );
};

export default App;
