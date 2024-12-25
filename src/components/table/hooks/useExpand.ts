import * as React from 'react';
import warning from 'rc-util/lib/warning';
import type {
  ExpandableConfig,
  ExpandableType,
  GetRowKey,
  Key,
  RenderExpandIcon,
  TriggerEventHandler,
} from '../interface';
import { findAllChildrenKeys, renderExpandIcon } from '../utils/expandUtil';

export default function useExpand<RecordType>(
  expandable: ExpandableConfig<RecordType> = {},
  mergedData: readonly RecordType[],
  getRowKey: GetRowKey<RecordType>,
): [
  expandableConfig: ExpandableConfig<RecordType>,
  expandableType: ExpandableType,
  expandedKeys: Set<Key>,
  expandIcon: RenderExpandIcon<RecordType>,
  childrenColumnName: keyof RecordType,
  onTriggerExpand: TriggerEventHandler<RecordType>,
] {
  const expandableConfig = { ...expandable };
  if (expandableConfig.showExpandColumn === false) {
    expandableConfig.expandIconColumnIndex = -1;
  }

  const {
    expandIcon,
    expandedRowKeys,
    defaultExpandedRowKeys,
    defaultExpandAllRows,
    expandedRowRender,
    onExpand,
    onExpandedRowsChange,
    childrenColumnName,
  } = expandableConfig;

  const mergedExpandIcon = expandIcon || renderExpandIcon;
  const mergedChildrenColumnName = childrenColumnName || ('children' as keyof RecordType);
  const expandableType = React.useMemo<ExpandableType>(() => {
    if (expandedRowRender) {
      return 'row';
    }
    if (
      mergedData.some(
        (record) => record && typeof record === 'object' && record[mergedChildrenColumnName],
      )
    ) {
      return 'nest';
    }
    return false;
  }, [!!expandedRowRender, mergedData]);

  const [innerExpandedKeys, setInnerExpandedKeys] = React.useState(() => {
    if (defaultExpandedRowKeys) {
      return defaultExpandedRowKeys;
    }
    if (defaultExpandAllRows) {
      return findAllChildrenKeys<RecordType>(mergedData, getRowKey, mergedChildrenColumnName);
    }
    return [];
  });
  const mergedExpandedKeys = React.useMemo(
    () => new Set(expandedRowKeys || innerExpandedKeys || []),
    [expandedRowKeys, innerExpandedKeys],
  );

  const onTriggerExpand: TriggerEventHandler<RecordType> = React.useCallback(
    (record: RecordType) => {
      const key = getRowKey(record, mergedData.indexOf(record));

      let newExpandedKeys: Key[];
      const hasKey = mergedExpandedKeys.has(key);
      if (hasKey) {
        mergedExpandedKeys.delete(key);
        newExpandedKeys = [...mergedExpandedKeys];
      } else {
        newExpandedKeys = [...mergedExpandedKeys, key];
      }

      setInnerExpandedKeys(newExpandedKeys);
      if (onExpand) {
        onExpand(!hasKey, record);
      }
      if (onExpandedRowsChange) {
        onExpandedRowsChange(newExpandedKeys);
      }
    },
    [getRowKey, mergedExpandedKeys, mergedData, onExpand, onExpandedRowsChange],
  );

  // Warning if use `expandedRowRender` and nest children in the same time
  if (
    process.env.NODE_ENV !== 'production' &&
    expandedRowRender &&
    mergedData.some((record: RecordType) => {
      return Array.isArray(record?.[mergedChildrenColumnName]);
    })
  ) {
    warning(false, '`expandedRowRender` should not use with nested Table');
  }

  return [
    expandableConfig,
    expandableType,
    mergedExpandedKeys,
    mergedExpandIcon,
    mergedChildrenColumnName,
    onTriggerExpand,
  ];
}
