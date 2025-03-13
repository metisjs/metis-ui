import { useContext } from '@rc-component/context';
import type { AnyObject } from '@util/type';
import classNames from 'classnames';
import { useEvent } from 'rc-util';
import type { TableContextProps } from '../context/TableContext';
import TableContext from '../context/TableContext';
import type { Key } from '../interface';
import { getColumnsKey } from '../utils/valueUtil';

type ContextValues<RecordType extends AnyObject> = Pick<
  TableContextProps<RecordType>,
  | 'prefixCls'
  | 'fixedInfoList'
  | 'flattenColumns'
  | 'expandableType'
  | 'expandRowByClick'
  | 'onTriggerExpand'
  | 'rowClassName'
  | 'rowExpandable'
  | 'expandedRowClassName'
  | 'indentSize'
  | 'expandIcon'
  | 'expandedRowRender'
  | 'expandIconColumnIndex'
  | 'expandedKeys'
  | 'childrenColumnName'
  | 'onRow'
  | 'selectedRowKeys'
  | 'editingRowKey'
  | 'startEdit'
  | 'actionRender'
>;

export default function useRowInfo<RecordType extends AnyObject>(
  record: RecordType,
  rowKey: Key,
  recordIndex: number,
  indent: number,
): ContextValues<RecordType> & {
  selected: boolean;
  columnsKey: React.Key[];
  nestExpandable: boolean;
  expanded: boolean;
  hasNestChildren: boolean;
  record: RecordType;
  rowSupportExpand: boolean;
  expandable: boolean;
  rowProps: React.HTMLAttributes<any> & React.TdHTMLAttributes<any>;
} {
  const context = useContext(TableContext, [
    'prefixCls',
    'fixedInfoList',
    'flattenColumns',
    'expandableType',
    'expandRowByClick',
    'onTriggerExpand',
    'rowClassName',
    'expandedRowClassName',
    'indentSize',
    'expandIcon',
    'expandedRowRender',
    'expandIconColumnIndex',
    'expandedKeys',
    'childrenColumnName',
    'rowExpandable',
    'onRow',
    'selectedRowKeys',
    'editingRowKey',
    'startEdit',
    'actionRender',
  ]) as ContextValues<RecordType>;

  const {
    flattenColumns,
    expandableType,
    expandedKeys,
    childrenColumnName,
    onTriggerExpand,
    rowExpandable,
    onRow,
    expandRowByClick,
    rowClassName,
    selectedRowKeys,
  } = context;

  // ======================= Expandable =======================
  // Only when row is not expandable and `children` exist in record
  const nestExpandable = expandableType === 'nest';

  const rowSupportExpand = expandableType === 'row' && (!rowExpandable || rowExpandable(record));
  const mergedExpandable = rowSupportExpand || nestExpandable;

  const expanded = expandedKeys && expandedKeys.has(rowKey);

  const hasNestChildren = !!childrenColumnName && !!record && !!record[childrenColumnName];

  const onInternalTriggerExpand = useEvent(onTriggerExpand);

  // ========================= onRow ==========================
  const rowProps = onRow?.(record, recordIndex);
  const onRowClick = rowProps?.onClick;

  const onClick: React.MouseEventHandler<HTMLElement> = (event, ...args) => {
    if (expandRowByClick && mergedExpandable) {
      onTriggerExpand(record, event);
    }

    onRowClick?.(event, ...args);
  };

  // ====================== RowClassName ======================
  let computeRowClassName: string | undefined;
  if (typeof rowClassName === 'string') {
    computeRowClassName = rowClassName;
  } else if (typeof rowClassName === 'function') {
    computeRowClassName = rowClassName(record, recordIndex, indent);
  }

  // ========================= Column =========================
  const columnsKey = getColumnsKey(flattenColumns);

  return {
    ...context,
    selected: !!selectedRowKeys?.has(rowKey),
    columnsKey,
    nestExpandable,
    expanded,
    hasNestChildren,
    record,
    onTriggerExpand: onInternalTriggerExpand,
    rowSupportExpand,
    expandable: mergedExpandable,
    rowProps: {
      ...rowProps,
      className: classNames(computeRowClassName, rowProps?.className),
      onClick,
    },
  };
}
