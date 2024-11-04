import * as React from 'react';
import { XMarkOutline } from '@metisjs/icons';
import KeyCode from 'rc-util/lib/KeyCode';
import { clsx, type SemanticClassName } from '../../_util/classNameUtils';
import useSemanticCls from '../../_util/hooks/useSemanticCls';
import { TabContext } from '../context';
import type { GetIndicatorSize } from '../hooks/useIndicator';
import useIndicator from '../hooks/useIndicator';
import type { EditableConfig, Tab, TabOffset, TabPosition } from '../interface';
import { genDataNodeKey, getRemovable } from '../util';

export interface TabNodeProps {
  id: string;
  prefixCls: string;
  tab: Tab;
  active: boolean;
  closable?: boolean;
  editable?: EditableConfig;
  onClick?: (e: React.MouseEvent | React.KeyboardEvent) => void;
  onResize?: (width: number, height: number, left: number, top: number) => void;
  renderWrapper?: (node: React.ReactElement) => React.ReactElement;
  removeAriaLabel?: string;
  removeIcon?: React.ReactNode;
  onFocus: React.FocusEventHandler;
  style?: React.CSSProperties;
  className?: SemanticClassName<
    {
      icon?: string;
      label?: string;
      remove?: string;
    },
    { active?: boolean; removable?: boolean; disabled?: boolean }
  >;
  position?: TabPosition;
  indicator?: {
    size?: GetIndicatorSize;
    align?: 'start' | 'center' | 'end';
  };
  offset?: TabOffset;
}

const TabNode: React.FC<TabNodeProps> = (props) => {
  const {
    prefixCls,
    id,
    active,
    tab: { key, label, disabled, closeIcon, icon },
    closable,
    renderWrapper,
    removeAriaLabel,
    removeIcon,
    editable,
    onClick,
    onFocus,
    style,
    className,
    position,
    indicator,
    offset,
  } = props;

  const { type } = React.useContext(TabContext);

  const horizontal = position === 'top' || position === 'bottom';
  const { size: indicatorSize, align: indicatorAlign } = useIndicator({
    tabOffset: offset,
    horizontal,
    indicator,
  });

  const tabPrefix = `${prefixCls}-tab`;

  const removable = getRemovable(closable, closeIcon, editable, disabled);

  function onInternalClick(e: React.MouseEvent | React.KeyboardEvent) {
    if (disabled) {
      return;
    }
    onClick?.(e);
  }

  function onRemoveTab(event: React.MouseEvent | React.KeyboardEvent) {
    event.preventDefault();
    event.stopPropagation();
    editable?.onEdit('remove', { key, event });
  }

  // =================== Style ===================
  const semanticCls = useSemanticCls(className, { active, removable, disabled });

  const nodeCls = clsx(
    tabPrefix,
    {
      [`${tabPrefix}-with-remove`]: removable,
      [`${tabPrefix}-active`]: active,
      [`${tabPrefix}-disabled`]: disabled,
    },
    'group/tab',
    'relative inline-flex cursor-pointer items-center transition-colors',
    // Line
    type === 'line' && [
      'text-text-secondary',
      horizontal ? 'ml-8 px-1 py-4 first:ml-0' : 'mt-4 px-6 py-2 first:mt-0',
      {
        'hover:text-text hover:before:absolute hover:before:border-border': !disabled,
        'text-primary hover:text-primary': active,
      },
      {
        'hover:before:w-[var(--indicator-size)]': !disabled && horizontal,
        'hover:before:h-[var(--indicator-size)]': !disabled && !horizontal,
      },
      {
        'before:bottom-0 hover:before:border-b-2': position === 'top',
        'before:top-0 hover:before:border-t-2': position === 'bottom',
        'before:right-0 hover:before:border-r-2': position === 'left',
        'before:left-0 hover:before:border-l-2': position === 'right',
      },
      horizontal
        ? {
            'before:left-0': indicatorAlign === 'start',
            'before:left-1/2 before:-translate-x-1/2': indicatorAlign === 'center',
            'before:right-0': indicatorAlign === 'end',
          }
        : {
            'before:top-0': indicatorAlign === 'start',
            'before:top-1/2 before:-translate-y-1/2': indicatorAlign === 'center',
            'before:bottom-0': indicatorAlign === 'end',
          },
    ],
    // Card

    // Pills
    disabled && 'cursor-not-allowed text-text-quaternary',
    semanticCls.root,
  );

  const iconCls = clsx(
    `${tabPrefix}-icon`,
    'mr-2 inline-flex items-center text-xl text-text-tertiary',
    {
      'text-primary': active,
      'group-hover/tab:text-text-secondary': !active && !disabled,
    },
    disabled && 'text-text-quaternary',
    semanticCls.icon,
  );

  const labelCls = clsx(`${tabPrefix}-label`, '', semanticCls.label);

  const removeCls = clsx(`${tabPrefix}-remove`, '', semanticCls.remove);

  // =================== Render ===================
  const node: React.ReactElement = (
    <div
      key={key}
      data-node-key={genDataNodeKey(key)}
      className={nodeCls}
      // @ts-ignore
      style={{ ...style, '--indicator-size': `${indicatorSize}px` }}
      role="tab"
      aria-selected={active}
      id={id && `${id}-tab-${key}`}
      aria-controls={id && `${id}-panel-${key}`}
      aria-disabled={disabled}
      tabIndex={disabled ? undefined : 0}
      onClick={onInternalClick}
      onKeyDown={(e) => {
        if ([KeyCode.SPACE, KeyCode.ENTER].includes(e.which)) {
          e.preventDefault();
          onInternalClick(e);
        }
      }}
      onFocus={onFocus}
    >
      {icon && <span className={iconCls}>{icon}</span>}
      {label && <span className={labelCls}>{label}</span>}
      {removable && (
        <button
          type="button"
          aria-label={removeAriaLabel || 'remove'}
          tabIndex={0}
          className={removeCls}
          onClick={(e) => {
            e.stopPropagation();
            onRemoveTab(e);
          }}
        >
          {closeIcon || removeIcon || <XMarkOutline />}
        </button>
      )}
    </div>
  );

  return renderWrapper ? renderWrapper(node) : node;
};

export default TabNode;
