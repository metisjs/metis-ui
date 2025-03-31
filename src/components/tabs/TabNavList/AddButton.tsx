import * as React from 'react';
import { PlusOutline } from '@metisjs/icons';
import { clsx } from '@util/classNameUtils';
import { TabContext } from '../context';
import type { EditableConfig, TabsLocale } from '../interface';

export interface AddButtonProps {
  prefixCls: string;
  editConfig: EditableConfig;
  locale?: TabsLocale;
  style?: React.CSSProperties;
  className?: string;
  icon?: React.ReactNode;
}

const AddButton = React.forwardRef<HTMLButtonElement, AddButtonProps>((props, ref) => {
  const { prefixCls, editConfig, locale, icon, style, className } = props;

  const { type, size, triggerRename } = React.useContext(TabContext);

  if (!editConfig.addable) {
    return null;
  }

  const rootCls = clsx(
    `${prefixCls}-nav-add`,
    'text-text-tertiary hover:text-text-secondary relative inline-flex items-center justify-center text-xl transition-colors',
    {
      'text-lg': size === 'middle' || size === 'small',
    },
    type === 'card' && [
      'hover:bg-fill-tertiary h-9 w-9 rounded-full text-xl',
      {
        'h-8 w-8': size === 'middle',
        'h-7 w-7': size === 'small',
      },
    ],
    type === 'pills' && [
      'hover:bg-fill-quinary w-9 rounded-md',
      {
        'w-8': size === 'middle',
        'w-7 rounded-sm': size === 'small',
      },
    ],
    className,
  );

  const handleClick: React.MouseEventHandler<HTMLButtonElement> = async (event) => {
    const key = await editConfig.onAdd?.(event);
    if (key && editConfig.renameAfterAdd) {
      triggerRename(key);
    }
  };

  return (
    <button
      ref={ref}
      type="button"
      className={rootCls}
      style={style}
      aria-label={locale?.addAriaLabel || 'Add tab'}
      onClick={handleClick}
    >
      {icon || <PlusOutline />}
    </button>
  );
});

export default AddButton;
