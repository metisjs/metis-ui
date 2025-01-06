import * as React from 'react';
import useBreakpoint from '@util/hooks/useBreakpoint';
import type { Breakpoint } from '@util/responsiveObserver';
import type { AnyObject } from '@util/type';
import toArray from 'rc-util/lib/Children/toArray';
import { EXPAND_COLUMN, SELECTION_COLUMN } from '../../constant';
import type { ColumnGroupType, ColumnsType, ColumnTitleProps, ColumnType } from '../../interface';
import { renderColumnTitle } from '../../utils/valueUtil';
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

function filterHiddenColumns<RecordType extends AnyObject>(
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

function flatColumns<RecordType extends AnyObject>(
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

const fillTitle = <RecordType extends AnyObject = AnyObject>(
  columns: ColumnsType<RecordType>,
  columnTitleProps: ColumnTitleProps<RecordType>,
): ColumnsType<RecordType> => {
  const finalColumns = columns.map((column) => {
    if (column === SELECTION_COLUMN || column === EXPAND_COLUMN) {
      return column;
    }

    const cloneColumn: ColumnGroupType<RecordType> | ColumnType<RecordType> = { ...column };
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
  transformColumns?: (columns: ColumnsType<RecordType>) => ColumnsType<RecordType>,
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

  const needResponsive = React.useMemo(
    () => baseColumns.some((col: ColumnType<RecordType>) => col.responsive),
    [baseColumns],
  );

  const screens = useBreakpoint(needResponsive);

  // ========================= Transform ========================
  const mergedColumns = React.useMemo(() => {
    const matched = new Set(Object.keys(screens).filter((m) => screens[m as Breakpoint]));

    let finalColumns = baseColumns;
    if (transformColumns) {
      finalColumns = transformColumns(finalColumns);
    }

    finalColumns.filter((c) => !c.responsive || c.responsive.some((r) => matched.has(r)));
    finalColumns = fillTitle(finalColumns, columnTitleProps);

    // Always provides at least one column for table display
    if (!finalColumns.length) {
      finalColumns = [
        {
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
