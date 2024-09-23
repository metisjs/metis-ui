import React from 'react';
import dayjs from 'dayjs';
import type { DatePickerProps } from 'metis-ui';
import { Button, DatePicker, Slider, Space } from 'metis-ui';

const onChange: DatePickerProps['onChange'] = (dateString, date) => {
  console.log(dateString, date);
};

type DateComponent = Required<NonNullable<DatePickerProps['components']>>['date'];
type GetProps<T> = T extends React.ComponentType<infer P> ? P : never;

const MyDatePanel = (props: GetProps<DateComponent>) => {
  const { value, onSelect, onHover } = props;

  // Value
  const startDate = React.useMemo(() => dayjs().date(1).month(0), []);
  const [innerValue, setInnerValue] = React.useState(value || startDate);

  React.useEffect(() => {
    if (value) {
      setInnerValue(value);
    }
  }, [value]);

  // Range
  const dateCount = React.useMemo(() => {
    const endDate = startDate.add(1, 'year').add(-1, 'day');
    return endDate.diff(startDate, 'day');
  }, [startDate]);

  const sliderValue = Math.min(Math.max(0, innerValue.diff(startDate, 'day')), dateCount);

  // Render
  return (
    <Space vertical block size="small" className="p-4">
      <h4 className="text-lg font-medium">The BEST Picker Panel</h4>
      <Slider
        min={0}
        max={dateCount}
        value={sliderValue}
        onChange={(nextValue) => {
          const nextDate = startDate.add(nextValue, 'day');
          setInnerValue(nextDate);
          onHover?.(nextDate);
        }}
        tooltip={{
          formatter: (nextValue) => startDate.add(nextValue || 0, 'day').format('YYYY-MM-DD'),
        }}
      />
      <Button
        className="w-full"
        type="primary"
        onClick={() => {
          onSelect(innerValue);
        }}
      >{`That's It!`}</Button>
    </Space>
  );
};

const App: React.FC = () => (
  <Space vertical>
    <DatePicker
      showNow={false}
      onChange={onChange}
      components={{
        date: MyDatePanel,
      }}
    />
  </Space>
);

export default App;
