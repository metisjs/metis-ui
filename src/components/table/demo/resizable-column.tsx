import React, { useState } from 'react';
import { Table } from 'metis-ui';
import type { TableColumnsType, TableColumnType } from 'metis-ui';
import type { ResizeCallbackData } from 'react-resizable';
import { Resizable } from 'react-resizable';

interface DataType {
  key: React.Key;
  date: string;
  amount: number;
  type: string;
  note: string;
}

interface TitlePropsType {
  width: number;
  onResize: (e: React.SyntheticEvent<Element>, data: ResizeCallbackData) => void;
}

const ResizableTitle: React.FC<Readonly<React.HTMLAttributes<any> & TitlePropsType>> = (props) => {
  const { onResize, width, ...restProps } = props;

  if (!width) {
    return <th {...restProps} />;
  }

  return (
    <Resizable
      className="relative bg-clip-padding"
      width={width}
      height={0}
      handle={
        <span
          className="absolute -end-[5px] bottom-0 z-1 h-full w-[10px] cursor-col-resize"
          onClick={(e) => e.stopPropagation()}
        />
      }
      onResize={onResize}
      draggableOpts={{ enableUserSelectHack: false }}
    >
      <th {...restProps} />
    </Resizable>
  );
};

const data: DataType[] = [
  {
    key: 0,
    date: '2018-02-11',
    amount: 120,
    type: 'income',
    note: 'transfer',
  },
  {
    key: 1,
    date: '2018-03-11',
    amount: 243,
    type: 'income',
    note: 'transfer',
  },
  {
    key: 2,
    date: '2018-04-11',
    amount: 98,
    type: 'income',
    note: 'transfer',
  },
];

const App: React.FC = () => {
  const [columns, setColumns] = useState<TableColumnsType<DataType>>([
    {
      title: 'Date',
      dataIndex: 'date',
      width: 200,
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      width: 100,
      sorter: { compare: (a, b) => a.amount - b.amount },
    },
    {
      title: 'Type',
      dataIndex: 'type',
      width: 100,
    },
    {
      title: 'Note',
      dataIndex: 'note',
      width: 100,
    },
    {
      title: 'Action',
      key: 'action',
      valueType: 'action',
      render: () => [<a key="del">Delete</a>],
    },
  ]);

  const handleResize =
    (index: number) =>
    (_: React.SyntheticEvent<Element>, { size }: ResizeCallbackData) => {
      const newColumns = [...columns];
      newColumns[index] = {
        ...newColumns[index],
        width: size.width,
      };
      setColumns(newColumns);
    };

  const mergedColumns = columns.map<TableColumnType<DataType>>((col, index) => ({
    ...col,
    onHeaderCell: (column) => ({
      width: 'width' in column ? column.width : undefined,
      onResize: handleResize(index) as React.ReactEventHandler<any>,
    }),
  }));

  return (
    <Table
      verticalLine
      components={{ header: { cell: ResizableTitle } }}
      columns={mergedColumns}
      dataSource={data}
    />
  );
};

export default App;
