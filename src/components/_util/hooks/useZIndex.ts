import React from 'react';
import { devUseWarning } from '../warning';
import ZIndexContext from '../ZIndexContext';

export type ZIndexContainer = 'Modal' | 'Drawer' | 'Popover' | 'Popconfirm' | 'Tooltip' | 'Tour';

export type ZIndexConsumer = 'SelectLike' | 'Dropdown' | 'DatePicker' | 'Menu' | 'ImagePreview';

// Z-Index control range
// Container: 1000 + offset 100 (max base + 10 * offset = 2000)
// Popover: offset 50
// Notification: Container Max zIndex + componentOffset

export const Z_INDEX_BASE = 1000;
const CONTAINER_OFFSET = 100;
const CONTAINER_OFFSET_MAX_COUNT = 10;

export const CONTAINER_MAX_OFFSET = CONTAINER_OFFSET * CONTAINER_OFFSET_MAX_COUNT;

export const containerBaseZIndexOffset: Record<ZIndexContainer, number> = {
  Modal: CONTAINER_OFFSET,
  Drawer: CONTAINER_OFFSET,
  Popover: CONTAINER_OFFSET,
  Popconfirm: CONTAINER_OFFSET,
  Tooltip: CONTAINER_OFFSET,
  Tour: CONTAINER_OFFSET,
};
export const consumerBaseZIndexOffset: Record<ZIndexConsumer, number> = {
  SelectLike: 50,
  Dropdown: 50,
  DatePicker: 50,
  Menu: 50,
  ImagePreview: 1,
};

function isContainerType(type: ZIndexContainer | ZIndexConsumer): type is ZIndexContainer {
  return type in containerBaseZIndexOffset;
}

type ReturnResult = [zIndex: number | undefined, contextZIndex: number];

export function useZIndex(
  componentType: ZIndexContainer | ZIndexConsumer,
  customZIndex?: number,
): ReturnResult {
  const parentZIndex = React.useContext(ZIndexContext);
  const isContainer = isContainerType(componentType);

  let result: ReturnResult;

  if (customZIndex !== undefined) {
    result = [customZIndex, customZIndex];
  } else {
    let zIndex = parentZIndex ?? Z_INDEX_BASE;

    if (isContainer) {
      zIndex += containerBaseZIndexOffset[componentType];
    } else {
      zIndex += consumerBaseZIndexOffset[componentType];
    }
    result = [zIndex, zIndex];
  }

  if (process.env.NODE_ENV !== 'production') {
    const warning = devUseWarning(componentType);

    const maxZIndex = Z_INDEX_BASE + CONTAINER_MAX_OFFSET;
    const currentZIndex = result[0] || 0;

    warning(
      customZIndex !== undefined || currentZIndex <= maxZIndex,
      'usage',
      '`zIndex` is over base_zindex(1000) too much. It may cause unexpected override.',
    );
  }

  return result;
}
