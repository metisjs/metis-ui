import * as React from 'react';
import type { AnyObject } from '@util/type';
import { devUseWarning } from '@util/warning';
import { EXPAND_COLUMN, INTERNAL_COL_DEFINE } from '../constant';
import type {
  ColumnsType,
  ExpandableConfig,
  ExpandableType,
  GetRowKey,
  Key,
  TriggerEventHandler,
} from '../interface';
import { findAllChildrenKeys, renderExpandIcon } from '../utils/expandUtil';

export default function useExpand<RecordType extends AnyObject>(
  prefixCls: string,
  expandable: ExpandableConfig<RecordType> = {},
  mergedData: readonly RecordType[],
  getRowKey: GetRowKey<RecordType>,
) {
  const warning = devUseWarning('Table');

  const expandableConfig = { ...expandable, indentSize: expandable.indentSize ?? 15 };
  if (expandableConfig.showExpandColumn === false) {
    expandableConfig.expandIconColumnIndex = -1;
  }

  const {
    fixed,
    columnTitle,
    expandRowByClick,
    columnWidth,
    rowExpandable,
    expandIcon,
    expandedRowKeys,
    defaultExpandedRowKeys,
    defaultExpandAllRows,
    expandedRowRender,
    onExpand,
    onExpandedRowsChange,
    childrenColumnName,
  } = expandableConfig;

  const mergedExpandIcon = expandIcon || renderExpandIcon;
  const mergedChildrenColumnName = childrenColumnName || ('children' as keyof RecordType);
  const expandableType = React.useMemo<ExpandableType>(() => {
    if (expandedRowRender) {
      return 'row';
    }
    if (
      mergedData.some(
        (record) => record && typeof record === 'object' && record[mergedChildrenColumnName],
      )
    ) {
      return 'nest';
    }
    return false;
  }, [!!expandedRowRender, mergedData]);

  const [innerExpandedKeys, setInnerExpandedKeys] = React.useState(() => {
    if (defaultExpandedRowKeys) {
      return defaultExpandedRowKeys;
    }
    if (defaultExpandAllRows) {
      return findAllChildrenKeys<RecordType>(mergedData, getRowKey, mergedChildrenColumnName);
    }
    return [];
  });
  const mergedExpandedKeys = React.useMemo(
    () => new Set(expandedRowKeys || innerExpandedKeys || []),
    [expandedRowKeys, innerExpandedKeys],
  );

  const onTriggerExpand: TriggerEventHandler<RecordType> = React.useCallback(
    (record: RecordType) => {
      const key = getRowKey(record, mergedData.indexOf(record));

      let newExpandedKeys: Key[];
      const hasKey = mergedExpandedKeys.has(key);
      if (hasKey) {
        mergedExpandedKeys.delete(key);
        newExpandedKeys = [...mergedExpandedKeys];
      } else {
        newExpandedKeys = [...mergedExpandedKeys, key];
      }

      setInnerExpandedKeys(newExpandedKeys);
      if (onExpand) {
        onExpand(!hasKey, record);
      }
      if (onExpandedRowsChange) {
        onExpandedRowsChange(newExpandedKeys);
      }
    },
    [getRowKey, mergedExpandedKeys, mergedData, onExpand, onExpandedRowsChange],
  );

  // Warning if use `expandedRowRender` and nest children in the same time
  if (
    process.env.NODE_ENV !== 'production' &&
    expandedRowRender &&
    mergedData.some((record: RecordType) => {
      return Array.isArray(record?.[mergedChildrenColumnName]);
    })
  ) {
    warning(false, 'usage', '`expandedRowRender` should not use with nested Table');
  }

  // ======================= Columns ========================
  const transformColumns = React.useCallback(
    (columns: ColumnsType<RecordType>): ColumnsType<RecordType> => {
      if (!!expandableConfig.expandedRowRender) {
        let cloneColumns = columns.slice();

        // >>> Insert expand column if not exist
        if (!cloneColumns.includes(EXPAND_COLUMN)) {
          cloneColumns.unshift(EXPAND_COLUMN);
        }

        // >>> Deduplicate additional expand column
        warning(
          cloneColumns.filter((c) => c === EXPAND_COLUMN).length <= 1,
          'usage',
          'There exist more than one `EXPAND_COLUMN` in `columns`.',
        );

        const expandColumnIndex = cloneColumns.indexOf(EXPAND_COLUMN);
        cloneColumns = cloneColumns.filter(
          (column, index) => column !== EXPAND_COLUMN || index === expandColumnIndex,
        );

        // >>> Check if expand column need to fixed
        const nextColumn = cloneColumns[expandColumnIndex + 1];

        let fixedColumn = fixed;
        if (!fixed && nextColumn?.fixed) {
          fixedColumn = nextColumn.fixed;
        }

        // >>> Create expandable column
        const expandColumn = {
          [INTERNAL_COL_DEFINE]: {
            className: `${prefixCls}-expand-icon-col`,
            columnType: 'EXPAND_COLUMN',
          },
          title: columnTitle,
          fixed: fixedColumn,
          className: `${prefixCls}-row-expand-icon-cell`,
          width: columnWidth,
          render: (_: any, record: RecordType, index: number) => {
            const rowKey = getRowKey(record, index);
            const expanded = mergedExpandedKeys.has(rowKey);
            const recordExpandable = rowExpandable?.(record) ?? true;

            const icon = mergedExpandIcon({
              prefixCls,
              expanded,
              expandable: recordExpandable,
              record,
              onExpand: onTriggerExpand,
            });

            if (expandRowByClick) {
              return <span onClick={(e) => e.stopPropagation()}>{icon}</span>;
            }
            return icon;
          },
        };

        return cloneColumns.map((col) => (col === EXPAND_COLUMN ? expandColumn : col));
      }

      warning(
        !columns.includes(EXPAND_COLUMN),
        'usage',
        '`expandable` is not config but there exist `EXPAND_COLUMN` in `columns`.',
      );

      return columns.filter((col) => col !== EXPAND_COLUMN);
    },
    [!!expandableConfig.expandedRowRender, getRowKey, mergedExpandedKeys, mergedExpandIcon],
  );

  return [
    transformColumns,
    expandableConfig,
    expandableType,
    mergedExpandedKeys,
    mergedExpandIcon,
    mergedChildrenColumnName,
    onTriggerExpand,
  ] as const;
}
