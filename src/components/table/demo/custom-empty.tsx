import React, { useState } from 'react';
import type { GetProp } from 'metis-ui';
import { Button, ConfigProvider, Empty, Table } from 'metis-ui';

interface DataType {
  key: number;
  name: string;
  age: number;
  address: string;
}

const genFakeData = (count = 5) =>
  Array.from({ length: count }).map<DataType>((_, index) => ({
    key: index,
    name: `Edward King ${index}`,
    age: 32 + index,
    address: `London, Park Lane no. ${index}`,
  }));

const renderEmpty: GetProp<typeof ConfigProvider, 'renderEmpty'> = (componentName) => {
  if (componentName === 'Table.filter') {
    return <Empty description="No Filter(Custom)" />;
  }
};

function App() {
  const [dataSource, setDataSource] = useState<DataType[]>(genFakeData);

  const handleToggle = () => {
    setDataSource(dataSource.length ? [] : genFakeData(Math.floor(Math.random() * 10)));
  };

  const columns: GetProp<typeof Table<DataType>, 'columns'> = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Age',
      dataIndex: 'age',
      key: 'age',
      filter: {
        items: dataSource.length
          ? [
              { label: '>=35', value: 'gte35' },
              { label: '<18', value: 'lt18' },
            ]
          : [],
      },
    },
    {
      title: 'Address',
      dataIndex: 'address',
      key: 'address',
    },
  ];

  const toggleButton = (
    <Button type="primary" onClick={handleToggle}>
      Toggle Data
    </Button>
  );

  return (
    <ConfigProvider renderEmpty={renderEmpty}>
      {dataSource.length ? toggleButton : null}
      <div className="my-2" />
      <Table
        verticalLine
        dataSource={dataSource}
        columns={columns}
        locale={{ emptyText: <Empty description="No Data">{toggleButton}</Empty> }}
      />
    </ConfigProvider>
  );
}

export default App;
