import * as React from 'react';
import type { SafeKey } from '../../_util/type';

export const IdContext = React.createContext<string | undefined>(undefined);

export function getMenuId(uuid?: string, eventKey?: SafeKey) {
  if (uuid === undefined) {
    return null;
  }
  return `${uuid}-${eventKey}`;
}

/**
 * Get `data-menu-id`
 */
export function useMenuId(eventKey: SafeKey) {
  const id = React.useContext(IdContext);
  return getMenuId(id, eventKey);
}
