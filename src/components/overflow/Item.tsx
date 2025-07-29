import * as React from 'react';
import { clsx } from '@util/classNameUtils';
import ResizeObserver from 'rc-resize-observer';
import type { ComponentType } from './RawItem';

// Use shared variable to save bundle size
const UNDEFINED = undefined;

export interface ItemProps<ItemType> extends React.HTMLAttributes<any> {
  prefixCls: string;
  item?: ItemType;
  className?: string;
  style?: React.CSSProperties;
  renderItem?: (item: ItemType, info: { index: number }) => React.ReactNode;
  responsive?: boolean;
  /**
   * @private To make node structure stable. We need keep wrap with ResizeObserver.
   * But disable it when it's no need to real measure.
   */
  responsiveDisabled?: boolean;
  itemKey?: React.Key;
  registerSize: (key: React.Key, width: number | null) => void;
  children?: React.ReactNode;
  display: boolean;
  order: number;
  component?: ComponentType;
  invalidate?: boolean;
}

function InternalItem<ItemType>(props: ItemProps<ItemType>, ref: React.Ref<any>) {
  const {
    prefixCls,
    invalidate,
    item,
    renderItem,
    responsive,
    responsiveDisabled,
    registerSize,
    itemKey,
    className,
    style,
    children,
    display,
    order,
    component: Component = 'div',
    ...restProps
  } = props;

  const mergedHidden = responsive && !display;

  // ================================ Effect ================================
  function internalRegisterSize(width: number | null) {
    registerSize(itemKey!, width);
  }

  React.useEffect(
    () => () => {
      internalRegisterSize(null);
    },
    [],
  );

  // ================================ Render ================================
  const childNode =
    renderItem && item !== UNDEFINED ? renderItem(item, { index: order }) : children;

  let overflowStyle: React.CSSProperties | undefined;
  if (!invalidate) {
    overflowStyle = {
      opacity: mergedHidden ? 0 : 1,
      height: mergedHidden ? 0 : UNDEFINED,
      overflowY: mergedHidden ? 'hidden' : UNDEFINED,
      order: responsive ? order : UNDEFINED,
      pointerEvents: mergedHidden ? 'none' : UNDEFINED,
      position: mergedHidden ? 'absolute' : UNDEFINED,
    };
  }

  const overflowProps: React.HTMLAttributes<any> = {};
  if (mergedHidden) {
    overflowProps['aria-hidden'] = true;
  }

  let itemNode = (
    <Component
      className={clsx(!invalidate && prefixCls, className)}
      style={{
        ...overflowStyle,
        ...style,
      }}
      {...overflowProps}
      {...restProps}
      ref={ref}
    >
      {childNode}
    </Component>
  );

  if (responsive) {
    itemNode = (
      <ResizeObserver
        onResize={({ offsetWidth }) => {
          internalRegisterSize(offsetWidth);
        }}
        disabled={responsiveDisabled}
      >
        {itemNode}
      </ResizeObserver>
    );
  }

  return itemNode;
}

const Item = React.forwardRef(InternalItem);
Item.displayName = 'Item';

export default Item;
