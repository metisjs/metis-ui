import React, { useState } from 'react';
import { Button, Descriptions, Radio } from 'metis-ui';
import type { DescriptionsProps, RadioChangeEvent } from 'metis-ui';

const borderedItems: DescriptionsProps['items'] = [
  {
    key: '1',
    label: 'Product',
    content: 'Cloud Database',
  },
  {
    key: '2',
    label: 'Billing',
    content: 'Prepaid',
  },
  {
    key: '3',
    label: 'Time',
    content: '18:00:00',
  },
  {
    key: '4',
    label: 'Amount',
    content: '$80.00',
  },
  {
    key: '5',
    label: 'Discount',
    content: '$20.00',
  },
  {
    key: '6',
    label: 'Official',
    content: '$60.00',
  },
  {
    key: '7',
    label: 'Config Info',
    content: (
      <>
        Data disk type: MongoDB
        <br />
        Database version: 3.4
        <br />
        Package: dds.mongo.mid
        <br />
        Storage space: 10 GB
        <br />
        Replication factor: 3
        <br />
        Region: East China 1
        <br />
      </>
    ),
  },
];

const items: DescriptionsProps['items'] = [
  {
    key: '1',
    label: 'Product',
    content: 'Cloud Database',
  },
  {
    key: '2',
    label: 'Billing',
    content: 'Prepaid',
  },
  {
    key: '3',
    label: 'Time',
    content: '18:00:00',
  },
  {
    key: '4',
    label: 'Amount',
    content: '$80.00',
  },
  {
    key: '5',
    label: 'Discount',
    content: '$20.00',
  },
  {
    key: '6',
    label: 'Official',
    content: '$60.00',
  },
];

const App: React.FC = () => {
  const [size, setSize] = useState<'default' | 'middle' | 'small'>('default');

  const onChange = (e: RadioChangeEvent) => {
    console.log('size checked', e.target.value);
    setSize(e.target.value);
  };

  return (
    <div>
      <Radio.Group onChange={onChange} value={size}>
        <Radio value="default">default</Radio>
        <Radio value="middle">middle</Radio>
        <Radio value="small">small</Radio>
      </Radio.Group>
      <br />
      <br />
      <Descriptions
        bordered
        title="Custom Size"
        size={size}
        extra={<Button type="primary">Edit</Button>}
        items={borderedItems}
      />
      <br />
      <br />
      <Descriptions
        title="Custom Size"
        size={size}
        extra={<Button type="primary">Edit</Button>}
        items={items}
      />
    </div>
  );
};

export default App;
