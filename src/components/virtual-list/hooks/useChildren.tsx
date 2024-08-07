import * as React from 'react';
import type { RenderFunc, SharedConfig } from '../interface';
import { Item } from '../Item';

export default function useChildren<T>(
  list: T[],
  startIndex: number,
  endIndex: number,
  scrollWidth: number | undefined,
  offsetX: number,
  setNodeRef: (item: T, element: HTMLElement) => void,
  renderFunc: RenderFunc<T>,
  { getKey }: SharedConfig<T>,
) {
  return list.slice(startIndex, endIndex + 1).map((item, index) => {
    const eleIndex = startIndex + index;
    const node = renderFunc(item, eleIndex, {
      style: {
        width: scrollWidth,
      },
      offsetX,
    }) as React.ReactElement;

    const key = getKey(item);
    return (
      <Item key={key} setRef={(ele) => setNodeRef(item, ele)}>
        {node}
      </Item>
    );
  });
}
