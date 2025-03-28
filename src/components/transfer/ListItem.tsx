import * as React from 'react';
import { XMarkOutline } from '@metisjs/icons';
import type { SemanticClassName } from '@util/classNameUtils';
import { clsx } from '@util/classNameUtils';
import useSemanticCls from '@util/hooks/useSemanticCls';
import type { KeyWiseTransferItem } from '.';
import Checkbox from '../checkbox';
import { useLocale } from '../locale';
import defaultLocale from '../locale/en_US';
import TransButton from './Button';

export type ListItemSemanticClassName = SemanticClassName<
  { root?: string },
  { checked?: boolean; disabled?: boolean }
>;

type ListItemProps<RecordType> = {
  className?: ListItemSemanticClassName;
  renderedText?: string | number;
  renderedEl: React.ReactNode;
  disabled?: boolean;
  checked?: boolean;
  prefixCls: string;
  onClick: (item: RecordType, e: React.MouseEvent<HTMLLIElement, MouseEvent>) => void;
  onRemove?: (item: RecordType) => void;
  item: RecordType;
  showRemove?: boolean;
};

const ListItem = <RecordType extends KeyWiseTransferItem>(props: ListItemProps<RecordType>) => {
  const {
    className,
    renderedText,
    renderedEl,
    item,
    checked,
    disabled,
    prefixCls,
    onClick,
    onRemove,
    showRemove,
  } = props;

  const mergedDisabled = disabled || item.disabled;

  const semanticCls = useSemanticCls(className, { disabled: mergedDisabled, checked });

  const itemCls = clsx(
    `${prefixCls}-content-item`,
    {
      [`${prefixCls}-content-item-disabled`]: mergedDisabled,
      [`${prefixCls}-content-item-checked`]: checked,
    },
    'flex min-h-8 cursor-pointer items-center gap-2 px-3 py-2',
    {
      'hover:bg-fill-quaternary': !checked && !mergedDisabled,
      'bg-fill-quaternary text-primary': checked,
    },
    mergedDisabled && 'cursor-not-allowed text-text-tertiary',
    semanticCls.root,
  );

  let title: string | undefined;
  if (typeof renderedText === 'string' || typeof renderedText === 'number') {
    title = String(renderedText);
  }

  const [contextLocale] = useLocale('Transfer', defaultLocale.Transfer);

  const liProps: React.HTMLAttributes<HTMLLIElement> = { className: itemCls, title };

  const labelNode = (
    <span className={clsx(`${prefixCls}-content-item-text`, 'truncate')}>{renderedEl}</span>
  );

  if (showRemove) {
    return (
      <li {...liProps}>
        {labelNode}
        <TransButton
          disabled={mergedDisabled}
          className={clsx(
            `${prefixCls}-content-item-remove`,
            'ml-auto text-text-tertiary',
            !mergedDisabled && 'hover:text-text-secondary',
          )}
          aria-label={contextLocale?.remove}
          onClick={() => {
            onRemove?.(item);
          }}
        >
          <XMarkOutline />
        </TransButton>
      </li>
    );
  }

  // Default click to select
  liProps.onClick = disabled || item.disabled ? undefined : (event) => onClick(item, event);

  return (
    <li {...liProps}>
      <Checkbox
        className={`${prefixCls}-checkbox`}
        checked={checked}
        disabled={disabled || item.disabled}
      />
      {labelNode}
    </li>
  );
};

export default React.memo(ListItem);
