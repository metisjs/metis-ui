import * as React from 'react';
import useBreakpoint from '@util/hooks/useBreakpoint';
import type { Breakpoint } from '@util/responsiveObserver';
import type { AnyObject } from '@util/type';
import toArray from 'rc-util/lib/Children/toArray';
import { INTERNAL_COL_KEY_PREFIX } from '../../constant';
import type {
  ColumnGroupType,
  ColumnsPos,
  ColumnsType,
  ColumnTitleProps,
  ColumnType,
  InternalColumnGroupType,
  InternalColumnsType,
  InternalColumnType,
  Key,
  StickyOffsets,
} from '../../interface';
import { renderColumnTitle } from '../../utils/valueUtil';
import type { Updater } from '../useFrame';
import { useLayoutState } from '../useFrame';
import useStickyOffsets from '../useStickyOffsets';
import useColumnsPos from './useColumnsPos';
import useWidthColumns from './useWidthColumns';

export function convertChildrenToColumns<RecordType extends AnyObject>(
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

function flatColumns<RecordType extends AnyObject>(
  columns: InternalColumnsType<RecordType>,
): InternalColumnType<RecordType>[] {
  return columns
    .filter((column) => column && typeof column === 'object')
    .reduce((list, column) => {
      const { fixed } = column;
      // Convert `fixed='true'` to `fixed='left'` instead
      const parsedFixed = fixed === true ? 'left' : fixed;

      const subColumns = (column as InternalColumnGroupType<RecordType>).children;
      if (subColumns && subColumns.length > 0) {
        return [
          ...list,
          ...flatColumns(subColumns).map((subColum) => ({
            fixed: parsedFixed,
            ...subColum,
          })),
        ];
      }
      return [
        ...list,
        {
          ...column,
          fixed: parsedFixed,
        },
      ];
    }, []);
}

const fillKey = <RecordType extends AnyObject = AnyObject>(
  columns: ColumnsType<RecordType>,
  keyPrefix: Key = INTERNAL_COL_KEY_PREFIX,
): InternalColumnsType<RecordType> => {
  const finalColumns = columns.map((column, index) => {
    let mergedKey = column.key;
    if ('dataIndex' in column && column.dataIndex) {
      mergedKey = Array.isArray(column.dataIndex)
        ? column.dataIndex.join('@#@')
        : (column.dataIndex as Key);
    }

    if (!mergedKey) {
      mergedKey = `${keyPrefix}_${index}`;
    }

    const cloneColumn: ColumnGroupType<RecordType> | ColumnType<RecordType> = {
      ...column,
    };
    cloneColumn.key = mergedKey;
    if ('children' in cloneColumn) {
      cloneColumn.children = fillKey<RecordType>(
        cloneColumn.children as ColumnsType<RecordType>,
        mergedKey,
      );
    }
    return cloneColumn;
  });
  return finalColumns as InternalColumnsType<RecordType>;
};

const fillTitle = <RecordType extends AnyObject = AnyObject>(
  columns: InternalColumnsType<RecordType>,
  columnTitleProps: ColumnTitleProps<RecordType>,
): InternalColumnsType<RecordType> => {
  const finalColumns = columns.map((column) => {
    const cloneColumn: InternalColumnGroupType<RecordType> | InternalColumnType<RecordType> = {
      ...column,
    };
    cloneColumn.title = renderColumnTitle(column.title, columnTitleProps);
    if ('children' in cloneColumn) {
      cloneColumn.children = fillTitle<RecordType>(cloneColumn.children, columnTitleProps);
    }
    return cloneColumn;
  });
  return finalColumns;
};

/**
 * Parse `columns` & `children` into `columns`.
 */
function useColumns<RecordType extends AnyObject>(
  {
    columns,
    children,
    scrollWidth,
    clientWidth,
    columnTitleProps,
  }: {
    columns?: ColumnsType<RecordType>;
    children?: React.ReactNode;
    clientWidth: number;
    scrollWidth?: number;
    columnTitleProps: ColumnTitleProps<RecordType>;
  },
  transformColumns?: (columns: InternalColumnsType<RecordType>) => InternalColumnsType<RecordType>,
): [
  columns: InternalColumnsType<RecordType>,
  flattenColumns: readonly InternalColumnType<RecordType>[],
  realScrollWidth: undefined | number,
  colWidths: number[],
  updateColsWidths: (updater: Updater<Map<React.Key, number>>) => void,
  stickyOffsets: StickyOffsets,
  position: ColumnsPos,
  columnKeys: React.Key[],
] {
  const [colsWidths, updateColsWidths] = useLayoutState(new Map<React.Key, number>());

  const baseColumns = React.useMemo<ColumnsType<RecordType>>(() => {
    const newColumns = columns || convertChildrenToColumns(children) || [];

    return newColumns.slice();
  }, [columns, children]);

  const needResponsive = React.useMemo(
    () => baseColumns.some((col: ColumnType<RecordType>) => col.responsive),
    [baseColumns],
  );

  const screens = useBreakpoint(needResponsive);

  // ========================= Transform ========================
  const mergedColumns = React.useMemo(() => {
    const matched = new Set(Object.keys(screens).filter((m) => screens[m as Breakpoint]));

    let finalColumns: InternalColumnsType<RecordType> = fillKey(baseColumns);

    if (transformColumns) {
      finalColumns = transformColumns(finalColumns);
    }

    finalColumns = finalColumns.filter(
      (c) => !c.responsive || c.responsive.some((r) => matched.has(r)),
    );

    finalColumns = fillTitle(finalColumns, columnTitleProps);

    // Always provides at least one column for table display
    if (!finalColumns.length) {
      finalColumns = [
        {
          key: 'placeholder_cell',
          render: () => null,
        },
      ];
    }
    return finalColumns;
  }, [transformColumns, baseColumns, screens]);

  // ========================== Flatten =========================
  const flattenColumns = React.useMemo(
    () => flatColumns(mergedColumns),
    [mergedColumns, scrollWidth],
  );

  // ========================= FillWidth ========================
  const [filledColumns, realScrollWidth] = useWidthColumns(
    flattenColumns,
    scrollWidth,
    clientWidth,
  );

  const colsKeys = React.useMemo(() => filledColumns.map((col) => col.key), [filledColumns]);
  const pureColWidths = React.useMemo(
    () => colsKeys.map((columnKey) => colsWidths.get(columnKey)!),
    [colsWidths, colsKeys.join('_')],
  );
  const colWidths = React.useMemo(() => pureColWidths, [pureColWidths.join('_')]);
  const stickyOffsets = useStickyOffsets(colWidths, filledColumns);
  const position = useColumnsPos(colWidths, filledColumns);

  return [
    mergedColumns,
    filledColumns,
    realScrollWidth,
    colWidths,
    updateColsWidths,
    stickyOffsets,
    position,
    colsKeys,
  ];
}

export default useColumns;
