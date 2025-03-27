import { useContext } from '@rc-component/context';
import type { AnyObject } from '@util/type';
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
  | 'rowExpandable'
  | 'indentSize'
  | 'expandIcon'
  | 'expandedRowRender'
  | 'expandIconColumnIndex'
  | 'expandedKeys'
  | 'childrenColumnName'
  | 'onRow'
  | 'selectedRowKeys'
  | 'editingRowKey'
>;

export default function useRowInfo<RecordType extends AnyObject>(
  record: RecordType,
  rowKey: Key,
  recordIndex: number,
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
      onClick,
    },
  };
}
