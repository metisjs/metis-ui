import * as React from 'react';
import { useContext } from '@rc-component/context';
import Cell from '../Cell';
import TableContext from '../context/TableContext';
import type { AlignType } from '../interface';
import { getCellFixedInfo } from '../utils/fixUtil';
import { SummaryContext, SummaryRowContext } from './contexts';

export interface SummaryCellProps {
  className?: string;
  index: number;
  children?: React.ReactNode;
  colSpan?: number;
  rowSpan?: number;
  align?: AlignType;
}

export default function SummaryCell({
  className,
  index,
  children,
  colSpan = 1,
  rowSpan = 1,
  align,
}: SummaryCellProps) {
  const { prefixCls } = useContext(TableContext, ['prefixCls']);
  const {
    scrollColumnIndex,
    stickyOffsets,
    flattenColumns,
    scrollOffset,
    columnsPos,
    totalRowCount,
  } = React.useContext(SummaryContext);
  const { rowIndex } = React.useContext(SummaryRowContext);

  const lastIndex = index + colSpan - 1;
  const mergedColSpan = lastIndex + 1 === scrollColumnIndex ? colSpan + 1 : colSpan;

  const fixedInfo = getCellFixedInfo(
    index,
    index + mergedColSpan - 1,
    flattenColumns,
    stickyOffsets,
    scrollOffset,
    columnsPos,
  );

  return (
    <Cell
      className={className}
      rowIndex={rowIndex}
      index={index}
      component="td"
      prefixCls={prefixCls}
      rowType="footer"
      record={null!}
      dataIndex={-1}
      align={align}
      colSpan={mergedColSpan}
      rowSpan={rowSpan}
      {...fixedInfo}
      renderIndex={-1}
      totalColCount={flattenColumns.length}
      totalRowCount={totalRowCount}
    >
      {children}
    </Cell>
  );
}
