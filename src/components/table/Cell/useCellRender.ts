import type * as React from 'react';
import type { AnyObject } from '@util/type';
import useMemo from 'rc-util/lib/hooks/useMemo';
import isEqual from 'rc-util/lib/isEqual';
import getValue from 'rc-util/lib/utils/get';
import { useImmutableMark } from '../context/TableContext';
import type { ColumnType, DataIndex } from '../interface';
import { validateValue } from '../utils/valueUtil';

export default function useCellRender<RecordType extends AnyObject>(
  record: RecordType,
  dataIndex: DataIndex<RecordType> | null | undefined,
  renderIndex: number,
  children?: React.ReactNode,
  render?: ColumnType<RecordType>['render'],
  shouldCellUpdate?: ColumnType<RecordType>['shouldCellUpdate'],
) {
  const mark = useImmutableMark();

  // ======================== Render ========================
  const retData = useMemo<React.ReactNode>(
    () => {
      if (validateValue(children)) {
        return children;
      }

      const path =
        dataIndex === null || dataIndex === undefined || dataIndex === ''
          ? []
          : Array.isArray(dataIndex)
            ? dataIndex
            : [dataIndex];

      const value: React.ReactNode = getValue(record, path as any);

      return render?.(value, record, renderIndex) ?? value;
    },
    [
      // Force update deps
      mark,

      // Normal deps
      record,
      children,
      dataIndex,
      render,
      renderIndex,
    ] as const,
    (prev, next) => {
      if (shouldCellUpdate) {
        const [, prevRecord] = prev;
        const [, nextRecord] = next;
        return shouldCellUpdate(nextRecord, prevRecord);
      }

      return !isEqual(prev, next, true);
    },
  );

  return retData;
}
