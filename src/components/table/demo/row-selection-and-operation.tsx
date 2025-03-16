import React from 'react';
import type { TableColumnsType, TableProps } from 'metis-ui';
import { Button, Space, Table } from 'metis-ui';

type TableRowSelection<T extends object = object> = TableProps<T>['rowSelection'];

interface DataType {
  key: React.Key;
  name: string;
  age: number;
  address: string;
}

const columns: TableColumnsType<DataType> = [
  { title: 'Name', dataIndex: 'name' },
  { title: 'Age', dataIndex: 'age' },
  { title: 'Address', dataIndex: 'address' },
];

const dataSource = Array.from<DataType>({ length: 46 }).map<DataType>((_, i) => ({
  key: i,
  name: `Edward King ${i}`,
  age: 32,
  address: `London, Park Lane no. ${i}`,
}));

const App: React.FC = () => {
  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    console.log('selectedRowKeys changed: ', newSelectedRowKeys);
  };

  const rowSelection: TableRowSelection<DataType> = {
    onChange: onSelectChange,
    optionRender: ({ selectedRowKeys, clearSelected }) => (
      <Space size={8}>
        <Button size="mini" onClick={clearSelected}>
          Clear all
        </Button>
        <Button size="mini">Delete {selectedRowKeys.length} items</Button>
      </Space>
    ),
  };

  return (
    <Space size="middle" vertical block>
      <Table<DataType> rowSelection={rowSelection} columns={columns} dataSource={dataSource} />
    </Space>
  );
};

export default App;
