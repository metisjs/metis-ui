import React from 'react';
import { Checkbox, Space } from 'metis-ui';
import type { CheckboxValueType } from 'metis-ui/es/checkbox/Group';

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
  <Space vertical>
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
