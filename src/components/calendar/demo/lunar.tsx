import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
import React from 'react';
import { Button, Calendar, ConfigProvider } from 'metis-ui';
import zhCN from 'metis-ui/es/locale/zh_CN';

dayjs.locale('zh-cn');

const App: React.FC = () => {
  return (
    <ConfigProvider locale={zhCN}>
      <Calendar
        extra={<Button type="primary">Add Event</Button>}
        className="h-[768px]"
        lunar
        events={[]}
      />
    </ConfigProvider>
  );
};

export default App;
