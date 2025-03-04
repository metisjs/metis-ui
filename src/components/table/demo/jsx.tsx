import React from 'react';
import { Table } from 'metis-ui';

const { Column, ColumnGroup } = Table;

interface DataType {
  key: React.Key;
  firstName: string;
  lastName: string;
  age: number;
  address: string;
  tags: string[];
}

const data: DataType[] = [
  {
    key: '1',
    firstName: 'John',
    lastName: 'Brown',
    age: 32,
    address: 'New York No. 1 Lake Park',
    tags: ['nice', 'developer'],
  },
  {
    key: '2',
    firstName: 'Jim',
    lastName: 'Green',
    age: 42,
    address: 'London No. 1 Lake Park',
    tags: ['loser'],
  },
  {
    key: '3',
    firstName: 'Joe',
    lastName: 'Black',
    age: 32,
    address: 'Sydney No. 1 Lake Park',
    tags: ['cool', 'teacher'],
  },
];

const App: React.FC = () => (
  <Table<DataType> dataSource={data}>
    <ColumnGroup title="Name">
      <Column title="First Name" dataIndex="firstName" key="firstName" />
      <Column title="Last Name" dataIndex="lastName" key="lastName" />
    </ColumnGroup>
    <Column title="Age" dataIndex="age" key="age" />
    <Column title="Address" dataIndex="address" key="address" />
    <Column<DataType>
      title="Tags"
      dataIndex="tags"
      key="tags"
      valueType="tag"
      valueEnum={{
        teacher: { label: 'Teacher', color: 'processing' },
        developer: { label: 'Developer', color: 'processing' },
        loser: { label: 'Loser', color: 'red' },
        cool: { label: 'Cool', color: 'green' },
        nice: { label: 'Nice', color: 'green' },
      }}
    />
    <Column<DataType>
      title="Action"
      key="action"
      valueType="action"
      render={(_, record) => [
        <a key="invite">Invite {record.lastName}</a>,
        <a key="del">Delete</a>,
      ]}
    />
  </Table>
);

export default App;
