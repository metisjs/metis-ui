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
          label: 'Jim',
          value: 'Jim',
        },
        {
          label: 'Submenu',
          value: 'Submenu',
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
      onFilter: (value, record) => (value as string[]).some((v) => record.name.indexOf(v) === 0),
    },
    sorter: {
      compare: (a, b) => a.name.length - b.name.length,
      directions: ['descend'],
      showTooltip: { target: 'full-header' },
    },
  },
  {
    title: 'Age',
    dataIndex: 'age',
    sorter: { compare: (a, b) => a.age - b.age, defaultOrder: 'descend' },
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
      onFilter: (value, record) => (value as string[]).some((v) => record.address.indexOf(v) === 0),
    },
  },
];

const data = [
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
  <Table
    columns={columns}
    dataSource={data}
    onChange={onChange}
    showSorterTooltip={{ target: 'sorter-icon' }}
  />
);

export default App;
