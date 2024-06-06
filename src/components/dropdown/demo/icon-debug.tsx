/**
 * description: 特殊处理 Down icon。
 */
import { ChevronDownOutline } from '@metisjs/icons';
import { Dropdown, Space } from 'meta-ui';
import React from 'react';

const App: React.FC = () => (
  <Space>
    <Dropdown.Button icon={<ChevronDownOutline />} menu={{ items: [] }}>
      Submit
    </Dropdown.Button>
  </Space>
);

export default App;
