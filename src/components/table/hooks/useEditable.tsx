import type { ReactNode } from 'react';
import React, { useEffect, useState } from 'react';
import { LoadingOutline } from '@metisjs/icons';
import { isNil } from '@util/isNil';
import type { AnyObject } from '@util/type';
import { useEvent } from 'rc-util';
import useMergedState from 'rc-util/lib/hooks/useMergedState';
import { merge } from 'rc-util/lib/utils/set';
import type { FormInstance } from '../../form';
import Form from '../../form';
import { useLocale } from '../../locale';
import message from '../../message';
import type {
  EditableActionRenderFunction,
  GetRowKey,
  Key,
  TableEditableConfig,
} from '../interface';

function editRowByKey<RecordType extends AnyObject>(keyProps: {
  data: RecordType[];
  childrenColumnName: keyof RecordType;
  getRowKey: GetRowKey<RecordType>;
  key: Key;
  row: RecordType;
}) {
  const { getRowKey, row, data, key, childrenColumnName } = keyProps;

  const kvMap = new Map<Key, RecordType & { parentKey?: Key }>();

  function dig(records: RecordType[], map_row_parentKey?: Key, map_row_index?: number) {
    records.forEach((record, index) => {
      const eachIndex = (map_row_index || 0) * 10 + index;
      const recordKey = getRowKey(record, eachIndex);
      // children 取在前面方便拼的时候按照反顺序放回去
      if (record && typeof record === 'object' && childrenColumnName in record) {
        dig((record as any)[childrenColumnName] || [], recordKey, eachIndex);
      }
      const newRecord = {
        ...record,
        map_row_key: recordKey,
        children: undefined,
        map_row_parentKey,
      };
      delete newRecord.children;
      if (!map_row_parentKey) {
        delete newRecord.map_row_parentKey;
      }
      kvMap.set(recordKey, newRecord);
    });
  }

  dig(data);

  kvMap.set(key, {
    ...kvMap.get(key),
    ...row,
  });

  const fill = (map: Map<Key, RecordType & { map_row_parentKey?: Key; map_row_key?: Key }>) => {
    const kvArrayMap = new Map<Key, RecordType[]>();
    const kvSource: RecordType[] = [];
    const fillNewRecord = (fillChildren: boolean = true) => {
      map.forEach((value) => {
        if (value.map_row_parentKey && !value.map_row_key) {
          const { map_row_parentKey, ...rest } = value;
          if (!kvArrayMap.has(map_row_parentKey)) {
            kvArrayMap.set(map_row_parentKey, []);
          }
          if (fillChildren) {
            kvArrayMap.get(map_row_parentKey)?.push(rest as unknown as RecordType);
          }
        }
      });
    };

    map.forEach((value) => {
      if (value.map_row_parentKey && value.map_row_key) {
        const { map_row_parentKey, map_row_key, ...rest } = value;
        if (kvArrayMap.has(map_row_key)) {
          (rest as any)[childrenColumnName] = kvArrayMap.get(map_row_key);
        }
        if (!kvArrayMap.has(map_row_parentKey)) {
          kvArrayMap.set(map_row_parentKey, []);
        }
        kvArrayMap.get(map_row_parentKey)?.push(rest as unknown as RecordType);
      }
    });

    fillNewRecord();

    map.forEach((value) => {
      if (!value.map_row_parentKey) {
        const { map_row_key, ...rest } = value;
        if (map_row_key && kvArrayMap.has(map_row_key)) {
          const item = {
            ...rest,
            [childrenColumnName]: kvArrayMap.get(map_row_key),
          };
          kvSource.push(item as RecordType);
          return;
        }
        kvSource.push(rest as RecordType);
      }
    });

    return kvSource;
  };
  return fill(kvMap);
}

function SaveEditAction<RecordType extends AnyObject>({
  record,
  index,
  children,
  onSave,
}: {
  record: RecordType;
  index: number;
  children: ReactNode;
  onSave?: TableEditableConfig<RecordType>['onSave'];
}) {
  const form = Form.useFormInstance();
  const [loading, setLoading] = useState<boolean>(false);

  const save = useEvent(async () => {
    try {
      setLoading(true);

      const fields = await form?.validateFields();
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
          if (!loading) await save();
        } catch {}
      }}
      className="inline-flex items-center gap-1"
    >
      {loading ? <LoadingOutline className="h-4 w-4 animate-spin" /> : null}
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

        form?.resetFields();
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
    onSave?: TableEditableConfig<RecordType>['onSave'];
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

function useEditable<RecordType extends AnyObject>(
  props: TableEditableConfig<RecordType> & {
    getRowKey: GetRowKey<RecordType>;
    getRecordByKey: (key: Key) => RecordType;
    dataSource: RecordType[];
    childrenColumnName: keyof RecordType;
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

  const startEdit = useEvent((recordKey: Key, form?: FormInstance) => {
    if (!isNil(editingRowKey) && editingRowKey !== recordKey) {
      message.warning(locale.editingAlertMessage);
      return false;
    }

    form?.setFieldsValue(props.getRecordByKey(recordKey));
    setEditingRowKey(recordKey);

    return true;
  });

  const cancelEdit = useEvent(async () => {
    if (!isNil(editingRowKey)) {
      setEditingRowKey(undefined);
      return true;
    }
    return false;
  });

  const onSave = useEvent(async (record: RecordType, index: number) => {
    const res = await props?.onSave?.(record, index);
    cancelEdit();

    props.setDataSource(
      editRowByKey({
        data: props.dataSource,
        getRowKey: props.getRowKey,
        row: record,
        key: props.getRowKey(record),
        childrenColumnName: props.childrenColumnName,
      }),
    );

    return res;
  });

  const actionRender = useEvent((record: RecordType, index: number) => {
    const renderResult = defaultActionRender<RecordType>(record, index, {
      saveText: locale.saveText,
      cancelText: locale.cancelText,
      onSave,
      onCancel: cancelEdit,
    });

    if (existCustomActionRender)
      return customActionRenderRef(record, {
        save: renderResult.save,
        cancel: renderResult.cancel,
      });

    return [renderResult.save, renderResult.cancel] as ReactNode[];
  });

  useEffect(() => {
    cancelEdit();
  }, [props.dataSource]);

  return {
    editingRowKey,
    setEditingRowKey,
    actionRender,
    startEdit,
    cancelEdit,
  };
}

export default useEditable;
