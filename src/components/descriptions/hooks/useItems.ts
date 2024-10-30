import * as React from 'react';
import type { DescriptionsItemType, InternalDescriptionsItemType } from '..';
import type { ScreenMap } from '../../_util/responsiveObserver';
import { matchScreen } from '../../_util/responsiveObserver';

export default function useItems(screens: ScreenMap, items: DescriptionsItemType[] = []) {
  const responsiveItems = React.useMemo<InternalDescriptionsItemType[]>(
    () =>
      items.map(({ span, ...restItem }) => ({
        ...restItem,
        span: typeof span === 'number' ? span : matchScreen(screens, span),
      })),
    [items, screens],
  );

  return responsiveItems;
}
