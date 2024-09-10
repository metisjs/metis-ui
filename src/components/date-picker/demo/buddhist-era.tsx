import React from 'react';
import dayjs from 'dayjs';
import buddhistEra from 'dayjs/plugin/buddhistEra';
import { ConfigProvider, DatePicker, Space } from 'metis-ui';
import type { DatePickerProps } from 'metis-ui';
import en from 'metis-ui/es/date-picker/locale/en_US';
import enUS from 'metis-ui/locale/en_US';

dayjs.extend(buddhistEra);

// Component level locale
const buddhistLocale: typeof en = {
  ...en,
  fieldDateFormat: 'BBBB-MM-DD',
  fieldDateTimeFormat: 'BBBB-MM-DD HH:mm:ss',
  yearFormat: 'BBBB',
  cellYearFormat: 'BBBB',
};

// ConfigProvider level locale
const globalBuddhistLocale: typeof enUS = {
  ...enUS,
  DatePicker: {
    ...enUS.DatePicker!,
    ...buddhistLocale,
  },
};

const defaultValue = dayjs('2024-01-01');

const App: React.FC = () => {
  const onChange: DatePickerProps['onChange'] = (_, dateStr) => {
    console.log('onChange:', dateStr);
  };

  return (
    <Space vertical>
      <h5 className="text-base font-semibold">By locale props</h5>
      <DatePicker defaultValue={defaultValue} locale={buddhistLocale} onChange={onChange} />
      <DatePicker
        defaultValue={defaultValue}
        showTime
        locale={buddhistLocale}
        onChange={onChange}
      />

      <h5 className="mt-4 text-base font-semibold">By ConfigProvider</h5>
      <ConfigProvider locale={globalBuddhistLocale}>
        <Space vertical>
          <DatePicker defaultValue={defaultValue} onChange={onChange} />
          <DatePicker defaultValue={defaultValue} showTime onChange={onChange} />
        </Space>
      </ConfigProvider>
    </Space>
  );
};

export default App;
