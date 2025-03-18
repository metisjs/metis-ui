import { useMemo } from 'react';
import type { AnyObject } from '@util/type';
import type { ColumnsPos, InternalColumnType } from '../../interface';

/**
 * Get sticky column offset width
 */
function useColumnsPos<RecordType extends AnyObject>(
  colWidths: number[],
  flattenColumns: readonly InternalColumnType<RecordType>[],
) {
  const columnsPos: ColumnsPos = useMemo(() => {
    const columnCount = flattenColumns.length;

    const getOffsets = (startIndex: number, endIndex: number, offset: number) => {
      const posArr: number[] = [];
      let total = 0;

      for (let i = startIndex; i !== endIndex; i += offset) {
        posArr.push(total);
        total += colWidths[i] || 0;
      }

      return posArr;
    };

    const leftPosList = getOffsets(0, columnCount, 1);
    const rightPosList = getOffsets(columnCount - 1, -1, -1).reverse();

    return {
      left: leftPosList,
      right: rightPosList,
    };
  }, [colWidths.join('_'), flattenColumns.length]);

  return columnsPos;
}

export default useColumnsPos;
