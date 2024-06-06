/**
 * description: 后缀图标。
 */
import { FaceFrownOutline, FaceSmileOutline } from '@metisjs/icons';
import { Select, Space } from 'meta-ui';
import React from 'react';

const smileIcon = <FaceSmileOutline className="h-4 w-4" />;
const mehIcon = <FaceFrownOutline className="h-4 w-4" />;

const handleChange = (value: string) => {
  console.log(`selected ${value}`);
};

const App: React.FC = () => (
  <Space wrap>
    <Select
      suffixIcon={smileIcon}
      defaultValue="lucy"
      style={{ width: 120 }}
      onChange={handleChange}
      options={[
        { value: 'jack', label: 'Jack' },
        { value: 'lucy', label: 'Lucy' },
        { value: 'Yiminghe', label: 'yiminghe' },
        { value: 'disabled', label: 'Disabled', disabled: true },
      ]}
    />
    <Select
      suffixIcon={mehIcon}
      defaultValue="lucy"
      style={{ width: 120 }}
      disabled
      options={[{ value: 'lucy', label: 'Lucy' }]}
    />
  </Space>
);

export default App;
