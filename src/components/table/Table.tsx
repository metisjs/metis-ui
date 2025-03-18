import * as React from 'react';
import type { AnyObject, RequestConfig } from '../_util/type';
import {
  EXPAND_COLUMN,
  SELECTION_ALL,
  SELECTION_COLUMN,
  SELECTION_INVERT,
  SELECTION_NONE,
} from './constant';
import Summary from './Footer/Summary';
import type { FilterValue, Reference, SorterResult, TablePaginationConfig } from './interface';
import type { TableProps } from './InternalTable';
import InternalTable from './InternalTable';

const Table = <RecordType extends AnyObject = AnyObject>(
  props: TableProps<RecordType>,
  ref: React.Ref<Reference>,
) => {
  const renderTimesRef = React.useRef<number>(0);
  renderTimesRef.current += 1;
  return <InternalTable<RecordType> {...props} ref={ref} _renderTimes={renderTimesRef.current} />;
};

type MixedTableProps<RecordType extends AnyObject = AnyObject> =
  | (Omit<TableProps<RecordType>, 'pagination' | 'request'> & {
      pagination: false;
      request?: RequestConfig<RecordType, any[]>;
    })
  | (Omit<TableProps<RecordType>, 'pagination' | 'request'> & {
      pagination?: TablePaginationConfig;
      request?: RequestConfig<
        RecordType,
        [
          {
            filters: Record<string, FilterValue | null>;
            sorter: SorterResult<RecordType> | SorterResult<RecordType>[];
            pageSize: number;
            current: number;
          },
          ...any[],
        ]
      >;
    });

const ForwardTable = React.forwardRef(Table) as unknown as (<
  RecordType extends AnyObject = AnyObject,
>(
  props: React.PropsWithChildren<MixedTableProps<RecordType>> & React.RefAttributes<Reference>,
) => React.ReactElement) & {
  displayName?: string;
  SELECTION_COLUMN: typeof SELECTION_COLUMN;
  EXPAND_COLUMN: typeof EXPAND_COLUMN;
  SELECTION_ALL: typeof SELECTION_ALL;
  SELECTION_INVERT: typeof SELECTION_INVERT;
  SELECTION_NONE: typeof SELECTION_NONE;
  Summary: typeof Summary;
};

ForwardTable.SELECTION_COLUMN = SELECTION_COLUMN;
ForwardTable.EXPAND_COLUMN = EXPAND_COLUMN;
ForwardTable.SELECTION_ALL = SELECTION_ALL;
ForwardTable.SELECTION_INVERT = SELECTION_INVERT;
ForwardTable.SELECTION_NONE = SELECTION_NONE;
ForwardTable.Summary = Summary;

if (process.env.NODE_ENV !== 'production') {
  ForwardTable.displayName = 'Table';
}

export default ForwardTable;
