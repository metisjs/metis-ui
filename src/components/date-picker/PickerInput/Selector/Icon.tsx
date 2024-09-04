import * as React from 'react';
import { clsx } from '../../../_util/classNameUtils';
import PickerContext from '../context';

export interface IconProps extends React.HtmlHTMLAttributes<HTMLElement> {
  icon?: React.ReactNode;
  type: 'suffix' | 'clear';
}

export default function Icon(props: IconProps) {
  const { icon, type, className, ...restProps } = props;

  const { prefixCls } = React.useContext(PickerContext);

  return icon ? (
    <span
      className={clsx(
        `${prefixCls}-${type}`,
        '[&_.metis-icon]:text-base text-text-tertiary inline-flex items-center',
        className,
      )}
      {...restProps}
    >
      {icon}
    </span>
  ) : null;
}

export interface ClearIconProps extends Omit<IconProps, 'type'> {
  onClear: VoidFunction;
}

export function ClearIcon({ onClear, ...restProps }: ClearIconProps) {
  return (
    <Icon
      {...restProps}
      type="clear"
      role="button"
      className={clsx(
        'text-text-quaternary transition-all hover:text-text-tertiary absolute cursor-pointer opacity-0 end-0 top-1/2 -translate-y-1/2 group-hover/selector:opacity-100',
      )}
      onMouseDown={(e) => {
        e.preventDefault();
      }}
      onClick={(e) => {
        e.stopPropagation();
        onClear();
      }}
    />
  );
}
