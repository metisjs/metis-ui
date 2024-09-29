import React from 'react';
import { EllipsisVerticalOutline } from '@metisjs/icons';
import type { DraggableConfig, DraggableFn } from '../interface';

export default function useDraggableConfig(draggable?: DraggableFn | boolean | DraggableConfig) {
  return React.useMemo(() => {
    if (!draggable) {
      return undefined;
    }

    let mergedDraggable: DraggableConfig = {};
    switch (typeof draggable) {
      case 'function':
        mergedDraggable.nodeDraggable = draggable;
        break;
      case 'object':
        mergedDraggable = { icon: false, ...draggable };
        break;
      default:
        break;
    }

    if (mergedDraggable.icon === true) {
      mergedDraggable.icon = <EllipsisVerticalOutline />;
    }

    return mergedDraggable;
  }, [draggable]);
}
