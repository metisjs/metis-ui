import React from 'react';
import { Button, ConfigProvider, Input, Space } from 'metis-ui';

export default () => (
  <ConfigProvider theme="dark">
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
  </ConfigProvider>
);
