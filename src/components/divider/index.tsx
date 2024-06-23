import * as React from 'react';
import { clsx } from '../_util/classNameUtils';
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
  const classString = clsx(
    prefixCls,
    'border-neutral-fill-secondary',
    {
      'clear-both my-6 flex w-full min-w-full border-t': type === 'horizontal',
      'relative top-[-0.06em] mx-2 inline-block h-[0.9em] border-l align-middle':
        type === 'vertical',
    },
    {
      'before:w-[5%] after:w-[95%]': orientation === 'left',
      'before:w-[95%] after:w-[5%]': orientation === 'right',
      'before:w-1/2 after:w-1/2': orientation === 'center',
    },
    {
      'my-4 flex translate-y-1/2 items-center whitespace-nowrap border-t-0 text-center text-base font-medium before:relative before:border-b-0 before:border-t before:border-inherit before:content-[""] after:relative after:border-b-0 after:border-t after:border-inherit after:content-[""]':
        hasChildren,
      'border-dashed': dashed,
      'text-sm font-normal': plain,
      'before:border-dashed after:border-dashed': hasChildren && dashed,
    },
    className,
  );

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
