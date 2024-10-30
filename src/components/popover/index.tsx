import * as React from 'react';
import { clsx } from '../_util/classNameUtils';
import type { RenderFunction } from '../_util/getRenderPropValue';
import { getRenderPropValue } from '../_util/getRenderPropValue';
import useSemanticCls from '../_util/hooks/useSemanticCls';
import { ConfigContext } from '../config-provider';
import type { AbstractTooltipProps, TooltipRef } from '../tooltip';
import Tooltip from '../tooltip';

export interface PopoverProps extends AbstractTooltipProps {
  title?: React.ReactNode | RenderFunction;
  content?: React.ReactNode | RenderFunction;
}

interface OverlayProps {
  prefixCls?: string;
  title?: PopoverProps['title'];
  content?: PopoverProps['content'];
}

const Overlay: React.FC<OverlayProps> = ({ title, content, prefixCls }) => (
  <>
    {title && (
      <div className={clsx(`${prefixCls}-title`, 'mb-2 box-border min-w-[177px] font-semibold')}>
        {getRenderPropValue(title)}
      </div>
    )}
    <div className={`${prefixCls}-inner-content`}>{getRenderPropValue(content)}</div>
  </>
);

const Popover = React.forwardRef<TooltipRef, PopoverProps>((props, ref) => {
  const {
    title,
    content,
    className,
    placement = 'top',
    trigger = 'hover',
    mouseEnterDelay = 0.1,
    mouseLeaveDelay = 0.1,
    overlayStyle = {},
    ...otherProps
  } = props;
  const { getPrefixCls } = React.useContext(ConfigContext);

  const semanticCls = useSemanticCls(className);

  const prefixCls = getPrefixCls('popover');

  const overlayCls = clsx(
    'visible absolute z-[1070] box-border block w-max max-w-[100vw] origin-[var(--arrow-x,50%)_var(--arrow-y,50%)] [--metis-arrow-background-color:hsla(var(--elevated))]',
    semanticCls.overlay,
  );

  const popupInnerCls = clsx(
    'z-[1030] cursor-auto select-text rounded-lg p-3 text-text shadow-lg ring-1 ring-border-secondary focus:outline-none',
  );

  const arrowCls = clsx('after:ring-1 after:ring-border-secondary');

  return (
    <Tooltip
      placement={placement}
      trigger={trigger}
      mouseEnterDelay={mouseEnterDelay}
      mouseLeaveDelay={mouseLeaveDelay}
      overlayStyle={overlayStyle}
      {...otherProps}
      prefixCls={prefixCls}
      className={{ overlay: overlayCls, popupInner: popupInnerCls, arrow: arrowCls }}
      ref={ref}
      overlay={
        title || content ? <Overlay prefixCls={prefixCls} title={title} content={content} /> : null
      }
      transition={{
        enter: 'transition duration-[200ms]',
        enterFrom: 'opacity-0 scale-0',
        enterTo: 'opacity-100 scale-100',
        leave: 'transition duration-[200ms]',
        leaveFrom: 'opacity-100 scale-100 ',
        leaveTo: 'opacity-0 scale-0',
      }}
    />
  );
});

if (process.env.NODE_ENV !== 'production') {
  Popover.displayName = 'Popover';
}

export default Popover;
