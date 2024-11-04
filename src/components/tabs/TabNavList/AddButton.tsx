import * as React from 'react';
import { PlusOutline } from '@metisjs/icons';
import { clsx } from '../../_util/classNameUtils';
import type { EditableConfig, TabsLocale } from '../interface';

export interface AddButtonProps {
  prefixCls: string;
  editable?: EditableConfig;
  locale?: TabsLocale;
  style?: React.CSSProperties;
  className?: string;
  icon?: React.ReactNode;
}

const AddButton = React.forwardRef<HTMLButtonElement, AddButtonProps>((props, ref) => {
  const { prefixCls, editable, locale, icon, style, className } = props;
  if (!editable || editable.showAdd === false) {
    return null;
  }

  return (
    <button
      ref={ref}
      type="button"
      className={clsx(`${prefixCls}-nav-add`, className)}
      style={style}
      aria-label={locale?.addAriaLabel || 'Add tab'}
      onClick={(event) => {
        editable.onEdit('add', { event });
      }}
    >
      {icon || <PlusOutline />}
    </button>
  );
});

export default AddButton;
