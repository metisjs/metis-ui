import React, { useState } from 'react';
import type { TableColumnsType, TableProps } from 'metis-ui';
import { Button, Space, Table } from 'metis-ui';

type OnChange = NonNullable<TableProps<DataType>['onChange']>;
type Filters = Parameters<OnChange>[1];

type GetSingle<T> = T extends (infer U)[] ? U : never;
type Sorts = GetSingle<Parameters<OnChange>[2]>;

interface DataType {
  key: string;
  name: string;
  age: number;
  address: string;
}

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

const App: React.FC = () => {
  const [filteredInfo, setFilteredInfo] = useState<Filters>({});
  const [sortedInfo, setSortedInfo] = useState<Sorts>({});

  const handleChange: OnChange = (pagination, filters, sorter) => {
    console.log('Various parameters', pagination, filters, sorter);
    setFilteredInfo(filters);
    setSortedInfo(sorter as Sorts);
  };

  const clearFilters = () => {
    setFilteredInfo({});
  };

  const clearAll = () => {
    setFilteredInfo({});
    setSortedInfo({});
  };

  const setAgeSort = () => {
    setSortedInfo({
      order: 'descend',
      columnKey: 'age',
    });
  };

  const columns: TableColumnsType<DataType> = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      filter: {
        items: [
          { label: 'Joe', value: 'Joe' },
          { label: 'Jim', value: 'Jim' },
        ],
        value: filteredInfo.name || null,
        onFilter: (value, record) => (value as string[]).some((v) => record.name.includes(v)),
      },
      sorter: {
        compare: (a, b) => a.name.length - b.name.length,
        order: sortedInfo.columnKey === 'name' ? sortedInfo.order : null,
      },
      ellipsis: true,
    },
    {
      title: 'Age',
      dataIndex: 'age',
      key: 'age',
      sorter: {
        compare: (a, b) => a.age - b.age,
        order: sortedInfo.columnKey === 'age' ? sortedInfo.order : null,
      },
      ellipsis: true,
    },
    {
      title: 'Address',
      dataIndex: 'address',
      key: 'address',
      filter: {
        items: [
          { label: 'London', value: 'London' },
          { label: 'New York', value: 'New York' },
        ],
        value: filteredInfo.address || null,
        onFilter: (value, record) => (value as string[]).some((v) => record.address.includes(v)),
      },
      sorter: {
        compare: (a, b) => a.address.length - b.address.length,
        order: sortedInfo.columnKey === 'address' ? sortedInfo.order : null,
      },
      ellipsis: true,
    },
  ];

  return (
    <>
      <Space className="mb-4">
        <Button onClick={setAgeSort}>Sort age</Button>
        <Button onClick={clearFilters}>Clear filters</Button>
        <Button onClick={clearAll}>Clear filters and sorters</Button>
      </Space>
      <Table columns={columns} dataSource={data} onChange={handleChange} />
    </>
  );
};

export default App;
