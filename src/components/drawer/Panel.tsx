import * as React from 'react';
import pickAttrs from '@rc-component/util/es/pickAttrs';
import { composeRef } from '@rc-component/util/es/ref';
import { clsx } from '@util/classNameUtils';
import useClosable from '@util/hooks/useClosable';
import useSemanticCls from '@util/hooks/useSemanticCls';
import { getSkeletonButtons } from '../modal/Footer';
import Scrollbar from '../scrollbar';
import Skeleton from '../skeleton';
import type { TransitionProps } from '../transition';
import Transition from '../transition';
import { usePanelRef } from '../watermark/context';
import type { DrawerContextProps } from './context';
import DrawerContext from './context';
import type { PanelProps, PushConfig } from './interface';

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

  const semanticCls = useSemanticCls(className, 'drawer');

  // ================================ Refs ================================
  const panelRef = React.useRef<HTMLDivElement>(null);
  const sentinelStartRef = React.useRef<HTMLDivElement>(null);
  const sentinelEndRef = React.useRef<HTMLDivElement>(null);
  const watermarkRef = usePanelRef();

  React.useImperativeHandle(ref, () => panelRef.current!);

  const onPanelKeyDown: React.KeyboardEventHandler<HTMLDivElement> = (event) => {
    const { key, shiftKey } = event;

    switch (key) {
      // Tab active
      case 'Tab': {
        if (!shiftKey && document.activeElement === sentinelEndRef.current) {
          sentinelStartRef.current?.focus({ preventScroll: true });
        } else if (shiftKey && document.activeElement === sentinelStartRef.current) {
          sentinelEndRef.current?.focus({ preventScroll: true });
        }
        break;
      }

      // Close
      case 'Escape': {
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
    'text-text pointer-events-none fixed inset-0 text-sm',
    { absolute: inline },
    semanticCls.root,
  );
  const wrapperCls = clsx(
    `${prefixCls}-content-wrapper`,
    'absolute max-w-full transition-transform duration-300',
    {
      'top-0 bottom-0 left-0': placement === 'left',
      'top-0 right-0 bottom-0': placement === 'right',
      'top-0 right-0 left-0': placement === 'top',
      'right-0 bottom-0 left-0': placement === 'bottom',
    },
  );
  const contentCls = clsx(
    `${prefixCls}-content`,
    'bg-container pointer-events-auto relative flex h-full w-full flex-col backdrop-blur-2xl',
    {
      'shadow-[20px_0_25px_-5px_rgba(0,0,0,0.1),8px_0_10px_-6px_rgba(0,0,0,0.1)]':
        placement === 'left',
      'shadow-[-20px_0_25px_-5px_rgba(0,0,0,0.1),-8px_0_10px_-6px_rgba(0,0,0,0.1)]':
        placement === 'right',
      'shadow-xl': placement === 'top',
      'shadow-[0_-20px_25px_-5px_rgba(0,0,0,0.1),0_-8px_10px_-6px_rgba(0,0,0,0.1)]':
        placement === 'bottom',
    },
    semanticCls.content,
  );
  const headerCls = clsx(
    `${prefixCls}-header`,
    'relative truncate p-6 pr-10 text-base leading-6 font-semibold',
    semanticCls.header,
  );
  const closeCls = clsx(
    `${prefixCls}-close`,
    'text-text-tertiary hover:bg-fill-tertiary hover:text-text-secondary absolute top-3 right-3 z-1000 rounded-sm p-1 transition-colors',
    semanticCls.close,
  );
  const bodyCls = clsx(
    `${prefixCls}-body`,
    'p-6',
    {
      'pt-0': title || closable,
    },
    semanticCls.body,
  );
  const footerCls = clsx(
    `${prefixCls}-footer`,
    'border-border-secondary flex items-center justify-end gap-4 border-t p-4',
    semanticCls.footer,
  );
  const maskCls = clsx(
    `${prefixCls}-mask`,
    'bg-mask pointer-events-auto absolute inset-0',
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
    if (!title) {
      return null;
    }
    return <div className={headerCls}>{title}</div>;
  }, [title, headerCls]);

  const footerNode = React.useMemo<React.ReactNode>(() => {
    if (!footer) {
      return null;
    }
    return <div className={footerCls}>{loading ? getSkeletonButtons(footer) : footer}</div>;
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
            ref={composeRef(transitionRef, watermarkRef)}
            className={contentCls}
            style={style}
            aria-modal="true"
            {...pickAttrs(props, { aria: true })}
            {...eventHandlers}
          >
            {closerNode}
            {headerNode}
            <Scrollbar className={{ root: 'flex-1 basis-0', view: bodyCls }}>
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
            </Scrollbar>
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
