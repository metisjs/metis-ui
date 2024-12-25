import * as React from 'react';
import { devUseWarning } from '@util/warning';
import toArray from 'rc-util/lib/Children/toArray';
import { EXPAND_COLUMN } from '../../constant';
import type {
  ColumnGroupType,
  ColumnsType,
  ColumnType,
  FixedType,
  GetRowKey,
  Key,
  RenderExpandIcon,
  TriggerEventHandler,
} from '../../interface';
import { INTERNAL_COL_DEFINE } from '../../utils/legacyUtil';
import useWidthColumns from './useWidthColumns';

export function convertChildrenToColumns<RecordType>(
  children: React.ReactNode,
): ColumnsType<RecordType> {
  return toArray(children)
    .filter((node) => React.isValidElement(node))
    .map(({ key, props }: React.ReactElement) => {
      const { children: nodeChildren, ...restProps } = props;
      const column = {
        key,
        ...restProps,
      };

      if (nodeChildren) {
        column.children = convertChildrenToColumns(nodeChildren);
      }

      return column;
    });
}

function filterHiddenColumns<RecordType>(
  columns: ColumnsType<RecordType>,
): ColumnsType<RecordType> {
  return columns
    .filter((column) => column && typeof column === 'object' && !column.hidden)
    .map((column) => {
      const subColumns = (column as ColumnGroupType<RecordType>).children;

      if (subColumns && subColumns.length > 0) {
        return {
          ...column,
          children: filterHiddenColumns(subColumns),
        };
      }

      return column;
    });
}

function flatColumns<RecordType>(
  columns: ColumnsType<RecordType>,
  parentKey = 'key',
): ColumnType<RecordType>[] {
  return columns
    .filter((column) => column && typeof column === 'object')
    .reduce((list, column, index) => {
      const { fixed } = column;
      // Convert `fixed='true'` to `fixed='left'` instead
      const parsedFixed = fixed === true ? 'left' : fixed;
      const mergedKey = `${parentKey}-${index}`;

      const subColumns = (column as ColumnGroupType<RecordType>).children;
      if (subColumns && subColumns.length > 0) {
        return [
          ...list,
          ...flatColumns(subColumns, mergedKey).map((subColum) => ({
            fixed: parsedFixed,
            ...subColum,
          })),
        ];
      }
      return [
        ...list,
        {
          key: mergedKey,
          ...column,
          fixed: parsedFixed,
        },
      ];
    }, []);
}

/**
 * Parse `columns` & `children` into `columns`.
 */
function useColumns<RecordType>(
  {
    prefixCls,
    columns,
    children,
    expandable,
    expandedKeys,
    columnTitle,
    getRowKey,
    onTriggerExpand,
    expandIcon,
    rowExpandable,
    expandRowByClick,
    columnWidth,
    fixed,
    scrollWidth,
    clientWidth,
  }: {
    prefixCls: string;
    columns?: ColumnsType<RecordType>;
    children?: React.ReactNode;
    expandable: boolean;
    expandedKeys: Set<Key>;
    columnTitle?: React.ReactNode;
    getRowKey: GetRowKey<RecordType>;
    onTriggerExpand: TriggerEventHandler<RecordType>;
    expandIcon: RenderExpandIcon<RecordType>;
    rowExpandable?: (record: RecordType) => boolean;
    expandRowByClick?: boolean;
    columnWidth?: number | string;
    clientWidth: number;
    fixed?: FixedType;
    scrollWidth?: number;
  },
  transformColumns: (columns: ColumnsType<RecordType>) => ColumnsType<RecordType>,
): [
  columns: ColumnsType<RecordType>,
  flattenColumns: readonly ColumnType<RecordType>[],
  realScrollWidth: undefined | number,
  hasGapFixed: boolean,
] {
  const baseColumns = React.useMemo<ColumnsType<RecordType>>(() => {
    const newColumns = columns || convertChildrenToColumns(children) || [];

    return filterHiddenColumns(newColumns.slice());
  }, [columns, children]);

  // ========================== Expand ==========================
  const withExpandColumns = React.useMemo<ColumnsType<RecordType>>(() => {
    const warning = devUseWarning('Table');

    if (expandable) {
      let cloneColumns = baseColumns.slice();

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
          const expanded = expandedKeys.has(rowKey);
          const recordExpandable = rowExpandable ? rowExpandable(record) : true;

          const icon = expandIcon({
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
      !baseColumns.includes(EXPAND_COLUMN),
      'usage',
      '`expandable` is not config but there exist `EXPAND_COLUMN` in `columns`.',
    );

    return baseColumns.filter((col) => col !== EXPAND_COLUMN);
  }, [expandable, baseColumns, getRowKey, expandedKeys, expandIcon]);

  // ========================= Transform ========================
  const mergedColumns = React.useMemo(() => {
    let finalColumns = withExpandColumns;
    if (transformColumns) {
      finalColumns = transformColumns(finalColumns);
    }

    // Always provides at least one column for table display
    if (!finalColumns.length) {
      finalColumns = [
        {
          render: () => null,
        },
      ];
    }
    return finalColumns;
  }, [transformColumns, withExpandColumns]);

  // ========================== Flatten =========================
  const flattenColumns = React.useMemo(
    () => flatColumns(mergedColumns),
    [mergedColumns, scrollWidth],
  );

  // ========================= Gap Fixed ========================
  const hasGapFixed = React.useMemo(() => {
    // Fixed: left, since old browser not support `findLastIndex`, we should use reverse loop
    let lastLeftIndex = -1;
    for (let i = flattenColumns.length - 1; i >= 0; i -= 1) {
      const colFixed = flattenColumns[i].fixed;
      if (colFixed === 'left' || colFixed === true) {
        lastLeftIndex = i;
        break;
      }
    }

    if (lastLeftIndex >= 0) {
      for (let i = 0; i <= lastLeftIndex; i += 1) {
        const colFixed = flattenColumns[i].fixed;
        if (colFixed !== 'left' && colFixed !== true) {
          return true;
        }
      }
    }

    // Fixed: right
    const firstRightIndex = flattenColumns.findIndex(({ fixed: colFixed }) => colFixed === 'right');
    if (firstRightIndex >= 0) {
      for (let i = firstRightIndex; i < flattenColumns.length; i += 1) {
        const colFixed = flattenColumns[i].fixed;
        if (colFixed !== 'right') {
          return true;
        }
      }
    }

    return false;
  }, [flattenColumns]);

  // ========================= FillWidth ========================
  const [filledColumns, realScrollWidth] = useWidthColumns(
    flattenColumns,
    scrollWidth,
    clientWidth,
  );

  return [mergedColumns, filledColumns, realScrollWidth, hasGapFixed];
}

export default useColumns;
