import * as React from 'react';
import { clsx } from '../_util/classNameUtils';
import cva from '../_util/cva';
import warning from '../_util/warning';
import { ConfigContext } from '../config-provider';

export interface DividerProps {
  prefixCls?: string;
  type?: 'horizontal' | 'vertical';
  orientation?: 'left' | 'right' | 'center';
  className?: string;
  children?: React.ReactNode;
  dashed?: boolean;
  style?: React.CSSProperties;
  plain?: boolean;
}

const variantStyles = cva('border-neutral-fill-secondary', {
  variants: {
    type: {
      horizontal: 'clear-both my-6 flex w-full min-w-full border-t',
      vertical: 'relative top-[-0.06em] mx-2 inline-block h-[0.9em] border-l align-middle',
    },
    withText: {
      true: 'my-4 flex translate-y-1/2 items-center whitespace-nowrap border-t-0 text-center text-base font-medium before:relative before:border-b-0 before:border-t before:border-inherit before:content-[""] after:relative after:border-b-0 after:border-t after:border-inherit after:content-[""]',
    },
    orientation: {
      left: 'before:w-[5%] after:w-[95%]',
      right: 'before:w-[95%] after:w-[5%]',
      center: 'before:w-1/2 after:w-1/2',
    },
    dashed: { true: 'border-dashed' },
    plain: { true: 'text-sm font-normal' },
  },
  compoundVariants: [
    {
      withText: true,
      dashed: true,
      className: 'before:border-dashed after:border-dashed',
    },
  ],
});

const Divider: React.FC<DividerProps> = (props) => {
  const {
    prefixCls: customizePrefixCls,
    type = 'horizontal',
    orientation = 'center',
    className,
    children,
    dashed,
    plain,
    ...restProps
  } = props;
  const { getPrefixCls } = React.useContext(ConfigContext);
  const prefixCls = getPrefixCls('divider', customizePrefixCls);

  const hasChildren = !!children;
  const classString = variantStyles({ type, orientation, withText: hasChildren, dashed, plain }, [
    prefixCls,
    className,
  ]);

  // Warning children not work in vertical mode
  if (process.env.NODE_ENV !== 'production') {
    warning(
      !children || type !== 'vertical',
      'Divider',
      '`children` not working in `vertical` mode.',
    );
  }

  return (
    <div className={classString} {...restProps} role="separator">
      {children && type !== 'vertical' && (
        <span className={clsx(`${prefixCls}-inner-text`, 'inline-block px-2')}>{children}</span>
      )}
    </div>
  );
};

export default Divider;
