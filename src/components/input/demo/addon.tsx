import { Cog6ToothOutline } from '@metisjs/icons';
import { Input, Select, Space } from 'metis-ui';
import React from 'react';

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
    <Input addonAfter={<Cog6ToothOutline className="h-5 w-5" />} defaultValue="mysite" />
    <Input addonBefore="http://" suffix=".com" defaultValue="mysite" />
    {/* TODO: Cascader待开发 */}
    {/* <Input
      addonBefore={<Cascader placeholder="cascader" style={{ width: 150 }} />}
      defaultValue="mysite"
    /> */}
  </Space>
);

export default App;
