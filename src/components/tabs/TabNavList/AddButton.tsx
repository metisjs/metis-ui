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
    'relative inline-flex items-center justify-center text-xl text-text-tertiary transition-colors hover:text-text-secondary',
    {
      'text-lg': size === 'middle' || size === 'small',
    },
    type === 'card' && [
      'h-9 w-9 rounded-full text-xl hover:bg-fill-tertiary',
      {
        'h-8 w-8': size === 'middle',
        'h-7 w-7': size === 'small',
      },
    ],
    type === 'pills' && [
      'w-9 rounded-md hover:bg-fill-quinary',
      {
        'w-8': size === 'middle',
        'w-7 rounded': size === 'small',
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
