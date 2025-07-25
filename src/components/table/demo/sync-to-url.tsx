import React from 'react';
import type { TableProps } from 'metis-ui';
import { Table } from 'metis-ui';
import { fetchDataWithPagination } from './services';

type ColumnsType<T extends object = object> = TableProps<T>['columns'];

interface DataType {
  name: {
    first: string;
    last: string;
  };
  gender: string;
  email: string;
  login: {
    uuid: string;
  };
}

const columns: ColumnsType<DataType> = [
  {
    title: 'Name',
    dataIndex: 'name',
    filter: true,
    sorter: true,
    render: (_, record) => `${record.name.first} ${record.name.last}`,
    width: '20%',
  },
  {
    title: 'Gender',
    dataIndex: 'gender',
    filter: true,
    valueEnum: {
      male: 'Male',
      female: 'Female',
    },
    width: '20%',
  },
  {
    title: 'Email',
    dataIndex: 'email',
  },
];

const App: React.FC = () => (
  <Table
    columns={columns}
    rowKey={(record) => record.login.uuid}
    request={fetchDataWithPagination}
    search={{
      items: [{ name: 'keyword', label: 'Keyword', span: 2 }],
    }}
    syncToUrl
  />
);

export default App;
