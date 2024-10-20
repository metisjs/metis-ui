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
        'ml-1 inline-flex items-center gap-2 text-text-tertiary',
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

export function ClearIcon({ onClear, className, ...restProps }: ClearIconProps) {
  return (
    <Icon
      {...restProps}
      type="clear"
      role="button"
      className={clsx(
        'absolute end-0 top-1/2 -translate-y-1/2 cursor-pointer text-text-tertiary opacity-0 transition-all hover:text-text-secondary group-hover/selector:opacity-100',
        className,
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
