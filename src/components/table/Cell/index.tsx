import * as React from 'react';
import { useContext } from '@rc-component/context';
import { clsx } from '@util/classNameUtils';
import useSemanticCls from '@util/hooks/useSemanticCls';
import type { AnyObject } from '@util/type';
import { useEvent } from 'rc-util';
import TableContext from '../context/TableContext';
import type {
  AlignType,
  CellEllipsisType,
  ColumnRenderActionType,
  ColumnType,
  CustomizeComponent,
  DataIndex,
  ScopeType,
} from '../interface';
import useCellRender from './useCellRender';
import useHoverState from './useHoverState';

export interface CellProps<RecordType extends AnyObject> {
  prefixCls?: string;
  className?: ColumnType<RecordType>['className'];
  cellKey?: React.Key;
  record: RecordType;
  rowIndex: number;
  rowSelected?: boolean;
  index: number;
  /** the index of the record. For the render(value, record, renderIndex) */
  renderIndex: number;
  totalRowCount?: number;
  totalColCount?: number;
  dataIndex?: DataIndex<RecordType>;
  render?: ColumnType<RecordType>['render'];
  component: CustomizeComponent;
  children?: React.ReactNode;
  colSpan?: number;
  rowSpan?: number;
  scope?: ScopeType;
  ellipsis?: CellEllipsisType;
  align?: AlignType;

  shouldCellUpdate?: (record: RecordType, prevRecord: RecordType) => boolean;

  // Fixed
  fixLeft?: number | false;
  fixRight?: number | false;
  pinged?: boolean;
  lastPingLeft?: boolean;
  firstPingRight?: boolean;
  allColsFixedLeft?: boolean;

  // ====================== Private Props ======================
  /** @private Used for `expandable` with nest tree */
  appendNode?: React.ReactNode;
  additionalProps?: React.TdHTMLAttributes<HTMLTableCellElement>;

  rowType?: 'header' | 'body' | 'footer';

  isSticky?: boolean;

  valueType?: ColumnType<RecordType>['valueType'];
  valueEnum?: ColumnType<RecordType>['valueEnum'];
  editable?: ColumnType<RecordType>['editable'];
  editing?: boolean;

  renderAction?: ColumnRenderActionType;
  actionRender?: (record: RecordType, index: number) => React.ReactNode[];
}

export const getTitleFromCellRenderChildren = ({
  ellipsis,
  rowType,
  children,
}: Pick<CellProps<any>, 'ellipsis' | 'rowType' | 'children'>) => {
  let title: string | undefined;
  const ellipsisConfig = ellipsis === true ? { showTitle: true } : ellipsis;
  if (ellipsisConfig && (ellipsisConfig.showTitle || rowType === 'header')) {
    if (typeof children === 'string' || typeof children === 'number') {
      title = children.toString();
    } else if (React.isValidElement(children) && typeof children.props.children === 'string') {
      title = children.props.children;
    }
  }
  return title;
};

function Cell<RecordType extends AnyObject>(props: CellProps<RecordType>) {
  const {
    component: Component,
    children,
    ellipsis,
    scope,
    index,

    // Style
    prefixCls,
    className,
    align,

    // Value
    record,
    render,
    dataIndex,
    renderIndex,
    totalRowCount,
    totalColCount,
    shouldCellUpdate,

    // Row
    rowIndex,
    rowType = 'body',
    rowSelected,

    // Span
    colSpan,
    rowSpan,

    // Fixed
    fixLeft,
    fixRight,
    lastPingLeft,
    firstPingRight,
    pinged,

    // Private
    appendNode,
    additionalProps = {},
    isSticky,

    valueType,
    valueEnum,
    cellKey,
    editable,
    editing,
    renderAction,
    actionRender,
  } = props;

  const cellPrefixCls = `${prefixCls}-cell`;
  const { allColumnsFixedLeft, rowHoverable, size, verticalLine, fixFooter, tableKey } = useContext(
    TableContext,
    ['allColumnsFixedLeft', 'rowHoverable', 'size', 'verticalLine', 'fixFooter', 'tableKey'],
  );

  // ====================== Value =======================
  const childNode = useCellRender({
    record,
    dataIndex,
    renderIndex,
    valueType,
    valueEnum,
    cacheKey: `${tableKey}-cell-${cellKey}`,
    rowType,
    children,
    editable,
    editing,
    render,
    shouldCellUpdate,
    renderAction,
    actionRender,
  });

  // ====================== Fixed =======================
  const fixedStyle: React.CSSProperties = {};
  const isFixLeft = typeof fixLeft === 'number';
  const isFixRight = typeof fixRight === 'number';

  if (isFixLeft) {
    fixedStyle.position = 'sticky';
    fixedStyle.left = fixLeft as number;
  }
  if (isFixRight) {
    fixedStyle.position = 'sticky';
    fixedStyle.right = fixRight as number;
  }

  // ================ RowSpan & ColSpan =================
  const mergedColSpan = additionalProps.colSpan ?? colSpan ?? 1;
  const mergedRowSpan = additionalProps.rowSpan ?? rowSpan ?? 1;

  // ====================== Hover =======================
  const [hovering, onHover] = useHoverState(rowIndex, mergedRowSpan);

  // ====================== SemanticClassName =======================
  const semanticCls = useSemanticCls(className, { rowType, hovering });

  const onMouseEnter: React.MouseEventHandler<HTMLTableCellElement> = useEvent((event) => {
    if (record) {
      onHover(rowIndex, rowIndex + mergedRowSpan - 1);
    }

    additionalProps?.onMouseEnter?.(event);
  });

  const onMouseLeave: React.MouseEventHandler<HTMLTableCellElement> = useEvent((event) => {
    if (record) {
      onHover(-1, -1);
    }

    additionalProps?.onMouseLeave?.(event);
  });

  // ====================== Render ======================
  if (mergedColSpan === 0 || mergedRowSpan === 0) {
    return null;
  }

  // >>>>> Title
  const title =
    additionalProps.title ??
    getTitleFromCellRenderChildren({
      rowType,
      ellipsis,
      children: childNode,
    });

  const atBottom = totalRowCount && rowIndex + mergedRowSpan === totalRowCount;
  const atRight = totalColCount && index + mergedColSpan === totalColCount;

  // >>>>> ClassName
  const mergedClassName = clsx(
    cellPrefixCls,
    {
      [`${cellPrefixCls}-fix-left`]: isFixLeft,
      [`${cellPrefixCls}-ping-left-last`]: lastPingLeft,
      [`${cellPrefixCls}-ping-left`]: isFixLeft && pinged,
      [`${cellPrefixCls}-fix-right`]: isFixRight,
      [`${cellPrefixCls}-ping-right-first`]: firstPingRight,
      [`${cellPrefixCls}-ping-right`]: isFixRight && pinged,
      [`${cellPrefixCls}-ellipsis`]: ellipsis,
      [`${cellPrefixCls}-with-append`]: appendNode,
      [`${cellPrefixCls}-fix-sticky`]: (isFixLeft || isFixRight) && isSticky,
      [`${cellPrefixCls}-row-hover`]: hovering,
    },
    'relative border-b border-b-border-secondary bg-container px-3 py-4 transition-colors',
    {
      'px-2 py-3': size === 'middle',
      'px-2 py-2': size === 'small',
    },
    {
      'backdrop-blur': isSticky || isFixLeft || isFixRight,
      'border-b-0': atBottom,
      ['truncate']: ellipsis,
      'sticky z-[2]': isFixLeft || isFixRight,
      'after:pointer-events-none after:absolute after:-bottom-px after:right-0 after:top-0 after:w-7 after:translate-x-full after:shadow-[inset_10px_0_8px_-8px_rgba(0,_0,_0,_0.08)] after:transition-shadow group-last/body-row:after:bottom-0':
        lastPingLeft,
      'after:pointer-events-none after:absolute after:-bottom-px after:left-0 after:top-0 after:w-7 after:-translate-x-full after:shadow-[inset_-10px_0_8px_-8px_rgba(0,_0,_0,_0.08)] after:transition-shadow group-last/body-row:after:bottom-0':
        firstPingRight,
      'after:border-r after:border-r-border-secondary': firstPingRight && verticalLine,
      'after:bottom-0': atBottom && (firstPingRight || lastPingLeft),
      'after:hidden': lastPingLeft && allColumnsFixedLeft,
    },
    rowType === 'header' && [
      'border-b border-b-border py-3.5 text-start font-semibold',
      {
        'py-2.5': size === 'middle',
        'py-1.5': size === 'small',
      },
      {
        'border-b-0 text-center': mergedColSpan > 1,
        'before:absolute before:end-0 before:top-1/2 before:h-5 before:w-px before:-translate-y-1/2 before:bg-border-tertiary last:before:hidden':
          mergedColSpan === 1 && !verticalLine && !lastPingLeft,
      },
    ],
    rowType === 'body' && [{ 'bg-fill-quinary': hovering }],
    rowType === 'footer' && [
      'group-first/footer-row:border-t group-first/footer-row:border-t-border-secondary',
      {
        'border-b border-b-border-secondary group-first/footer-row:border-t-0': fixFooter === 'top',
      },
    ],
    /** >>> Selected */
    rowSelected && [
      'bg-fill-quinary',
      {
        'first:before:absolute first:before:bottom-0 first:before:left-0 first:before:top-0 first:before:w-0.5 first:before:bg-primary':
          index === 0,
      },
    ],
    /** >>> Bordered */
    verticalLine && [
      'border-r border-border-secondary',
      {
        'border-r-0': atRight,
      },
      rowType === 'header' && [
        'border-b border-b-border-secondary',
        {
          'border-b-border': atBottom,
        },
      ],
    ],

    semanticCls.root,
    additionalProps.className,
  );

  // >>>>> Style
  const alignStyle: React.CSSProperties = {};
  if (align) {
    alignStyle.textAlign = align;
  }

  // The order is important since user can overwrite style.
  const mergedStyle = {
    ...fixedStyle,
    ...alignStyle,
    ...additionalProps.style,
    ...((isSticky || isFixLeft || isFixRight) && {
      backgroundColor: 'color-mix(in oklab, hsla(var(--container)) 75%, transparent)',
    }),
  };

  // >>>>> Children Node
  let mergedChildNode = childNode;

  // Not crash if final `childNode` is not validate ReactNode
  if (
    typeof mergedChildNode === 'object' &&
    !Array.isArray(mergedChildNode) &&
    !React.isValidElement(mergedChildNode)
  ) {
    mergedChildNode = null;
  }

  if (ellipsis && (lastPingLeft || firstPingRight)) {
    mergedChildNode = <span className={`${cellPrefixCls}-content`}>{mergedChildNode}</span>;
  }

  return (
    <Component
      {...additionalProps}
      className={mergedClassName}
      style={mergedStyle}
      // A11y
      title={title}
      scope={scope}
      // Hover
      onMouseEnter={rowHoverable ? onMouseEnter : undefined}
      onMouseLeave={rowHoverable ? onMouseLeave : undefined}
      //Span
      colSpan={mergedColSpan !== 1 ? mergedColSpan : null}
      rowSpan={mergedRowSpan !== 1 ? mergedRowSpan : null}
    >
      {appendNode}
      {mergedChildNode}
    </Component>
  );
}

export default React.memo(Cell) as typeof Cell;
