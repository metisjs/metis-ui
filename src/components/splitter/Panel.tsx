import React, { forwardRef } from 'react';
import { clsx } from '../_util/classNameUtils';
import useSemanticCls from '../_util/hooks/useSemanticCls';
import type { InternalPanelProps, PanelProps } from './interface';

export const InternalPanel = forwardRef<
  HTMLDivElement,
  React.PropsWithChildren<InternalPanelProps>
>((props, ref) => {
  const { prefixCls, className, children, size, style = {} } = props;

  const semanticCls = useSemanticCls(className);

  const panelClassName = clsx(
    `${prefixCls}-panel`,
    {
      [`${prefixCls}-panel-hidden`]: size === 0,
    },
    'overflow-auto px-px has-[.splitter:only-child]:overflow-hidden',
    {
      'overflow-hidden p-0': size === 0,
    },
    semanticCls.root,
  );

  const hasSize = size !== undefined;

  return (
    <div
      ref={ref}
      className={panelClassName}
      style={{
        ...style,
        // Use auto when start from ssr
        flexBasis: hasSize ? size : 'auto',
        flexGrow: hasSize ? 0 : 1,
      }}
    >
      {children}
    </div>
  );
});

if (process.env.NODE_ENV !== 'production') {
  InternalPanel.displayName = 'Panel';
}

const Panel: React.FC<React.PropsWithChildren<PanelProps>> = () => null;

export default Panel;
