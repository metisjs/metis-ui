import * as React from 'react';
import { XMarkOutline } from '@metisjs/icons';
import { clsx, type SemanticClassName } from '@util/classNameUtils';
import useSemanticCls from '@util/hooks/useSemanticCls';
import { devUseWarning } from '@util/warning';
import Dropdown from '../../dropdown';
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
  editConfig: EditableConfig;
  onClick?: (e: React.MouseEvent | React.KeyboardEvent) => void;
  onResize?: (width: number, height: number, left: number, top: number) => void;
  renderWrapper?: (node: React.ReactElement) => React.ReactElement;
  closeAriaLabel?: string;
  closeIcon?: React.ReactNode;
  onFocus: React.FocusEventHandler;
  style?: React.CSSProperties;
  className?: SemanticClassName<
    {
      icon?: string;
      label?: string;
      close?: string;
    },
    { active?: boolean; removable?: boolean; disabled?: boolean; renaming?: boolean }
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
    tab: { key, label, disabled, closeIcon: tabCloseIcon, icon },
    closable,
    renderWrapper,
    closeAriaLabel,
    closeIcon,
    editConfig,
    onClick,
    onFocus,
    style,
    className,
    position,
    indicator,
    offset,
  } = props;

  const { type, size, renamingKey, cancelRename, renderTabContextMenu } =
    React.useContext(TabContext);

  const labelRef = React.useRef<HTMLDivElement>(null);
  const [renamingLabel, setRenamingLabel] = React.useState<string>();

  const renaming = renamingKey === key && typeof label === 'string';

  const horizontal = position === 'top' || position === 'bottom';
  const { size: indicatorSize, align: indicatorAlign } = useIndicator({
    tabOffset: offset,
    horizontal,
    indicator,
  });

  const tabPrefix = `${prefixCls}-tab`;

  const removable = getRemovable(closable, closeIcon, editConfig, disabled);

  function onInternalClick(e: React.MouseEvent | React.KeyboardEvent) {
    if (disabled) {
      return;
    }
    onClick?.(e);
  }

  function onCloseTab(event: React.MouseEvent | React.KeyboardEvent) {
    event.preventDefault();
    event.stopPropagation();
    editConfig.onClose?.(key, event);
  }

  // =================== Rename ===================
  const warning = devUseWarning('Tabs');

  React.useEffect(() => {
    if (renamingKey === key && typeof label !== 'string') {
      warning(false, 'usage', '`rename` can only be used with string labels.');
      cancelRename();
    }
  }, [renamingKey, key, label]);

  React.useEffect(() => {
    if (renaming) {
      labelRef.current?.focus();
      const range = document.createRange();
      range.selectNodeContents(labelRef.current!);
      const selection = window.getSelection();
      selection!.removeAllRanges();
      selection!.addRange(range);
    } else if (typeof label === 'string' && labelRef.current?.innerText !== label) {
      labelRef.current!.innerText = label as string;
    }
  }, [renaming, label]);

  function onRenameBlur() {
    if (renaming) {
      if (!renamingLabel || renamingLabel.trim() === '') {
        labelRef.current!.innerText = label as string;
      } else {
        editConfig.onRename?.(key, renamingLabel);
      }
      cancelRename();
      setRenamingLabel(undefined);
    }
  }

  // =================== Style ===================
  const semanticCls = useSemanticCls(className, { active, removable, disabled, renaming });

  const nodeCls = clsx(
    tabPrefix,
    {
      [`${tabPrefix}-with-close`]: removable,
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
        'hover:text-text hover:before:border-border hover:before:absolute': !disabled,
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
      { 'pe-8': editConfig?.closable && !horizontal },
      disabled && 'text-text-quaternary',
    ],
    // Card
    type === 'card' && [
      'ml-1.5 w-56 overflow-visible rounded-lg px-2 py-2 duration-0 last-of-type:mr-1.5 hover:duration-150',
      {
        'mb-1.5': position === 'top',
        'mt-1.5': position === 'bottom',
      },
      {
        'bg-container mt-0 mb-0 transition-none [&_+_button::before]:opacity-0 [&_+_div_.divider]:opacity-0':
          active,
        'hover:bg-fill-tertiary hover:[&+button::before]:opacity-0 hover:[&+div_.divider]:opacity-0':
          !disabled && !active,
      },
      {
        'py-1.5': size === 'middle',
        'py-1': size === 'small',
      },
      active && [
        {
          'rounded-ee-none rounded-es-none pb-3.5': position === 'top',
          'rounded-ss-none rounded-se-none pt-3.5': position === 'bottom',
        },
        'before:pointer-events-none before:absolute before:-left-2.5 before:h-2.5 before:w-2.5',
        {
          'before:bottom-0 before:bg-[radial-gradient(circle_at_0_0,_transparent_10px,_var(--container)_10px)]':
            position === 'top',
          'before:top-0 before:bg-[radial-gradient(circle_at_0_10px,_transparent_10px,_var(--container)_10px)]':
            position === 'bottom',
        },
        'after:pointer-events-none after:absolute after:-right-2.5 after:h-2.5 after:w-2.5',
        {
          'after:bottom-0 after:bg-[radial-gradient(circle_at_10px_0,_transparent_10px,_var(--container)_10px)]':
            position === 'top',
          'after:top-0 after:bg-[radial-gradient(circle_at_10px_10px,_transparent_10px,_var(--container)_10px)]':
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
      'text-text-secondary ml-4 rounded-md px-3 py-2 first:ml-0',
      {
        'hover:bg-fill-quinary': !disabled && !active,
        'bg-fill-quaternary text-text': active,
      },
      {
        'ml-3.5 px-2.5 py-1.5': size === 'middle',
        'ml-3 rounded-sm px-2 py-1': size === 'small',
      },
      renaming && 'outline-primary outline outline-2 -outline-offset-2',
      disabled && 'text-text-quaternary',
    ],
    disabled && 'cursor-not-allowed',
    semanticCls.root,
  );

  const iconCls = clsx(
    `${tabPrefix}-icon`,
    'text-text-tertiary inline-flex items-center',
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

  const labelCls = clsx(
    `${tabPrefix}-label`,
    'flex-1 truncate',
    renaming && [
      'text-text rounded-xs',
      {
        'outline-0': type === 'pills',
        'outline-primary outline outline-2 outline-offset-1': type === 'line' || type === 'card',
      },
    ],
    semanticCls.label,
  );

  const closeCls = clsx(
    `${tabPrefix}-close`,
    'text-text-tertiary hover:text-text-secondary ml-2 inline-flex items-center text-base transition-colors',
    type === 'line' && !horizontal && 'absolute end-2',
    semanticCls.close,
  );

  const cardDividerCls = clsx(
    `${tabPrefix}-divider`,
    'divider bg-fill-secondary absolute -start-1 h-3/5 w-0.5 rounded-full opacity-75 transition-opacity',
    'group-first/tab:opacity-0 group-hover/tab:opacity-0',
    {
      'opacity-0': active,
    },
  );

  // =================== Render ===================
  const node = (
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
        if (['Space', 'Enter'].includes(e.key)) {
          e.preventDefault();
          onInternalClick(e);
        }
      }}
      onFocus={onFocus}
    >
      {icon && <span className={iconCls}>{icon}</span>}
      <span
        suppressContentEditableWarning
        ref={labelRef}
        className={labelCls}
        contentEditable={renaming}
        onClick={(e) => renaming && e.stopPropagation()}
        onBlur={onRenameBlur}
        onInput={(event) => setRenamingLabel((event.target as HTMLDivElement).innerText)}
        onKeyDown={(e) => {
          if (renaming && ['Enter'].includes(e.key)) {
            e.preventDefault();
            e.stopPropagation();
            onRenameBlur();
          }
        }}
      >
        {label}
      </span>
      {removable && (
        <button
          type="button"
          aria-label={closeAriaLabel || 'close'}
          tabIndex={0}
          className={closeCls}
          onClick={(e) => {
            e.stopPropagation();
            onCloseTab(e);
          }}
        >
          {tabCloseIcon || closeIcon || <XMarkOutline />}
        </button>
      )}

      {type === 'card' && <span className={cardDividerCls} />}
    </div>
  );

  const wrappedNode = renderWrapper ? renderWrapper(node) : node;

  const tabContextMenu = React.useMemo(
    () => renderTabContextMenu?.({ ...props.tab, closable: removable }),
    [renderTabContextMenu, props.tab, removable],
  );

  if (tabContextMenu) {
    return (
      <Dropdown key={key} menu={tabContextMenu} trigger={['contextMenu']}>
        {wrappedNode}
      </Dropdown>
    );
  }

  return wrappedNode;
};

export default TabNode;
