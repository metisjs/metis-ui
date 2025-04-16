import React from 'react';
import { Cog6ToothOutline } from '@metisjs/icons';
import { Cascader, InputNumber, Select, Space } from 'metis-ui';

const selectBefore = (
  <Select
    defaultValue="add"
    options={[
      { value: 'add', label: '+' },
      { value: 'minus', label: '-' },
    ]}
    className="w-16"
  ></Select>
);
const selectAfter = (
  <Select
    defaultValue="USD"
    options={[
      { value: 'USD', label: '$' },
      { value: 'EUR', label: '€' },
      { value: 'GBP', label: '£' },
      { value: 'CNY', label: '¥' },
    ]}
    className="w-16"
  ></Select>
);

const App: React.FC = () => (
  <Space vertical>
    <InputNumber addonBefore="+" addonAfter="$" defaultValue={100} />
    <InputNumber addonBefore={selectBefore} addonAfter={selectAfter} defaultValue={100} />
    <InputNumber addonAfter={<Cog6ToothOutline />} defaultValue={100} />
    <InputNumber
      addonBefore={<Cascader placeholder="cascader" className="w-[150px]" />}
      defaultValue={100}
    />
    <InputNumber
      addonBefore="+"
      addonAfter={<Cog6ToothOutline />}
      defaultValue={100}
      disabled
      controls
    />
    <InputNumber
      prefix="¥"
      addonBefore="+"
      addonAfter={<Cog6ToothOutline />}
      defaultValue={100}
      disabled
      controls
    />
  </Space>
);

export default App;
