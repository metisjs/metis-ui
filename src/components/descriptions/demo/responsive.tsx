import React from 'react';
import { Descriptions } from 'metis-ui';
import type { DescriptionsProps } from 'metis-ui';

const items: DescriptionsProps['items'] = [
  {
    label: 'Product',
    content: 'Cloud Database',
  },
  {
    label: 'Billing',
    content: 'Prepaid',
  },
  {
    label: 'Time',
    content: '18:00:00',
  },
  {
    label: 'Amount',
    content: '$80.00',
  },
  {
    label: 'Discount',
    span: { xl: 2, xxl: 2 },
    content: '$20.00',
  },
  {
    label: 'Official',
    span: { xl: 2, xxl: 2 },
    content: '$60.00',
  },
  {
    label: 'Config Info',
    span: { xs: 1, sm: 2, md: 3, lg: 3, xl: 2, xxl: 2 },
    content: (
      <>
        Data disk type: MongoDB
        <br />
        Database version: 3.4
        <br />
        Package: dds.mongo.mid
      </>
    ),
  },
  {
    label: 'Hardware Info',
    span: { xs: 1, sm: 2, md: 3, lg: 3, xl: 2, xxl: 2 },
    content: (
      <>
        CPU: 6 Core 3.5 GHz
        <br />
        Storage space: 10 GB
        <br />
        Replication factor: 3
        <br />
        Region: East China 1
      </>
    ),
  },
];

const App: React.FC = () => (
  <Descriptions
    title="Responsive Descriptions"
    bordered
    column={{ xs: 1, sm: 2, md: 3, lg: 3, xl: 4, xxl: 4 }}
    items={items}
  />
);

export default App;
