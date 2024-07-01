import toArray from 'rc-util/lib/Children/toArray';
import * as React from 'react';
import { clsx } from '../_util/classNameUtils';
import type { SizeType } from '../config-provider/SizeContext';

export interface SpaceCompactItemContextType {
  compactSize?: SizeType;
  vertical?: boolean;
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

    const { vertical, isFirstItem, isLastItem } = compactItemContext;
    const separator = vertical ? '-vertical-' : '-';

    return [
      clsx(
        {
          [`${prefixCls}-compact${separator}item`]: true,
          [`${prefixCls}-compact${separator}first-item`]: isFirstItem,
          [`${prefixCls}-compact${separator}last-item`]: isLastItem,
        },
        !vertical && {
          '-me-[1px]': !isLastItem,
        },
      ),
      clsx(
        'focus:z-[2]',
        !vertical && {
          'rounded-r-none': isFirstItem && !isLastItem,
          'rounded-l-none': isLastItem && !isFirstItem,
          'rounded-none': !isFirstItem && !isLastItem,
        },
      ),
    ];
  }, [compactItemContext]);

  return {
    compactSize: compactItemContext?.compactSize,
    compactItemClassnames,
  };
};

export const NoCompactStyle: React.FC<React.PropsWithChildren> = ({ children }) => (
  <SpaceCompactItemContext.Provider value={null}>{children}</SpaceCompactItemContext.Provider>
);

export interface SpaceCompactProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: SizeType;
  vertical?: boolean;
  block?: boolean;
}

const CompactItem: React.FC<React.PropsWithChildren<SpaceCompactItemContextType>> = ({
  children,
  ...otherProps
}) => (
  <SpaceCompactItemContext.Provider value={otherProps}>{children}</SpaceCompactItemContext.Provider>
);

const Compact: React.FC<SpaceCompactProps> = (props) => {
  const { size = 'middle', vertical, block, className, children, ...restProps } = props;

  const clx = clsx(
    'inline-flex',
    {
      ['flex']: block,
      'flex-col': vertical,
    },
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
            vertical={vertical}
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
