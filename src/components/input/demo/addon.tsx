import React from 'react';
import { Cog6ToothOutline } from '@metisjs/icons';
import { Cascader, Input, Select, Space } from 'metis-ui';

const App: React.FC = () => (
  <Space vertical>
    <Input addonBefore="http://" addonAfter=".com" defaultValue="mysite" />
    <Input
      addonBefore={
        <Select
          defaultValue="http://"
          options={[
            { value: 'http://', label: 'http://' },
            { value: 'https://', label: 'https://' },
          ]}
        />
      }
      addonAfter={
        <Select
          defaultValue=".com"
          options={[
            { value: '.com', label: '.com' },
            { value: '.jp', label: '.jp' },
            { value: '.cn', label: '.cn' },
            { value: '.org', label: '.org' },
          ]}
        />
      }
      defaultValue="mysite"
    />
    <Input addonAfter={<Cog6ToothOutline className="size-5" />} defaultValue="mysite" />
    <Input addonBefore="http://" suffix=".com" defaultValue="mysite" />
    <Input
      addonBefore={<Cascader placeholder="cascader" className="w-[150px]" />}
      defaultValue="mysite"
    />
  </Space>
);

export default App;
