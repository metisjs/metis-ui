import * as React from 'react';
import { useContext } from '@rc-component/context';
import type { AnyObject } from '@util/type';
import TableContext, { responseImmutable } from '../context/TableContext';
import type { ColumnsPos, ColumnType, ScrollOffset, StickyOffsets } from '../interface';
import Summary from './Summary';
import SummaryContext from './SummaryContext';

type FlattenColumns<RecordType extends AnyObject> = readonly (ColumnType<RecordType> & {
  scrollbar?: boolean;
})[];

export interface FooterProps<RecordType extends AnyObject> {
  children: React.ReactNode;
  stickyOffsets: StickyOffsets;
  scrollOffset: ScrollOffset;
  columnsPos: ColumnsPos;
  flattenColumns: FlattenColumns<RecordType>;
}

function Footer<RecordType extends AnyObject>(props: FooterProps<RecordType>) {
  const { children, stickyOffsets, columnsPos, scrollOffset, flattenColumns } = props;

  const prefixCls = useContext(TableContext, 'prefixCls');

  const lastColumnIndex = flattenColumns.length - 1;
  const scrollColumn = flattenColumns[lastColumnIndex];

  const summaryContext = React.useMemo(
    () => ({
      stickyOffsets,
      flattenColumns,
      scrollColumnIndex: scrollColumn?.scrollbar ? lastColumnIndex : null,
      columnsPos,
      scrollOffset,
    }),
    [scrollColumn, flattenColumns, lastColumnIndex, stickyOffsets, columnsPos, scrollOffset],
  );

  return (
    <SummaryContext.Provider value={summaryContext}>
      <tfoot className={`${prefixCls}-summary`}>{children}</tfoot>
    </SummaryContext.Provider>
  );
}

export default responseImmutable(Footer);

export const FooterComponents = Summary;
