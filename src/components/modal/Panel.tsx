import * as React from 'react';
import { clsx } from '@util/classNameUtils';
import useClosable from '@util/hooks/useClosable';
import useSemanticCls from '@util/hooks/useSemanticCls';
import pickAttrs from 'rc-util/es/pickAttrs';
import Scrollbar from '../scrollbar';
import Transition from '../transition';
import { usePanelRef } from '../watermark/context';
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
    centered,
    destroyOnClose,
    onOpenChanged,
  } = props;

  const semanticCls = useSemanticCls(className, 'modal');

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

  const watermarkRef = usePanelRef();

  // ================================ Style =================================
  const panelCls = clsx(
    prefixCls,
    'text-text pointer-events-none relative top-28 mx-auto w-auto max-w-[calc(100vw-48px)] transform pb-6 text-left text-sm',
    !!centered && 'top-0 pb-0',
    semanticCls.root,
  );

  const contentCls = clsx(
    `${prefixCls}-content`,
    'bg-elevated pointer-events-auto relative flex flex-col overflow-hidden rounded-lg shadow-xl',
    semanticCls.content,
  );

  const headerCls = clsx(
    `${prefixCls}-header`,
    'truncate p-6 pr-14 pb-2 text-base leading-6 font-semibold',
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
    <div ref={watermarkRef} className={contentCls} style={height ? { height: height } : undefined}>
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
    </div>
  );

  return (
    <Transition
      appear
      visible={open}
      enter="transition-[opacity,transform] ease-out duration-300"
      enterFrom="opacity-0 translate-y-0 scale-95 xs:translate-y-4 xs:scale-100"
      enterTo="opacity-100 translate-y-0 scale-100"
      leave="transition-[opacity,transform] ease-in duration-200"
      leaveFrom="opacity-100 translate-y-0 scale-100"
      leaveTo="opacity-0 translate-y-0 scale-95 xs:translate-y-4 xs:scale-100"
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
          style={{ ...panelStyle, ...style, ...transitionStyle }}
          className={clsx(panelCls, transitionCls)}
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
