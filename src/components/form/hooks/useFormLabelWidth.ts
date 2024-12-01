import { useCallback, useMemo, useState } from 'react';
import { devUseWarning } from '@util/warning';
import { useEvent } from 'rc-util';

export default function useFormLabelWidth() {
  const [potentialLabelWidthArr, setPotentialLabelWidthArr] = useState<number[]>([]);

  const autoLabelWidth = useMemo(() => {
    if (!potentialLabelWidthArr.length) return 0;
    const max = Math.max(...potentialLabelWidthArr);
    return max ? max : 0;
  }, [potentialLabelWidthArr]);

  const getLabelWidthIndex = useEvent((width: number) => {
    const index = potentialLabelWidthArr.indexOf(width);
    if (index === -1 && autoLabelWidth === 0) {
      const warning = devUseWarning('Form');
      warning(false, 'usage', `unexpected width ${width}`);
    }
    return index;
  });

  const registerLabelWidth = useCallback(
    (val: number, oldVal?: number) => {
      if (val && oldVal) {
        const index = getLabelWidthIndex(oldVal);

        setPotentialLabelWidthArr((origin) => {
          origin.splice(index, 1, val);
          return [...origin];
        });
      } else if (val) {
        setPotentialLabelWidthArr((origin) => [...origin, val]);
      }
    },
    [getLabelWidthIndex],
  );

  const deregisterLabelWidth = useCallback(
    (val: number) => {
      const index = getLabelWidthIndex(val);
      if (index > -1) {
        setPotentialLabelWidthArr((origin) => {
          origin.splice(index, 1);
          return [...origin];
        });
      }
    },
    [getLabelWidthIndex],
  );

  return {
    autoLabelWidth,
    registerLabelWidth,
    deregisterLabelWidth,
  };
}
