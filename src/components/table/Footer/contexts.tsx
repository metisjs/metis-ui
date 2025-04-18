import * as React from 'react';
import type { AnyObject } from '@util/type';
import type { ColumnsPos, InternalColumnType, ScrollOffset, StickyOffsets } from '../interface';

type FlattenColumns<RecordType extends AnyObject> = readonly (InternalColumnType<RecordType> & {
  scrollbar?: boolean;
})[];

const SummaryContext = React.createContext<{
  stickyOffsets: StickyOffsets;
  scrollColumnIndex: number | null;
  flattenColumns: FlattenColumns<any>;
  columnsPos: ColumnsPos;
  scrollOffset: ScrollOffset;
  totalRowCount: number;
}>(null!);

const SummaryRowContext = React.createContext<{
  rowIndex: number;
}>(null!);

export { SummaryContext, SummaryRowContext };
