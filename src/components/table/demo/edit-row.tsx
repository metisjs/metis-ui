import React from 'react';
import type { TableProps } from 'metis-ui';
import { Table } from 'metis-ui';

interface DataType {
  key: number;
  title: string;
  price: number;
  state: string;
  description: string;
  createdAt: number;
}

const waitTime = (time: number = 100) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, time);
  });
};

const data = Array.from({ length: 100 }).map<DataType>((_, i) => ({
  key: i,
  title: `Edward ${i}`,
  price: Math.floor(Math.random() * 2000),
  state: ['open', 'closed'][Math.floor(Math.random() * 10) % 2],
  description: `London Park no. ${i}`,
  createdAt: Date.now() - Math.floor(Math.random() * 2000),
}));

const columns: TableProps<DataType>['columns'] = [
  {
    title: 'Index',
    valueType: 'indexBorder',
    width: 50,
  },
  {
    title: 'Title',
    dataIndex: 'title',
    editable: (_, __, index) => {
      if (index === 0) {
        return false;
      }
      return { rules: index > 1 ? [{ required: true }] : [] };
    },
    width: 160,
  },
  {
    title: 'Price',
    dataIndex: 'price',
    valueType: 'money',
    width: 140,
  },
  {
    title: 'State',
    dataIndex: 'state',
    valueType: 'select',
    valueEnum: {
      open: {
        label: 'Open',
        status: 'error',
      },
      closed: {
        label: 'Closed',
        status: 'success',
      },
    },
    width: 150,
  },
  {
    title: 'Description',
    dataIndex: 'description',
  },
  {
    title: 'CreatedAt',
    dataIndex: 'createdAt',
    valueType: 'date',
    width: 160,
  },
  {
    title: 'Actions',
    dataIndex: 'action',
    valueType: 'action',
    render: (_, record, __, action) => [
      <a key="edit" onClick={() => action.startEdit(record.key)}>
        Edit
      </a>,
      <a key="delete">Delete</a>,
    ],
    width: 160,
  },
];

const App: React.FC = () => (
  <Table
    dataSource={data}
    columns={columns}
    editable={{
      onSave: async (record) => {
        console.log(record);
        await waitTime(2000);
      },
    }}
  />
);

export default App;
