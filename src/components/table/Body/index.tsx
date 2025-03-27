import * as React from 'react';
import { useContext } from '@rc-component/context';
import { clsx } from '@util/classNameUtils';
import type { AnyObject } from '@util/type';
import TableContext, { responseImmutable } from '../context/TableContext';
import useFlattenRecords from '../hooks/useFlattenRecords';
import type { ExpandedRowSemanticClsType, RowSemanticClsType } from '../interface';
import { getColumnsKey } from '../utils/valueUtil';
import BodyRow from './BodyRow';
import ExpandedRow from './ExpandedRow';
import MeasureRow from './MeasureRow';

export interface BodyProps<RecordType extends AnyObject> {
  data: readonly RecordType[];
  measureColumnWidth: boolean;
  className?: string;
  expandedRowClassName?: ExpandedRowSemanticClsType<RecordType>;
  rowClassName?: RowSemanticClsType<RecordType>;
}

function Body<RecordType extends AnyObject>(props: BodyProps<RecordType>) {
  const { className, expandedRowClassName, rowClassName, data, measureColumnWidth } = props;

  const {
    prefixCls,
    getComponent,
    onColumnResize,
    flattenColumns,
    getRowKey,
    expandedKeys,
    childrenColumnName,
    emptyNode,
  } = useContext(TableContext, [
    'prefixCls',
    'getComponent',
    'onColumnResize',
    'flattenColumns',
    'getRowKey',
    'expandedKeys',
    'childrenColumnName',
    'emptyNode',
  ]);

  const flattenData: { record: RecordType; indent: number; index: number }[] =
    useFlattenRecords<RecordType>(data, childrenColumnName, expandedKeys, getRowKey);

  // ====================== Render ======================
  const WrapperComponent = getComponent(['body', 'wrapper'], 'tbody');
  const trComponent = getComponent(['body', 'row'], 'tr');
  const tdComponent = getComponent(['body', 'cell'], 'td');
  const thComponent = getComponent(['body', 'cell'], 'th');

  let rows: React.ReactNode;
  if (data.length) {
    const totalRowCount = flattenData.length;
    rows = flattenData.map((item, idx) => {
      const { record, indent, index: renderIndex } = item;

      const key = getRowKey(record, idx);

      return (
        <BodyRow
          key={key}
          className={rowClassName}
          expandedRowClassName={expandedRowClassName}
          rowKey={key}
          record={record}
          index={idx}
          renderIndex={renderIndex}
          rowComponent={trComponent}
          cellComponent={tdComponent}
          scopeCellComponent={thComponent}
          indent={indent}
          totalRowCount={totalRowCount}
        />
      );
    });
  } else {
    rows = (
      <ExpandedRow
        expanded
        className={`${prefixCls}-placeholder`}
        prefixCls={prefixCls}
        component={trComponent}
        cellComponent={tdComponent}
        colSpan={flattenColumns.length}
        isEmpty
      >
        {emptyNode}
      </ExpandedRow>
    );
  }

  const columnsKey = getColumnsKey(flattenColumns);

  return (
    <WrapperComponent className={clsx(`${prefixCls}-tbody`, className)}>
      {/* Measure body column width with additional hidden col */}
      {measureColumnWidth && (
        <MeasureRow prefixCls={prefixCls} columnsKey={columnsKey} onColumnResize={onColumnResize} />
      )}

      {rows}
    </WrapperComponent>
  );
}

if (process.env.NODE_ENV !== 'production') {
  Body.displayName = 'Body';
}

export default responseImmutable(Body);
