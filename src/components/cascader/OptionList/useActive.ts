import * as React from 'react';
import type { SafeKey } from '@util/type';
import CascaderContext from '../context';

/**
 * Control the active open options path.
 */
const useActive = (
  multiple?: boolean,
  open?: boolean,
): [SafeKey[], (activeValueCells: SafeKey[]) => void] => {
  const { values } = React.useContext(CascaderContext);

  const firstValueCells = values[0];

  // Record current dropdown active options
  // This also control the open status
  const [activeValueCells, setActiveValueCells] = React.useState<SafeKey[]>([]);

  React.useEffect(
    () => {
      if (!multiple) {
        setActiveValueCells(firstValueCells || []);
      }
    },
    /* eslint-disable react-hooks/exhaustive-deps */
    [open, firstValueCells],
    /* eslint-enable react-hooks/exhaustive-deps */
  );

  return [activeValueCells, setActiveValueCells];
};

export default useActive;
