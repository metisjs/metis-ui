import * as React from 'react';
import type { ScreenMap } from '@util/responsiveObserver';
import { matchScreen } from '@util/responsiveObserver';
import type { DescriptionsItemType, InternalDescriptionsItemType } from '..';

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
