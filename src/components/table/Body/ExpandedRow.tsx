import * as React from 'react';
import { useContext } from '@rc-component/context';
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

  const { scrollbarSize, fixHeader, fixColumn, componentWidth, horizonScroll } = useContext(
    TableContext,
    ['scrollbarSize', 'fixHeader', 'fixColumn', 'componentWidth', 'horizonScroll'],
  );

  // Cache render node
  let contentNode = children;

  if (isEmpty ? horizonScroll && componentWidth : fixColumn) {
    contentNode = (
      <div
        style={{
          width: componentWidth - (fixHeader && !isEmpty ? scrollbarSize : 0),
          position: 'sticky',
          left: 0,
          overflow: 'hidden',
        }}
        className={`${prefixCls}-expanded-row-fixed`}
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
        index={-1}
      >
        {contentNode}
      </Cell>
    </Component>
  );
}

export default ExpandedRow;
