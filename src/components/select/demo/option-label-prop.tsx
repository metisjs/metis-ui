/**
 * description: 使用 `optionLabelProp` 指定回填到选择框的 `Option` 属性。
 */
import { Select, Space } from 'metis-ui';
import React from 'react';

const { Option } = Select;

const handleChange = (value: string[]) => {
  console.log(`selected ${value}`);
};

const App: React.FC = () => (
  <Select
    mode="multiple"
    style={{ width: '100%' }}
    placeholder="Select one country"
    defaultValue={['china']}
    onChange={handleChange}
    optionLabelProp="label"
  >
    <Option value="china" label="China">
      <Space>
        <span role="img" aria-label="China">
          🇨🇳
        </span>
        China (中国)
      </Space>
    </Option>
    <Option value="usa" label="USA">
      <Space>
        <span role="img" aria-label="USA">
          🇺🇸
        </span>
        USA (美国)
      </Space>
    </Option>
    <Option value="japan" label="Japan">
      <Space>
        <span role="img" aria-label="Japan">
          🇯🇵
        </span>
        Japan (日本)
      </Space>
    </Option>
    <Option value="korea" label="Korea">
      <Space>
        <span role="img" aria-label="Korea">
          🇰🇷
        </span>
        Korea (韩国)
      </Space>
    </Option>
  </Select>
);

export default App;
