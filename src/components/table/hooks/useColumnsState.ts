import { useCallback, useMemo, useState } from 'react';
import type { AnyObject } from '@util/type';
import { merge } from 'rc-util/lib/utils/set';
import type { ColumnState, ColumnStateType, InternalColumnsType, Key } from '../interface';
import { getColumnsKey } from '../utils/valueUtil';

function useColumnsState<RecordType extends AnyObject = AnyObject>({
  columns,
  columnsState,
}: {
  columns?: InternalColumnsType<RecordType>;
  columnsState?: ColumnStateType;
}) {
  const defaultColumnKeyMap = useMemo(() => {
    const columnKeys = getColumnsKey(columns);
    const columnKeyMap = {} as Record<Key, ColumnState>;
    columns?.forEach((column, index) => {
      const columnKey = columnKeys[index];
      if (columnKey) {
        columnKeyMap[columnKey] = {
          show: !column.hidden,
          fixed: column.fixed === true ? 'left' : column.fixed === false ? undefined : column.fixed,
          order: index,
        };
      }
    });
    return columnKeyMap;
  }, [columns]);

  const [columnStateMap, setColumnStateMap] = useState<Record<Key, ColumnState>>(() => {
    const { persistenceType = 'localStorage', persistenceKey } = columnsState || {};

    if (persistenceKey && persistenceType && typeof window !== 'undefined') {
      const storage = window[persistenceType];
      try {
        const storageValue = storage?.getItem(persistenceKey);
        if (storageValue) {
          return merge({}, defaultColumnKeyMap, JSON.parse(storageValue));
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

      const { persistenceType, persistenceKey } = columnsState || {};
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

  return [columnStateMap, setInternalColumnStateMap, resetColumnStateMap] as const;
}

export default useColumnsState;
