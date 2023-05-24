import toArray from 'rc-util/lib/Children/toArray';
import * as React from 'react';
import { clsx } from '../_util/classNameUtils';
import useFlexGapSupport from '../_util/hooks/useFlexGapSupport';
import { ConfigContext } from '../config-provider';
import type { SizeType } from '../config-provider/SizeContext';
import Compact from './Compact';
import Item from './Item';

export const SpaceContext = React.createContext({
  latestIndex: 0,
  horizontalSize: 0,
  verticalSize: 0,
  supportFlexGap: false,
});

export type SpaceSize = SizeType | number;

export interface SpaceProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  itemClassName?: string;
  style?: React.CSSProperties;
  size?: SpaceSize | [SpaceSize, SpaceSize];
  direction?: 'horizontal' | 'vertical';
  // No `stretch` since many components do not support that.
  align?: 'start' | 'end' | 'center' | 'baseline';
  split?: React.ReactNode;
  wrap?: boolean;
}

const spaceSize = {
  small: 8,
  middle: 16,
  large: 24,
};

function getNumberSize(size: SpaceSize) {
  return typeof size === 'string' ? spaceSize[size] : size || 0;
}

const Space: React.FC<SpaceProps> = (props) => {
  const { space } = React.useContext(ConfigContext);

  const {
    size = space?.size || 'small',
    align,
    className,
    itemClassName,
    children,
    direction = 'horizontal',
    split,
    style,
    wrap = false,
    ...otherProps
  } = props;

  const supportFlexGap = useFlexGapSupport();

  const [horizontalSize, verticalSize] = React.useMemo(
    () =>
      ((Array.isArray(size) ? size : [size, size]) as [SpaceSize, SpaceSize]).map((item) =>
        getNumberSize(item),
      ),
    [size],
  );

  const childNodes = toArray(children, { keepEmpty: true });

  const mergedAlign = align === undefined && direction === 'horizontal' ? 'center' : align;
  const clx = clsx(
    {
      'flex-col': direction === 'vertical',
    },
    'inline-flex',
    `items-${mergedAlign}`,
    className,
  );

  // Calculate latest one
  let latestIndex = 0;
  const nodes = childNodes.map((child, i) => {
    if (child !== null && child !== undefined) {
      latestIndex = i;
    }

    const key = (child && child.key) || `item-${i}`;

    return (
      <Item
        className={itemClassName}
        key={key}
        direction={direction}
        index={i}
        split={split}
        wrap={wrap}
      >
        {child}
      </Item>
    );
  });

  const spaceContext = React.useMemo(
    () => ({ horizontalSize, verticalSize, latestIndex, supportFlexGap }),
    [horizontalSize, verticalSize, latestIndex, supportFlexGap],
  );

  // =========================== Render ===========================
  if (childNodes.length === 0) {
    return null;
  }

  const gapStyle: React.CSSProperties = {};

  if (wrap) {
    gapStyle.flexWrap = 'wrap';

    // Patch for gap not support
    if (!supportFlexGap) {
      gapStyle.marginBottom = -verticalSize;
    }
  }

  if (supportFlexGap) {
    gapStyle.columnGap = horizontalSize;
    gapStyle.rowGap = verticalSize;
  }

  return (
    <div
      className={clx}
      style={{
        ...gapStyle,
        ...style,
      }}
      {...otherProps}
    >
      <SpaceContext.Provider value={spaceContext}>{nodes}</SpaceContext.Provider>
    </div>
  );
};

type CompoundedComponent = React.FC<SpaceProps> & {
  Compact: typeof Compact;
};

const CompoundedSpace = Space as CompoundedComponent;
CompoundedSpace.Compact = Compact;

export default CompoundedSpace;
