import toArray from 'rc-util/lib/Children/toArray';
import * as React from 'react';
import { clsx } from '../_util/classNameUtils';
import type { SizeType } from '../config-provider/SizeContext';

export interface SpaceCompactItemContextType {
  compactSize?: SizeType;
  compactDirection?: 'horizontal' | 'vertical';
  isFirstItem?: boolean;
  isLastItem?: boolean;
}

export const SpaceCompactItemContext = React.createContext<SpaceCompactItemContextType | null>(
  null,
);

export const useCompactItemContext = (prefixCls: string) => {
  const compactItemContext = React.useContext(SpaceCompactItemContext);

  const compactItemClassnames = React.useMemo(() => {
    if (!compactItemContext) return '';

    const { compactDirection, isFirstItem, isLastItem } = compactItemContext;
    const isVertical = compactDirection === 'vertical';
    const separator = isVertical ? '-vertical-' : '-';

    return [
      clsx(
        {
          [`${prefixCls}-compact${separator}item`]: true,
          [`${prefixCls}-compact${separator}first-item`]: isFirstItem,
          [`${prefixCls}-compact${separator}last-item`]: isLastItem,
        },
        !isVertical && {
          '-me-[1px]': !isLastItem,
        },
      ),
      clsx(
        'focus:z-[2]',
        !isVertical && {
          'rounded-r-none': isFirstItem && !isLastItem,
          'rounded-l-none': isLastItem && !isFirstItem,
          'rounded-none': !isFirstItem && !isLastItem,
        },
      ),
    ];
  }, [compactItemContext]);

  return {
    compactSize: compactItemContext?.compactSize,
    compactDirection: compactItemContext?.compactDirection,
    compactItemClassnames,
  };
};

export const NoCompactStyle: React.FC<React.PropsWithChildren> = ({ children }) => (
  <SpaceCompactItemContext.Provider value={null}>{children}</SpaceCompactItemContext.Provider>
);

export interface SpaceCompactProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: SizeType;
  direction?: 'horizontal' | 'vertical';
  block?: boolean;
}

const CompactItem: React.FC<React.PropsWithChildren<SpaceCompactItemContextType>> = ({
  children,
  ...otherProps
}) => (
  <SpaceCompactItemContext.Provider value={otherProps}>{children}</SpaceCompactItemContext.Provider>
);

const Compact: React.FC<SpaceCompactProps> = (props) => {
  const { size = 'middle', direction, block, className, children, ...restProps } = props;

  const clx = clsx(
    {
      'flex w-full': block,
      'flex-col': direction === 'vertical',
    },
    'inline-flex',
    className,
  );

  const compactItemContext = React.useContext(SpaceCompactItemContext);

  const childNodes = toArray(children);
  const nodes = React.useMemo(
    () =>
      childNodes.map((child, i) => {
        const key = (child && child.key) || `item-${i}`;

        return (
          <CompactItem
            key={key}
            compactSize={size}
            compactDirection={direction}
            isFirstItem={i === 0 && (!compactItemContext || compactItemContext?.isFirstItem)}
            isLastItem={
              i === childNodes.length - 1 && (!compactItemContext || compactItemContext?.isLastItem)
            }
          >
            {child}
          </CompactItem>
        );
      }),
    [size, childNodes, compactItemContext],
  );

  // =========================== Render ===========================
  if (childNodes.length === 0) {
    return null;
  }

  return (
    <div className={clx} {...restProps}>
      {nodes}
    </div>
  );
};

export default Compact;
