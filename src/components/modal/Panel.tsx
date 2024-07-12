import pickAttrs from 'rc-util/lib/pickAttrs';
import * as React from 'react';
import { clsx, getSemanticCls } from '../_util/classNameUtils';
import useClosable from '../_util/hooks/useClosable';
import Transition from '../transition';
import type { ModalProps } from './interface';

const sentinelStyle = { width: 0, height: 0, overflow: 'hidden', outline: 'none' };
const entityStyle = { outline: 'none' };

export interface PanelProps
  extends Pick<
    ModalProps,
    | 'className'
    | 'style'
    | 'title'
    | 'closable'
    | 'children'
    | 'bodyProps'
    | 'modalRender'
    | 'open'
    | 'forceRender'
    | 'width'
    | 'height'
    | 'destroyOnClose'
  > {
  prefixCls: string;
  ariaId?: string;
  footer?: React.ReactNode;
  onMouseDown?: React.MouseEventHandler;
  onMouseUp?: React.MouseEventHandler;
  onOpenChanged: (open: boolean) => void;
  onClose?: (e: React.SyntheticEvent) => any;
}

export type PanelRef = {
  focus: () => void;
  changeActive: (next: boolean) => void;
};

const MemoChildren = React.memo(
  ({ children }: { shouldUpdate: boolean; children: React.ReactNode }) =>
    children as React.ReactElement,
  (_, { shouldUpdate }) => !shouldUpdate,
);

const Panel = React.forwardRef<PanelRef, PanelProps>((props, ref) => {
  const {
    prefixCls,
    className,
    style,
    title,
    ariaId,
    footer,
    closable,
    onClose,
    children,
    bodyProps,
    modalRender,
    onMouseDown,
    onMouseUp,
    open,
    forceRender,
    width,
    height,
    destroyOnClose,
    onOpenChanged,
  } = props;

  const semanticCls = getSemanticCls(className);

  const sentinelStartRef = React.useRef<HTMLDivElement>(null);
  const sentinelEndRef = React.useRef<HTMLDivElement>(null);
  const entityRef = React.useRef<HTMLDivElement>(null);

  React.useImperativeHandle(ref, () => ({
    focus: () => {
      entityRef.current?.focus({ preventScroll: true });
    },
    changeActive: (next) => {
      const { activeElement } = document;
      if (next && activeElement === sentinelEndRef.current) {
        sentinelStartRef.current?.focus({ preventScroll: true });
      } else if (!next && activeElement === sentinelStartRef.current) {
        sentinelEndRef.current?.focus({ preventScroll: true });
      }
    },
  }));

  // ================================ Style =================================
  const contentStyle: React.CSSProperties = {};

  if (width !== undefined) {
    contentStyle.width = width;
  }
  if (height !== undefined) {
    contentStyle.height = height;
  }
  // ================================ Render ================================
  const footerNode = footer ? (
    <div className={clsx(`${prefixCls}-footer`, semanticCls.footer)}>{footer}</div>
  ) : null;

  const headerNode = title ? (
    <div className={clsx(`${prefixCls}-header`, semanticCls.header)}>
      <div className={`${prefixCls}-title`} id={ariaId}>
        {title}
      </div>
    </div>
  ) : null;

  const [, closeIcon, iconProps] = useClosable(closable);
  const ariaProps = pickAttrs(iconProps, true);

  const closerNode = closable ? (
    <button
      type="button"
      onClick={onClose}
      aria-label="Close"
      {...ariaProps}
      className={`${prefixCls}-close`}
    >
      {closeIcon}
    </button>
  ) : null;

  const content = (
    // TODO: use Scrollbar
    <div className={clsx(`${prefixCls}-content`, semanticCls.content)} style={contentStyle}>
      {closerNode}
      {headerNode}
      <div className={clsx(`${prefixCls}-body`, semanticCls.body)} {...bodyProps}>
        {children}
      </div>
      {footerNode}
    </div>
  );

  return (
    <Transition
      appear
      visible={open}
      enter="transition-[opacity,transform] ease-out duration-300"
      enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
      enterTo="opacity-100 translate-y-0 sm:scale-100"
      leave="transition-[opacity,transform] ease-in duration-200"
      leaveFrom="opacity-100 translate-y-0 sm:scale-100"
      leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
      onVisibleChanged={onOpenChanged}
      forceRender={forceRender}
      removeOnLeave={destroyOnClose}
    >
      {({ className: transitionCls, style: transitionStyle }, transitionRef) => (
        <div
          key="dialog-element"
          role="dialog"
          aria-labelledby={title ? ariaId : undefined}
          aria-modal="true"
          ref={transitionRef}
          style={{ ...style, ...transitionStyle }}
          className={clsx(prefixCls, className, transitionCls)}
          onMouseDown={onMouseDown}
          onMouseUp={onMouseUp}
        >
          <div tabIndex={0} ref={sentinelStartRef} style={sentinelStyle} aria-hidden="true" />
          <div ref={entityRef} tabIndex={-1} style={entityStyle}>
            <MemoChildren shouldUpdate={!!open || !!forceRender}>
              {modalRender ? modalRender(content) : content}
            </MemoChildren>
          </div>
          <div tabIndex={0} ref={sentinelEndRef} style={sentinelStyle} aria-hidden="true" />
        </div>
      )}
    </Transition>
  );
});

export default Panel;
