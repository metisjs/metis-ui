import * as React from 'react';
import { clsx } from '@util/classNameUtils';
import type { AnyObject } from '@util/type';
import Cell from '../Cell';
import { responseImmutable } from '../context/TableContext';
import useRowInfo from '../hooks/useRowInfo';
import type { ColumnRenderActionType, ColumnType, CustomizeComponent, Key } from '../interface';
import { computedExpandedClassName } from '../utils/expandUtil';
import ExpandedRow from './ExpandedRow';

export interface BodyRowProps<RecordType extends AnyObject> {
  record: RecordType;
  index: number;
  renderIndex: number;
  className?: string;
  style?: React.CSSProperties;
  rowComponent: CustomizeComponent;
  cellComponent: CustomizeComponent;
  scopeCellComponent: CustomizeComponent;
  indent?: number;
  rowKey: Key;
  totalRowCount?: number;
}

// ==================================================================================
// ==                                 getCellProps                                 ==
// ==================================================================================
export function getCellProps<RecordType extends AnyObject>(
  rowInfo: ReturnType<typeof useRowInfo<RecordType>>,
  column: ColumnType<RecordType>,
  colIndex: number,
  indent: number,
  index: number,
) {
  const {
    record,
    prefixCls,
    columnsKey,
    fixedInfoList,
    expandIconColumnIndex,
    nestExpandable,
    indentSize,
    expandIcon,
    expanded,
    hasNestChildren,
    onTriggerExpand,
  } = rowInfo;

  const key = columnsKey[colIndex];
  const fixedInfo = fixedInfoList[colIndex];

  // ============= Used for nest expandable =============
  let appendCellNode: React.ReactNode;
  if (colIndex === (expandIconColumnIndex || 0) && nestExpandable) {
    appendCellNode = (
      <>
        <span
          style={{ paddingLeft: `${indentSize * indent}px` }}
          className={`${prefixCls}-row-indent indent-level-${indent}`}
        />
        {expandIcon({
          prefixCls,
          expanded,
          expandable: hasNestChildren,
          record,
          nestExpandable,
          onExpand: onTriggerExpand,
        })}
      </>
    );
  }

  let additionalCellProps: React.TdHTMLAttributes<HTMLElement> = {};
  if (column.onCell) {
    additionalCellProps = column.onCell(record, index);
  }

  return {
    key,
    fixedInfo,
    appendCellNode,
    additionalCellProps,
  };
}

// ==================================================================================
// ==                                 getCellProps                                 ==
// ==================================================================================
function BodyRow<RecordType extends AnyObject>(props: BodyRowProps<RecordType>) {
  const {
    className,
    style,
    record,
    index,
    renderIndex,
    rowKey,
    indent = 0,
    totalRowCount,
    rowComponent: RowComponent,
    cellComponent,
    scopeCellComponent,
  } = props;
  const rowInfo = useRowInfo(record, rowKey, index, indent);
  const {
    prefixCls,
    flattenColumns,
    expandedRowClassName,
    expandedRowRender,
    rowProps,

    // Misc
    expanded,
    selected,
    rowSupportExpand,
    editingRowKey,
    startEdit,
  } = rowInfo;

  // Force render expand row if expanded before
  const expandedRef = React.useRef(false);
  expandedRef.current ||= expanded;

  // 若没有 expandedRowRender 参数, 将使用 baseRowNode 渲染 Children
  // 此时如果 level > 1 则说明是 expandedRow, 一样需要附加 computedExpandedRowClassName
  const expandedClsName = computedExpandedClassName(expandedRowClassName, record, index, indent);

  const isEditing = editingRowKey === rowKey;
  const renderAction = React.useMemo<ColumnRenderActionType>(
    () => ({ startEdit: () => startEdit(rowKey) }),
    [rowKey],
  );

  // ======================== Base tr row ========================
  const baseRowNode = (
    <RowComponent
      {...rowProps}
      data-row-key={rowKey}
      className={clsx(
        `${prefixCls}-row`,
        `${prefixCls}-row-level-${indent}`,
        {
          [`${prefixCls}-row-selected`]: selected,
          [expandedClsName]: indent >= 1,
        },
        'group/body-row',
        className,
        rowProps?.className,
      )}
      style={{ ...style, ...rowProps?.style }}
    >
      {flattenColumns.map((column: ColumnType<RecordType>, colIndex) => {
        const { render, dataIndex, className: columnClassName, valueType, valueEnum } = column;

        const { key, fixedInfo, appendCellNode, additionalCellProps } = getCellProps(
          rowInfo,
          column,
          colIndex,
          indent,
          index,
        );

        return (
          <Cell<RecordType>
            className={columnClassName}
            ellipsis={column.ellipsis}
            align={column.align}
            scope={column.rowScope}
            component={column.rowScope ? scopeCellComponent : cellComponent}
            prefixCls={prefixCls}
            key={key}
            cellKey={key}
            record={record}
            rowIndex={index}
            rowSelected={selected}
            index={colIndex}
            renderIndex={renderIndex}
            dataIndex={dataIndex}
            render={render}
            shouldCellUpdate={column.shouldCellUpdate}
            {...fixedInfo}
            appendNode={appendCellNode}
            additionalProps={additionalCellProps}
            totalRowCount={totalRowCount}
            totalColCount={flattenColumns.length}
            valueType={valueType}
            valueEnum={valueEnum}
            editing={isEditing}
            renderAction={renderAction}
          />
        );
      })}
    </RowComponent>
  );

  // ======================== Expand Row =========================
  let expandRowNode: React.ReactElement | undefined;
  if (rowSupportExpand && (expandedRef.current || expanded)) {
    const expandContent = expandedRowRender!(record, index, indent + 1, expanded);

    expandRowNode = (
      <ExpandedRow
        expanded={expanded}
        className={clsx(
          `${prefixCls}-expanded-row`,
          `${prefixCls}-expanded-row-level-${indent + 1}`,
          '*:bg-fill-quinary',
          expandedClsName,
        )}
        prefixCls={prefixCls}
        component={RowComponent}
        cellComponent={cellComponent}
        colSpan={flattenColumns.length}
        isEmpty={false}
      >
        {expandContent}
      </ExpandedRow>
    );
  }

  return (
    <>
      {baseRowNode}
      {expandRowNode}
    </>
  );
}

if (process.env.NODE_ENV !== 'production') {
  BodyRow.displayName = 'BodyRow';
}

export default responseImmutable(BodyRow);
