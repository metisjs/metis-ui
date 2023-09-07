/**
 * description: 我们添加了多种预设色彩的标签样式，用作不同场景使用。如果预设值不能满足你的需求，可以设置为具体的色值。
 */
import { Divider, Space, Tag } from 'meta-ui';
import React from 'react';

const App: React.FC = () => (
  <>
    <Divider orientation="left">Custom</Divider>
    <Space size={[0, 8]} wrap>
      <Tag color="#f50">#f50</Tag>
      <Tag color="#2db7f5">#2db7f5</Tag>
      <Tag color="#87d068">#87d068</Tag>
      <Tag color="#108ee9">#108ee9</Tag>
    </Space>
  </>
);

export default App;
