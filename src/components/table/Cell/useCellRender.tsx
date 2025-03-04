import * as React from 'react';
import type { AnyObject } from '@util/type';
import useMemo from 'rc-util/lib/hooks/useMemo';
import isEqual from 'rc-util/lib/isEqual';
import getValue from 'rc-util/lib/utils/get';
import type { CellProps } from '.';
import FieldComponent from '../../form/Field';
import { useImmutableMark } from '../context/TableContext';
import type {
  ColumnRenderActionType,
  ColumnType,
  ColumnValueEnum,
  ColumnValueType,
  DataIndex,
} from '../interface';
import { validateValue } from '../utils/valueUtil';

export default function useCellRender<RecordType extends AnyObject>({
  record,
  dataIndex,
  renderIndex,
  valueType,
  valueEnum,
  cacheKey,
  rowType,
  children,
  editing,
  render,
  shouldCellUpdate,
  renderAction,
}: {
  record: RecordType;
  dataIndex: DataIndex<RecordType> | null | undefined;
  renderIndex: number;
  valueType: ColumnValueType<RecordType> | undefined;
  valueEnum: ColumnValueEnum<RecordType> | undefined;
  cacheKey: string;
  rowType: CellProps<any>['rowType'];
  children?: React.ReactNode;
  editing?: boolean;
  render?: ColumnType<RecordType>['render'];
  shouldCellUpdate?: ColumnType<RecordType>['shouldCellUpdate'];
  renderAction?: ColumnRenderActionType;
}) {
  const mark = useImmutableMark();

  // ======================== Render ========================
  const retData = useMemo<React.ReactNode>(
    () => {
      if (validateValue(children) || rowType !== 'body') {
        return children;
      }

      const path =
        dataIndex === null || dataIndex === undefined || dataIndex === ''
          ? []
          : Array.isArray(dataIndex)
            ? dataIndex
            : [dataIndex];

      const value: React.ReactNode =
        valueType === 'index' || valueType === 'indexBorder'
          ? renderIndex
          : getValue(record, path as any);

      const mergedValueEnum = typeof valueEnum === 'function' ? valueEnum(record) : valueEnum;
      const mergedValueType = typeof valueType === 'function' ? valueType(record) : valueType;

      const dom = (
        <FieldComponent
          mode={editing ? 'edit' : 'read'}
          text={value}
          valueType={mergedValueType}
          valueEnum={mergedValueEnum}
          fieldKey={cacheKey}
          editorProps={{}}
          // renderEditor={() => {}}
        />
      );

      if (editing) {
        if (mergedValueType === 'action') {
          return (
            <div className="inline-flex items-center gap-2">
              {/* {editableUtils.actionRender({
                ...rowData,
                index: columnProps.index || index,
              })} */}
            </div>
          );
        }
        return dom;
      }

      const renderDom = render?.(dom, record, renderIndex, renderAction!) ?? dom;

      if (renderDom && mergedValueType === 'action' && Array.isArray(renderDom)) {
        return <div className="inline-flex items-center gap-2">{renderDom}</div>;
      }

      return renderDom;
    },
    [
      // Force update deps
      mark,

      // Normal deps
      record,
      children,
      dataIndex,
      rowType,
      render,
      renderIndex,
      valueType,
      valueEnum,
      cacheKey,
      renderAction,
    ] as const,
    (prev, next) => {
      if (shouldCellUpdate) {
        const [, prevRecord] = prev;
        const [, nextRecord] = next;
        return shouldCellUpdate(nextRecord, prevRecord);
      }

      return !isEqual(prev, next, true);
    },
  );

  return retData;
}
