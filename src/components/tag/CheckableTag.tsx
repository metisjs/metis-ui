import * as React from 'react';
import { clsx } from '../_util/classNameUtils';
import { ConfigContext } from '../config-provider';

export interface CheckableTagProps {
  prefixCls?: string;
  className?: string;
  style?: React.CSSProperties;
  /**
   * 该组件为完全受控组件，不支持非受控用法。
   */
  checked: boolean;
  children?: React.ReactNode;
  onChange?: (checked: boolean) => void;
  onClick?: (e: React.MouseEvent<HTMLSpanElement, MouseEvent>) => void;
}

const CheckableTag: React.FC<CheckableTagProps> = (props) => {
  const {
    prefixCls: customizePrefixCls,
    className,
    checked,
    onChange,
    onClick,
    ...restProps
  } = props;
  const { getPrefixCls } = React.useContext(ConfigContext);

  const handleClick = (e: React.MouseEvent<HTMLSpanElement, MouseEvent>) => {
    onChange?.(!checked);
    onClick?.(e);
  };

  const prefixCls = getPrefixCls('tag', customizePrefixCls);

  const cls = clsx(
    prefixCls,
    `${prefixCls}-checkable`,
    'relative me-2 inline-block h-auto cursor-pointer whitespace-nowrap rounded bg-transparent px-2 py-1 text-xs transition-colors',
    {
      [`${prefixCls}-checkable-checked bg-primary text-white hover:bg-primary-hover`]: checked,
      'hover:bg-neutral-fill-secondary hover:text-primary': !checked,
    },
    className,
  );

  return <span {...restProps} className={cls} onClick={handleClick} />;
};

export default CheckableTag;
