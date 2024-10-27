import React from 'react';
import type { ListItemMetaProps, ListItemProps } from './Item';

export interface ListConsumerProps {
  bordered?: boolean;
  itemClassName?: ListItemProps['className'];
  metaClassName?: ListItemMetaProps['className'];
}

export const ListContext = React.createContext<ListConsumerProps>({});

export const ListConsumer = ListContext.Consumer;
