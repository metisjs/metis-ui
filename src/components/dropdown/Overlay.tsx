import type { ReactElement } from 'react';
import React, { forwardRef } from 'react';
import { composeRef, supportRef } from 'rc-util/lib/ref';
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
        className={{
          root: 'py-1',
          item: {
            root: 'px-1',
            inner: 'h-8 gap-1 px-3 py-1 pe-3 ps-3 font-normal leading-6',
            icon: 'h-[1.125rem] w-[1.125rem]',
          },
          group: {
            title: 'pe-3 ps-3',
            list: 'px-2',
          },
        }}
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
