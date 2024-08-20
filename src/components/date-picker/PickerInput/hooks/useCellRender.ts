import * as React from 'react';
import type { CellRender, CellRenderInfo, SharedPickerProps } from '../../interface';

export default function useCellRender<DateType extends object = any>(
  cellRender: SharedPickerProps<DateType>['cellRender'],
  range?: CellRenderInfo<DateType>['range'],
) {
  // ======================== Render ========================
  // Merged render
  const mergedCellRender = React.useMemo(() => {
    if (cellRender) {
      return cellRender;
    }

    return (_: DateType | number, info: CellRenderInfo<DateType>) => {
      return info.originNode;
    };
  }, [cellRender]);

  // Cell render
  const onInternalCellRender: CellRender<DateType> = React.useCallback(
    (date, info) =>
      mergedCellRender(date, {
        ...info,
        range,
      }),
    [mergedCellRender, range],
  );

  return onInternalCellRender;
}
