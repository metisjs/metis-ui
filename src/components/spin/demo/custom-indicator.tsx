import { LoadingOutlined } from '@ant-design/icons';
import { Space, Spin } from 'antd';
import React from 'react';

const App: React.FC = () => (
  <Space>
    <Spin indicator={<LoadingOutlined spin />} size="small" />
    <Spin indicator={<LoadingOutlined spin />} />
    <Spin indicator={<LoadingOutlined spin />} size="large" />
    <Spin indicator={<LoadingOutlined style={{ fontSize: 48 }} spin />} />
  </Space>
);

export default App;
