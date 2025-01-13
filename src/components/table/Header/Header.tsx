import * as React from 'react';
import { useContext } from '@rc-component/context';
import type { AnyObject } from '@util/type';
import TableContext, { responseImmutable } from '../context/TableContext';
import type {
  CellType,
  ColumnGroupType,
  ColumnsPos,
  ColumnsType,
  ColumnType,
  GetComponentProps,
  ScrollOffset,
  StickyOffsets,
} from '../interface';
import HeaderRow from './HeaderRow';

function parseHeaderRows<RecordType extends AnyObject>(
  rootColumns: ColumnsType<RecordType>,
): CellType<RecordType>[][] {
  const rows: CellType<RecordType>[][] = [];

  function fillRowCells(
    columns: ColumnsType<RecordType>,
    colIndex: number,
    rowIndex: number = 0,
  ): number[] {
    // Init rows
    rows[rowIndex] = rows[rowIndex] || [];

    let currentColIndex = colIndex;
    const colSpans: number[] = columns.filter(Boolean).map((column) => {
      const cell: CellType<RecordType> = {
        key: column.key,
        className: column.className || '',
        children: column.title as React.ReactNode,
        column,
        colStart: currentColIndex,
      };

      let colSpan: number = 1;

      const subColumns = (column as ColumnGroupType<RecordType>).children;
      if (subColumns && subColumns.length > 0) {
        colSpan = fillRowCells(subColumns, currentColIndex, rowIndex + 1).reduce(
          (total, count) => total + count,
          0,
        );
        cell.hasSubColumns = true;
      }

      if ('colSpan' in column) {
        ({ colSpan = 1 } = column);
      }

      if ('rowSpan' in column) {
        cell.rowSpan = column.rowSpan;
      }

      cell.colSpan = colSpan;
      cell.colEnd = cell.colStart! + colSpan - 1;
      rows[rowIndex].push(cell);

      currentColIndex += colSpan;

      return colSpan;
    });

    return colSpans;
  }

  // Generate `rows` cell data
  fillRowCells(rootColumns, 0);

  // Handle `rowSpan`
  const rowCount = rows.length;
  for (let rowIndex = 0; rowIndex < rowCount; rowIndex += 1) {
    rows[rowIndex].forEach((cell) => {
      if (!('rowSpan' in cell) && !cell.hasSubColumns) {
        // eslint-disable-next-line no-param-reassign
        cell.rowSpan = rowCount - rowIndex;
      }
    });
  }

  return rows;
}

export interface HeaderProps<RecordType extends AnyObject> {
  columns: ColumnsType<RecordType>;
  flattenColumns: readonly ColumnType<RecordType>[];
  stickyOffsets: StickyOffsets;
  scrollOffset: ScrollOffset;
  columnsPos: ColumnsPos;
  onHeaderRow?: GetComponentProps<readonly ColumnType<RecordType>[]>;
}

const Header = <RecordType extends AnyObject>(props: HeaderProps<RecordType>) => {
  const { stickyOffsets, columnsPos, scrollOffset, columns, flattenColumns, onHeaderRow } = props;

  const { prefixCls, getComponent } = useContext(TableContext, ['prefixCls', 'getComponent']);
  const rows = React.useMemo<CellType<RecordType>[][]>(() => parseHeaderRows(columns), [columns]);

  const WrapperComponent = getComponent(['header', 'wrapper'], 'thead');
  const trComponent = getComponent(['header', 'row'], 'tr');
  const thComponent = getComponent(['header', 'cell'], 'th');

  return (
    <WrapperComponent className={`${prefixCls}-thead`}>
      {rows.map((row, rowIndex) => {
        const rowNode = (
          <HeaderRow
            key={rowIndex}
            flattenColumns={flattenColumns}
            cells={row}
            stickyOffsets={stickyOffsets}
            columnsPos={columnsPos}
            scrollOffset={scrollOffset}
            rowComponent={trComponent}
            cellComponent={thComponent}
            onHeaderRow={onHeaderRow}
            index={rowIndex}
            totalRowCount={rows.length}
          />
        );
        return rowNode;
      })}
    </WrapperComponent>
  );
};

export default responseImmutable(Header);
