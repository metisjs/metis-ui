import React from 'react';
import KeyCode from 'rc-util/lib/KeyCode';
import { clsx, getSemanticCls } from '../_util/classNameUtils';
import { collapseTransition } from '../_util/transition';
import Transition from '../transition';
import type { CollapsePanelProps } from './interface';

const CollapsePanel = React.forwardRef<HTMLDivElement, CollapsePanelProps>((props, ref) => {
  const {
    showArrow = true,
    isActive,
    onItemClick,
    forceRender,
    className,
    prefixCls,
    collapsible,
    accordion,
    panelKey,
    extra,
    header,
    expandIcon,
    destroyInactivePanel = false,
    expandIconPosition,
    children,
    ...resetProps
  } = props;

  const semanticCls = getSemanticCls(className);

  const disabled = collapsible === 'disabled';
  const collapsibleHeader = collapsible === 'header';
  const collapsibleIcon = collapsible === 'icon';

  const ifExtraExist = extra !== null && extra !== undefined && typeof extra !== 'boolean';

  const handleItemClick = () => {
    onItemClick?.(panelKey);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.keyCode === KeyCode.ENTER || e.which === KeyCode.ENTER) {
      handleItemClick();
    }
  };

  const iconNode = (
    <div
      className={clsx(`${prefixCls}-expand-icon`, {
        'order-1': expandIconPosition === 'end',
        'cursor-pointer': collapsibleIcon,
      })}
      onClick={['header', 'icon'].includes(collapsible as string) ? handleItemClick : undefined}
    >
      {expandIcon(props)}
    </div>
  );

  const rootCls = clsx(
    {
      [`${prefixCls}-item`]: true,
      [`${prefixCls}-item-active`]: isActive,
      [`${prefixCls}-item-disabled`]: disabled,
    },
    'border-b border-border last-of-type:border-none',
    semanticCls.root,
  );

  const headerCls = clsx(
    {
      [`${prefixCls}-header`]: true,
      [`${prefixCls}-header-collapsible-only`]: collapsibleHeader,
      [`${prefixCls}-icon-collapsible-only`]: collapsibleIcon,
    },
    'relative flex cursor-pointer flex-nowrap items-center gap-2 py-3 pl-3 pr-4',
    {
      'cursor-default': collapsibleIcon,
      'pl-4 pr-3': expandIconPosition === 'end',
      'cursor-not-allowed text-text-tertiary': disabled,
    },
    semanticCls.header,
  );

  const contentCls = clsx(`${prefixCls}-content`, {
    [`${prefixCls}-content-active`]: isActive,
    [`${prefixCls}-content-inactive`]: !isActive,
  });

  const contentBoxCls = clsx(
    `${prefixCls}-content-box`,
    'border-t border-border bg-container p-4',
    semanticCls.content,
  );

  // ======================== HeaderProps ========================
  const headerProps: React.HTMLAttributes<HTMLDivElement> = {
    className: headerCls,
    'aria-expanded': isActive,
    'aria-disabled': disabled,
    onKeyDown: handleKeyDown,
  };

  if (!collapsibleHeader && !collapsibleIcon) {
    headerProps.onClick = handleItemClick;
    headerProps.role = accordion ? 'tab' : 'button';
    headerProps.tabIndex = disabled ? -1 : 0;
  }

  // ======================== Render ========================
  return (
    <div {...resetProps} ref={ref} className={rootCls}>
      <div {...headerProps}>
        {showArrow && iconNode}
        <span
          className={clsx(`${prefixCls}-header-text`, 'flex-auto truncate')}
          onClick={collapsible === 'header' ? handleItemClick : undefined}
        >
          {header}
        </span>
        {ifExtraExist && <div className={`${prefixCls}-extra`}>{extra}</div>}
      </div>
      <Transition
        visible={isActive}
        appear={false}
        {...collapseTransition}
        forceRender={forceRender}
        removeOnLeave={destroyInactivePanel}
      >
        {({ className: transitionCls, style: transitionStyle }, transitionRef) => {
          return (
            <div
              ref={transitionRef}
              className={clsx(contentCls, transitionCls)}
              style={transitionStyle}
            >
              <div className={contentBoxCls}>{children}</div>
            </div>
          );
        }}
      </Transition>
    </div>
  );
});

export default CollapsePanel;
