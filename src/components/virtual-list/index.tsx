import React, { forwardRef } from 'react';
import type { VirtualListProps, VirtualListRef } from './interface';
import NormalList from './NormalList';
import VirtuosoList from './VirtuosoList';

const InternalVirtualList = <D, C>(
  { virtual = true, ...restProps }: VirtualListProps<D, C>,
  ref: React.ForwardedRef<VirtualListRef>,
) =>
  virtual ? (
    <VirtuosoList<D, C> ref={ref} {...restProps} />
  ) : (
    <NormalList<D, C> ref={ref} {...restProps} />
  );

const VirtualList = forwardRef(InternalVirtualList) as (<D, C = any>(
  props: VirtualListProps<D, C> & {
    ref?: React.ForwardedRef<VirtualListRef>;
  },
) => ReturnType<typeof InternalVirtualList>) &
  Pick<React.FC, 'displayName'>;

if (process.env.NODE_ENV !== 'production') {
  VirtualList.displayName = 'VirtualList';
}

export type * from './interface';

export default VirtualList;
