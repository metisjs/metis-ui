import React from 'react';
import { Table, TableProps } from 'metis-ui';

interface DataType {
  key: number;
  status: string | number;
  avatar: string;
  progress: number;
  money: number;
  rate: number;
  createdAt: number;
}

const statusEnum = {
  running: { label: 'Running', status: 'processing' },
  online: { label: 'Online', status: 'success' },
  error: { label: 'Error', status: 'error' },
} as const;

const columns: TableProps<DataType>['columns'] = [
  {
    title: 'Index',
    dataIndex: 'index',
    valueType: 'indexBorder',
  },
  {
    title: 'Avatar',
    dataIndex: 'avatar',
    valueType: 'avatar',
  },
  {
    title: 'Tag',
    dataIndex: 'status',
    valueType: 'tag',
    valueEnum: statusEnum,
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
    title: 'Rate',
    dataIndex: 'rate',
    valueType: 'rate',
  },
  {
    title: 'FromNow',
    dataIndex: 'createdAt',
    valueType: 'fromNow',
  },
];

const tableData: DataType[] = [
  {
    key: 1,
    avatar:
      'https://gw.alipayobjects.com/zos/antfincdn/efFD%24IOql2/weixintupian_20170331104822.jpg',
    status: 'running',
    money: 1000,
    progress: 50,
    rate: 3,
    createdAt: Date.now() - 1000 * 60 * 60 * 24,
  },
  {
    key: 2,
    avatar:
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    status: 'online',
    money: 1600,
    progress: 35,
    rate: 4,
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 24,
  },
];

const ComponentsBlock: React.FC = () => {
  return (
    <div className="flex flex-col gap-6">
      <Table<DataType> columns={columns} dataSource={tableData} pagination={false} />
    </div>
  );
};

export default ComponentsBlock;
