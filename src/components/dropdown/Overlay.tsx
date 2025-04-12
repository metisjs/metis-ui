import React, { forwardRef } from 'react';
import { composeRef, getNodeRef, supportRef } from '@rc-component/util/es/ref';
import { cloneElement } from '@util/reactNode';
import warning from '@util/warning';
import { OverrideProvider } from '../menu/context/OverrideContext';
import type { DropdownProps } from './Dropdown';

export type OverlayProps = Pick<DropdownProps, 'prefixCls'> & {
  children: React.ReactNode;
  onClick: () => void;
};

const Overlay = forwardRef<HTMLElement, OverlayProps>((props, ref) => {
  const { prefixCls, children, onClick } = props;

  const composedRef = composeRef(ref, getNodeRef(children));

  return (
    <OverrideProvider
      prefixCls={`${prefixCls}-menu`}
      mode="vertical"
      selectable={false}
      onClick={onClick}
      className={{
        root: 'gap-0 py-1',
        item: {
          root: 'px-1',
          inner: 'h-8 gap-1.5 px-3 py-1 ps-3 pe-3 leading-6 font-normal',
          icon: 'size-4',
        },
        sub: {
          root: 'gap-0 px-1 *:px-0',
          inner: 'h-8 gap-1.5 px-1 py-1 ps-3 pe-3 leading-6 font-normal',
          icon: 'size-4',
          list: 'gap-0',
        },
        group: {
          label: 'ps-3 pe-3',
          list: 'gap-0 px-2',
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
