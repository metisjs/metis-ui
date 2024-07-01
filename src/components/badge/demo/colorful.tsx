import { Badge, Divider, Space } from 'metis-ui';
import React from 'react';

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
    <Space vertical>
      {colors.map((color) => (
        <Badge key={color} color={color} text={color} />
      ))}
    </Space>
    <Divider orientation="left">Custom</Divider>
    <Space vertical>
      <Badge color="#f50" text="#f50" />
      <Badge color="rgb(45, 183, 245)" text="rgb(45, 183, 245)" />
      <Badge color="hsl(102, 53%, 61%)" text="hsl(102, 53%, 61%)" />
      <Badge color="hwb(205 6% 9%)" text="hwb(205 6% 9%)" />
    </Space>
  </>
);

export default App;
