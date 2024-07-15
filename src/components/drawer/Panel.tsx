import KeyCode from 'rc-util/lib/KeyCode';
import pickAttrs from 'rc-util/lib/pickAttrs';
import * as React from 'react';
import { clsx, getSemanticCls } from '../_util/classNameUtils';
import useClosable from '../_util/hooks/useClosable';
import Skeleton from '../skeleton';
import Transition, { TransitionProps } from '../transition';
import type { DrawerContextProps } from './context';
import DrawerContext from './context';
import { PanelProps, PushConfig } from './interface';

const defaultPushState: PushConfig = { distance: 180 };

const sentinelStyle: React.CSSProperties = {
  width: 0,
  height: 0,
  overflow: 'hidden',
  outline: 'none',
  position: 'absolute',
};

function Panel(props: PanelProps, ref: React.Ref<HTMLDivElement | null>) {
  const {
    prefixCls,
    open,
    placement,
    inline,
    push = defaultPushState,
    forceRender,
    autoFocus,
    keyboard,
    zIndex,
    className,
    id,
    style,
    width,
    height,
    children,
    closable = true,
    title,
    footer,
    loading,

    // Mask
    mask,
    maskClosable,

    // Events
    afterOpenChange,
    onClose,
    onMouseEnter,
    onMouseOver,
    onMouseLeave,
    onClick,
    onKeyDown,
    onKeyUp,

    drawerRender,
  } = props;

  const semanticCls = getSemanticCls(className);

  // ================================ Refs ================================
  const panelRef = React.useRef<HTMLDivElement>(null);
  const sentinelStartRef = React.useRef<HTMLDivElement>(null);
  const sentinelEndRef = React.useRef<HTMLDivElement>(null);

  React.useImperativeHandle(ref, () => panelRef.current);

  const onPanelKeyDown: React.KeyboardEventHandler<HTMLDivElement> = (event) => {
    const { keyCode, shiftKey } = event;

    switch (keyCode) {
      // Tab active
      case KeyCode.TAB: {
        if (keyCode === KeyCode.TAB) {
          if (!shiftKey && document.activeElement === sentinelEndRef.current) {
            sentinelStartRef.current?.focus({ preventScroll: true });
          } else if (shiftKey && document.activeElement === sentinelStartRef.current) {
            sentinelEndRef.current?.focus({ preventScroll: true });
          }
        }
        break;
      }

      // Close
      case KeyCode.ESC: {
        if (onClose && keyboard) {
          event.stopPropagation();
          onClose(event);
        }
        break;
      }
    }
  };

  // ========================== Control ===========================
  // Auto Focus
  React.useEffect(() => {
    if (open && autoFocus) {
      panelRef.current?.focus({ preventScroll: true });
    }
  }, [open]);

  // ============================ Push ============================
  const [pushed, setPushed] = React.useState(false);

  const parentContext = React.useContext(DrawerContext);

  // Merge push distance
  let pushConfig: PushConfig;
  if (typeof push === 'boolean') {
    pushConfig = push ? {} : { distance: 0 };
  } else {
    pushConfig = push || {};
  }
  const pushDistance = pushConfig?.distance ?? parentContext?.pushDistance ?? 180;

  const mergedContext = React.useMemo<DrawerContextProps>(
    () => ({
      pushDistance,
      push: () => {
        setPushed(true);
      },
      pull: () => {
        setPushed(false);
      },
    }),
    [pushDistance],
  );

  // ========================= ScrollLock =========================
  // Tell parent to push
  React.useEffect(() => {
    if (open) {
      parentContext?.push?.();
    } else {
      parentContext?.pull?.();
    }
  }, [open]);

  // Clean up
  React.useEffect(
    () => () => {
      parentContext?.pull?.();
    },
    [],
  );

  // ============================ Style ==========================
  const panelCls = clsx(
    prefixCls,
    `${prefixCls}-${placement}`,
    {
      [`${prefixCls}-open`]: open,
      [`${prefixCls}-inline`]: inline,
    },
    'pointer-events-none fixed inset-0 text-sm text-neutral-text',
    { absolute: inline },
    semanticCls.root,
  );
  const wrapperCls = clsx(
    `${prefixCls}-content-wrapper`,
    'absolute max-w-full shadow-xl',
    semanticCls.wrapper,
  );
  const contentCls = clsx(`${prefixCls}-content`, semanticCls.content);
  const headerCls = clsx(`${prefixCls}-header`, semanticCls.header);
  const titleCls = clsx(`${prefixCls}-title`);
  const footerCls = clsx(`${prefixCls}-footer`, semanticCls.footer);
  const bodyCls = clsx(`${prefixCls}-body`, semanticCls.body);
  const closeCls = clsx(`${prefixCls}-close`);
  const maskCls = clsx(
    `${prefixCls}-mask`,
    'pointer-events-auto fixed inset-0 bg-neutral-bg-mask',
    semanticCls.mask,
  );

  // ============================ Mask ============================
  const maskNode: React.ReactNode = mask && (
    <Transition
      key="mask"
      visible={open}
      appear
      deadline={500}
      enter="transition-[opacity] ease-in-out duration-300"
      enterFrom="opacity-0"
      enterTo="opacity-100"
      leave="transition-[opacity] ease-in-out duration-300"
      leaveFrom="opacity-100"
      leaveTo="opacity-0"
    >
      {({ className: transitionCls, style: transitionStyle }, maskRef) => (
        <div
          className={clsx(maskCls, transitionCls)}
          onClick={maskClosable && open ? onClose : undefined}
          style={{ zIndex: zIndex, ...transitionStyle }}
          ref={maskRef}
        />
      )}
    </Transition>
  );

  // =========================== Content ============================
  const transitionProps: TransitionProps = React.useMemo(
    () => ({
      appear: true,
      enter: 'transform transition ease-in-out duration-300',
      enterFrom: clsx({
        'translate-x-full': placement === 'right',
        '-translate-x-full': placement === 'left',
        '-translate-y-full': placement === 'top',
        'translate-y-full': placement === 'bottom',
      }),
      enterTo: clsx({
        'translate-x-0': placement === 'right',
        '-translate-x-0': placement === 'left',
        '-translate-y-0': placement === 'top',
        'translate-y-0': placement === 'bottom',
      }),
      leave: 'transform transition ease-in-out duration-300',
      leaveFrom: clsx({
        'translate-x-0': placement === 'right',
        '-translate-x-0': placement === 'left',
        '-translate-y-0': placement === 'top',
        'translate-y-0': placement === 'bottom',
      }),
      leaveTo: clsx({
        'translate-x-full': placement === 'right',
        '-translate-x-full': placement === 'left',
        '-translate-y-full': placement === 'top',
        'translate-y-full': placement === 'bottom',
      }),
    }),
    [placement],
  );

  const wrapperStyle: React.CSSProperties = {};

  if (pushed && pushDistance) {
    switch (placement) {
      case 'top':
        wrapperStyle.transform = `translateY(${pushDistance}px)`;
        break;
      case 'bottom':
        wrapperStyle.transform = `translateY(${-pushDistance}px)`;
        break;
      case 'left':
        wrapperStyle.transform = `translateX(${pushDistance}px)`;

        break;
      default:
        wrapperStyle.transform = `translateX(${-pushDistance}px)`;
        break;
    }
  }

  if (placement === 'left' || placement === 'right') {
    wrapperStyle.width = width;
  } else {
    wrapperStyle.height = height;
  }

  const eventHandlers = {
    onMouseEnter,
    onMouseOver,
    onMouseLeave,
    onClick,
    onKeyDown,
    onKeyUp,
  };

  const [mergedClosable, closeIcon, iconProps] = useClosable(closable, { className: 'w-6 h-6' });
  const ariaProps = pickAttrs(iconProps, true);

  const closerNode = mergedClosable ? (
    <button type="button" onClick={onClose} aria-label="Close" {...ariaProps} className={closeCls}>
      {closeIcon}
    </button>
  ) : null;

  const headerNode = React.useMemo<React.ReactNode>(() => {
    if (!title && !mergedClosable) {
      return null;
    }
    return (
      <div className={headerCls}>
        {title && <div className={titleCls}>{title}</div>}
        {closerNode}
      </div>
    );
  }, [mergedClosable, title, headerCls, titleCls]);

  const footerNode = React.useMemo<React.ReactNode>(() => {
    if (!footer) {
      return null;
    }
    return <div className={footerCls}>{footer}</div>;
  }, [footer, footerCls]);

  const contentNode: React.ReactNode = (
    <Transition
      key="panel"
      {...transitionProps}
      visible={open}
      deadline={500}
      forceRender={forceRender}
      onVisibleChanged={(nextVisible) => {
        afterOpenChange?.(nextVisible);
      }}
      removeOnLeave={false}
    >
      {({ className: transitionCls, style: transitionStyle }, transitionRef) => {
        const content = (
          <div
            role="dialog"
            id={id}
            ref={transitionRef}
            className={contentCls}
            style={style}
            aria-modal="true"
            {...pickAttrs(props, { aria: true })}
            {...eventHandlers}
          >
            {headerNode}
            <div className={bodyCls}>
              {loading ? (
                <Skeleton
                  active
                  title={false}
                  paragraph={{ rows: 5 }}
                  className={clsx(`${prefixCls}-body-skeleton`, 'mt-1')}
                />
              ) : (
                children
              )}
            </div>
            {footerNode}
          </div>
        );
        return (
          <div
            className={clsx(wrapperCls, transitionCls)}
            style={{
              zIndex,
              ...wrapperStyle,
              ...transitionStyle,
            }}
            {...pickAttrs(props, { data: true })}
          >
            {drawerRender ? drawerRender(content) : content}
          </div>
        );
      }}
    </Transition>
  );

  // =========================== Render ===========================
  return (
    <DrawerContext.Provider value={mergedContext}>
      <div
        className={panelCls}
        style={{ zIndex: zIndex }}
        tabIndex={-1}
        ref={panelRef}
        onKeyDown={onPanelKeyDown}
      >
        {maskNode}
        <div
          tabIndex={0}
          ref={sentinelStartRef}
          style={sentinelStyle}
          aria-hidden="true"
          data-sentinel="start"
        />
        {contentNode}
        <div
          tabIndex={0}
          ref={sentinelEndRef}
          style={sentinelStyle}
          aria-hidden="true"
          data-sentinel="end"
        />
      </div>
    </DrawerContext.Provider>
  );
}

const RefPanel = React.forwardRef(Panel);

export default RefPanel;
