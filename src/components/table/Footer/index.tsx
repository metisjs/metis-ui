import * as React from 'react';
import { useContext } from '@rc-component/context';
import { clsx } from '@util/classNameUtils';
import { isFragment, isValidElement } from '@util/reactNode';
import type { AnyObject } from '@util/type';
import TableContext, { responseImmutable } from '../context/TableContext';
import type { ColumnsPos, InternalColumnType, ScrollOffset, StickyOffsets } from '../interface';
import { SummaryContext } from './contexts';
import Summary from './Summary';

type FlattenColumns<RecordType extends AnyObject> = readonly (InternalColumnType<RecordType> & {
  scrollbar?: boolean;
})[];

export interface FooterProps<RecordType extends AnyObject> {
  className?: string;
  children: React.ReactNode;
  stickyOffsets: StickyOffsets;
  scrollOffset: ScrollOffset;
  columnsPos: ColumnsPos;
  flattenColumns: FlattenColumns<RecordType>;
}

function Footer<RecordType extends AnyObject>(props: FooterProps<RecordType>) {
  const { className, children, stickyOffsets, columnsPos, scrollOffset, flattenColumns } = props;

  const prefixCls = useContext(TableContext, 'prefixCls');

  const lastColumnIndex = flattenColumns.length - 1;
  const scrollColumn = flattenColumns[lastColumnIndex];

  const summaryContext = React.useMemo(() => {
    let totalRowCount = 0;
    if (isValidElement<{ children?: React.ReactNode }>(children)) {
      if (isFragment(children)) {
        totalRowCount = React.Children.count(children.props.children);
      } else {
        totalRowCount = React.Children.count(children);
      }
    }
    return {
      stickyOffsets,
      flattenColumns,
      scrollColumnIndex: scrollColumn?.scrollbar ? lastColumnIndex : null,
      columnsPos,
      scrollOffset,
      totalRowCount,
    };
  }, [
    scrollColumn,
    flattenColumns,
    lastColumnIndex,
    stickyOffsets,
    columnsPos,
    scrollOffset,
    children,
  ]);

  return (
    <SummaryContext.Provider value={summaryContext}>
      <tfoot className={clsx(`${prefixCls}-summary`, className)}>{children}</tfoot>
    </SummaryContext.Provider>
  );
}

export default responseImmutable(Footer);

export const FooterComponents = Summary;
