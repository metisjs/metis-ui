import { Select, Space } from 'metis-ui';
import React from 'react';

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
    optionLabelProp="label2"
    options={[
      {
        value: 'china',
        label: (
          <Space>
            <span role="img" aria-label="China">
              🇨🇳
            </span>
            China (中国)
          </Space>
        ),
        label2: 'China',
      },
      {
        value: 'usa',
        label: (
          <Space>
            <span role="img" aria-label="USA">
              🇺🇸
            </span>
            USA (美国)
          </Space>
        ),
        label2: 'USA',
      },
    ]}
  ></Select>
);

export default App;
