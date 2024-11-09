import React, { useState } from 'react';
import type { DescriptionsProps } from 'metis-ui';
import { Descriptions, Divider, Radio, Switch } from 'metis-ui';

const labelCls = 'bg-red-600';
const contentCls = 'bg-green-600';

type LayoutType = 'horizontal' | 'vertical' | undefined;

const items: DescriptionsProps['items'] = [
  {
    key: '1',
    label: 'Product',
    content: 'Cloud Database',
    className: { label: labelCls, content: contentCls },
  },
  {
    key: '2',
    label: 'Billing Mode',
    content: 'Prepaid',
  },
  {
    key: '3',
    label: 'Automatic Renewal',
    content: 'YES',
  },
];

const rootStyleItems: DescriptionsProps['items'] = [
  {
    key: '1',
    label: 'Product',
    content: 'Cloud Database',
  },
  {
    key: '2',
    label: 'Billing Mode',
    content: 'Prepaid',
  },
  {
    key: '3',
    label: 'Automatic Renewal',
    content: 'YES',
    className: { label: 'text-yellow-500', content: 'text-blue-500' },
  },
];

const App: React.FC = () => {
  const [border, setBorder] = useState(true);
  const [layout, setLayout] = useState('horizontal' as LayoutType);

  return (
    <>
      <Switch
        checkedChildren="Border"
        unCheckedChildren="No Border"
        checked={border}
        onChange={(e) => setBorder(e)}
      />
      <Divider />
      <Radio.Group onChange={setLayout} value={layout}>
        <Radio value="horizontal">horizontal</Radio>
        <Radio value="vertical">vertical</Radio>
      </Radio.Group>
      <Divider />
      <Descriptions title="User Info" bordered={border} layout={layout} items={items} />
      <Divider />
      <Descriptions
        title="Root style"
        className={{ item: { label: labelCls, content: contentCls } }}
        bordered={border}
        layout={layout}
        items={rootStyleItems}
      />
    </>
  );
};

export default App;
