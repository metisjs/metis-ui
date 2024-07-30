import { composeRef, supportRef } from 'rc-util/lib/ref';
import React, { ReactElement, forwardRef } from 'react';
import { clsx } from '../_util/classNameUtils';
import getArrowClassName from '../_util/placementArrow';
import { cloneElement } from '../_util/reactNode';
import warning from '../_util/warning';
import { OverrideProvider } from '../menu/context/OverrideContext';
import type { DropdownProps } from './Dropdown';

export type OverlayProps = Pick<DropdownProps, 'arrow' | 'prefixCls'> & {
  children: React.ReactNode;
  onClick: () => void;
};

const overrideCls = {
  root: 'py-1',
  item: 'px-1',
  itemInner: 'py-2 px-3 ps-3 pe-3 h-9 leading-9 gap-2 font-normal',
  itemIcon: 'w-5 h-5',
  groupTitle: 'ps-3 pe-3',
  groupList: 'px-2',
};

const Overlay = forwardRef<HTMLElement, OverlayProps>((props, ref) => {
  const { arrow, prefixCls, children, onClick } = props;

  const composedRef = composeRef(
    ref,
    (children as ReactElement & { ref: React.Ref<HTMLElement> })?.ref,
  );

  return (
    <>
      {arrow && (
        <div
          className={clsx(
            `${prefixCls}-arrow`,
            getArrowClassName({
              limitVerticalRadius: true,
              custom: 'after:ring-1 after:ring-border-secondary',
            }),
          )}
        />
      )}
      <OverrideProvider
        prefixCls={`${prefixCls}-menu`}
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
