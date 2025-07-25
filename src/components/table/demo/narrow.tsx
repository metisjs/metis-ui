import React from 'react';
import { Table } from 'metis-ui';
import type { TableColumnsType } from 'metis-ui';

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
  },
  {
    title: 'Age',
    dataIndex: 'age',
  },
  {
    title: 'Address',
    dataIndex: 'address',
  },
];

const dataSource = Array.from({ length: 200 }).map<DataType>((_, key) => ({
  key,
  name: 'Sample Name',
  age: 30 + (key % 5),
  address: `Sample Address ${key}`,
}));

const App: React.FC = () => (
  <div className="w-75">
    <Table
      columns={columns}
      dataSource={dataSource}
      size="small"
      pagination={{ defaultCurrent: 13 }}
    />
  </div>
);

export default App;
