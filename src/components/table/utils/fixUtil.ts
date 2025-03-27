import type { ColumnsPos, FixedType, ScrollOffset, StickyOffsets } from '../interface';

export interface FixedInfo {
  fixLeft?: number;
  fixRight?: number;
  lastPinLeft: boolean;
  firstPinRight: boolean;
  pinned: boolean;

  isSticky: boolean;
}

function calculatePinned(scrollOffset: number, columnsPos: number, fixOffset: number): boolean {
  return scrollOffset > 0 && scrollOffset >= columnsPos - fixOffset;
}

function isNextPinned(
  columns: readonly { fixed?: FixedType }[],
  colEnd: number,
  stickyOffsets: StickyOffsets,
  scrollOffset: ScrollOffset,
  columnsPos: ColumnsPos,
): boolean {
  const nextFixedIndex =
    columns.slice(colEnd + 1).findIndex((c) => c.fixed === 'left') + colEnd + 1;
  if (nextFixedIndex > colEnd) {
    const nextFixLeft = stickyOffsets.left[nextFixedIndex];
    return calculatePinned(scrollOffset.left, columnsPos.left[nextFixedIndex], nextFixLeft);
  }
  return false;
}

function isPrevPinned(
  columns: readonly { fixed?: FixedType }[],
  colStart: number,
  stickyOffsets: StickyOffsets,
  scrollOffset: ScrollOffset,
  columnsPos: ColumnsPos,
): boolean {
  const index = columns
    .slice(0, colStart)
    .reverse()
    .findIndex((c) => c.fixed === 'right');
  if (index !== -1) {
    const prevFixedIndex = colStart - 1 - index;
    const prevFixRight = stickyOffsets.right[prevFixedIndex];
    return calculatePinned(scrollOffset.right, columnsPos.right[prevFixedIndex], prevFixRight);
  }
  return false;
}

export function getCellFixedInfo(
  colStart: number,
  colEnd: number,
  columns: readonly { fixed?: FixedType }[],
  stickyOffsets: StickyOffsets,
  scrollOffset: ScrollOffset,
  columnsPos: ColumnsPos,
): FixedInfo {
  const startColumn = columns[colStart] || {};
  const endColumn = columns[colEnd] || {};

  let pinned = false;
  let fixLeft: number | undefined;
  let fixRight: number | undefined;
  let lastPinLeft: boolean = false;
  let firstPinRight: boolean = false;

  if (startColumn.fixed === 'left') {
    fixLeft = stickyOffsets.left[colStart];
    pinned = calculatePinned(scrollOffset.left, columnsPos.left[colStart], fixLeft);

    if (pinned) {
      lastPinLeft = !isNextPinned(columns, colEnd, stickyOffsets, scrollOffset, columnsPos);
    }
  } else if (endColumn.fixed === 'right') {
    fixRight = stickyOffsets.right[colEnd];
    pinned = calculatePinned(scrollOffset.right, columnsPos.right[colEnd], fixRight);

    if (pinned) {
      firstPinRight = !isPrevPinned(columns, colStart, stickyOffsets, scrollOffset, columnsPos);
    }
  }

  return {
    fixLeft,
    fixRight,
    lastPinLeft,
    firstPinRight,
    pinned,
    isSticky: !!stickyOffsets.isSticky,
  };
}
