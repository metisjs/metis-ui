import * as React from 'react';
import useBreakpoint from '@util/hooks/useBreakpoint';
import type { Breakpoint } from '@util/responsiveObserver';
import type { AnyObject } from '@util/type';
import { EXPAND_COLUMN, SELECTION_COLUMN } from '../../constant';
import type {
  ColumnsPos,
  ColumnTitleProps,
  InternalColumnGroupType,
  InternalColumnsType,
  InternalColumnType,
  StickyOffsets,
} from '../../interface';
import { renderColumnTitle } from '../../utils/valueUtil';
import type { Updater } from '../useFrame';
import { useLayoutState } from '../useFrame';
import useStickyOffsets from '../useStickyOffsets';
import useColumnsPos from './useColumnsPos';
import useWidthColumns from './useWidthColumns';

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

const fillTitle = <RecordType extends AnyObject = AnyObject>(
  columns: InternalColumnsType<RecordType>,
  columnTitleProps: ColumnTitleProps<RecordType>,
): InternalColumnsType<RecordType> => {
  const finalColumns = columns.map((column) => {
    if (column === EXPAND_COLUMN || column === SELECTION_COLUMN) {
      return column;
    }

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
    scrollWidth,
    clientWidth,
    columnTitleProps,
  }: {
    columns?: InternalColumnsType<RecordType>;
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

  const baseColumns = React.useMemo<InternalColumnsType<RecordType>>(() => {
    const newColumns = columns || [];

    return newColumns.slice();
  }, [columns]);

  const needResponsive = React.useMemo(
    () => baseColumns.some((col: InternalColumnType<RecordType>) => col.responsive),
    [baseColumns],
  );

  const screens = useBreakpoint(needResponsive);

  // ========================= Transform ========================
  const mergedColumns = React.useMemo(() => {
    const matched = new Set(Object.keys(screens).filter((m) => screens[m as Breakpoint]));

    let finalColumns = baseColumns;

    finalColumns = fillTitle(finalColumns, columnTitleProps);

    if (transformColumns) {
      finalColumns = transformColumns(finalColumns);
    }

    finalColumns = finalColumns.filter(
      (c) => !c.responsive || c.responsive.some((r) => matched.has(r)),
    );

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
