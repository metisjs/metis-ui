import React from 'react';
import type { TableProps } from 'metis-ui';
import { Table } from 'metis-ui';

interface DataType {
  key: number;
  status: string | number;
  avatar: string;
  image: string;
  cascader: string[];
  progress: number;
  money: number;
  percent: number | string;
  rate: number;
  updatedAt: number;
  createdAt: number;
  createdAtRange: number[];
}

const statusEnum = {
  all: { label: 'All', status: 'default' },
  running: { label: 'Running', status: 'processing' },
  online: { label: 'Online', status: 'success' },
  error: { label: 'Error', status: 'error' },
} as const;

const cascaderOptions = [
  {
    field: 'front end',
    value: 'fe',
    language: [
      {
        field: 'Javascript',
        value: 'js',
      },
      {
        field: 'Typescript',
        value: 'ts',
      },
    ],
  },
  {
    field: 'back end',
    value: 'be',
    language: [
      {
        field: 'Java',
        value: 'java',
      },
      {
        field: 'Go',
        value: 'go',
      },
    ],
  },
];

const columns: TableProps<DataType>['columns'] = [
  {
    title: 'Index',
    dataIndex: 'index',
    valueType: 'index',
  },
  {
    title: 'Border Index',
    dataIndex: 'index',
    valueType: 'indexBorder',
  },
  {
    title: 'Avatar',
    dataIndex: 'avatar',
    valueType: 'avatar',
  },
  {
    title: 'Image',
    dataIndex: 'image',
    valueType: 'image',
  },
  {
    title: 'Tag',
    dataIndex: 'status',
    valueType: 'tag',
    valueEnum: statusEnum,
  },
  {
    title: 'Select',
    dataIndex: 'status',
    valueType: 'select',
    valueEnum: statusEnum,
  },
  {
    title: 'Radio',
    dataIndex: 'status',
    valueType: 'radio',
    valueEnum: statusEnum,
  },
  {
    title: 'Checkbox',
    dataIndex: 'status',
    valueType: 'checkbox',
    valueEnum: statusEnum,
  },
  {
    title: 'Cascader',
    dataIndex: 'cascader',
    valueType: {
      type: 'cascader',
      options: cascaderOptions,
      fieldNames: {
        children: 'language',
        label: 'field',
      },
    },
  },
  {
    title: 'Progress',
    dataIndex: 'progress',
    valueType: (record) => ({
      type: 'progress',
      status: record.status !== 'error' ? 'active' : 'exception',
    }),
    width: 200,
  },
  {
    title: 'Money',
    dataIndex: 'money',
    valueType: 'money',
  },
  {
    title: 'Digit',
    dataIndex: 'money',
    valueType: 'digit',
  },
  {
    title: 'Percent',
    dataIndex: 'percent',
    valueType: 'percent',
  },
  {
    title: 'Rate',
    dataIndex: 'rate',
    valueType: 'rate',
  },
  {
    title: 'Date',
    dataIndex: 'createdAt',
    valueType: 'date',
  },
  {
    title: 'FromNow',
    dataIndex: 'createdAt',
    valueType: 'fromNow',
  },
  {
    title: 'DateTime',
    dataIndex: 'createdAt',
    valueType: 'dateTime',
  },
  {
    title: 'DateRange',
    dataIndex: 'createdAtRange',
    valueType: 'dateRange',
  },
  {
    title: 'DateTimeRange',
    dataIndex: 'createdAtRange',
    valueType: 'dateTimeRange',
  },
  {
    title: 'Time',
    dataIndex: 'updatedAt',
    valueType: 'time',
  },
  {
    title: 'TimeRange',
    dataIndex: 'createdAtRange',
    valueType: 'timeRange',
  },
  {
    title: 'Actions',
    key: 'action',
    valueType: 'action',
    fixed: 'right',
    render: (_, record, __, action) => [
      <a key="edit" onClick={() => action.startEdit(record.key)}>
        Edit
      </a>,
      <a key="delete">Delete</a>,
    ],
    width: 160,
  },
];

const data: DataType[] = [];

for (let i = 0; i < 2; i += 1) {
  data.push({
    key: i,
    avatar:
      'https://gw.alipayobjects.com/zos/antfincdn/efFD%24IOql2/weixintupian_20170331104822.jpg',
    image: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
    status: ['running', 'online', 'error'][Math.floor(Math.random() * 10) % 3],
    cascader: ['fe', 'js'],
    money: Math.floor(Math.random() * 2000) * i,
    progress: Math.ceil(Math.random() * 100) + 1,
    percent:
      Math.random() > 0.5
        ? ((i + 1) * 10 + Math.random()).toFixed(3)
        : -((i + 1) * 10 + Math.random()).toFixed(2),
    rate: Math.floor(Math.random() * 6),
    updatedAt: Date.now() - Math.floor(Math.random() * 1000),
    createdAt: Date.now() - Math.floor(Math.random() * 2000),
    createdAtRange: [
      Date.now() - Math.floor(Math.random() * 2000),
      Date.now() - Math.floor(Math.random() * 2000),
    ],
  });
}

const App: React.FC = () => (
  <Table<DataType>
    columns={columns}
    dataSource={data}
    editable={{
      onSave: (record) => {
        console.log(record);
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve(0);
          }, 2000);
        });
      },
    }}
    scroll={{ x: 'max-content' }}
  />
);

export default App;
