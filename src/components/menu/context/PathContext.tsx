import * as React from 'react';
import type { SafeKey } from '../../_util/type';

const EmptyList: string[] = [];

// ========================= Path Register =========================
export interface PathRegisterContextProps {
  registerPath: (key: SafeKey, keyPath: SafeKey[]) => void;
  unregisterPath: (key: SafeKey, keyPath: SafeKey[]) => void;
}

export const PathRegisterContext = React.createContext<PathRegisterContextProps | null>(null);

export function useMeasure() {
  return React.useContext(PathRegisterContext);
}

// ========================= Path Tracker ==========================
export const PathTrackerContext = React.createContext<SafeKey[]>(EmptyList);

export function useFullPath(eventKey?: SafeKey) {
  const parentKeyPath = React.useContext(PathTrackerContext);
  return React.useMemo(
    () => (eventKey !== undefined ? [...parentKeyPath, eventKey] : parentKeyPath),
    [parentKeyPath, eventKey],
  );
}

// =========================== Path User ===========================
export interface PathUserContextProps {
  isSubPathKey: (pathKeys: SafeKey[], eventKey: SafeKey) => boolean;
}

export const PathUserContext = React.createContext<PathUserContextProps>({
  isSubPathKey: () => false,
});
