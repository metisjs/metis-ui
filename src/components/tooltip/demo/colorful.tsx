/**
 * description: 自定义背景颜色。
 */
import { Button, Space, Tooltip } from 'metis-ui';
import React from 'react';

const customColors = ['#f50', '#2db7f5', '#87d068', '#108ee9'];

const App: React.FC = () => (
  <>
    <Space wrap>
      {customColors.map((color) => (
        <Tooltip title="prompt text" color={color} key={color}>
          <Button>{color}</Button>
        </Tooltip>
      ))}
    </Space>
  </>
);

export default App;
