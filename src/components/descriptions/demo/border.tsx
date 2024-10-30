import React from 'react';
import { Badge, Descriptions } from 'metis-ui';
import type { DescriptionsProps } from 'metis-ui';

const items: DescriptionsProps['items'] = [
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
  },
  {
    key: '4',
    label: 'Order time',
    content: '2018-04-24 18:00:00',
  },
  {
    key: '5',
    label: 'Usage Time',
    content: '2019-04-24 18:00:00',
    span: 2,
  },
  {
    key: '6',
    label: 'Status',
    content: <Badge status="processing" text="Running" />,
    span: 3,
  },
  {
    key: '7',
    label: 'Negotiated Amount',
    content: '$80.00',
  },
  {
    key: '8',
    label: 'Discount',
    content: '$20.00',
  },
  {
    key: '9',
    label: 'Official Receipts',
    content: '$60.00',
  },
  {
    key: '10',
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

const App: React.FC = () => <Descriptions title="User Info" bordered items={items} />;

export default App;
