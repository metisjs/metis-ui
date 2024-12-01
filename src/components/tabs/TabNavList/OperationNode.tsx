import * as React from 'react';
import { useEffect, useState } from 'react';
import { EllipsisHorizontalOutline, XMarkOutline } from '@metisjs/icons';
import type { SemanticClassName } from '@util/classNameUtils';
import { clsx } from '@util/classNameUtils';
import useSemanticCls from '@util/hooks/useSemanticCls';
import type { SafeKey } from '@util/type';
import Dropdown from '../../dropdown';
import type { MenuProps } from '../../menu';
import Scrollbar from '../../scrollbar';
import { TabContext } from '../context';
import type {
  EditableConfig,
  IconsType,
  MoreProps,
  Tab,
  TabPosition,
  TabsLocale,
} from '../interface';
import { getRemovable } from '../util';
import AddButton from './AddButton';

export interface OperationNodeProps {
  prefixCls: string;
  className?: SemanticClassName<{ more?: string; addBtn?: string }>;
  style?: React.CSSProperties;
  id: string;
  tabs: Tab[];
  activeKey: SafeKey;
  mobile: boolean;
  more?: MoreProps;
  icons?: IconsType;
  editConfig: EditableConfig;
  locale?: TabsLocale;
  closeAriaLabel?: string;
  onTabClick: (key: SafeKey, e: React.MouseEvent | React.KeyboardEvent) => void;
  tabMoving?: boolean;
  getPopupContainer?: (node: HTMLElement) => HTMLElement;
  position?: TabPosition;
}

const OperationNode = React.forwardRef<HTMLDivElement, OperationNodeProps>((props, ref) => {
  const {
    prefixCls,
    id,
    tabs,
    locale,
    mobile,
    more,
    icons,
    style,
    className,
    editConfig,
    closeAriaLabel,
    position,
    onTabClick,
    getPopupContainer,
  } = props;

  const { type } = React.useContext(TabContext);

  const horizontal = position === 'top' || position === 'bottom';

  // ======================== Dropdown ========================
  const [open, setOpen] = useState(false);
  const [selectedKey, setSelectedKey] = useState<SafeKey | null>(null);

  const popupId = `${id}-more-popup`;
  const dropdownPrefix = `${prefixCls}-dropdown`;
  const selectedItemId = selectedKey !== null ? `${popupId}-${selectedKey}` : undefined;

  const dropdownAriaLabel = locale?.dropdownAriaLabel;

  function onCloseTab(event: React.MouseEvent | React.KeyboardEvent, key: SafeKey) {
    event.preventDefault();
    event.stopPropagation();
    editConfig?.onClose?.(key, event);
  }

  const menu: MenuProps = {
    onClick: ({ key, domEvent }) => {
      onTabClick(key, domEvent);
      setOpen(false);
    },
    prefixCls: `${dropdownPrefix}-menu`,
    className: {
      root: 'min-w-32',
      item: ({ disabled }) => ({
        inner: clsx(
          !disabled && 'text-text-secondary hover:text-text',
          disabled && 'text-text-quaternary',
          editConfig?.closable && 'pe-2',
        ),
        label: clsx('flex', editConfig?.closable && 'pe-6'),
      }),
    },
    id: popupId,
    tabIndex: -1,
    role: 'listbox',
    'aria-activedescendant': selectedItemId,
    selectedKeys: selectedKey ? [selectedKey] : undefined,
    'aria-label': dropdownAriaLabel !== undefined ? dropdownAriaLabel : 'expanded dropdown',
    items: tabs.map((tab) => {
      const { closable, disabled, closeIcon, key, label } = tab;
      const removable = getRemovable(closable, closeIcon, editConfig, disabled);

      return {
        key,
        id: `${popupId}-${key}`,
        role: 'option',
        'aria-controls': id && `${id}-panel-${key}`,
        disabled,
        label: (
          <>
            <span className="flex-1">{label}</span>
            {removable && (
              <button
                type="button"
                aria-label={closeAriaLabel || 'close'}
                tabIndex={0}
                className="absolute end-0 top-1/2 inline-flex -translate-y-1/2 items-center text-base text-text-tertiary transition-colors hover:text-text-secondary"
                onClick={(e) => {
                  e.stopPropagation();
                  onCloseTab(e, key);
                }}
              >
                {closeIcon || icons?.close || <XMarkOutline />}
              </button>
            )}
          </>
        ),
      };
    }),
  };

  function selectOffset(offset: -1 | 1) {
    const enabledTabs = tabs.filter((tab) => !tab.disabled);
    let selectedIndex = enabledTabs.findIndex((tab) => tab.key === selectedKey) || 0;
    const len = enabledTabs.length;

    for (let i = 0; i < len; i += 1) {
      selectedIndex = (selectedIndex + offset + len) % len;
      const tab = enabledTabs[selectedIndex];
      if (!tab.disabled) {
        setSelectedKey(tab.key);
        return;
      }
    }
  }

  function onKeyDown(e: React.KeyboardEvent) {
    const { key } = e;

    if (!open) {
      if (['ArrowDown', 'Space', 'Enter'].includes(key)) {
        setOpen(true);
        e.preventDefault();
      }
      return;
    }

    switch (key) {
      case 'ArrowUp':
        selectOffset(-1);
        e.preventDefault();
        break;
      case 'ArrowDown':
        selectOffset(1);
        e.preventDefault();
        break;
      case 'Escape':
        setOpen(false);
        break;
      case 'Space':
      case 'Enter':
        if (selectedKey !== null) {
          onTabClick(selectedKey, e);
        }
        break;
    }
  }

  // ========================= Effect =========================
  useEffect(() => {
    // We use query element here to avoid React strict warning
    const ele = document.getElementById(selectedItemId!);
    if (ele && ele.scrollIntoView) {
      ele.scrollIntoView(false);
    }
  }, [selectedKey]);

  useEffect(() => {
    if (!open) {
      setSelectedKey(null);
    }
  }, [open]);

  // ========================= Style =========================
  const semanticCls = useSemanticCls(className);

  const rootCls = clsx(
    `${prefixCls}-nav-operations`,
    'flex self-stretch',
    !horizontal && 'tex flex-col',
    semanticCls.root,
  );

  const moreCls = clsx(
    `${prefixCls}-nav-more`,
    'inline-flex items-center justify-center px-4 py-1 text-lg text-text-tertiary hover:text-text-secondary',
    type === 'card' && {
      'mb-1.5': position === 'top',
      'mt-1.5': position === 'bottom',
    },
    semanticCls.more,
  );

  const addBtnCls = clsx(
    type === 'line' && 'py-1 pe-2',
    type === 'card' && 'mr-1.5',
    semanticCls.addBtn,
  );

  // ========================= Render =========================
  const moreNode: React.ReactNode = mobile ? null : (
    <Dropdown
      prefixCls={dropdownPrefix}
      menu={menu}
      open={tabs.length ? open : false}
      onOpenChange={setOpen}
      mouseEnterDelay={0.1}
      mouseLeaveDelay={0.1}
      getPopupContainer={getPopupContainer}
      popupRender={(node) => <Scrollbar autoHeight={[0, 208]}>{node}</Scrollbar>}
      {...more}
    >
      <button
        type="button"
        className={moreCls}
        tabIndex={-1}
        aria-haspopup="listbox"
        aria-controls={popupId}
        id={`${id}-more`}
        aria-expanded={open}
        onKeyDown={onKeyDown}
      >
        {icons?.more ?? <EllipsisHorizontalOutline />}
      </button>
    </Dropdown>
  );

  return (
    <div className={rootCls} style={style} ref={ref}>
      {moreNode}
      <AddButton
        prefixCls={prefixCls}
        locale={locale}
        editConfig={editConfig}
        className={addBtnCls}
        icon={icons?.add}
      />
    </div>
  );
});

export default React.memo(OperationNode, (_, next) => !!next.tabMoving);
