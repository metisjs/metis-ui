import type { ReactElement } from 'react';
import React, { forwardRef } from 'react';
import { cloneElement } from '@util/reactNode';
import warning from '@util/warning';
import { composeRef, supportRef } from 'rc-util/lib/ref';
import { OverrideProvider } from '../menu/context/OverrideContext';
import type { DropdownProps } from './Dropdown';

export type OverlayProps = Pick<DropdownProps, 'prefixCls'> & {
  children: React.ReactNode;
  onClick: () => void;
};

const Overlay = forwardRef<HTMLElement, OverlayProps>((props, ref) => {
  const { prefixCls, children, onClick } = props;

  const composedRef = composeRef(
    ref,
    (children as ReactElement & { ref: React.Ref<HTMLElement> })?.ref,
  );

  return (
    <OverrideProvider
      prefixCls={`${prefixCls}-menu`}
      mode="vertical"
      selectable={false}
      onClick={onClick}
      className={{
        root: 'py-1',
        item: {
          root: 'px-1',
          inner: 'h-8 gap-1.5 px-3 py-1 pe-3 ps-3 font-normal leading-6',
          icon: 'h-4 w-4',
        },
        sub: {
          root: 'px-1',
          inner: 'h-8 gap-1.5 px-1 py-1 pe-3 ps-3 font-normal leading-6',
          icon: 'h-4 w-4',
        },
        group: {
          label: 'pe-3 ps-3',
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
  );
});

export default Overlay;
