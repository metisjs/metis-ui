import React from 'react';
import { Table } from 'metis-ui';
import type { TableColumnsType, TableProps } from 'metis-ui';

interface DataType {
  key: React.Key;
  name: string;
  age: number;
  address: string;
}

const columns: TableColumnsType<DataType> = [
  {
    title: 'Name',
    dataIndex: 'name',
    filter: {
      items: [
        {
          label: 'Joe',
          value: 'Joe',
        },
        {
          label: 'Category 1',
          value: 'Category 1',
          children: [
            {
              label: 'Yellow',
              value: 'Yellow',
            },
            {
              label: 'Pink',
              value: 'Pink',
            },
          ],
        },
        {
          label: 'Category 2',
          value: 'Category 2',
          children: [
            {
              label: 'Green',
              value: 'Green',
            },
            {
              label: 'Black',
              value: 'Black',
            },
          ],
        },
      ],
      mode: 'tree',
      search: true,
      onFilter: (value, record) => record.name.includes(value as string),
    },
    width: '30%',
  },
  {
    title: 'Age',
    dataIndex: 'age',
    sorter: { compare: (a, b) => a.age - b.age },
  },
  {
    title: 'Address',
    dataIndex: 'address',
    filter: {
      items: [
        {
          label: 'London',
          value: 'London',
        },
        {
          label: 'New York',
          value: 'New York',
        },
      ],
      onFilter: (value, record) => record.address.startsWith(value as string),
      search: true,
    },
    width: '40%',
  },
];

const data: DataType[] = [
  {
    key: '1',
    name: 'John Brown',
    age: 32,
    address: 'New York No. 1 Lake Park',
  },
  {
    key: '2',
    name: 'Jim Green',
    age: 42,
    address: 'London No. 1 Lake Park',
  },
  {
    key: '3',
    name: 'Joe Black',
    age: 32,
    address: 'Sydney No. 1 Lake Park',
  },
  {
    key: '4',
    name: 'Jim Red',
    age: 32,
    address: 'London No. 2 Lake Park',
  },
];

const onChange: TableProps<DataType>['onChange'] = (pagination, filters, sorter, extra) => {
  console.log('params', pagination, filters, sorter, extra);
};

const App: React.FC = () => (
  <Table<DataType> columns={columns} dataSource={data} onChange={onChange} />
);

export default App;
