import { XCircleOutline } from '@metisjs/icons';
import { Space, Tag } from 'metis-ui';
import React from 'react';

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
    <Tag closeIcon onClose={preventDefault}>
      Prevent Default
    </Tag>
    <Tag closeIcon={<XCircleOutline />} onClose={log}>
      Tag 2
    </Tag>
  </Space>
);

export default App;
