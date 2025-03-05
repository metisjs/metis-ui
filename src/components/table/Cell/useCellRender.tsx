import * as React from 'react';
import { isNil } from '@util/isNil';
import type { AnyObject } from '@util/type';
import { devUseWarning } from '@util/warning';
import { omit } from 'lodash';
import useMemo from 'rc-util/lib/hooks/useMemo';
import isEqual from 'rc-util/lib/isEqual';
import getValue from 'rc-util/lib/utils/get';
import type { CellProps } from '.';
import Form from '../../form';
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
  editable,
  editing,
  render,
  shouldCellUpdate,
  renderAction,
  actionRender,
}: {
  record: RecordType;
  dataIndex: DataIndex<RecordType> | null | undefined;
  renderIndex: number;
  valueType: ColumnValueType<RecordType> | undefined;
  valueEnum: ColumnValueEnum<RecordType> | undefined;
  cacheKey: string;
  rowType: CellProps<any>['rowType'];
  children?: React.ReactNode;
  editable?: ColumnType<RecordType>['editable'];
  editing?: boolean;
  render?: ColumnType<RecordType>['render'];
  shouldCellUpdate?: ColumnType<RecordType>['shouldCellUpdate'];
  renderAction?: ColumnRenderActionType;
  actionRender?: (record: RecordType, index: number) => React.ReactNode[];
}) {
  const warning = devUseWarning('Table');

  const mark = useImmutableMark();

  const editableForm = Form.useFormInstance();

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

      const mergedValueEnum =
        typeof valueEnum === 'function' ? valueEnum(record, renderIndex) : valueEnum;
      const mergedValueType =
        typeof valueType === 'function' ? valueType(record, renderIndex) : valueType;
      const mergedEditable =
        typeof editable === 'function' ? editable(editableForm, record, renderIndex) : editable;
      const editableConfig = typeof mergedEditable === 'boolean' ? {} : (mergedEditable ?? {});

      let dom: React.ReactNode = (
        <FieldComponent
          mode={editing && mergedEditable !== false ? 'edit' : 'read'}
          text={value}
          valueType={mergedValueType}
          valueEnum={mergedValueEnum}
          fieldKey={cacheKey}
          editorProps={editableConfig.editorProps}
        />
      );

      if (editableConfig?.editorRender) {
        dom = editableConfig?.editorRender(editableForm);
      }

      if (editing) {
        if (mergedValueType === 'action') {
          return (
            <div className="inline-flex items-center gap-2">
              {actionRender?.(record, renderIndex)}
            </div>
          );
        }

        warning(
          !isNil(dataIndex) || mergedEditable !== false,
          'usage',
          'Editable column should have a `dataIndex` value.',
        );

        if (!isNil(dataIndex) && mergedEditable !== false) {
          return (
            <Form.Item
              name={dataIndex as any}
              hasFeedback={false}
              {...omit(editableConfig, ['editorProps', 'editorRender'])}
              className="-mb-2 -mt-2"
            >
              {dom}
            </Form.Item>
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
      editing,
      editable,
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
