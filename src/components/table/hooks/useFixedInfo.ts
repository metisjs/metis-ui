import type { AnyObject } from '@util/type';
import useMemo from 'rc-util/es/hooks/useMemo';
import isEqual from 'rc-util/es/isEqual';
import type { ColumnsPos, InternalColumnType, ScrollOffset, StickyOffsets } from '../interface';
import { getCellFixedInfo } from '../utils/fixUtil';

export default function useFixedInfo<RecordType extends AnyObject>(
  flattenColumns: readonly InternalColumnType<RecordType>[],
  stickyOffsets: StickyOffsets,
  scrollOffset: ScrollOffset,
  columnsPos: ColumnsPos,
) {
  const fixedInfoList = flattenColumns.map((_, colIndex) =>
    getCellFixedInfo(colIndex, colIndex, flattenColumns, stickyOffsets, scrollOffset, columnsPos),
  );

  return useMemo(
    () => fixedInfoList,
    [fixedInfoList],
    (prev, next) => !isEqual(prev, next),
  );
}
