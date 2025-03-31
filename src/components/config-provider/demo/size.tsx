import React, { useState } from 'react';
import type { ConfigProviderProps } from 'metis-ui';
import {
  Button,
  Card,
  ConfigProvider,
  DatePicker,
  Divider,
  Input,
  Segmented,
  Select,
  Space,
} from 'metis-ui';

type SizeType = ConfigProviderProps['componentSize'];

const App: React.FC = () => {
  const [componentSize, setComponentSize] = useState<SizeType>('small');

  return (
    <>
      <Segmented
        options={[
          { label: 'Mini', value: 'mini' },
          { label: 'Small', value: 'small' },
          { label: 'Middle', value: 'middle' },
          { label: 'Large', value: 'large' },
        ]}
        value={componentSize}
        onChange={setComponentSize}
      />
      <Divider />
      <ConfigProvider componentSize={componentSize}>
        <Space size={[0, 16]} vertical block>
          <Input />
          <Input allowClear />
          <Input.TextArea allowClear />
          <Select defaultValue="demo" options={[{ value: 'demo' }]} />
          <DatePicker />
          <DatePicker.RangePicker />
          <Button>Button</Button>
          <Card title="Card">Content</Card>
        </Space>
      </ConfigProvider>
    </>
  );
};

export default App;
