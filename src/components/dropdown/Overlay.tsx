import { ArrowRightOutline } from '@metaoa/icons';
import { composeRef, supportRef } from 'rc-util/lib/ref';
import React, { ReactElement, forwardRef } from 'react';
import { cloneElement } from '../_util/reactNode';
import warning from '../_util/warning';
import { OverrideProvider } from '../menu/context/OverrideContext';
import type { DropdownProps } from './Dropdown';

export type OverlayProps = Pick<DropdownProps, 'arrow' | 'prefixCls'> & {
  children: React.ReactNode;
  onClick: () => void;
};

const overrideCls = { root: 'p-1', item: 'p-0', itemInner: 'py-2 px-3 h-9 leading-9 gap-2' };

const Overlay = forwardRef<HTMLElement, OverlayProps>((props, ref) => {
  const { arrow, prefixCls, children, onClick } = props;

  const composedRef = composeRef(
    ref,
    (children as ReactElement & { ref: React.Ref<HTMLElement> })?.ref,
  );

  return (
    <>
      {arrow && <div className={`${prefixCls}-arrow`} />}
      <OverrideProvider
        prefixCls={`${prefixCls}-menu`}
        expandIcon={
          <span className={`${prefixCls}-menu-submenu-arrow`}>
            <ArrowRightOutline className={`${prefixCls}-menu-submenu-arrow-icon h-4 w-4`} />
          </span>
        }
        mode="vertical"
        selectable={false}
        onClick={onClick}
        className={overrideCls}
        validator={({ mode }) => {
          // Warning if use other mode
          warning(
            !mode || mode === 'vertical',
            'Dropdown',
            `mode="${mode}" is not supported for Dropdown's Menu.`,
          );
        }}
      >
        {cloneElement(children, { ref: supportRef(children) ? composedRef : undefined })}
      </OverrideProvider>
    </>
  );
});

export default Overlay;
