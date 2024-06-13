import { Cog6ToothOutline } from '@metisjs/icons';
import { Input, Space } from 'metis-ui';
import React from 'react';

// const selectBefore = (
//   <Select defaultValue="http://">
//     <Option value="http://">http://</Option>
//     <Option value="https://">https://</Option>
//   </Select>
// );
// const selectAfter = (
//   <Select defaultValue=".com">
//     <Option value=".com">.com</Option>
//     <Option value=".jp">.jp</Option>
//     <Option value=".cn">.cn</Option>
//     <Option value=".org">.org</Option>
//   </Select>
// );

const App: React.FC = () => (
  <Space direction="vertical">
    <Input addonBefore="http://" addonAfter=".com" defaultValue="mysite" />
    {/* <Input addonBefore={selectBefore} addonAfter={selectAfter} defaultValue="mysite" /> */}
    <Input addonAfter={<Cog6ToothOutline className="h-5 w-5" />} defaultValue="mysite" />
    <Input addonBefore="http://" suffix=".com" defaultValue="mysite" />
    {/* <Input
      addonBefore={<Cascader placeholder="cascader" style={{ width: 150 }} />}
      defaultValue="mysite"
    /> */}
  </Space>
);

export default App;
