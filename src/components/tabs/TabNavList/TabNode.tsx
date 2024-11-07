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

  const { type, size } = React.useContext(TabContext);

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
      {
        'ml-7 py-3': horizontal && size === 'middle',
        'ml-6 py-2': horizontal && size === 'small',
        'mt-3.5 px-5 py-1.5': !horizontal && size === 'middle',
        'mt-3 px-4 py-1': !horizontal && size === 'small',
      },
      disabled && 'text-text-quaternary',
    ],
    // Card
    type === 'card' && [
      'ml-1.5 w-56 overflow-visible rounded-lg px-2 py-2 duration-0 hover:duration-150',
      {
        'mb-1.5': position === 'top',
        'mt-1.5': position === 'bottom',
      },
      {
        'mb-0 mt-0 bg-container transition-none [&_+_div_.divider]:opacity-0': active,
        'hover:bg-fill-tertiary [&_+_div_.divider]:hover:opacity-0': !disabled && !active,
      },
      {
        'py-1.5': size === 'middle',
        'py-1': size === 'small',
      },
      active && [
        {
          'rounded-ee-none rounded-es-none pb-3.5': position === 'top',
          'rounded-se-none rounded-ss-none pt-3.5': position === 'bottom',
        },
        'before:pointer-events-none before:absolute before:-left-2.5 before:h-2.5 before:w-2.5',
        {
          'before:bottom-0 before:bg-[radial-gradient(circle_at_0_0,_transparent_10px,_hsla(var(--container))_10px)]':
            position === 'top',
          'before:top-0 before:bg-[radial-gradient(circle_at_0_10px,_transparent_10px,_hsla(var(--container))_10px)]':
            position === 'bottom',
        },
        'after:pointer-events-none after:absolute after:-right-2.5 after:h-2.5 after:w-2.5',
        {
          'after:bottom-0 after:bg-[radial-gradient(circle_at_10px_0,_transparent_10px,_hsla(var(--container))_10px)]':
            position === 'top',
          'after:top-0 after:bg-[radial-gradient(circle_at_10px_10px,_transparent_10px,_hsla(var(--container))_10px)]':
            position === 'bottom',
        },
        {
          'pb-3': size === 'middle' && position === 'top',
          'pt-3': size === 'middle' && position === 'bottom',
          'pb-2.5': size === 'small' && position === 'top',
          'pt-2.5': size === 'small' && position === 'bottom',
        },
      ],
      disabled && 'text-text-tertiary',
    ],
    // Pills
    type === 'pills' && [
      'ml-4 rounded-md px-3 py-2 text-text-secondary first:ml-0',
      {
        'hover:bg-fill-quinary': !disabled && !active,
        'bg-fill-quaternary text-text': active,
      },
      {
        'ml-3.5 px-2.5 py-1.5': size === 'middle',
        'ml-3 rounded px-2 py-1': size === 'small',
      },
      disabled && 'text-text-quaternary',
    ],
    disabled && 'cursor-not-allowed',
    semanticCls.root,
  );

  const iconCls = clsx(
    `${tabPrefix}-icon`,
    'inline-flex items-center text-text-tertiary',
    // Line
    type === 'line' && [
      'mr-2 text-xl',
      {
        'text-primary': active,
        'group-hover/tab:text-text-secondary': !active && !disabled,
      },
      {
        'mr-1.5 text-lg': size === 'middle',
        'mr-1 text-base': size === 'small',
      },
    ],
    // Card
    type === 'card' && [
      'mr-1.5 text-lg',
      {
        'text-text-secondary': active,
      },
      {
        'mr-1.5': size === 'middle',
        'mr-1 text-base': size === 'small',
      },
    ],
    // Pills
    type === 'pills' && [
      'mr-1.5 text-lg',
      {
        'text-text-secondary': active,
      },
      {
        'mr-1.5': size === 'middle',
        'mr-1 text-base': size === 'small',
      },
    ],
    disabled && 'text-text-quaternary',
    semanticCls.icon,
  );

  const labelCls = clsx(`${tabPrefix}-label`, '', semanticCls.label);

  const removeCls = clsx(`${tabPrefix}-remove`, '', semanticCls.remove);

  const cardDividerCls = clsx(
    `${tabPrefix}-divider`,
    'divider absolute -start-1 h-3/5 w-0.5 rounded-full bg-fill-secondary opacity-75 transition-opacity',
    'group-first/tab:opacity-0 group-hover/tab:opacity-0',
    {
      'opacity-0': active,
    },
  );

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
      {type === 'card' && <span className={cardDividerCls} />}
    </div>
  );

  return renderWrapper ? renderWrapper(node) : node;
};

export default TabNode;