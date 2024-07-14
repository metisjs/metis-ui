import Portal from '@rc-component/portal';
import contains from 'rc-util/lib/Dom/contains';
import KeyCode from 'rc-util/lib/KeyCode';
import pickAttrs from 'rc-util/lib/pickAttrs';
import * as React from 'react';
import { clsx, getSemanticCls } from '../_util/classNameUtils';
import ContextIsolator from '../_util/ContextIsolator';
import { useZIndex } from '../_util/hooks/useZIndex';
import ZIndexContext from '../_util/ZIndexContext';
import { ConfigContext } from '../config-provider';
import Skeleton from '../skeleton';
import Footer from './Footer';
import type { ModalProps } from './interface';
import Mask from './Mask';
import Panel, { PanelRef } from './Panel';

const Modal: React.FC<ModalProps> = (props) => {
  const {
    prefixCls: customizePrefixCls,
    className,
    zIndex,
    open = false,
    forceRender,
    destroyOnClose = false,
    keyboard = true,
    focusTriggerAfterClose = true,
    closable = true,
    mask = true,
    maskClosable = true,
    maskProps,
    wrapProps,
    getContainer,
    centered,
    width = 520,
    footer,
    loading,
    children,
    onCancel,
    afterOpenChange,
    afterClose,
    ...restProps
  } = props;

  const { getPrefixCls, getPopupContainer: getContextPopupContainer } =
    React.useContext(ConfigContext);
  const prefixCls = getPrefixCls('modal', customizePrefixCls);
  const semanticCls = getSemanticCls(className);

  const mergedGetContainer = getContainer ?? getContextPopupContainer;

  const lastOutSideActiveElementRef = React.useRef<HTMLElement | null>(null);
  const wrapperRef = React.useRef<HTMLDivElement>(null);
  const panelRef = React.useRef<PanelRef>(null);
  const panelClickRef = React.useRef(false);
  const panelTimeoutRef = React.useRef<ReturnType<typeof setTimeout>>();

  const [animatedOpen, setAnimatedOpen] = React.useState(open);

  const ariaId = React.useId();
  const saveLastOutSideActiveElementRef = () => {
    if (!contains(wrapperRef.current, document.activeElement!)) {
      lastOutSideActiveElementRef.current = document.activeElement as HTMLElement;
    }
  };

  const focusPanel = () => {
    if (!contains(wrapperRef.current, document.activeElement!)) {
      panelRef.current?.focus();
    }
  };

  // ========================= Events =========================
  const onOpenChanged = (newOpen: boolean) => {
    // Try to focus
    if (newOpen) {
      focusPanel();
    } else {
      // Clean up scroll bar & focus back
      setAnimatedOpen(false);

      if (mask && lastOutSideActiveElementRef.current && focusTriggerAfterClose) {
        try {
          lastOutSideActiveElementRef.current.focus({ preventScroll: true });
        } catch (e) {
          // Do nothing
        }
        lastOutSideActiveElementRef.current = null;
      }

      // Trigger afterClose only when change visible from true to false
      if (animatedOpen) {
        afterClose?.();
      }
    }
    afterOpenChange?.(newOpen);
  };

  // We need record panel click incase panel popup out of dialog
  const onPanelMouseDown: React.MouseEventHandler = () => {
    clearTimeout(panelTimeoutRef.current);
    panelClickRef.current = true;
  };

  const onPanelMouseUp: React.MouseEventHandler = () => {
    panelTimeoutRef.current = setTimeout(() => {
      panelClickRef.current = false;
    });
  };

  // Close only when element not on dialog
  let onWrapperClick: React.MouseEventHandler<HTMLDivElement> | undefined = undefined;
  if (maskClosable) {
    onWrapperClick = (e) => {
      if (panelClickRef.current) {
        panelClickRef.current = false;
      } else if (wrapperRef.current === e.target) {
        onCancel?.(e);
      }
    };
  }

  const onWrapperKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (keyboard && e.keyCode === KeyCode.ESC) {
      e.stopPropagation();
      onCancel?.(e);
      return;
    }

    // keep focus inside dialog
    if (open && e.keyCode === KeyCode.TAB) {
      panelRef.current?.changeActive(!e.shiftKey);
    }
  };

  // ========================= Effect =========================
  React.useEffect(() => {
    if (open) {
      setAnimatedOpen(true);
      saveLastOutSideActiveElementRef();
    }
  }, [open]);

  // Remove direct should also check the scroll bar update
  React.useEffect(
    () => () => {
      clearTimeout(panelTimeoutRef.current);
    },
    [],
  );

  // ============================ zIndex ============================
  const [mergedZIndex, contextZIndex] = useZIndex('Modal', zIndex);

  // ========================= Styles =========================
  const containerCls = clsx(`${prefixCls}-container`);
  const wrapperCls = clsx(
    `${prefixCls}-wrap`,
    { [`${prefixCls}-centered`]: !!centered },
    'fixed inset-0 overflow-auto outline-none',
    !!centered && 'flex items-center justify-center',
    semanticCls.wrapper,
  );

  // ============================ Refs ============================
  // Select `metis-modal-content` by `panelRef`
  // TODO: watermark组件待开发
  // const watermarkRef = usePanelRef(`.${prefixCls}-content`);

  // ========================= Render ==========================
  if (!forceRender && destroyOnClose && !animatedOpen) {
    return null;
  }

  const mergedFooter = footer !== null ? <Footer {...props} /> : null;

  return (
    <ContextIsolator form space>
      <ZIndexContext.Provider value={contextZIndex}>
        <Portal
          open={open || forceRender || animatedOpen}
          autoDestroy={false}
          getContainer={mergedGetContainer}
          autoLock={open || animatedOpen}
        >
          <div className={containerCls} {...pickAttrs(props, { data: true })}>
            <Mask
              prefixCls={prefixCls}
              open={mask && open}
              style={{ zIndex: mergedZIndex }}
              maskProps={maskProps}
              className={semanticCls.mask}
            />
            <div
              tabIndex={-1}
              onKeyDown={onWrapperKeyDown}
              className={wrapperCls}
              ref={wrapperRef}
              onClick={onWrapperClick}
              style={{
                zIndex: mergedZIndex,
                display: !animatedOpen ? 'none' : undefined,
              }}
              {...wrapProps}
            >
              <Panel
                {...restProps}
                width={width}
                ref={panelRef}
                closable={closable}
                ariaId={ariaId}
                prefixCls={prefixCls}
                open={open && animatedOpen}
                footer={mergedFooter}
                destroyOnClose={destroyOnClose}
                className={className}
                forceRender={forceRender}
                centered={centered}
                onClose={onCancel}
                onMouseDown={onPanelMouseDown}
                onMouseUp={onPanelMouseUp}
                onOpenChanged={onOpenChanged}
              >
                {loading ? (
                  <Skeleton
                    active
                    title={false}
                    paragraph={{ rows: 4 }}
                    className={clsx(`${prefixCls}-body-skeleton`, 'mt-1')}
                  />
                ) : (
                  children
                )}
              </Panel>
            </div>
          </div>
        </Portal>
      </ZIndexContext.Provider>
    </ContextIsolator>
  );
};

export default Modal;
