import React from 'react';
import type { TableProps } from 'metis-ui';
import { Table } from 'metis-ui';

interface DataType {
  key: number;
  name: string;
  age: number;
  address: string;
}

const waitTime = (time: number = 100) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, time);
  });
};

const data = Array.from({ length: 100 }).map<DataType>((_, i) => ({
  key: i,
  name: `Edward ${i}`,
  age: 32,
  address: `London Park no. ${i}`,
}));

const columns: TableProps<DataType>['columns'] = [
  {
    title: 'Name',
    dataIndex: 'name',
    editable: (_, __, index) => {
      if (index === 0) {
        return false;
      }
      return { rules: index > 1 ? [{ required: true }] : [] };
    },
    width: '15%',
  },
  {
    title: 'State',
    dataIndex: 'state',
    valueType: 'select',
    valueEnum: {
      all: { label: 'All', status: 'default' },
      open: {
        label: 'Open',
        status: 'error',
      },
      closed: {
        label: 'Closed',
        status: 'success',
      },
    },
  },
  {
    title: 'Description',
    dataIndex: 'decs',
    valueType: { type: 'text' },
    editable: (form) => {
      if (form.getFieldValue('title') === '不好玩') {
        return {
          editorProps: { disabled: true },
        };
      }
      return true;
    },
  },
  {
    title: '活动时间',
    dataIndex: 'createdAt',
    valueType: 'date',
  },
  {
    title: 'Action',
    dataIndex: 'action',
    valueType: 'action',
    render: (_, __, ___, action) => [
      <a key="edit" onClick={() => action.startEdit()}>
        Edit
      </a>,
      <a key="delete">Delete</a>,
    ],
    width: 160,
  },
];

const App: React.FC = () => (
  <Table<DataType>
    dataSource={data}
    columns={columns}
    editable={{
      onSave: async (record) => {
        console.log(record);
        await waitTime(2000);
      },
    }}
  />
);

export default App;
