import { AlignType, BuildInPlacements } from '../trigger';

export interface AdjustOverflow {
  adjustX?: 0 | 1;
  adjustY?: 0 | 1;
}

export interface PlacementsConfig {
  arrowWidth: number;
  arrowPointAtCenter?: boolean;
  autoAdjustOverflow?: boolean | AdjustOverflow;
  offset: number;
  borderRadius: number;
  visibleFirst?: boolean;
}

export const MAX_VERTICAL_CONTENT_RADIUS = 8;

export function getArrowOffset(options: { contentRadius: number; limitVerticalRadius?: boolean }) {
  const maxVerticalContentRadius = MAX_VERTICAL_CONTENT_RADIUS;
  const { contentRadius, limitVerticalRadius } = options;
  const dropdownArrowOffset = contentRadius > 12 ? contentRadius + 2 : 12;
  const dropdownArrowOffsetVertical = limitVerticalRadius
    ? maxVerticalContentRadius
    : dropdownArrowOffset;
  return { dropdownArrowOffset, dropdownArrowOffsetVertical };
}

export function getOverflowOptions(
  placement: string,
  arrowOffset: ReturnType<typeof getArrowOffset>,
  arrowWidth: number,
  autoAdjustOverflow?: boolean | AdjustOverflow,
) {
  if (autoAdjustOverflow === false) {
    return {
      adjustX: false,
      adjustY: false,
    };
  }

  const overflow =
    autoAdjustOverflow && typeof autoAdjustOverflow === 'object' ? autoAdjustOverflow : {};

  const baseOverflow: AlignType['overflow'] = {};

  switch (placement) {
    case 'top':
    case 'bottom':
      baseOverflow.shiftX = arrowOffset.dropdownArrowOffset * 2 + arrowWidth;
      break;

    case 'left':
    case 'right':
      baseOverflow.shiftY = arrowOffset.dropdownArrowOffsetVertical * 2 + arrowWidth;
      break;
  }

  const mergedOverflow = {
    ...baseOverflow,
    ...overflow,
  };

  // Support auto shift
  if (!mergedOverflow.shiftX) {
    mergedOverflow.adjustX = true;
  }
  if (!mergedOverflow.shiftY) {
    mergedOverflow.adjustY = true;
  }

  return mergedOverflow;
}

type PlacementType = keyof BuildInPlacements;

const PlacementAlignMap: BuildInPlacements = {
  left: {
    points: ['cr', 'cl'],
  },
  right: {
    points: ['cl', 'cr'],
  },
  top: {
    points: ['bc', 'tc'],
  },
  bottom: {
    points: ['tc', 'bc'],
  },
  topLeft: {
    points: ['bl', 'tl'],
  },
  leftTop: {
    points: ['tr', 'tl'],
  },
  topRight: {
    points: ['br', 'tr'],
  },
  rightTop: {
    points: ['tl', 'tr'],
  },
  bottomRight: {
    points: ['tr', 'br'],
  },
  rightBottom: {
    points: ['bl', 'br'],
  },
  bottomLeft: {
    points: ['tl', 'bl'],
  },
  leftBottom: {
    points: ['br', 'bl'],
  },
};

const ArrowCenterPlacementAlignMap: BuildInPlacements = {
  topLeft: {
    points: ['bl', 'tc'],
  },
  leftTop: {
    points: ['tr', 'cl'],
  },
  topRight: {
    points: ['br', 'tc'],
  },
  rightTop: {
    points: ['tl', 'cr'],
  },
  bottomRight: {
    points: ['tr', 'bc'],
  },
  rightBottom: {
    points: ['bl', 'cr'],
  },
  bottomLeft: {
    points: ['tl', 'bc'],
  },
  leftBottom: {
    points: ['br', 'cl'],
  },
};

const DisableAutoArrowList: Set<keyof BuildInPlacements> = new Set([
  'topLeft',
  'topRight',
  'bottomLeft',
  'bottomRight',
  'leftTop',
  'leftBottom',
  'rightTop',
  'rightBottom',
]);

export default function getPlacements(config: PlacementsConfig) {
  const { arrowWidth, autoAdjustOverflow, arrowPointAtCenter, offset, borderRadius, visibleFirst } =
    config;
  const halfArrowWidth = arrowWidth / 2;

  const placementMap: BuildInPlacements = {};

  Object.keys(PlacementAlignMap).forEach((key: PlacementType) => {
    const template =
      (arrowPointAtCenter && ArrowCenterPlacementAlignMap[key]) || PlacementAlignMap[key];

    const placementInfo = {
      ...template,
      offset: [0, 0],
    };
    placementMap[key] = placementInfo;

    // Disable autoArrow since design is fixed position
    if (DisableAutoArrowList.has(key)) {
      placementInfo.autoArrow = false;
    }

    // Static offset
    switch (key) {
      case 'top':
      case 'topLeft':
      case 'topRight':
        placementInfo.offset[1] = -halfArrowWidth - offset;
        break;

      case 'bottom':
      case 'bottomLeft':
      case 'bottomRight':
        placementInfo.offset[1] = halfArrowWidth + offset;
        break;

      case 'left':
      case 'leftTop':
      case 'leftBottom':
        placementInfo.offset[0] = -halfArrowWidth - offset;
        break;

      case 'right':
      case 'rightTop':
      case 'rightBottom':
        placementInfo.offset[0] = halfArrowWidth + offset;
        break;
    }

    // Dynamic offset
    const arrowOffset = getArrowOffset({
      contentRadius: borderRadius,
      limitVerticalRadius: true,
    });

    if (arrowPointAtCenter) {
      switch (key) {
        case 'topLeft':
        case 'bottomLeft':
          placementInfo.offset[0] = -arrowOffset.dropdownArrowOffset - halfArrowWidth;
          break;

        case 'topRight':
        case 'bottomRight':
          placementInfo.offset[0] = arrowOffset.dropdownArrowOffset + halfArrowWidth;
          break;

        case 'leftTop':
        case 'rightTop':
          placementInfo.offset[1] = -arrowOffset.dropdownArrowOffset - halfArrowWidth;
          break;

        case 'leftBottom':
        case 'rightBottom':
          placementInfo.offset[1] = arrowOffset.dropdownArrowOffset + halfArrowWidth;
          break;
      }
    }

    // Overflow
    placementInfo.overflow = getOverflowOptions(key, arrowOffset, arrowWidth, autoAdjustOverflow);

    // VisibleFirst
    if (visibleFirst) {
      placementInfo.htmlRegion = 'visibleFirst';
    }
  });

  return placementMap;
}