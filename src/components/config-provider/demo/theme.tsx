import React from 'react';
import { Button, ConfigProvider, Input, Space } from 'metis-ui';

export default () => (
  <ConfigProvider theme="dark">
    <div className="bg-gray-950 px-6 py-10">
      <Space vertical>
        <Space>
          <Input value="Dark Theme"></Input>
          <Button type="primary">Dark Theme</Button>
        </Space>
        <ConfigProvider theme="light">
          <Space>
            <Input value="Light Theme"></Input>
            <Button type="primary">Light Theme</Button>
          </Space>
        </ConfigProvider>
      </Space>
    </div>
  </ConfigProvider>
);
