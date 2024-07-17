import * as React from 'react';
import type { InputProps } from '..';
import type { CountConfig, ShowCountFormatter } from '../interface';

type ForcedCountConfig = Omit<CountConfig, 'show'> &
  Pick<Required<CountConfig>, 'strategy'> & {
    show: boolean;
    showFormatter?: ShowCountFormatter;
  };

/**
 * Cut `value` by the `count.max` prop.
 */
export function inCountRange(value: string, countConfig: ForcedCountConfig) {
  if (!countConfig.max) {
    return true;
  }

  const count = countConfig.strategy(value);
  return count <= countConfig.max;
}

export default function useCount(count?: CountConfig, showCount?: InputProps['showCount']) {
  return React.useMemo<ForcedCountConfig>(() => {
    let mergedConfig: CountConfig = {};

    if (showCount) {
      mergedConfig.show =
        typeof showCount === 'object' && showCount.formatter ? showCount.formatter : !!showCount;
    }

    mergedConfig = {
      ...mergedConfig,
      ...count,
    };

    const { show, ...rest } = mergedConfig!;

    return {
      ...rest,
      show: !!show,
      showFormatter: typeof show === 'function' ? show : undefined,
      strategy: rest.strategy || ((value) => value.length),
    };
  }, [count, showCount]);
}
