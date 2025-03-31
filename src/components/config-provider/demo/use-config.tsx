import React, { useState } from 'react';
import type { ConfigProviderProps } from 'metis-ui';
import { Checkbox, ConfigProvider, Divider, Form, Input, Segmented, Space } from 'metis-ui';

type SizeType = ConfigProviderProps['componentSize'];

const ConfigDisplay = () => {
  const { componentDisabled, componentSize } = ConfigProvider.useConfig();

  return (
    <>
      <Form.Item label="componentSize value">
        <Input value={componentSize} />
      </Form.Item>
      <Form.Item label="componentDisabled value">
        <Input value={String(componentDisabled)} disabled={componentDisabled} />
      </Form.Item>
    </>
  );
};

const App: React.FC = () => {
  const [componentSize, setComponentSize] = useState<SizeType>('small');
  const [disabled, setDisabled] = useState<boolean>(true);

  return (
    <div>
      <Space>
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
        <Checkbox checked={disabled} onChange={setDisabled}>
          Form disabled
        </Checkbox>
      </Space>
      <Divider />
      <ConfigProvider componentSize={componentSize}>
        <div className="example">
          <Form disabled={disabled}>
            <ConfigDisplay />
          </Form>
        </div>
      </ConfigProvider>
    </div>
  );
};

export default App;
