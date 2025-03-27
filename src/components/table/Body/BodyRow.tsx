import * as React from 'react';
import { clsx } from '@util/classNameUtils';
import useSemanticCls from '@util/hooks/useSemanticCls';
import type { AnyObject } from '@util/type';
import Cell from '../Cell';
import { responseImmutable } from '../context/TableContext';
import useRowInfo from '../hooks/useRowInfo';
import type {
  CustomizeComponent,
  ExpandedRowSemanticClsType,
  InternalColumnType,
  Key,
  RowSemanticClsType,
} from '../interface';
import ExpandedRow from './ExpandedRow';

export interface BodyRowProps<RecordType extends AnyObject> {
  record: RecordType;
  index: number;
  renderIndex: number;
  className?: RowSemanticClsType<RecordType>;
  expandedRowClassName?: ExpandedRowSemanticClsType<RecordType>;
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
  column: InternalColumnType<RecordType>,
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
    expandedRowClassName,
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
  const rowInfo = useRowInfo(record, rowKey, index);
  const {
    prefixCls,
    flattenColumns,
    expandedRowRender,
    rowProps,

    // Misc
    expanded,
    selected,
    rowSupportExpand,
    editingRowKey,
  } = rowInfo;

  const semanticCls = useSemanticCls(className, { record, index });
  const expandedSemanticCls = useSemanticCls(expandedRowClassName, { record, index, indent });

  // Force render expand row if expanded before
  const expandedRef = React.useRef(false);
  expandedRef.current ||= expanded;

  const isEditing = editingRowKey === rowKey;

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
        },
        'group/body-row',
        semanticCls.root,
        indent >= 1 && expandedSemanticCls.root,
        rowProps?.className,
      )}
      style={{ ...style, ...rowProps?.style }}
    >
      {flattenColumns.map((column: InternalColumnType<RecordType>, colIndex) => {
        const {
          render,
          dataIndex,
          className: columnClassName,
          valueType,
          valueEnum,
          editable,
          title,
        } = column;

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
            editable={editable}
            editing={isEditing}
            cellTitle={title as React.ReactNode}
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
          expandedSemanticCls.root,
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
