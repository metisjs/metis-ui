import React from 'react';
import { XCircleOutline } from '@metisjs/icons';
import { Space, Tag } from 'metis-ui';

const log = (e: React.MouseEvent<HTMLElement>) => {
  console.log(e);
};

const preventDefault = (e: React.MouseEvent<HTMLElement>) => {
  e.preventDefault();
  console.log('Clicked! But prevent default.');
};

const App: React.FC = () => (
  <Space size={[0, 8]} wrap>
    <Tag>Tag 1</Tag>
    <Tag>
      <a href="https://github.com/metis-oa/metis-ui">Link</a>
    </Tag>
    <Tag closable onClose={preventDefault}>
      Prevent Default
    </Tag>
    <Tag closable={{ closeIcon: <XCircleOutline /> }} onClose={log}>
      Tag 2
    </Tag>
  </Space>
);

export default App;
