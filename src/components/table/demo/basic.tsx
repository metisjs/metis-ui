import React from 'react';
import type { TableProps } from 'metis-ui';
import { Table } from 'metis-ui';

interface DataType {
  key: string;
  name: string;
  age: number;
  address: string;
  tags: string[];
}

const columns: TableProps<DataType>['columns'] = [
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: 'Age',
    dataIndex: 'age',
    key: 'age',
  },
  {
    title: 'Address',
    dataIndex: 'address',
    key: 'address',
  },
  {
    title: 'Tags',
    key: 'tags',
    dataIndex: 'tags',
    valueType: 'tag',
    valueEnum: {
      teacher: { label: 'Teacher', color: 'processing' },
      developer: { label: 'Developer', color: 'processing' },
      loser: { label: 'Loser', color: 'error' },
      cool: { label: 'Cool', color: 'success' },
      nice: { label: 'Nice', color: 'success' },
    },
  },
  {
    title: 'Action',
    key: 'action',
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
  },
  {
    key: '2',
    name: 'Jim Green',
    age: 42,
    address: 'London No. 1 Lake Park',
    tags: ['loser'],
  },
  {
    key: '3',
    name: 'Joe Black',
    age: 32,
    address: 'Sydney No. 1 Lake Park',
    tags: ['cool', 'teacher'],
  },
];

const App: React.FC = () => <Table<DataType> columns={columns} dataSource={data} />;

export default App;
