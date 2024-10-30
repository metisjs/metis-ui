import React from 'react';
import useMergedState from 'rc-util/lib/hooks/useMergedState';
import pickAttrs from 'rc-util/lib/pickAttrs';
import { clsx, mergeSemanticCls } from '../_util/classNameUtils';
import ExpandIcon from '../_util/ExpandIcon';
import useSemanticCls from '../_util/hooks/useSemanticCls';
import { cloneElement } from '../_util/reactNode';
import { ConfigContext } from '../config-provider';
import CollapsePanel from './CollapsePanel';
import type { CollapsePanelProps, CollapseProps } from './interface';

function getActiveKeysArray(activeKey: React.Key | React.Key[]) {
  let currentActiveKey = activeKey;
  if (!Array.isArray(currentActiveKey)) {
    const activeKeyType = typeof currentActiveKey;
    currentActiveKey =
      activeKeyType === 'number' || activeKeyType === 'string' ? [currentActiveKey] : [];
  }
  return currentActiveKey.map((key) => String(key));
}

const Collapse = React.forwardRef<HTMLDivElement, CollapseProps>((props, ref) => {
  const { getPrefixCls } = React.useContext(ConfigContext);

  const {
    prefixCls: customizePrefixCls,
    className,
    style,
    bordered = true,
    ghost,
    expandIconPosition = 'start',
    activeKey: rawActiveKey,
    defaultActiveKey,
    accordion,
    items,
    destroyInactivePanel,
    collapsible,
    expandIcon,
    onChange,
  } = props;

  const prefixCls = getPrefixCls('collapse', customizePrefixCls);
  const semanticCls = useSemanticCls(className, 'collapse');

  const [activeKey, setActiveKey] = useMergedState<React.Key | React.Key[], React.Key[]>([], {
    value: rawActiveKey,
    onChange: (v) => onChange?.(v),
    defaultValue: defaultActiveKey,
    postState: getActiveKeysArray,
  });

  const renderExpandIcon = React.useCallback(
    (panelProps: CollapsePanelProps) => {
      const icon =
        typeof expandIcon === 'function' ? (
          expandIcon(panelProps)
        ) : (
          <ExpandIcon open={panelProps.isActive} className="h-5 w-5" />
        );
      return cloneElement(icon, () => ({
        className: clsx(
          `${prefixCls}-arrow`,
          'h-5 w-5',
          (icon as React.ReactElement)?.props?.className,
        ),
      }));
    },
    [expandIcon, prefixCls],
  );

  const onItemClick = (key: React.Key) =>
    setActiveKey(() => {
      if (accordion) {
        return activeKey[0] === key ? [] : [key];
      }

      const index = activeKey.indexOf(key);
      const isActive = index > -1;
      if (isActive) {
        return activeKey.filter((item) => item !== key);
      }

      return [...activeKey, key];
    });

  // ======================== Style ========================
  const rootCls = clsx(
    prefixCls,
    `${prefixCls}-icon-position-${expandIconPosition}`,
    {
      [`${prefixCls}-borderless`]: !bordered,
      [`${prefixCls}-ghost`]: !!ghost,
    },
    'overflow-hidden rounded-lg border border-border bg-fill-quinary text-sm text-text',
    { 'border-0': !bordered, 'border-0 bg-transparent': !!ghost },
    semanticCls.root,
  );

  // ======================== Render ========================
  return (
    <div
      ref={ref}
      className={rootCls}
      style={style}
      role={accordion ? 'tablist' : undefined}
      {...pickAttrs(props, { aria: true, data: true })}
    >
      {items.map((item, index) => {
        const {
          children,
          label,
          key: rawKey,
          collapsible: rawCollapsible,
          onItemClick: rawOnItemClick,
          destroyInactivePanel: rawDestroyInactivePanel,
          ...restProps
        } = item;

        const key = String(rawKey ?? index);
        const mergeCollapsible = rawCollapsible ?? collapsible;
        const mergeDestroyInactivePanel = rawDestroyInactivePanel ?? destroyInactivePanel;

        const handleItemClick = (value: React.Key) => {
          if (mergeCollapsible === 'disabled') return;
          onItemClick(value);
          rawOnItemClick?.(value);
        };

        let isActive = false;
        if (accordion) {
          isActive = activeKey[0] === key;
        } else {
          isActive = activeKey.indexOf(key) > -1;
        }

        return (
          <CollapsePanel
            {...restProps}
            prefixCls={prefixCls}
            key={key}
            panelKey={key}
            isActive={isActive}
            accordion={accordion}
            expandIcon={renderExpandIcon}
            header={label}
            collapsible={mergeCollapsible}
            onItemClick={handleItemClick}
            destroyInactivePanel={mergeDestroyInactivePanel}
            expandIconPosition={expandIconPosition}
            className={mergeSemanticCls(
              {
                root: clsx({
                  'border-0': !!ghost,
                }),
                content: clsx({
                  'border-t-0 bg-transparent pt-1': !bordered,
                  'border-0 bg-transparent px-4 py-3': !!ghost,
                }),
              },
              semanticCls.panel,
            )}
          >
            {children}
          </CollapsePanel>
        );
      })}
    </div>
  );
});

export default Collapse;
