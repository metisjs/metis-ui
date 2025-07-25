import React from 'react';
import { useLocale } from 'dumi';
import type { TableProps } from 'metis-ui';
import { Button, Table } from 'metis-ui';
import SemanticPreview from '../../../../.dumi/components/SemanticPreview';

interface DataType {
  key: string;
  name: string;
  age: number;
  address: string;
  tags: string[];
}

const columns: TableProps<DataType>['columns'] = [
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
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
    search: true,
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
  const { id } = useLocale();
  const localeSuffix = id === 'zh-CN' ? '-cn' : '';

  return (
    <SemanticPreview
      semantics={[
        { name: 'root' },
        { name: 'container' },
        {
          name: 'search',
          link: `/components/form${localeSuffix}#semantic-dom`,
          children: [{ name: 'actions' }, { name: 'collapse' }],
        },
        { name: 'extra' },
        {
          name: 'toolbar',
          children: [
            { name: 'title' },
            { name: 'search' },
            { name: 'actions' },
            { name: 'options' },
          ],
        },
        { name: 'table' },
        { name: 'thead' },
        { name: 'tbody' },
        { name: 'tfoot' },
        {
          name: 'row',
          args: [
            { name: 'record', type: 'RecordType' },
            { name: 'index', type: 'number' },
          ],
        },
        {
          name: 'expandedRow',
          args: [
            { name: 'record', type: 'RecordType' },
            { name: 'index', type: 'number' },
            { name: 'indent', type: 'number' },
          ],
        },
        {
          name: 'cell',
          args: [
            { name: 'rowType', type: 'header | body | footer' },
            { name: 'hovering', type: 'boolean' },
            { name: 'selected', type: 'boolean' },
            { name: 'fixed', type: 'left | right' },
            { name: 'pinned', type: 'boolean' },
            { name: 'lastRow', type: 'boolean' },
            { name: 'lastCell', type: 'boolean' },
          ],
        },
        { name: 'pagination', link: `/components/pagination${localeSuffix}#semantic-dom` },
      ]}
      rootArgs={[
        { name: 'scrollLeftShadow', type: 'boolean' },
        { name: 'scrollRightShadow', type: 'boolean' },
      ]}
    >
      <Table
        headerTitle="Users"
        columns={columns}
        dataSource={data}
        extraRender={() => <div>Extra Content</div>}
        search={{ items: [{ name: 'keyword', label: 'Keyword', span: 2, order: 0 }] }}
        toolbar={{
          search: true,
          actions: [
            <Button key="add" type="primary">
              Add
            </Button>,
          ],
          options: true,
        }}
        expandable={{
          defaultExpandedRowKeys: ['1'],
          expandedRowRender: () => <p className="m-0">Expandable content</p>,
        }}
        summary={() => (
          <>
            <Table.Summary.Row index={0}>
              <Table.Summary.Cell index={0} colSpan={6}>
                Summary
              </Table.Summary.Cell>
            </Table.Summary.Row>
          </>
        )}
      />
    </SemanticPreview>
  );
};

export default App;
