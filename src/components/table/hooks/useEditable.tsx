import type { ReactNode } from 'react';
import React, { useState } from 'react';
import { LoadingOutline } from '@metisjs/icons';
import type { AnyObject } from '@util/type';
import { useEvent } from 'rc-util';
import useMergedState from 'rc-util/lib/hooks/useMergedState';
import { merge } from 'rc-util/lib/utils/set';
import Form from '../../form';
import { useLocale } from '../../locale';
import message from '../../message';
import type { EditableActionRenderFunction, EditableConfig, GetRowKey, Key } from '../interface';

function SaveEditAction<RecordType extends AnyObject>({
  record,
  index,
  children,
  onSave,
}: {
  record: RecordType;
  index: number;
  children: ReactNode;
  onSave?: EditableConfig<RecordType>['onSave'];
}) {
  const form = Form.useFormInstance();
  const [loading, setLoading] = useState<boolean>(false);

  const save = useEvent(async () => {
    try {
      setLoading(true);

      const fields = await form.validateFields();
      const res = await onSave?.(merge(record, fields), index);

      setLoading(false);
      return res;
    } catch (error) {
      setLoading(false);
      throw error;
    }
  });

  return (
    <a
      key="save"
      onClick={async (e) => {
        e.stopPropagation();
        e.preventDefault();
        try {
          await save();
        } catch {}
      }}
    >
      {loading ? <LoadingOutline className="me-2 h-4 w-4 animate-spin" /> : null}
      {children}
    </a>
  );
}

function CancelEditAction<RecordType extends AnyObject>({
  children,
  onCancel,
}: {
  record: RecordType;
  index: number;
  children: ReactNode;
  onCancel?: () => void;
}) {
  const form = Form.useFormInstance();

  return (
    <a
      key="cancel"
      onClick={async (e) => {
        e.stopPropagation();
        e.preventDefault();

        form.resetFields();
        onCancel?.();
      }}
    >
      {children}
    </a>
  );
}

function defaultActionRender<RecordType extends AnyObject>(
  record: RecordType,
  index: number,
  {
    saveText,
    cancelText,
    onSave,
    onCancel,
  }: {
    saveText?: string;
    cancelText?: string;
    onSave?: EditableConfig<RecordType>['onSave'];
    onCancel?: () => void;
  },
) {
  return {
    save: (
      <SaveEditAction key="save" record={record} index={index} onSave={onSave}>
        {saveText}
      </SaveEditAction>
    ),
    cancel: (
      <CancelEditAction key="cancel" record={record} index={index} onCancel={onCancel}>
        {cancelText}
      </CancelEditAction>
    ),
  };
}

function useEditableArray<RecordType extends AnyObject>(
  props: EditableConfig<RecordType> & {
    getRowKey: GetRowKey<RecordType>;
    getRecordByKey: (key: Key) => RecordType;
    dataSource: RecordType[];
    childrenColumnName: string | undefined;
    setDataSource: (dataSource: RecordType[]) => void;
  },
) {
  const [locale] = useLocale('Table');

  const [editingRowKey, setEditingRowKey] = useMergedState<Key | undefined>(undefined, {
    value: props.editingRowKey,
    onChange: (recordKey) =>
      props.onChange?.(recordKey, recordKey ? props.getRecordByKey(recordKey) : undefined),
  });

  const existCustomActionRender = props.actionRender && typeof props.actionRender === 'function';
  const customActionRender = existCustomActionRender ? props.actionRender : () => {};
  const customActionRenderRef = useEvent(
    customActionRender as EditableActionRenderFunction<RecordType>,
  );

  const startEdit = useEvent((recordKey: Key) => {
    if (editingRowKey && editingRowKey !== recordKey) {
      message.warning(locale.editingAlertMessage);
      return false;
    }

    setEditingRowKey(recordKey);

    return true;
  });

  const cancelEdit = useEvent(async () => {
    setEditingRowKey(undefined);

    return true;
  });

  const onSave = useEvent(async (record: RecordType, index: number) => {
    const res = await props?.onSave?.(record, index);
    cancelEdit();

    props.setDataSource([]);

    return res;
  });

  const actionRender = (record: RecordType, index: number) => {
    const key = props.getRowKey(record, index);

    const renderResult = defaultActionRender<RecordType>(record, index, {
      saveText: locale.saveText,
      cancelText: locale.cancelText,
    });

    if (existCustomActionRender)
      return customActionRenderRef(record, index, {
        save: renderResult.save,
        cancel: renderResult.cancel,
      });

    return [renderResult.save, renderResult.cancel];
  };

  return {
    editingKey: editingRowKey,
    setEditingKey: setEditingRowKey,
    actionRender,
    startEdit,
    cancelEdit,
  };
}

export default useEditableArray;
