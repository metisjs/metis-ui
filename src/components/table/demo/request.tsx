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
    sorter: true,
    render: (name) => `${name.first} ${name.last}`,
    width: '20%',
  },
  {
    title: 'Gender',
    dataIndex: 'gender',
    filter: {
      items: [
        { label: 'Male', value: 'male' },
        { label: 'Female', value: 'female' },
      ],
    },
    width: '20%',
  },
  {
    title: 'Email',
    dataIndex: 'email',
  },
];

const App: React.FC = () => (
  <Table<DataType>
    columns={columns}
    rowKey={(record) => record.login.uuid}
    request={fetchDataWithPagination}
  />
);

export default App;
