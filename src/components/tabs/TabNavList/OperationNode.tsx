import * as React from 'react';
import { useEffect, useState } from 'react';
import { EllipsisHorizontalOutline } from '@metisjs/icons';
import Scrollbar from 'metis-ui/es/scrollbar';
import KeyCode from 'rc-util/lib/KeyCode';
import type { SemanticClassName } from '../../_util/classNameUtils';
import { clsx } from '../../_util/classNameUtils';
import useSemanticCls from '../../_util/hooks/useSemanticCls';
import Dropdown from '../../dropdown';
import type { MenuProps } from '../../menu';
import type { EditableConfig, IconsType, MoreProps, Tab, TabsLocale } from '../interface';
import { getRemovable } from '../util';
import AddButton from './AddButton';

export interface OperationNodeProps {
  prefixCls: string;
  className?: SemanticClassName<{ more?: string; addBtn?: string }>;
  style?: React.CSSProperties;
  id: string;
  tabs: Tab[];
  tabBarGutter?: number;
  activeKey: string;
  mobile: boolean;
  more?: MoreProps;
  icons?: IconsType;
  editable?: EditableConfig;
  locale?: TabsLocale;
  removeAriaLabel?: string;
  onTabClick: (key: string, e: React.MouseEvent | React.KeyboardEvent) => void;
  tabMoving?: boolean;
  getPopupContainer?: (node: HTMLElement) => HTMLElement;
  horizontal?: boolean;
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
    editable,
    tabBarGutter,
    removeAriaLabel,
    horizontal,
    onTabClick,
    getPopupContainer,
  } = props;
  // ======================== Dropdown ========================
  const [open, setOpen] = useState(false);
  const [selectedKey, setSelectedKey] = useState<string | null>(null);

  const popupId = `${id}-more-popup`;
  const dropdownPrefix = `${prefixCls}-dropdown`;
  const selectedItemId = selectedKey !== null ? `${popupId}-${selectedKey}` : undefined;

  const dropdownAriaLabel = locale?.dropdownAriaLabel;

  function onRemoveTab(event: React.MouseEvent | React.KeyboardEvent, key: string) {
    event.preventDefault();
    event.stopPropagation();
    editable?.onEdit('remove', { key, event });
  }

  const menu: MenuProps = {
    onClick: ({ key, domEvent }) => {
      onTabClick(key, domEvent);
      setOpen(false);
    },
    prefixCls: `${dropdownPrefix}-menu`,
    className: {
      root: 'min-w-28 gap-0',
      item: ({ disabled }) => ({
        root: 'px-0',
        inner: clsx(
          'rounded-none pe-2 ps-2 leading-8',
          !disabled && 'text-text-secondary hover:text-text',
          disabled && 'text-text-quaternary',
        ),
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
      const removable = getRemovable(closable, closeIcon, editable, disabled);

      return {
        key,
        id: `${popupId}-${key}`,
        role: 'option',
        'aria-controls': id && `${id}-panel-${key}`,
        disabled,
        label: (
          <>
            <span>{label}</span>
            {removable && (
              <button
                type="button"
                aria-label={removeAriaLabel || 'remove'}
                tabIndex={0}
                className={`${dropdownPrefix}-menu-item-remove`}
                onClick={(e) => {
                  e.stopPropagation();
                  onRemoveTab(e, key);
                }}
              >
                {closeIcon || icons?.remove || '×'}
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
    const { which } = e;

    if (!open) {
      if ([KeyCode.DOWN, KeyCode.SPACE, KeyCode.ENTER].includes(which)) {
        setOpen(true);
        e.preventDefault();
      }
      return;
    }

    switch (which) {
      case KeyCode.UP:
        selectOffset(-1);
        e.preventDefault();
        break;
      case KeyCode.DOWN:
        selectOffset(1);
        e.preventDefault();
        break;
      case KeyCode.ESC:
        setOpen(false);
        break;
      case KeyCode.SPACE:
      case KeyCode.ENTER:
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
    'inline-flex items-center justify-center px-4 py-3 text-lg text-text-secondary',
    semanticCls.more,
  );

  // ========================= Render =========================
  const moreStyle: React.CSSProperties = {
    marginLeft: tabBarGutter,
  };
  if (!tabs.length) {
    moreStyle.visibility = 'hidden';
    moreStyle.order = 1;
  }

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
        style={moreStyle}
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
        editable={editable}
        className={semanticCls.addBtn}
      />
    </div>
  );
});

export default React.memo(OperationNode, (_, next) => !!next.tabMoving);
