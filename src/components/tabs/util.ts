import type React from 'react';
import type { ReactNode } from 'react';
import type { EditableConfig } from './interface';

/**
 * We trade Map as deps which may change with same value but different ref object.
 * We should make it as hash for deps
 * */
export function stringify<K extends PropertyKey, V>(obj?: Record<K, V> | Map<K, V>) {
  let tgt: Record<K, V> | undefined;

  if (obj instanceof Map) {
    tgt = {} as Record<K, V>;
    obj.forEach((v, k) => {
      tgt![k] = v;
    });
  } else {
    tgt = obj;
  }

  return JSON.stringify(tgt);
}

const METIS_TABS_DOUBLE_QUOTE = 'TABS_DQ';

export function genDataNodeKey(key: React.Key): string {
  return String(key).replace(/"/g, METIS_TABS_DOUBLE_QUOTE);
}

export function getRemovable(
  closable?: boolean,
  closeIcon?: ReactNode,
  editConfig?: EditableConfig,
  disabled?: boolean,
) {
  if (
    // Only editConfig tabs can be removed
    !editConfig?.closable ||
    // Tabs cannot be removed when disabled
    disabled ||
    // closable is false
    closable === false ||
    // If closable is undefined, the remove button should be hidden when closeIcon is null or false
    (closable === undefined && (closeIcon === false || closeIcon === null))
  ) {
    return false;
  }
  return true;
}
