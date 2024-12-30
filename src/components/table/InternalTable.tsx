import * as React from 'react';
import type { AnyObject } from '@util/type';
import { devUseWarning } from '@util/warning';
import classNames from 'classnames';
import type { SizeInfo } from 'rc-resize-observer';
import ResizeObserver from 'rc-resize-observer';
import { getDOM } from 'rc-util/lib/Dom/findDOMNode';
import isVisible from 'rc-util/lib/Dom/isVisible';
import useEvent from 'rc-util/lib/hooks/useEvent';
import pickAttrs from 'rc-util/lib/pickAttrs';
import getValue from 'rc-util/lib/utils/get';
import type { ConfigConsumerProps } from '../config-provider';
import { ConfigContext } from '../config-provider';
import DefaultRenderEmpty from '../config-provider/defaultRenderEmpty';
import type { SizeType } from '../config-provider/SizeContext';
import defaultLocale from '../locale/en_US';
import type { ScrollbarRef, ScrollValues } from '../scrollbar';
import Scrollbar from '../scrollbar';
import type { SpinProps } from '../spin';
import Body from './Body';
import ColGroup from './ColGroup';
import type { TableContextProps } from './context/TableContext';
import TableContext, { makeImmutable } from './context/TableContext';
import type { FixedHolderProps } from './FixedHolder';
import FixedHolder from './FixedHolder';
import Footer from './Footer';
import type { SummaryProps } from './Footer/Summary';
import Summary from './Footer/Summary';
import Header from './Header/Header';
import useColumns from './hooks/useColumns';
import useExpand from './hooks/useExpand';
import useFixedInfo from './hooks/useFixedInfo';
import { useLayoutState, useTimeoutLock } from './hooks/useFrame';
import useHover from './hooks/useHover';
import useSelection from './hooks/useSelection';
import useSticky from './hooks/useSticky';
import useStickyOffsets from './hooks/useStickyOffsets';
import type {
  ColumnsType,
  ColumnType,
  CustomizeScrollBody,
  ExpandableConfig,
  FilterValue,
  GetComponent,
  GetComponentProps,
  GetPopupContainer,
  GetRowKey,
  PanelRender,
  Reference,
  RowClassName,
  SorterResult,
  SorterTooltipProps,
  SortOrder,
  TableComponents,
  TableCurrentDataSource,
  TableLayout,
  TableLocale,
  TablePaginationConfig,
  TableRowSelection,
  TableSticky,
} from './interface';
import Panel from './Panel';
import { getColumnsKey, validateValue } from './utils/valueUtil';

export const DEFAULT_PREFIX = 'metis-table';

// Used for conditions cache
const EMPTY_DATA = [] as const;

// Used for customize scroll
const EMPTY_SCROLL_TARGET = {};

export interface TableProps<RecordType extends AnyObject> {
  prefixCls?: string;
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  dataSource?: readonly RecordType[];
  columns?: ColumnsType<RecordType>;
  rowKey?: string | keyof RecordType | GetRowKey<RecordType>;
  tableLayout?: TableLayout;

  // Fixed Columns
  scroll?: { x?: number | true | string; y?: number | string; scrollToFirstRowOnChange?: boolean };

  // Expandable
  /** Config expand rows */
  expandable?: ExpandableConfig<RecordType>;
  rowClassName?: string | RowClassName<RecordType>;

  // Selection
  rowSelection?: TableRowSelection<RecordType>;

  // Additional Part
  title?: PanelRender<RecordType>;
  footer?: PanelRender<RecordType>;
  summary?: (data: readonly RecordType[]) => React.ReactNode;

  // Customize
  id?: string;
  showHeader?: boolean;
  components?: TableComponents<RecordType>;
  onRow?: GetComponentProps<RecordType>;
  onHeaderRow?: GetComponentProps<readonly ColumnType<RecordType>[]>;

  sticky?: boolean | TableSticky;

  rowHoverable?: boolean;

  pagination?: false | TablePaginationConfig;

  loading?: boolean | SpinProps;
  size?: SizeType;
  bordered?: boolean;
  locale?: TableLocale;

  onChange?: (
    pagination: TablePaginationConfig,
    filters: Record<string, FilterValue | null>,
    sorter: SorterResult<RecordType> | SorterResult<RecordType>[],
    extra: TableCurrentDataSource<RecordType>,
  ) => void;

  getPopupContainer?: GetPopupContainer;

  sortDirections?: SortOrder[];
  showSorterTooltip?: boolean | SorterTooltipProps;
  virtual?: boolean;

  // Events
  onScroll?: React.UIEventHandler<HTMLDivElement>;
}

export interface InternalTableProps<RecordType extends AnyObject = AnyObject>
  extends TableProps<RecordType> {
  _renderTimes: number;
}

function InternalTable<RecordType extends AnyObject>(
  props: InternalTableProps<RecordType>,
  ref: React.Ref<Reference>,
) {
  const {
    prefixCls: customizePrefixCls,
    className,
    rowClassName,
    style,
    dataSource: data,
    rowKey = 'key',
    scroll,
    tableLayout,
    columns,

    expandable,
    rowSelection,

    // Additional Part
    title,
    footer,
    summary,

    // Customize
    id,
    showHeader,
    components,
    onRow,
    onHeaderRow,
    getPopupContainer,

    // Events
    onScroll,

    sticky,
    rowHoverable = true,
    locale,

    children,
  } = props;

  const {
    locale: contextLocale = defaultLocale,
    renderEmpty,
    getPrefixCls,
    getPopupContainer: getContextPopupContainer,
  } = React.useContext<ConfigConsumerProps>(ConfigContext);
  const prefixCls = getPrefixCls('table', customizePrefixCls);

  const tableLocale: TableLocale = { ...contextLocale.Table, ...locale };

  const mergedData = data || EMPTY_DATA;
  const hasData = !!mergedData.length;

  const emptyText =
    typeof locale?.emptyText !== 'undefined'
      ? locale.emptyText
      : renderEmpty?.('Table') || <DefaultRenderEmpty componentName="Table" />;

  // ==================== Warning =====================
  const warning = devUseWarning('Table');

  // ==================== Customize =====================
  const getComponent = React.useCallback<GetComponent>(
    (path, defaultComponent) => getValue(components, path) || defaultComponent,
    [components],
  );

  const getRowKey = React.useMemo<GetRowKey<RecordType>>(() => {
    if (typeof rowKey === 'function') {
      return rowKey;
    }
    return (record: RecordType) => {
      const key = record && record[rowKey];

      warning(
        key !== undefined,
        'usage',
        'Each record in table should have a unique `key` prop, or set `rowKey` to an unique primary key.',
      );

      return key;
    };
  }, [rowKey]);

  const customizeScrollBody = getComponent(['body']) as CustomizeScrollBody<RecordType>;

  // ====================== Hover =======================
  const [startRow, endRow, onHover] = useHover();

  // ====================== Expand ======================
  const [
    transformExpandableColumns,
    expandableConfig,
    expandableType,
    expandedKeys,
    expandIcon,
    childrenColumnName,
    onTriggerExpand,
  ] = useExpand(prefixCls, expandable, mergedData, getRowKey);

  // ====================== Selection ======================
  const [transformSelectionColumns, selectedKeySet] = useSelection(
    {
      prefixCls,
      data: mergedData,
      pageData,
      getRowKey,
      getRecordByKey,
      expandableType,
      childrenColumnName,
      locale: tableLocale,
      getPopupContainer: getPopupContainer || getContextPopupContainer,
    },
    rowSelection,
  );

  // ====================== Column ======================
  const scrollX = scroll?.x;
  const [componentWidth, setComponentWidth] = React.useState(0);

  const transformColumns = React.useCallback(
    (innerColumns: ColumnsType<RecordType>): ColumnsType<RecordType> =>
      transformTitleColumns(
        transformSelectionColumns(
          transformFilterColumns(transformSorterColumns(transformExpandableColumns(innerColumns))),
        ),
      ),
    [transformSorterColumns, transformFilterColumns, transformSelectionColumns],
  );

  const [mergedColumns, flattenColumns, flattenScrollX, hasGapFixed] = useColumns(
    {
      columns,
      scrollWidth: typeof scrollX === 'number' ? scrollX : undefined,
      clientWidth: componentWidth,
      children,
    },
    transformColumns,
  );
  const mergedScrollX = flattenScrollX ?? scrollX;

  const columnContext = React.useMemo(
    () => ({
      columns: mergedColumns,
      flattenColumns,
    }),
    [mergedColumns, flattenColumns],
  );

  // ======================= Refs =======================
  const fullTableRef = React.useRef<HTMLDivElement>(null);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const scrollHeaderRef = React.useRef<HTMLDivElement>(null);
  const scrollBodyRef = React.useRef<ScrollbarRef>(null);
  const scrollSummaryRef = React.useRef<HTMLDivElement>(null);

  React.useImperativeHandle(ref, () => {
    return {
      nativeElement: fullTableRef.current!,
      scrollTo: (config) => {},
    };
  });

  // ====================== Scroll ======================
  const [pingedLeft, setPingedLeft] = React.useState(false);
  const [pingedRight, setPingedRight] = React.useState(false);
  const [colsWidths, updateColsWidths] = useLayoutState(new Map<React.Key, number>());

  // Convert map to number width
  const colsKeys = getColumnsKey(flattenColumns);
  const pureColWidths = colsKeys.map((columnKey) => colsWidths.get(columnKey)!);
  const colWidths = React.useMemo(() => pureColWidths, [pureColWidths.join('_')]);
  const stickyOffsets = useStickyOffsets(colWidths, flattenColumns);
  const fixHeader = !!scroll && validateValue(scroll.y);
  const horizonScroll = (scroll && validateValue(mergedScrollX)) || Boolean(expandableConfig.fixed);
  const fixColumn = horizonScroll && flattenColumns.some(({ fixed }) => fixed);

  // Sticky
  const stickyRef = React.useRef<{
    setScrollLeft: (left: number) => void;
    checkScrollBarVisible: () => void;
  }>();
  const { isSticky, offsetHeader, offsetSummary, offsetScroll, stickyClassName, container } =
    useSticky(sticky, prefixCls);

  // Footer (Fix footer must fixed header)
  const summaryNode = React.useMemo(() => summary?.(mergedData), [summary, mergedData]);
  const fixFooter =
    (fixHeader || isSticky) &&
    React.isValidElement(summaryNode) &&
    summaryNode.type === Summary &&
    (summaryNode.props as SummaryProps).fixed;

  // Scroll
  let scrollTableStyle: React.CSSProperties = {};

  if (horizonScroll) {
    scrollTableStyle = {
      width: mergedScrollX === true ? 'auto' : mergedScrollX,
      minWidth: '100%',
    };
  }

  const onColumnResize = React.useCallback((columnKey: React.Key, width: number) => {
    if (fullTableRef.current && isVisible(fullTableRef.current)) {
      updateColsWidths((widths) => {
        if (widths.get(columnKey) !== width) {
          const newWidths = new Map(widths);
          newWidths.set(columnKey, width);
          return newWidths;
        }
        return widths;
      });
    }
  }, []);

  const [setScrollTarget, getScrollTarget] = useTimeoutLock<HTMLElement>();

  function forceScroll(
    scrollLeft: number,
    target: HTMLDivElement | null | ((left: number) => void),
  ) {
    if (!target) {
      return;
    }
    if (typeof target === 'function') {
      target(scrollLeft);
    } else if (target.scrollLeft !== scrollLeft) {
      target.scrollLeft = scrollLeft;

      if (target.scrollLeft !== scrollLeft) {
        setTimeout(() => {
          target.scrollLeft = scrollLeft;
        }, 0);
      }
    }
  }

  const onInternalScroll = useEvent(
    ({ scrollLeft }: { scrollLeft: number }, { currentTarget }: { currentTarget: HTMLElement }) => {
      const compareTarget = currentTarget || EMPTY_SCROLL_TARGET;
      if (!getScrollTarget() || getScrollTarget() === compareTarget) {
        setScrollTarget(compareTarget);

        forceScroll(scrollLeft, scrollHeaderRef.current);
        forceScroll(scrollLeft, (left) => scrollBodyRef.current?.scrollTo({ left }));
        forceScroll(scrollLeft, scrollSummaryRef.current);
        // forceScroll(mergedScrollLeft, stickyRef.current?.setScrollLeft);
      }

      const measureTarget = currentTarget || scrollHeaderRef.current;
      if (measureTarget) {
        const scrollWidth =
          typeof mergedScrollX === 'number' ? mergedScrollX : measureTarget.scrollWidth;
        const clientWidth = measureTarget.clientWidth;
        // There is no space to scroll
        if (scrollWidth === clientWidth) {
          setPingedLeft(false);
          setPingedRight(false);
          return;
        }
        setPingedLeft(scrollLeft > 0);
        setPingedRight(scrollLeft < scrollWidth - clientWidth);
      }
    },
  );

  const onBodyScroll = useEvent((values: ScrollValues, e: React.UIEvent<HTMLDivElement>) => {
    onInternalScroll(values, e);
    onScroll?.(e);
  });

  const triggerOnScroll = () => {
    if (horizonScroll && scrollBodyRef.current) {
      onInternalScroll(scrollBodyRef.current.getValues(), {
        currentTarget: getDOM(scrollBodyRef.current.view),
      } as React.UIEvent<HTMLDivElement>);
    } else {
      setPingedLeft(false);
      setPingedRight(false);
    }
  };

  const onFullTableResize = ({ width }: SizeInfo) => {
    stickyRef.current?.checkScrollBarVisible();
    let mergedWidth = fullTableRef.current ? fullTableRef.current.offsetWidth : width;
    if (containerRef.current) {
      // Ignore border width
      const style = getComputedStyle(containerRef.current);
      const borderLeft = parseInt(style.borderLeftWidth, 10);
      const borderRight = parseInt(style.borderRightWidth, 10);
      mergedWidth = mergedWidth - borderLeft - borderRight;
    }

    if (mergedWidth !== componentWidth) {
      triggerOnScroll();
      setComponentWidth(mergedWidth);
    }
  };

  // Sync scroll bar when init or `horizonScroll`, `data` and `columns.length` changed
  const mounted = React.useRef(false);
  React.useEffect(() => {
    // onFullTableResize will be trigger once when ResizeObserver is mounted
    // This will reduce one duplicated triggerOnScroll time
    if (mounted.current) {
      triggerOnScroll();
    }
  }, [horizonScroll, data, mergedColumns.length]);
  React.useEffect(() => {
    mounted.current = true;
  }, []);

  // ========================================================================
  // ==                               Render                               ==
  // ========================================================================
  // =================== Render: Func ===================
  const renderFixedHeaderTable = React.useCallback<FixedHolderProps<RecordType>['children']>(
    (fixedHeaderPassProps) => (
      <>
        <Header {...fixedHeaderPassProps} />
        {fixFooter === 'top' && <Footer {...fixedHeaderPassProps}>{summaryNode}</Footer>}
      </>
    ),
    [fixFooter, summaryNode],
  );

  const renderFixedFooterTable = React.useCallback<FixedHolderProps<RecordType>['children']>(
    (fixedHeaderPassProps) => <Footer {...fixedHeaderPassProps}>{summaryNode}</Footer>,
    [summaryNode],
  );

  // =================== Render: Node ===================
  const TableComponent = getComponent(['table'], 'table');

  // Table layout
  const mergedTableLayout = React.useMemo<TableLayout>(() => {
    if (tableLayout) {
      return tableLayout;
    }
    // When scroll.x is max-content, no need to fix table layout
    // it's width should stretch out to fit content
    if (fixColumn) {
      return mergedScrollX === 'max-content' ? 'auto' : 'fixed';
    }
    if (fixHeader || isSticky || flattenColumns.some(({ ellipsis }) => ellipsis)) {
      return 'fixed';
    }
    return 'auto';
  }, [fixHeader, fixColumn, flattenColumns, tableLayout, isSticky]);

  let groupTableNode: React.ReactNode;

  // Header props
  const headerProps = {
    colWidths,
    columnCount: flattenColumns.length,
    stickyOffsets,
    onHeaderRow,
    fixHeader,
    scroll,
  };

  // Empty
  const emptyNode: React.ReactNode = React.useMemo(() => {
    if (hasData) {
      return null;
    }

    if (typeof emptyText === 'function') {
      return emptyText();
    }
    return emptyText;
  }, [hasData, emptyText]);

  // Body
  const bodyTable = (
    <Body data={mergedData} measureColumnWidth={fixHeader || horizonScroll || isSticky} />
  );

  const bodyColGroup = (
    <ColGroup colWidths={flattenColumns.map(({ width }) => width)} columns={flattenColumns} />
  );

  const dataProps = pickAttrs(props, { data: true });
  const ariaProps = pickAttrs(props, { aria: true });

  if (fixHeader || isSticky) {
    // >>>>>> Fixed Header
    let bodyContent: React.ReactNode;

    if (typeof customizeScrollBody === 'function') {
      bodyContent = customizeScrollBody(mergedData, {
        ref: scrollBodyRef,
        onScroll: onInternalScroll,
      });

      headerProps.colWidths = flattenColumns.map(({ width }, index) => {
        const colWidth = index === flattenColumns.length - 1 ? (width as number) : width;
        if (typeof colWidth === 'number' && !Number.isNaN(colWidth)) {
          return colWidth;
        }

        warning(
          !(props.columns && props.columns.length),
          'usage',
          'When use `components.body` with render props. Each column should have a fixed `width` value.',
        );
        return 0;
      }) as number[];
    } else {
      bodyContent = (
        <Scrollbar
          autoHeight={fixHeader ? [0, scroll.y!] : false}
          onScroll={onBodyScroll}
          ref={scrollBodyRef}
          className={classNames(`${prefixCls}-body`)}
        >
          <TableComponent
            style={{
              ...scrollTableStyle,
              tableLayout: mergedTableLayout,
            }}
            {...ariaProps}
          >
            {bodyColGroup}
            {bodyTable}
            {!fixFooter && summaryNode && (
              <Footer stickyOffsets={stickyOffsets} flattenColumns={flattenColumns}>
                {summaryNode}
              </Footer>
            )}
          </TableComponent>
        </Scrollbar>
      );
    }

    // Fixed holder share the props
    const fixedHolderProps = {
      noData: !mergedData.length,
      maxContentScroll: horizonScroll && mergedScrollX === 'max-content',
      ...headerProps,
      ...columnContext,
      stickyClassName,
      onScroll: onInternalScroll,
    };

    groupTableNode = (
      <>
        {/* Header Table */}
        {showHeader !== false && (
          <FixedHolder
            {...fixedHolderProps}
            stickyTopOffset={offsetHeader}
            className={`${prefixCls}-header`}
            ref={scrollHeaderRef}
          >
            {renderFixedHeaderTable}
          </FixedHolder>
        )}

        {/* Body Table */}
        {bodyContent}

        {/* Summary Table */}
        {fixFooter && fixFooter !== 'top' && (
          <FixedHolder
            {...fixedHolderProps}
            stickyBottomOffset={offsetSummary}
            className={`${prefixCls}-summary`}
            ref={scrollSummaryRef}
          >
            {renderFixedFooterTable}
          </FixedHolder>
        )}

        {/* {isSticky && scrollBodyRef.current && scrollBodyRef.current instanceof Element && (
          <StickyScrollBar
            ref={stickyRef}
            offsetScroll={offsetScroll}
            scrollBodyRef={scrollBodyRef}
            onScroll={onInternalScroll}
            container={container}
          />
        )} */}
      </>
    );
  } else {
    // >>>>>> Unique table
    groupTableNode = (
      <Scrollbar
        className={classNames(`${prefixCls}-content`)}
        onScroll={onInternalScroll}
        ref={scrollBodyRef}
      >
        <TableComponent
          style={{ ...scrollTableStyle, tableLayout: mergedTableLayout }}
          {...ariaProps}
        >
          {bodyColGroup}
          {showHeader !== false && <Header {...headerProps} {...columnContext} />}
          {bodyTable}
          {summaryNode && (
            <Footer stickyOffsets={stickyOffsets} flattenColumns={flattenColumns}>
              {summaryNode}
            </Footer>
          )}
        </TableComponent>
      </Scrollbar>
    );
  }

  let fullTable = (
    <div
      className={classNames(prefixCls, className, {
        [`${prefixCls}-ping-left`]: pingedLeft,
        [`${prefixCls}-ping-right`]: pingedRight,
        [`${prefixCls}-layout-fixed`]: tableLayout === 'fixed',
        [`${prefixCls}-fixed-header`]: fixHeader,
        /** No used but for compatible */
        [`${prefixCls}-fixed-column`]: fixColumn,
        [`${prefixCls}-fixed-column-gapped`]: fixColumn && hasGapFixed,
        [`${prefixCls}-scroll-horizontal`]: horizonScroll,
        [`${prefixCls}-has-fix-left`]: flattenColumns[0] && flattenColumns[0].fixed,
        [`${prefixCls}-has-fix-right`]:
          flattenColumns[flattenColumns.length - 1] &&
          flattenColumns[flattenColumns.length - 1].fixed === 'right',
      })}
      style={style}
      id={id}
      ref={fullTableRef}
      {...dataProps}
    >
      {title && <Panel className={`${prefixCls}-title`}>{title(mergedData)}</Panel>}
      <div ref={containerRef} className={`${prefixCls}-container`}>
        {groupTableNode}
      </div>
      {footer && <Panel className={`${prefixCls}-footer`}>{footer(mergedData)}</Panel>}
    </div>
  );

  if (horizonScroll) {
    fullTable = <ResizeObserver onResize={onFullTableResize}>{fullTable}</ResizeObserver>;
  }

  const fixedInfoList = useFixedInfo(flattenColumns, stickyOffsets);

  const TableContextValue = React.useMemo<TableContextProps<RecordType>>(
    () => ({
      // Scroll
      scrollX: mergedScrollX,

      // Table
      prefixCls,
      getComponent,
      fixedInfoList,
      isSticky,

      componentWidth,
      fixHeader,
      fixColumn,
      horizonScroll,

      // Body
      tableLayout: mergedTableLayout,
      rowClassName,
      expandedRowClassName: expandableConfig.expandedRowClassName,
      expandIcon: expandIcon,
      expandableType,
      expandRowByClick: !!expandableConfig.expandRowByClick,
      expandedRowRender: expandableConfig.expandedRowRender,
      onTriggerExpand,
      expandIconColumnIndex: expandableConfig.expandIconColumnIndex ?? 0,
      indentSize: expandableConfig.indentSize ?? 0,
      allColumnsFixedLeft: flattenColumns.every((col) => col.fixed === 'left'),
      emptyNode,

      // Column
      columns: mergedColumns,
      flattenColumns,
      onColumnResize,

      // Row
      hoverStartRow: startRow,
      hoverEndRow: endRow,
      onHover,
      rowExpandable: expandableConfig.rowExpandable,
      onRow,

      getRowKey,
      expandedKeys: expandedKeys,
      childrenColumnName: childrenColumnName,

      rowHoverable,
    }),
    [
      // Scroll
      mergedScrollX,

      // Table
      prefixCls,
      getComponent,
      fixedInfoList,
      isSticky,

      componentWidth,
      fixHeader,
      fixColumn,
      horizonScroll,

      // Body
      mergedTableLayout,
      rowClassName,
      expandableConfig.expandedRowClassName,
      expandIcon,
      expandableType,
      expandableConfig.expandRowByClick,
      expandableConfig.expandedRowRender,
      onTriggerExpand,
      expandableConfig.expandIconColumnIndex,
      expandableConfig.indentSize,
      emptyNode,

      // Column
      mergedColumns,
      flattenColumns,
      onColumnResize,

      // Row
      startRow,
      endRow,
      onHover,
      expandableConfig.rowExpandable,
      onRow,

      getRowKey,
      expandedKeys,
      childrenColumnName,

      rowHoverable,
    ],
  );

  return <TableContext.Provider value={TableContextValue}>{fullTable}</TableContext.Provider>;
}

export type ForwardGenericTable = (<RecordType extends AnyObject = AnyObject>(
  props: InternalTableProps<RecordType> & React.RefAttributes<Reference>,
) => React.ReactElement) & { displayName?: string };

const ForwardTable = React.forwardRef(InternalTable) as ForwardGenericTable;

const ImmutableTable = makeImmutable(ForwardTable, (prev, next) => {
  const { _renderTimes: prevRenderTimes } = prev as Readonly<InternalTableProps<AnyObject>>;
  const { _renderTimes: nextRenderTimes } = next as Readonly<InternalTableProps<AnyObject>>;
  return prevRenderTimes !== nextRenderTimes;
});

export default ImmutableTable;
