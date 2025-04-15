import React, { useState } from 'react';
import type { TableProps } from 'metis-ui';
import { Radio, Table } from 'metis-ui';

type ColumnsType<T extends object> = TableProps<T>['columns'];
type TablePagination<T extends object> = NonNullable<Exclude<TableProps<T>['pagination'], boolean>>;
type TablePaginationPosition<T extends object> = NonNullable<
  TablePagination<T>['position']
>[number];

interface DataType {
  key: string;
  name: string;
  age: number;
  address: string;
  tags: string[];
}

const topOptions = [
  { label: 'topLeft', value: 'topLeft' },
  { label: 'topCenter', value: 'topCenter' },
  { label: 'topRight', value: 'topRight' },
  { label: 'none', value: 'none' },
];

const bottomOptions = [
  { label: 'bottomLeft', value: 'bottomLeft' },
  { label: 'bottomCenter', value: 'bottomCenter' },
  { label: 'bottomRight', value: 'bottomRight' },
  { label: 'none', value: 'none' },
];

const columns: ColumnsType<DataType> = [
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
    render: (text) => <a>{text}</a>,
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

const App: React.FC = () => {
  const [top, setTop] = useState<TablePaginationPosition<DataType>>('topLeft');
  const [bottom, setBottom] = useState<TablePaginationPosition<DataType>>('bottomRight');
  return (
    <div>
      <div>
        <Radio.Group
          style={{ marginBottom: 10 }}
          options={topOptions}
          value={top}
          onChange={setTop}
        />
      </div>
      <Radio.Group
        style={{ marginBottom: 10 }}
        options={bottomOptions}
        value={bottom}
        onChange={setBottom}
      />
      <Table<DataType>
        columns={columns}
        pagination={{ position: [top, bottom] }}
        dataSource={data}
      />
    </div>
  );
};

export default App;
