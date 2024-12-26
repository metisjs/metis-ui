import * as React from 'react';
import { useMemo } from 'react';
import { useContext } from '@rc-component/context';
import type { AnyObject } from '@util/type';
import classNames from 'classnames';
import { useComposeRef } from 'rc-util/lib/ref';
import ColGroup from '../ColGroup';
import TableContext from '../context/TableContext';
import type { HeaderProps } from '../Header/Header';
import type { ColumnsType, ColumnType } from '../interface';

function useColumnWidth(colWidths: readonly number[], columnCount: number) {
  return useMemo(() => {
    const cloneColumns: number[] = [];
    for (let i = 0; i < columnCount; i += 1) {
      const val = colWidths[i];
      if (val !== undefined) {
        cloneColumns[i] = val;
      } else {
        return null;
      }
    }
    return cloneColumns;
  }, [colWidths.join('_'), columnCount]);
}

export interface FixedHeaderProps<RecordType extends AnyObject> extends HeaderProps<RecordType> {
  className: string;
  noData: boolean;
  maxContentScroll: boolean;
  colWidths: readonly number[];
  columnCount: number;
  fixHeader: boolean;
  stickyTopOffset?: number;
  stickyBottomOffset?: number;
  stickyClassName?: string;
  onScroll: (info: { currentTarget: HTMLDivElement; scrollLeft?: number }) => void;
  children: (info: HeaderProps<RecordType>) => React.ReactNode;
}

const FixedHolder = React.forwardRef<HTMLDivElement, FixedHeaderProps<AnyObject>>((props, ref) => {
  const {
    className,
    noData,
    columns,
    flattenColumns,
    colWidths,
    columnCount,
    stickyOffsets,
    fixHeader,
    stickyTopOffset,
    stickyBottomOffset,
    stickyClassName,
    onScroll,
    maxContentScroll,
    children,
    ...restProps
  } = props;

  const { prefixCls, scrollbarSize, isSticky, getComponent } = useContext(TableContext, [
    'prefixCls',
    'scrollbarSize',
    'isSticky',
    'getComponent',
  ]);
  const TableComponent = getComponent(['header', 'table'], 'table');

  const combinationScrollBarSize = isSticky && !fixHeader ? 0 : scrollbarSize;

  // Pass wheel to scroll event
  const scrollRef = React.useRef<HTMLDivElement>(null);

  const composeRef = useComposeRef(scrollRef, ref);

  React.useEffect(() => {
    function onWheel(e: WheelEvent) {
      const { currentTarget, deltaX } = e as unknown as React.WheelEvent<HTMLDivElement>;
      if (deltaX) {
        onScroll({ currentTarget, scrollLeft: currentTarget.scrollLeft + deltaX });
        e.preventDefault();
      }
    }
    scrollRef.current?.addEventListener('wheel', onWheel, { passive: false });

    return () => {
      scrollRef.current?.removeEventListener('wheel', onWheel);
    };
  }, []);

  // Check if all flattenColumns has width
  const allFlattenColumnsWithWidth = React.useMemo(
    () => flattenColumns.every((column) => column.width),
    [flattenColumns],
  );

  // Add scrollbar column
  const lastColumn = flattenColumns[flattenColumns.length - 1];
  const ScrollBarColumn: ColumnType<AnyObject> & { scrollbar: true } = {
    fixed: lastColumn ? lastColumn.fixed : undefined,
    scrollbar: true,
    onHeaderCell: () => ({
      className: `${prefixCls}-cell-scrollbar`,
    }),
  };

  const columnsWithScrollbar = useMemo<ColumnsType<AnyObject>>(
    () => (combinationScrollBarSize ? [...columns, ScrollBarColumn] : columns),
    [combinationScrollBarSize, columns],
  );

  const flattenColumnsWithScrollbar = useMemo(
    () => (combinationScrollBarSize ? [...flattenColumns, ScrollBarColumn] : flattenColumns),
    [combinationScrollBarSize, flattenColumns],
  );

  // Calculate the sticky offsets
  const headerStickyOffsets = useMemo(() => {
    const { right, left } = stickyOffsets;
    return {
      ...stickyOffsets,
      left,
      right: [...right.map((width) => width + combinationScrollBarSize), 0],
      isSticky,
    };
  }, [combinationScrollBarSize, stickyOffsets, isSticky]);

  const mergedColumnWidth = useColumnWidth(colWidths, columnCount);

  return (
    <div
      style={{
        overflow: 'hidden',
        ...(isSticky ? { top: stickyTopOffset, bottom: stickyBottomOffset } : {}),
      }}
      ref={composeRef}
      className={classNames(className, {
        [stickyClassName!]: !!stickyClassName,
      })}
    >
      <TableComponent
        style={{
          tableLayout: 'fixed',
          visibility: noData || mergedColumnWidth ? null : 'hidden',
        }}
      >
        {(!noData || !maxContentScroll || allFlattenColumnsWithWidth) && (
          <ColGroup
            colWidths={mergedColumnWidth ? [...mergedColumnWidth, combinationScrollBarSize] : []}
            columnCount={columnCount + 1}
            columns={flattenColumnsWithScrollbar}
          />
        )}
        {children({
          ...restProps,
          stickyOffsets: headerStickyOffsets,
          columns: columnsWithScrollbar,
          flattenColumns: flattenColumnsWithScrollbar,
        })}
      </TableComponent>
    </div>
  );
});

if (process.env.NODE_ENV !== 'production') {
  FixedHolder.displayName = 'FixedHolder';
}

export default React.memo(FixedHolder);
