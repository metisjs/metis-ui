import * as React from 'react';
import { useContext } from '@rc-component/context';
import { clsx } from '@util/classNameUtils';
import type { AnyObject } from '@util/type';
import Cell from '../Cell';
import TableContext from '../context/TableContext';
import type {
  CellType,
  ColumnType,
  CustomizeComponent,
  GetComponentProps,
  StickyOffsets,
} from '../interface';
import { getCellFixedInfo } from '../utils/fixUtil';
import { getColumnsKey } from '../utils/valueUtil';

export interface RowProps<RecordType extends AnyObject> {
  cells: readonly CellType<RecordType>[];
  stickyOffsets: StickyOffsets;
  flattenColumns: readonly ColumnType<RecordType>[];
  rowComponent: CustomizeComponent;
  cellComponent: CustomizeComponent;
  onHeaderRow?: GetComponentProps<readonly ColumnType<RecordType>[]>;
  index: number;
}

const HeaderRow = <RecordType extends AnyObject>(props: RowProps<RecordType>) => {
  const {
    cells,
    stickyOffsets,
    flattenColumns,
    rowComponent: RowComponent,
    cellComponent: CellComponent,
    onHeaderRow,
    index,
  } = props;
  const { prefixCls } = useContext(TableContext, ['prefixCls']);
  let rowProps: React.HTMLAttributes<HTMLElement> = {};
  if (onHeaderRow) {
    rowProps = onHeaderRow(
      cells.map((cell) => cell.column!),
      index,
    );
  }
  rowProps.className = clsx('group/header-row', rowProps.className);

  const columnsKey = getColumnsKey(cells.map((cell) => cell.column!));

  return (
    <RowComponent {...rowProps}>
      {cells.map((cell: CellType<RecordType>, cellIndex) => {
        const { column } = cell;
        const fixedInfo = getCellFixedInfo(
          cell.colStart!,
          cell.colEnd!,
          flattenColumns,
          stickyOffsets,
        );

        let additionalProps: React.HTMLAttributes<HTMLElement> | undefined;
        if (column && column.onHeaderCell) {
          additionalProps = column.onHeaderCell(column);
        }

        return (
          <Cell
            {...cell}
            scope={
              column?.title ? (cell.colSpan && cell.colSpan > 1 ? 'colgroup' : 'col') : undefined
            }
            ellipsis={column?.ellipsis}
            align={column?.align}
            component={CellComponent}
            prefixCls={prefixCls}
            key={columnsKey[cellIndex]}
            {...fixedInfo}
            additionalProps={additionalProps}
            rowType="header"
            record={null!}
            index={-1}
            renderIndex={-1}
          />
        );
      })}
    </RowComponent>
  );
};

if (process.env.NODE_ENV !== 'production') {
  HeaderRow.displayName = 'HeaderRow';
}

export default HeaderRow;
