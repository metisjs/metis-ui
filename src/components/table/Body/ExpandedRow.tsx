import * as React from 'react';
import { useContext } from '@rc-component/context';
import { clsx } from '@util/classNameUtils';
import Cell from '../Cell';
import TableContext from '../context/TableContext';
import type { CustomizeComponent } from '../interface';

export interface ExpandedRowProps {
  prefixCls: string;
  component: CustomizeComponent;
  cellComponent: CustomizeComponent;
  className: string;
  expanded: boolean;
  children: React.ReactNode;
  colSpan: number;
  isEmpty: boolean;
}

function ExpandedRow(props: ExpandedRowProps) {
  const {
    prefixCls,
    children,
    component: Component,
    cellComponent,
    className,
    expanded,
    colSpan,
    isEmpty,
  } = props;

  const { fixColumn, componentWidth, horizonScroll } = useContext(TableContext, [
    'fixHeader',
    'fixColumn',
    'componentWidth',
    'horizonScroll',
  ]);

  // Cache render node
  let contentNode = children;

  if (isEmpty ? horizonScroll && componentWidth : fixColumn) {
    contentNode = (
      <div
        style={{
          width: componentWidth,
        }}
        className={clsx(`${prefixCls}-expanded-row-fixed`, 'sticky left-0 overflow-hidden')}
      >
        {contentNode}
      </div>
    );
  }

  return (
    <Component
      className={className}
      style={{
        display: expanded ? null : 'none',
      }}
    >
      <Cell
        component={cellComponent}
        prefixCls={prefixCls}
        colSpan={colSpan}
        record={null!}
        renderIndex={-1}
        rowIndex={-1}
        index={0}
        totalColCount={colSpan}
      >
        {contentNode}
      </Cell>
    </Component>
  );
}

export default ExpandedRow;
