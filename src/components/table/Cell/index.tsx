import * as React from 'react';
import { useContext } from '@rc-component/context';
import { useEvent } from '@rc-component/util';
import { clsx } from '@util/classNameUtils';
import useSemanticCls from '@util/hooks/useSemanticCls';
import { isValidElement } from '@util/reactNode';
import type { AnyObject } from '@util/type';
import TableContext from '../context/TableContext';
import type {
  AlignType,
  CellEllipsisType,
  CustomizeComponent,
  DataIndex,
  InternalColumnType,
  ScopeType,
} from '../interface';
import useCellRender from './useCellRender';
import useHoverState from './useHoverState';

export interface CellProps<RecordType extends AnyObject> {
  prefixCls?: string;
  className?: InternalColumnType<RecordType>['className'];
  cellKey?: React.Key;
  record: RecordType;
  rowIndex: number;
  rowSelected?: boolean;
  index: number;
  cellTitle?: React.ReactNode;
  /** the index of the record. For the render(value, record, renderIndex) */
  renderIndex: number;
  totalRowCount?: number;
  totalColCount?: number;
  dataIndex?: DataIndex<RecordType>;
  render?: InternalColumnType<RecordType>['render'];
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
  pinned?: boolean;
  lastPinLeft?: boolean;
  firstPinRight?: boolean;
  allColsFixedLeft?: boolean;

  // ====================== Private Props ======================
  /** @private Used for `expandable` with nest tree */
  appendNode?: React.ReactNode;
  additionalProps?: React.TdHTMLAttributes<HTMLTableCellElement>;

  rowType?: 'header' | 'body' | 'footer';

  isSticky?: boolean;

  valueType?: InternalColumnType<RecordType>['valueType'];
  valueEnum?: InternalColumnType<RecordType>['valueEnum'];
  editable?: InternalColumnType<RecordType>['editable'];
  editing?: boolean;
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
    } else if (
      isValidElement<any>(children) &&
      typeof (children as React.ReactElement<any>).props.children === 'string'
    ) {
      title = (children as React.ReactElement<any>).props.children;
    }
  }
  return title;
};

function Cell<RecordType extends AnyObject>(props: CellProps<RecordType>) {
  const {
    component: Component,
    ellipsis,
    scope,
    index,

    // Style
    prefixCls,
    className,
    align,

    // Value
    record,
    totalRowCount,
    totalColCount,

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
    lastPinLeft,
    firstPinRight,
    pinned,

    // Private
    appendNode,
    additionalProps = {},
    isSticky,
  } = props;

  const cellPrefixCls = `${prefixCls}-cell`;
  const { allColumnsFixedLeft, rowHoverable, size, verticalLine, fixFooter, cellClassName } =
    useContext(TableContext, [
      'allColumnsFixedLeft',
      'rowHoverable',
      'size',
      'verticalLine',
      'fixFooter',
      'cellClassName',
    ]);

  // ====================== Value =======================
  const childNode = useCellRender(props);

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

  const atBottom = !!totalRowCount && rowIndex + mergedRowSpan === totalRowCount;
  const atRight = !!totalColCount && index + mergedColSpan === totalColCount;

  // ====================== Hover =======================
  const [hovering, onHover] = useHoverState(rowIndex, mergedRowSpan);

  // ====================== SemanticClassName =======================
  const semanticCls = useSemanticCls([cellClassName, className], {
    rowType,
    hovering,
    selected: rowSelected,
    fixed: isFixLeft ? 'left' : isFixRight ? 'right' : undefined,
    pinned,
    lastRow: atBottom,
    lastCell: atRight,
  });

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

  // >>>>> ClassName
  const mergedClassName = clsx(
    cellPrefixCls,
    {
      [`${cellPrefixCls}-fix-left`]: isFixLeft,
      [`${cellPrefixCls}-pin-left-last`]: lastPinLeft,
      [`${cellPrefixCls}-pin-left`]: isFixLeft && pinned,
      [`${cellPrefixCls}-fix-right`]: isFixRight,
      [`${cellPrefixCls}-pin-right-first`]: firstPinRight,
      [`${cellPrefixCls}-pin-right`]: isFixRight && pinned,
      [`${cellPrefixCls}-ellipsis`]: ellipsis,
      [`${cellPrefixCls}-with-append`]: appendNode,
      [`${cellPrefixCls}-fix-sticky`]: (isFixLeft || isFixRight) && isSticky,
      [`${cellPrefixCls}-row-hover`]: hovering,
    },
    'border-b-border-secondary relative border-b px-3 py-4 transition-colors',
    {
      'px-2 py-3': size === 'middle',
      'px-2 py-2': size === 'small',
    },
    {
      sticky: isSticky || isFixLeft || isFixRight,
      'bg-elevated/75 backdrop-blur-sm': pinned || isSticky,
      'border-b-0': atBottom,
      truncate: ellipsis,
      'after:pointer-events-none after:absolute after:top-0 after:right-0 after:-bottom-px after:w-7 after:translate-x-full after:shadow-[inset_10px_0_8px_-8px_rgba(0,_0,_0,_0.08)] after:transition-shadow group-last/body-row:after:bottom-0':
        lastPinLeft,
      'after:pointer-events-none after:absolute after:top-0 after:-bottom-px after:left-0 after:w-7 after:-translate-x-full after:shadow-[inset_-10px_0_8px_-8px_rgba(0,_0,_0,_0.08)] after:transition-shadow group-last/body-row:after:bottom-0':
        firstPinRight,
      'after:border-r-border-secondary after:border-r': firstPinRight && verticalLine,
      'after:bottom-0': atBottom && (firstPinRight || lastPinLeft),
      'after:hidden': lastPinLeft && allColumnsFixedLeft,
    },
    /** >>> Z-Index */
    {
      'z-1': isFixRight,
      'z-2': isFixLeft,
      'z-3': isSticky,
      'z-4': isSticky && isFixLeft,
    },
    rowType === 'header' && [
      'border-b-border border-b py-3.5 text-start font-semibold',
      {
        'py-2.5': size === 'middle',
        'py-1.5': size === 'small',
      },
      {
        'border-b-0 text-center': mergedColSpan > 1,
        'before:bg-border-tertiary before:absolute before:end-0 before:top-1/2 before:h-5 before:w-px before:-translate-y-1/2 last:before:hidden':
          mergedColSpan === 1 && !verticalLine && !lastPinLeft,
      },
    ],
    rowType === 'body' && [{ 'bg-fill-quinary': hovering }],
    rowType === 'footer' && [
      'group-first/footer-row:border-t-border-secondary group-first/footer-row:border-t',
      {
        'border-b-border-secondary border-b group-first/footer-row:border-t-0': fixFooter === 'top',
      },
    ],
    /** >>> Selected */
    rowSelected && [
      'bg-fill-quinary',
      {
        'first:before:bg-primary first:before:absolute first:before:top-0 first:before:bottom-0 first:before:left-0 first:before:w-0.5':
          index === 0,
      },
    ],
    /** >>> Bordered */
    verticalLine && [
      'border-border-secondary border-r',
      {
        'border-r-0': atRight,
      },
      rowType === 'header' && [
        'border-b-border-secondary border-b',
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

  if (ellipsis && (lastPinLeft || firstPinRight)) {
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
