import React from 'react';
import { Space, Table } from 'metis-ui';
import type { TableColumnsType } from 'metis-ui';

interface DataType {
  key: string;
  name: string;
  borrow: number;
  repayment: number;
}

interface FixedDataType {
  key: React.Key;
  name: string;
  description: string;
}

const columns: TableColumnsType<DataType> = [
  {
    title: 'Name',
    dataIndex: 'name',
  },
  {
    title: 'Borrow',
    dataIndex: 'borrow',
  },
  {
    title: 'Repayment',
    dataIndex: 'repayment',
  },
];

const dataSource: DataType[] = [
  {
    key: '1',
    name: 'John Brown',
    borrow: 10,
    repayment: 33,
  },
  {
    key: '2',
    name: 'Jim Green',
    borrow: 100,
    repayment: 0,
  },
  {
    key: '3',
    name: 'Joe Black',
    borrow: 10,
    repayment: 10,
  },
  {
    key: '4',
    name: 'Jim Red',
    borrow: 75,
    repayment: 45,
  },
];

const fixedColumns: TableColumnsType<FixedDataType> = [
  {
    title: 'Name',
    dataIndex: 'name',
    fixed: true,
    width: 100,
  },
  {
    title: 'Description',
    dataIndex: 'description',
  },
];

const fixedDataSource = Array.from({ length: 20 }).map<FixedDataType>((_, i) => ({
  key: i,
  name: ['Light', 'Bamboo', 'Little'][i % 3],
  description: 'Everything that has a beginning, has an end.',
}));

const App: React.FC = () => (
  <Space block vertical size="large">
    <Table<DataType>
      verticalLine
      columns={columns}
      dataSource={dataSource}
      pagination={false}
      summary={(pageData) => {
        let totalBorrow = 0;
        let totalRepayment = 0;
        pageData.forEach(({ borrow, repayment }) => {
          totalBorrow += borrow;
          totalRepayment += repayment;
        });
        return (
          <>
            <Table.Summary.Row index={0}>
              <Table.Summary.Cell index={0}>Total</Table.Summary.Cell>
              <Table.Summary.Cell index={1}>
                <span className="text-error">{totalBorrow}</span>
              </Table.Summary.Cell>
              <Table.Summary.Cell index={2}>
                <span>{totalRepayment}</span>
              </Table.Summary.Cell>
            </Table.Summary.Row>
            <Table.Summary.Row index={1}>
              <Table.Summary.Cell index={0}>Balance</Table.Summary.Cell>
              <Table.Summary.Cell index={1} colSpan={2}>
                <span className="text-error">{totalBorrow - totalRepayment}</span>
              </Table.Summary.Cell>
            </Table.Summary.Row>
          </>
        );
      }}
    />
    <Table<FixedDataType>
      columns={fixedColumns}
      dataSource={fixedDataSource}
      pagination={false}
      scroll={{ x: 2000, y: 500 }}
      verticalLine
      summary={() => (
        <Table.Summary fixed>
          <Table.Summary.Row index={0}>
            <Table.Summary.Cell index={0}>Summary</Table.Summary.Cell>
            <Table.Summary.Cell index={1}>This is a summary content</Table.Summary.Cell>
          </Table.Summary.Row>
        </Table.Summary>
      )}
    />
  </Space>
);

export default App;
