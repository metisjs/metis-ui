import * as React from 'react';
import pickAttrs from '@rc-component/util/es/pickAttrs';
import { composeRef } from '@rc-component/util/es/ref';
import { clsx } from '@util/classNameUtils';
import useClosable from '@util/hooks/useClosable';
import useSemanticCls from '@util/hooks/useSemanticCls';
import Scrollbar from '../scrollbar';
import Transition from '../transition';
import { usePanelRef } from '../watermark/context';
import type { ModalProps } from './interface';

const sentinelStyle = { width: 0, height: 0, overflow: 'hidden', outline: 'none' };

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
    | 'centered'
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
  ({ children }: { shouldUpdate: boolean; children: React.ReactElement }) =>
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
    centered,
    destroyOnClose,
    onOpenChanged,
  } = props;

  const semanticCls = useSemanticCls(className, 'modal');

  const sentinelStartRef = React.useRef<HTMLDivElement>(null);
  const sentinelEndRef = React.useRef<HTMLDivElement>(null);

  React.useImperativeHandle(ref, () => ({
    focus: () => {
      sentinelStartRef.current?.focus({ preventScroll: true });
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

  const watermarkRef = usePanelRef();

  // ================================ Style =================================
  const panelCls = clsx(
    prefixCls,
    'text-text bg-container pointer-events-auto relative top-28 mb-8 flex w-auto max-w-[calc(100vw-48px)] transform flex-col overflow-hidden rounded-lg text-left text-sm shadow-xl backdrop-blur-2xl transition-all',
    !!centered && 'top-0',
    semanticCls.root,
  );

  const headerCls = clsx(
    `${prefixCls}-header`,
    'truncate px-6 pt-6 pr-14 pb-4 text-base leading-6 font-semibold',
    semanticCls.header,
  );

  const bodyCls = clsx(
    `${prefixCls}-body px-6 pb-4`,
    { 'pt-6': !title, 'pb-6': !footer },
    semanticCls.body,
  );

  const footerCls = clsx(
    `${prefixCls}-footer`,
    'bg-fill-quinary flex items-center justify-end gap-3 px-6 py-3',
    semanticCls.footer,
  );

  const closeCls = clsx(
    `${prefixCls}-close`,
    'text-text-tertiary hover:bg-fill-tertiary hover:text-text-secondary absolute top-3 right-3 rounded-sm p-1',
    semanticCls.close,
  );

  const panelStyle: React.CSSProperties = {};

  if (width !== undefined) {
    panelStyle.width = width;
  }
  if (height !== undefined) {
    panelStyle.height = height;
  }

  // ================================ Render ================================
  const footerNode = footer ? <div className={footerCls}>{footer}</div> : null;

  const headerNode = title ? (
    <div className={headerCls} id={ariaId}>
      {title}
    </div>
  ) : null;

  const [mergedClosable, closeIcon, iconProps] = useClosable(closable, { className: 'w-6 h-6' });
  const ariaProps = pickAttrs(iconProps, true);

  const closerNode = mergedClosable ? (
    <button type="button" onClick={onClose} aria-label="Close" {...ariaProps} className={closeCls}>
      {closeIcon}
    </button>
  ) : null;

  const content = (
    <>
      {closerNode}
      {headerNode}
      {!!height ? (
        <Scrollbar className={{ root: 'flex-1 basis-0', view: bodyCls }}>{children}</Scrollbar>
      ) : (
        <div className={bodyCls} {...bodyProps}>
          {children}
        </div>
      )}
      {footerNode}
    </>
  );

  return (
    <Transition
      appear
      visible={open}
      enter="ease-out duration-300"
      enterFrom="opacity-0 translate-y-0 scale-95 max-sm:translate-y-4 max-sm:scale-100"
      enterTo="opacity-100 translate-y-0 scale-100"
      leave="ease-in duration-200"
      leaveFrom="opacity-100 translate-y-0 scale-100"
      leaveTo="opacity-0 translate-y-0 scale-95 max-sm:translate-y-4 max-sm:scale-100"
      onVisibleChanged={onOpenChanged}
      forceRender={forceRender}
      removeOnLeave={destroyOnClose}
    >
      {({ className: transitionCls, style: transitionStyle }, transitionRef) => {
        const dom = (
          <div
            key="dialog-element"
            role="dialog"
            aria-labelledby={title ? ariaId : undefined}
            aria-modal="true"
            ref={composeRef(transitionRef, watermarkRef)}
            style={{ ...panelStyle, ...style, ...transitionStyle }}
            className={clsx(panelCls, transitionCls)}
            onMouseDown={onMouseDown}
            onMouseUp={onMouseUp}
          >
            <div ref={sentinelStartRef} tabIndex={0} style={sentinelStyle} />
            <MemoChildren shouldUpdate={!!open || !!forceRender}>{content}</MemoChildren>
            <div tabIndex={0} ref={sentinelEndRef} style={sentinelStyle} />
          </div>
        );
        return modalRender ? modalRender(dom) : dom;
      }}
    </Transition>
  );
});

export default Panel;
