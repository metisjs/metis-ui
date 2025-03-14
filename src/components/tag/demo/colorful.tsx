import React from 'react';
import { Divider, Space, Tag } from 'metis-ui';

const colors = [
  'blue',
  'purple',
  'cyan',
  'green',
  'pink',
  'red',
  'orange',
  'yellow',
  'lime',
  'amber',
  'emerald',
  'teal',
  'sky',
  'indigo',
];

const App: React.FC = () => (
  <>
    <Divider orientation="left">Presets</Divider>
    <Space wrap>
      {colors.map((color) => (
        <Tag key={color} color={color}>
          {color}
        </Tag>
      ))}
    </Space>
    <Divider orientation="left">Custom</Divider>
    <Space wrap>
      <Tag color="#f50">#f50</Tag>
      <Tag color="#2db7f5">#2db7f5</Tag>
      <Tag color="#87d068">#87d068</Tag>
      <Tag color="#108ee9">#108ee9</Tag>
    </Space>
  </>
);

export default App;
