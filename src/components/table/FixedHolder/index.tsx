import * as React from 'react';
import { useMemo } from 'react';
import { useContext } from '@rc-component/context';
import type { AnyObject } from '@util/type';
import classNames from 'classnames';
import { useComposeRef } from 'rc-util/lib/ref';
import ColGroup from '../ColGroup';
import TableContext from '../context/TableContext';
import type { HeaderProps } from '../Header/Header';

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

export interface FixedHolderProps<RecordType extends AnyObject> extends HeaderProps<RecordType> {
  className: string;
  noData: boolean;
  maxContentScroll: boolean;
  colWidths: readonly number[];
  columnCount: number;
  stickyTopOffset?: number;
  stickyBottomOffset?: number;
  stickyClassName?: string;
  onScroll: (values: { scrollLeft: number }, e: { currentTarget: HTMLElement }) => void;
  children: (info: HeaderProps<RecordType>) => React.ReactNode;
}

const FixedHolder = React.forwardRef<HTMLDivElement, FixedHolderProps<AnyObject>>((props, ref) => {
  const {
    className,
    noData,
    columns,
    flattenColumns,
    colWidths,
    columnCount,
    stickyOffsets,
    stickyTopOffset,
    stickyBottomOffset,
    stickyClassName,
    onScroll,
    maxContentScroll,
    children,
    ...restProps
  } = props;

  const { isSticky, getComponent } = useContext(TableContext, ['isSticky', 'getComponent']);
  const TableComponent = getComponent(['header', 'table'], 'table');

  // Pass wheel to scroll event
  const scrollRef = React.useRef<HTMLDivElement>(null);

  const composeRef = useComposeRef(scrollRef, ref);

  React.useEffect(() => {
    function onWheel(e: WheelEvent) {
      const { currentTarget, deltaX } = e as unknown as React.WheelEvent<HTMLDivElement>;
      if (deltaX) {
        onScroll(
          {
            scrollLeft: currentTarget.scrollLeft + deltaX,
          },
          { currentTarget },
        );
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

  // Calculate the sticky offsets
  const headerStickyOffsets = useMemo(() => {
    const { right, left } = stickyOffsets;
    return {
      ...stickyOffsets,
      left,
      right: [...right.map((width) => width), 0],
      isSticky,
    };
  }, [stickyOffsets, isSticky]);

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
            colWidths={mergedColumnWidth ?? []}
            columnCount={columnCount + 1}
            columns={flattenColumns}
          />
        )}
        {children({
          ...restProps,
          stickyOffsets: headerStickyOffsets,
          columns: columns,
          flattenColumns: flattenColumns,
        })}
      </TableComponent>
    </div>
  );
});

if (process.env.NODE_ENV !== 'production') {
  FixedHolder.displayName = 'FixedHeader';
}

export default React.memo(FixedHolder);
