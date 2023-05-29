/**
 * description: 方便的从数组生成 Checkbox 组。
 */
import { Checkbox, Space } from 'meta-ui';
import type { CheckboxValueType } from 'meta-ui/es/checkbox/Group';
import React from 'react';

const onChange = (checkedValues: CheckboxValueType[]) => {
  console.log('checked = ', checkedValues);
};

const plainOptions = ['Apple', 'Pear', 'Orange'];

const options = [
  { label: 'Apple', value: 'Apple' },
  { label: 'Pear', value: 'Pear' },
  { label: 'Orange', value: 'Orange' },
];

const optionsWithDisabled = [
  { label: 'Apple', value: 'Apple' },
  { label: 'Pear', value: 'Pear' },
  { label: 'Orange', value: 'Orange', disabled: false },
];

const App: React.FC = () => (
  <Space direction="vertical">
    <Checkbox.Group options={plainOptions} defaultValue={['Apple']} onChange={onChange} />
    <Checkbox.Group options={options} defaultValue={['Pear']} onChange={onChange} />
    <Checkbox.Group
      options={optionsWithDisabled}
      disabled
      defaultValue={['Apple']}
      onChange={onChange}
    />
  </Space>
);

export default App;
