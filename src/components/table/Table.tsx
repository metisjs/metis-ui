import * as React from 'react';
import type { AnyObject } from '../_util/type';
import { EXPAND_COLUMN } from './constant';
import Summary from './Footer/Summary';
import {
  SELECTION_ALL,
  SELECTION_COLUMN,
  SELECTION_INVERT,
  SELECTION_NONE,
} from './hooks/useSelection';
import type { Reference } from './interface';
import type { TableProps } from './InternalTable';
import InternalTable from './InternalTable';
import Column from './sugar/Column';
import ColumnGroup from './sugar/ColumnGroup';

const Table = <RecordType extends AnyObject = AnyObject>(
  props: TableProps<RecordType>,
  ref: React.Ref<Reference>,
) => {
  const renderTimesRef = React.useRef<number>(0);
  renderTimesRef.current += 1;
  return <InternalTable<RecordType> {...props} ref={ref} _renderTimes={renderTimesRef.current} />;
};

const ForwardTable = React.forwardRef(Table) as unknown as (<
  RecordType extends AnyObject = AnyObject,
>(
  props: React.PropsWithChildren<TableProps<RecordType>> & React.RefAttributes<Reference>,
) => React.ReactElement) & {
  displayName?: string;
  SELECTION_COLUMN: typeof SELECTION_COLUMN;
  EXPAND_COLUMN: typeof EXPAND_COLUMN;
  SELECTION_ALL: typeof SELECTION_ALL;
  SELECTION_INVERT: typeof SELECTION_INVERT;
  SELECTION_NONE: typeof SELECTION_NONE;
  Column: typeof Column;
  ColumnGroup: typeof ColumnGroup;
  Summary: typeof Summary;
};

ForwardTable.SELECTION_COLUMN = SELECTION_COLUMN;
ForwardTable.EXPAND_COLUMN = EXPAND_COLUMN;
ForwardTable.SELECTION_ALL = SELECTION_ALL;
ForwardTable.SELECTION_INVERT = SELECTION_INVERT;
ForwardTable.SELECTION_NONE = SELECTION_NONE;
ForwardTable.Column = Column;
ForwardTable.ColumnGroup = ColumnGroup;
ForwardTable.Summary = Summary;

if (process.env.NODE_ENV !== 'production') {
  ForwardTable.displayName = 'Table';
}

export default ForwardTable;
