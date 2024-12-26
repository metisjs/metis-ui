import * as React from 'react';
import type { AnyObject } from '@util/type';
import type { ColumnType, StickyOffsets } from '../interface';

type FlattenColumns<RecordType extends AnyObject> = readonly (ColumnType<RecordType> & {
  scrollbar?: boolean;
})[];

const SummaryContext = React.createContext<{
  stickyOffsets: StickyOffsets;
  scrollColumnIndex: number | null;
  flattenColumns: FlattenColumns<any>;
}>(null!);

export default SummaryContext;
