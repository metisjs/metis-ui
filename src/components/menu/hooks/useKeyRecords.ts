import * as React from 'react';
import { useCallback, useRef } from 'react';
import type { SafeKey } from '@util/type';
import warning from '@util/warning';
import { nextSlice } from '../utils/timeUtil';

const PATH_SPLIT = '__METIS_UTIL_PATH_SPLIT__';
const NUM_SYMBOL = '##METIS_UTIL_NUM_SYMBOL##';

const getPathStr = (keyPath: SafeKey[]) =>
  keyPath.map((key) => (typeof key === 'number' ? `${NUM_SYMBOL}${key}` : key)).join(PATH_SPLIT);
const getPathKeys = (keyPathStr: string) =>
  keyPathStr
    .split(PATH_SPLIT)
    .map((key) =>
      key.startsWith(NUM_SYMBOL) ? Number(key.slice(NUM_SYMBOL.length)) : key,
    ) as SafeKey[];

export const OVERFLOW_KEY = 'metis-menu-more';

export default function useKeyRecords() {
  const [, internalForceUpdate] = React.useState({});
  const key2pathRef = useRef(new Map<SafeKey, string>());
  const path2keyRef = useRef(new Map<string, SafeKey>());
  const [overflowKeys, setOverflowKeys] = React.useState<SafeKey[]>([]);
  const updateRef = useRef(0);
  const destroyRef = useRef(false);

  const forceUpdate = () => {
    if (!destroyRef.current) {
      internalForceUpdate({});
    }
  };

  const registerPath = useCallback((key: SafeKey, keyPath: SafeKey[]) => {
    // Warning for invalidate or duplicated `key`
    if (process.env.NODE_ENV !== 'production') {
      warning(
        !key2pathRef.current.has(key),
        `Duplicated key '${key}' used in Menu by path [${keyPath.join(' > ')}]`,
      );
    }

    // Fill map
    const connectedPath = getPathStr(keyPath);
    path2keyRef.current.set(connectedPath, key);
    key2pathRef.current.set(key, connectedPath);

    updateRef.current += 1;
    const id = updateRef.current;

    nextSlice(() => {
      if (id === updateRef.current) {
        forceUpdate();
      }
    });
  }, []);

  const unregisterPath = useCallback((key: SafeKey, keyPath: SafeKey[]) => {
    const connectedPath = getPathStr(keyPath);
    path2keyRef.current.delete(connectedPath);
    key2pathRef.current.delete(key);
  }, []);

  const refreshOverflowKeys = useCallback((keys: SafeKey[]) => {
    setOverflowKeys(keys);
  }, []);

  const getKeyPath = useCallback(
    (eventKey: SafeKey, includeOverflow?: boolean) => {
      const fullPath = key2pathRef.current.get(eventKey) || '';
      const keys = getPathKeys(fullPath);

      if (includeOverflow && overflowKeys.includes(keys[0])) {
        keys.unshift(OVERFLOW_KEY);
      }

      return keys;
    },
    [overflowKeys],
  );

  const isSubPathKey = useCallback(
    (pathKeys: SafeKey[], eventKey: SafeKey) =>
      pathKeys.some((pathKey) => {
        const pathKeyList = getKeyPath(pathKey, true);

        return pathKeyList.includes(eventKey);
      }),
    [getKeyPath],
  );

  const getKeys = () => {
    const keys = [...key2pathRef.current.keys()];

    if (overflowKeys.length) {
      keys.push(OVERFLOW_KEY);
    }

    return keys;
  };

  /**
   * Find current key related child path keys
   */
  const getSubPathKeys = useCallback((key: SafeKey): Set<SafeKey> => {
    const connectedPath = `${key2pathRef.current.get(key)}${PATH_SPLIT}`;
    const pathKeys = new Set<SafeKey>();

    [...path2keyRef.current.keys()].forEach((pathKey) => {
      if (pathKey.startsWith(connectedPath)) {
        pathKeys.add(path2keyRef.current.get(pathKey)!);
      }
    });
    return pathKeys;
  }, []);

  React.useEffect(
    () => () => {
      destroyRef.current = true;
    },
    [],
  );

  return {
    // Register
    registerPath,
    unregisterPath,
    refreshOverflowKeys,

    // Util
    isSubPathKey,
    getKeyPath,
    getKeys,
    getSubPathKeys,
  };
}
