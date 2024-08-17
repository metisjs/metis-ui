import React from 'react';
import { ChevronDownOutline } from '@metisjs/icons';
import { Dropdown, Space } from 'metis-ui';

const App: React.FC = () => (
  <Space>
    <Dropdown.Button icon={<ChevronDownOutline />} menu={{ items: [] }}>
      Submit
    </Dropdown.Button>
  </Space>
);

export default App;
