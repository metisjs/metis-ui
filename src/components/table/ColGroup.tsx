import * as React from 'react';
import { useContext } from '@rc-component/context';
import omit from '@rc-component/util/es/omit';
import type { AnyObject } from '@util/type';
import { INTERNAL_COL_DEFINE } from './constant';
import TableContext from './context/TableContext';
import type { InternalColumnType } from './interface';

export interface ColGroupProps<RecordType extends AnyObject> {
  colWidths: readonly (number | string | undefined)[];
  columns?: readonly InternalColumnType<RecordType>[];
  columnCount?: number;
}

function ColGroup<RecordType extends AnyObject>({
  colWidths,
  columns,
  columnCount,
}: ColGroupProps<RecordType>) {
  const { tableLayout } = useContext(TableContext, ['tableLayout']);

  const cols: React.ReactElement[] = [];
  const len = columnCount ?? columns?.length ?? 0;

  // Only insert col with width & additional props
  // Skip if rest col do not have any useful info
  let mustInsert = false;
  for (let i = len - 1; i >= 0; i -= 1) {
    const width = colWidths[i];
    const column = columns && columns[i];
    let additionalProps: Record<string, any> | undefined;
    let minWidth: number | undefined;
    if (column) {
      additionalProps = column[
        INTERNAL_COL_DEFINE as keyof InternalColumnType<RecordType>
      ] as Record<string, any>;

      // fixed will cause layout problems
      if (tableLayout === 'auto') {
        minWidth = column.minWidth;
      }
    }

    if (width || minWidth || additionalProps || mustInsert) {
      cols.unshift(
        <col
          key={i}
          style={{ width, minWidth }}
          {...omit(additionalProps ?? {}, ['columnType'])}
        />,
      );
      mustInsert = true;
    }
  }

  return <colgroup>{cols}</colgroup>;
}

export default ColGroup;
