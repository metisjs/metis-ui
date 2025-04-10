import * as React from 'react';
import toArray from '@rc-component/util/es/Children/toArray';
import { clsx } from '@util/classNameUtils';
import { ConfigContext } from '../config-provider';
import type { SizeType } from '../config-provider/SizeContext';
import Compact from './Compact';

export type SpaceSize = SizeType | number;

export interface SpaceProps extends React.HTMLAttributes<HTMLDivElement> {
  prefixCls?: string;
  className?: string;
  style?: React.CSSProperties;
  size?: SpaceSize | [SpaceSize, SpaceSize];
  vertical?: boolean;
  justify?: 'start' | 'end' | 'center' | 'space-around' | 'space-between';
  align?: 'start' | 'end' | 'center' | 'baseline';
  split?: React.ReactNode;
  wrap?: boolean;
  block?: boolean;
}

const spaceSize = {
  mini: 4,
  small: 8,
  middle: 16,
  large: 24,
};

function getNumberSize(size: SpaceSize) {
  return typeof size === 'string' ? spaceSize[size as keyof typeof spaceSize] : size || 0;
}

const Space: React.FC<SpaceProps> = (props) => {
  const { space } = React.useContext(ConfigContext);

  const {
    prefixCls: customizePrefixCls,
    size = space?.size || 'small',
    justify = 'start',
    align,
    className,
    children,
    vertical,
    split,
    style,
    wrap = false,
    block = false,
    ...otherProps
  } = props;
  const { getPrefixCls } = React.useContext(ConfigContext);

  const [horizontalSize, verticalSize] = React.useMemo(
    () =>
      ((Array.isArray(size) ? size : [size, size]) as [SpaceSize, SpaceSize]).map((item) =>
        getNumberSize(item),
      ),
    [size],
  );

  const childNodes = toArray(children, { keepEmpty: true });

  const prefixCls = getPrefixCls('space', customizePrefixCls);
  const mergedAlign = align === undefined && !vertical ? 'center' : align;
  const clx = clsx(
    prefixCls,
    'inline-flex',
    {
      'flex-col': vertical,
      ['flex']: block,
      'flex-wrap': wrap,
    },
    {
      'items-start': mergedAlign === 'start',
      'items-end': mergedAlign === 'end',
      'items-center': mergedAlign === 'center',
      'items-baseline': mergedAlign === 'baseline',
    },
    {
      'justify-start': justify === 'start',
      'justify-end': justify === 'end',
      'justify-center': justify === 'center',
      'justify-around': justify === 'space-around',
      'justify-between': justify === 'space-between',
    },
    className,
  );

  // Calculate latest one
  let latestIndex = childNodes.filter((child) => child !== null && child !== undefined).length - 1;
  const nodes = childNodes.map((child, i) => {
    if (child === null || child === undefined) {
      return null;
    }

    const key = (child && child.key) || `item-${i}`;

    return (
      <React.Fragment key={key}>
        {child}
        {i < latestIndex && split && <span className={`${prefixCls}-split`}>{split}</span>}
      </React.Fragment>
    );
  });

  // =========================== Render ===========================
  if (childNodes.length === 0) {
    return null;
  }

  const gapStyle: React.CSSProperties = { columnGap: horizontalSize, rowGap: verticalSize };

  return (
    <div
      className={clx}
      style={{
        ...gapStyle,
        ...style,
      }}
      {...otherProps}
    >
      {nodes}
    </div>
  );
};

type CompoundedComponent = React.FC<SpaceProps> & {
  Compact: typeof Compact;
};

const CompoundedSpace = Space as CompoundedComponent;
CompoundedSpace.Compact = Compact;

export default CompoundedSpace;
