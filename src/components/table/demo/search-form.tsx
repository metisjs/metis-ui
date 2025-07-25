import React from 'react';
import type { TableProps } from 'metis-ui';
import { Button, Table } from 'metis-ui';

interface DataType {
  key: string;
  name: string;
  age: number;
  address: string;
  tags: string[];
  registeredAt: string;
}

const columns: TableProps<DataType>['columns'] = [
  {
    title: 'Name',
    dataIndex: 'name',
  },
  {
    title: 'Age',
    dataIndex: 'age',
    valueType: 'digit',
    search: true,
  },
  {
    title: 'Address',
    dataIndex: 'address',
  },
  {
    title: 'Tags',
    dataIndex: 'tags',
    valueType: 'tag',
    valueEnum: {
      teacher: { label: 'Teacher', color: 'processing' },
      developer: { label: 'Developer', color: 'processing' },
      loser: { label: 'Loser', color: 'error' },
      cool: { label: 'Cool', color: 'success' },
      nice: { label: 'Nice', color: 'success' },
    },
    search: { fieldProps: { mode: 'multiple' } },
  },
  {
    title: 'RegisteredAt',
    dataIndex: 'registeredAt',
    valueType: 'dateTime',
    search: { fieldProps: { showTime: false } },
  },
  {
    title: 'Action',
    valueType: 'action',
    render: (_, record) => [<a key="invite">Invite {record.name}</a>, <a key="del">Delete</a>],
  },
];

const data: DataType[] = [
  {
    key: '1',
    name: 'John Brown',
    age: 32,
    address: 'New York No. 1 Lake Park',
    tags: ['nice', 'developer'],
    registeredAt: '2025-01-01 08:05:03',
  },
  {
    key: '2',
    name: 'Jim Green',
    age: 42,
    address: 'London No. 1 Lake Park',
    tags: ['loser'],
    registeredAt: '2025-03-01 12:11:33',
  },
  {
    key: '3',
    name: 'Joe Black',
    age: 32,
    address: 'Sydney No. 1 Lake Park',
    tags: ['cool', 'teacher'],
    registeredAt: '2025-07-01 19:15:00',
  },
];

const fetchData = (params: {
  filters: Record<string, any>;
  sorter: Record<string, any>;
  current: number;
  pageSize: number;
}) => {
  console.log('fetch params', params);

  return new Promise<{ data: DataType[]; total: number }>((resolve) => {
    setTimeout(() => {
      resolve({ data: data, total: 3 });
    }, 500);
  });
};

const App: React.FC = () => (
  <Table
    columns={columns}
    request={fetchData}
    toolbar={{
      actions: [
        <Button key="add" type="primary">
          Add user
        </Button>,
      ],
      options: true,
    }}
    search={{
      items: [
        {
          name: 'keyword',
          label: 'Keyword',
          span: 2,
          order: 0,
        },
      ],
    }}
  />
);

export default App;
