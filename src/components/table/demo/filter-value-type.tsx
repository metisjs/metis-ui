import React from 'react';
import type { TableProps } from 'metis-ui';
import { Table } from 'metis-ui';

interface DataType {
  key: number;
  text: string;
  status: string | number;
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
    valueType: 'indexBorder',
    fixed: 'left',
  },
  {
    title: 'Text',
    dataIndex: 'text',
    filter: true,
    width: 200,
  },
  {
    key: 'status',
    title: 'Tag',
    dataIndex: 'status',
    valueType: 'tag',
    valueEnum: statusEnum,
    filter: true,
  },
  {
    key: 'select',
    title: 'Select',
    dataIndex: 'status',
    valueType: 'select',
    valueEnum: statusEnum,
    filter: true,
  },
  {
    key: 'radio',
    title: 'Radio',
    dataIndex: 'status',
    valueType: 'radio',
    valueEnum: statusEnum,
    filter: true,
  },
  {
    key: 'checkbox',
    title: 'Checkbox',
    dataIndex: 'status',
    valueType: 'checkbox',
    valueEnum: statusEnum,
    filter: true,
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
    filter: true,
  },
  {
    title: 'Progress',
    dataIndex: 'progress',
    valueType: 'progress',
    width: 200,
    filter: true,
  },
  {
    key: 'money',
    title: 'Money',
    dataIndex: 'money',
    valueType: 'money',
    filter: true,
  },
  {
    key: 'digit',
    title: 'Digit',
    dataIndex: 'money',
    valueType: 'digit',
    filter: true,
  },
  {
    title: 'Percent',
    dataIndex: 'percent',
    valueType: 'percent',
    filter: true,
  },
  {
    title: 'Rate',
    dataIndex: 'rate',
    valueType: 'rate',
    filter: true,
  },
  {
    key: 'date',
    title: 'Date',
    dataIndex: 'createdAt',
    valueType: 'date',
    filter: true,
  },
  {
    key: 'fromNow',
    title: 'FromNow',
    dataIndex: 'createdAt',
    valueType: 'fromNow',
    filter: true,
  },
  {
    key: 'dateTime',
    title: 'DateTime',
    dataIndex: 'createdAt',
    valueType: 'dateTime',
    filter: true,
  },
  {
    key: 'dateRange',
    title: 'DateRange',
    dataIndex: 'createdAtRange',
    valueType: 'dateRange',
    filter: true,
  },
  {
    key: 'dateTimeRange',
    title: 'DateTimeRange',
    dataIndex: 'createdAtRange',
    valueType: 'dateTimeRange',
    filter: true,
  },
  {
    key: 'time',
    title: 'Time',
    dataIndex: 'updatedAt',
    valueType: 'time',
    filter: true,
  },
  {
    title: 'TimeRange',
    dataIndex: 'createdAtRange',
    valueType: 'timeRange',
    filter: true,
  },
];

const data: DataType[] = [];

for (let i = 0; i < 100; i += 1) {
  data.push({
    key: i,
    text: `T${i}E${i}X${i}T`,
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
    onChange={(_, filters, __) => {
      console.log(filters);
    }}
    scroll={{ x: 'max-content' }}
  />
);

export default App;
