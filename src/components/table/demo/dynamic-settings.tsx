import React, { useState } from 'react';
import type { GetProp, TableProps } from 'metis-ui';
import { Form, Radio, Switch, Table } from 'metis-ui';

type SizeType = TableProps['size'];
type ColumnsType<T extends object> = GetProp<TableProps<T>, 'columns'>;
type TablePagination<T extends object> = NonNullable<Exclude<TableProps<T>['pagination'], boolean>>;
type TablePaginationPosition = NonNullable<TablePagination<any>['position']>[number];
type ExpandableConfig<T extends object> = TableProps<T>['expandable'];
type TableRowSelection<T extends object> = TableProps<T>['rowSelection'];

interface DataType {
  key: number;
  name: string;
  age: number;
  address: string;
  description: string;
}

const columns: ColumnsType<DataType> = [
  {
    title: 'Name',
    dataIndex: 'name',
  },
  {
    title: 'Age',
    dataIndex: 'age',
    sorter: { compare: (a, b) => a.age - b.age },
  },
  {
    title: 'Address',
    dataIndex: 'address',
    filter: {
      items: [
        {
          label: 'London',
          value: 'London',
        },
        {
          label: 'New York',
          value: 'New York',
        },
      ],
      onFilter: (value, record) => record.address.indexOf(value as string) === 0,
    },
  },
  {
    title: 'Action',
    key: 'action',
    valueType: 'action',
    render: () => [<a key="del">Delete</a>, <a key="more">More actions</a>],
    sorter: true,
  },
];

const data = Array.from({ length: 10 }).map<DataType>((_, i) => ({
  key: i,
  name: 'John Brown',
  age: Number(`${i}2`),
  address: `New York No. ${i} Lake Park`,
  description: `My name is John Brown, I am ${i}2 years old, living in New York No. ${i} Lake Park.`,
}));

const defaultExpandable: ExpandableConfig<DataType> = {
  expandedRowRender: (record: DataType) => <p>{record.description}</p>,
};

const App: React.FC = () => {
  const [verticalLine, setVerticalLine] = useState(false);
  const [loading, setLoading] = useState(false);
  const [size, setSize] = useState<SizeType>('default');
  const [expandable, setExpandable] = useState<ExpandableConfig<DataType>>(defaultExpandable);
  const [showHeader, setShowHeader] = useState(true);
  const [rowSelection, setRowSelection] = useState<TableRowSelection<DataType> | undefined>({});
  const [hasData, setHasData] = useState(true);
  const [tableLayout, setTableLayout] = useState<string>('unset');
  const [top, setTop] = useState<TablePaginationPosition>('none');
  const [bottom, setBottom] = useState<TablePaginationPosition>('bottomRight');
  const [ellipsis, setEllipsis] = useState(false);
  const [yScroll, setYScroll] = useState(false);
  const [xScroll, setXScroll] = useState<string>('unset');

  const handleExpandChange = (enable: boolean) => {
    setExpandable(enable ? defaultExpandable : undefined);
  };

  const handleRowSelectionChange = (enable: boolean) => {
    setRowSelection(enable ? {} : undefined);
  };

  const scroll: { x?: number | string; y?: number | string } = {};
  if (yScroll) {
    scroll.y = 240;
  }
  if (xScroll !== 'unset') {
    scroll.x = '100vw';
  }

  const tableColumns = columns.map((item) => ({ ...item, ellipsis }));
  if (xScroll === 'fixed') {
    tableColumns[0].fixed = true;
    tableColumns[tableColumns.length - 1].fixed = 'right';
  }

  console.log(expandable);

  const tableProps: TableProps<DataType> = {
    verticalLine,
    loading,
    size,
    expandable,
    showHeader,
    rowSelection,
    scroll,
    tableLayout: tableLayout === 'unset' ? undefined : (tableLayout as TableProps['tableLayout']),
  };

  return (
    <>
      <Form layout="inline" className={{ root: 'mb-4 gap-x-4', item: 'mb-1' }}>
        <Form.Item label="VerticalLine">
          <Switch checked={verticalLine} onChange={setVerticalLine} />
        </Form.Item>
        <Form.Item label="loading">
          <Switch checked={loading} onChange={setLoading} />
        </Form.Item>
        <Form.Item label="Column Header">
          <Switch checked={showHeader} onChange={setShowHeader} />
        </Form.Item>
        <Form.Item label="Expandable">
          <Switch checked={!!expandable} onChange={handleExpandChange} />
        </Form.Item>
        <Form.Item label="Checkbox">
          <Switch checked={!!rowSelection} onChange={handleRowSelectionChange} />
        </Form.Item>
        <Form.Item label="Fixed Header">
          <Switch checked={!!yScroll} onChange={setYScroll} />
        </Form.Item>
        <Form.Item label="Has Data">
          <Switch checked={!!hasData} onChange={setHasData} />
        </Form.Item>
        <Form.Item label="Ellipsis">
          <Switch checked={!!ellipsis} onChange={setEllipsis} />
        </Form.Item>
        <Form.Item label="Size">
          <Radio.Group
            options={[
              {
                value: 'default',
                label: 'Default',
              },
              {
                value: 'middle',
                label: 'Middle',
              },
              {
                value: 'small',
                label: 'Small',
              },
            ]}
            value={size}
            onChange={setSize}
          ></Radio.Group>
        </Form.Item>
        <Form.Item label="Table Scroll">
          <Radio.Group
            options={[
              {
                value: 'unset',
                label: 'Unset',
              },
              {
                value: 'scroll',
                label: 'Scroll',
              },
              {
                value: 'fixed',
                label: 'Fixed Columns',
              },
            ]}
            value={xScroll}
            onChange={setXScroll}
          ></Radio.Group>
        </Form.Item>
        <Form.Item label="Table Layout">
          <Radio.Group
            options={[
              {
                value: 'unset',
                label: 'Unset',
              },
              {
                value: 'fixed',
                label: 'Fixed',
              },
            ]}
            value={tableLayout}
            onChange={setTableLayout}
          ></Radio.Group>
        </Form.Item>
        <Form.Item label="Pagination Top">
          <Radio.Group
            options={[
              {
                value: 'topLeft',
                label: 'TopLeft',
              },
              {
                value: 'topCenter',
                label: 'TopCenter',
              },
              {
                value: 'topRight',
                label: 'TopRight',
              },
              {
                value: 'none',
                label: 'None',
              },
            ]}
            value={top}
            onChange={setTop}
          ></Radio.Group>
        </Form.Item>
        <Form.Item label="Pagination Bottom">
          <Radio.Group
            options={[
              {
                value: 'bottomLeft',
                label: 'BottomLeft',
              },
              {
                value: 'bottomCenter',
                label: 'BottomCenter',
              },
              {
                value: 'bottomRight',
                label: 'BottomRight',
              },
              {
                value: 'none',
                label: 'None',
              },
            ]}
            value={bottom}
            onChange={setBottom}
          ></Radio.Group>
        </Form.Item>
      </Form>
      <Table<DataType>
        {...tableProps}
        pagination={{ position: [top, bottom] }}
        columns={tableColumns}
        dataSource={hasData ? data : []}
        scroll={scroll}
      />
    </>
  );
};

export default App;
