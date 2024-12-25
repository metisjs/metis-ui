import type { FixedType, StickyOffsets } from '../interface';

export interface FixedInfo {
  fixLeft?: number;
  fixRight?: number;
  lastFixLeft: boolean;
  firstFixRight: boolean;

  // For Rtl Direction
  lastFixRight: boolean;
  firstFixLeft: boolean;

  isSticky: boolean;
}

export function getCellFixedInfo(
  colStart: number,
  colEnd: number,
  columns: readonly { fixed?: FixedType }[],
  stickyOffsets: StickyOffsets,
): FixedInfo {
  const startColumn = columns[colStart] || {};
  const endColumn = columns[colEnd] || {};

  let fixLeft: number | undefined;
  let fixRight: number | undefined;

  if (startColumn.fixed === 'left') {
    fixLeft = stickyOffsets.left[colStart];
  } else if (endColumn.fixed === 'right') {
    fixRight = stickyOffsets.right[colEnd];
  }

  let lastFixLeft: boolean = false;
  let firstFixRight: boolean = false;

  let lastFixRight: boolean = false;
  let firstFixLeft: boolean = false;

  const nextColumn = columns[colEnd + 1];
  const prevColumn = columns[colStart - 1];

  // need show shadow only when canLastFix is true
  const canLastFix =
    (nextColumn && !nextColumn.fixed) ||
    (prevColumn && !prevColumn.fixed) ||
    columns.every((col) => col.fixed === 'left');

  if (fixLeft !== undefined) {
    const nextFixLeft = nextColumn && nextColumn.fixed === 'left';
    lastFixLeft = !nextFixLeft && canLastFix;
  } else if (fixRight !== undefined) {
    const prevFixRight = prevColumn && prevColumn.fixed === 'right';
    firstFixRight = !prevFixRight && canLastFix;
  }

  return {
    fixLeft,
    fixRight,
    lastFixLeft,
    firstFixRight,
    lastFixRight,
    firstFixLeft,
    isSticky: !!stickyOffsets.isSticky,
  };
}
