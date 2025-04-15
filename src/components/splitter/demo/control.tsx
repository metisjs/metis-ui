import React from 'react';
import { Button, Space, Splitter, Switch } from 'metis-ui';

const Desc: React.FC<Readonly<{ text?: string | number }>> = (props) => (
  <Space block justify="center" align="center" className="h-full">
    <div className="text-text-secondary text-base">{props.text}</div>
  </Space>
);

const App: React.FC = () => {
  const [sizes, setSizes] = React.useState<(number | string)[]>(['50%', '50%']);
  const [enabled, setEnabled] = React.useState(true);

  return (
    <Space vertical size="middle" block>
      <Splitter onResize={setSizes} className="h-50 bg-gray-950/2 dark:bg-white/5">
        <Splitter.Panel size={sizes[0]} resizable={enabled}>
          <Desc text="First" />
        </Splitter.Panel>
        <Splitter.Panel size={sizes[1]}>
          <Desc text="Second" />
        </Splitter.Panel>
      </Splitter>
      <Space size="middle" justify="space-between" block>
        <Switch
          checked={enabled}
          onChange={setEnabled}
          checkedChildren="Enabled"
          unCheckedChildren="Disabled"
        />
        <Button onClick={() => setSizes(['50%', '50%'])}>Reset</Button>
      </Space>
    </Space>
  );
};

export default App;
