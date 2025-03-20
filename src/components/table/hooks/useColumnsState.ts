import { useCallback, useMemo, useState } from 'react';
import type { AnyObject } from '@util/type';
import { merge } from 'rc-util/lib/utils/set';
import { EXPAND_COLUMN, SELECTION_COLUMN } from '../constant';
import type { ColumnState, ColumnStateType, InternalColumnsType, Key } from '../interface';

function reorderState(columnsState: Record<Key, ColumnState>) {
  const sortedKeys = Object.keys(columnsState).sort(
    (a, b) => (columnsState[a].order ?? 0) - (columnsState[b].order ?? 0),
  );

  sortedKeys.forEach((key, index) => {
    columnsState[key].order = index;
  });

  return columnsState;
}

function useColumnsState<RecordType extends AnyObject = AnyObject>({
  columns,
  columnsState,
}: {
  columns: InternalColumnsType<RecordType>;
  columnsState?: ColumnStateType;
}) {
  const defaultColumnKeyMap = useMemo(() => {
    const columnKeyMap = {} as Record<Key, ColumnState>;
    columns?.forEach((column, index) => {
      if (column.key !== EXPAND_COLUMN.key && column.key !== SELECTION_COLUMN.key) {
        columnKeyMap[column.key] = {
          show: !column.hidden,
          fixed: column.fixed === true ? 'left' : column.fixed === false ? undefined : column.fixed,
          order: index,
        };
      }
    });
    return reorderState(columnKeyMap);
  }, [columns]);

  const [columnStateMap, setColumnStateMap] = useState<Record<Key, ColumnState>>(() => {
    const { persistenceType = 'localStorage', persistenceKey } = columnsState || {};

    if (persistenceKey && persistenceType && typeof window !== 'undefined') {
      const storage = window[persistenceType];
      try {
        const storageValue = storage?.getItem(persistenceKey);
        if (storageValue) {
          return reorderState(merge({}, defaultColumnKeyMap, JSON.parse(storageValue)));
        }
      } catch (error) {
        console.warn(error);
      }
    }
    return defaultColumnKeyMap;
  });

  const clearPersistenceStorage = useCallback(() => {
    const { persistenceType, persistenceKey } = columnsState || {};

    if (!persistenceKey || !persistenceType || typeof window === 'undefined') return;

    const storage = window[persistenceType];
    try {
      storage?.removeItem(persistenceKey);
    } catch (error) {
      console.warn(error);
    }
  }, []);

  const resetColumnStateMap = useCallback(() => {
    setColumnStateMap(defaultColumnKeyMap);
    clearPersistenceStorage();
  }, [defaultColumnKeyMap, clearPersistenceStorage]);

  const setInternalColumnStateMap = useCallback(
    (value: Record<Key, ColumnState>) => {
      setColumnStateMap(value);

      const { persistenceType = 'localStorage', persistenceKey } = columnsState || {};
      if (!persistenceKey || !persistenceType || typeof window === 'undefined') return;

      const storage = window[persistenceType];
      try {
        storage?.setItem(persistenceKey, JSON.stringify(value));
      } catch (error) {
        console.warn(error);
        clearPersistenceStorage();
      }
    },
    [clearPersistenceStorage],
  );

  const mergedColumns = useMemo<InternalColumnsType<RecordType>>(() => {
    const cloned = columns
      .filter((column) => columnStateMap[column.key]?.show)
      .sort((a, b) => columnStateMap[a.key].order - columnStateMap[b.key].order)
      .map((column) =>
        !columnStateMap[column.key]
          ? column
          : { ...column, fixed: columnStateMap[column.key].fixed },
      );

    const selectionColumnIndex = columns.findIndex((column) => column === SELECTION_COLUMN);
    const expandColumnIndex = columns.findIndex((column) => column === EXPAND_COLUMN);

    [
      { index: selectionColumnIndex, value: SELECTION_COLUMN },
      { index: expandColumnIndex, value: EXPAND_COLUMN },
    ]
      .sort((a, b) => a.index - b.index)
      .forEach(({ index, value }) => {
        if (index > -1) cloned.splice(index, 0, value);
      });

    return cloned;
  }, [columns, columnStateMap]);

  return [mergedColumns, columnStateMap, setInternalColumnStateMap, resetColumnStateMap] as const;
}

export default useColumnsState;
