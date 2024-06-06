/**
 * description: 基本标签的用法，可以通过设置 `closeIcon` 变为可关闭标签并自定义关闭按钮，设置为 `true` 时将使用默认关闭按钮。可关闭标签具有 `onClose` 事件。
 */
import { XCircleOutline } from '@metisjs/icons';
import { Space, Tag } from 'meta-ui';
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
      <a href="https://github.com/meta-oa/meta-ui">Link</a>
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
