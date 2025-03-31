import React from 'react';
import {
  CheckCircleOutline,
  ExclamationTriangleOutline,
  InformationCircleOutline,
  XCircleOutline,
} from '@metisjs/icons';
import { clsx, getSemanticCls, mergeSemanticCls } from '@util/classNameUtils';
import { cloneElement } from '@util/reactNode';
import { devUseWarning } from '@util/warning';
import { getGlobalConfig } from '..';
import type {
  ArgsProps,
  NotificationAPI,
  NotificationConfig,
  NotificationInstance,
  NotificationPlacement,
} from '../interface';
import NotificationHolder from '../NotificationHolder';
import { getPlacementStyle } from '../util';

const DEFAULT_OFFSET = 24;
const DEFAULT_DURATION = 4.5;
const DEFAULT_PLACEMENT: NotificationPlacement = 'topRight';

const DEFAULT_TRANSITION: NotificationConfig['transition'] = (placement) => ({
  appear: true,
  enter: 'transition-[transform,opacity] duration-300 -translate-x-1/2!',
  enterFrom: clsx('opacity-0', {
    '-translate-y-full!': placement === 'top',
    'translate-y-full!': placement === 'bottom',
    'translate-x-full!': placement === 'topRight' || placement === 'bottomRight',
    '-translate-x-full!': placement === 'topLeft' || placement === 'bottomLeft',
  }),
  enterTo: clsx('opacity-100', {
    '-translate-y-0!': placement === 'top' || placement === 'bottom',
    'translate-x-0!':
      placement === 'topRight' ||
      placement === 'bottomRight' ||
      placement === 'topLeft' ||
      placement === 'bottomLeft',
  }),
  leave: 'transition-[opacity,margin,max-height] duration-200',
  leaveFrom: 'opacity-100 mb-4 max-h-[9rem]',
  leaveTo: 'opacity-0 mb-0 max-h-0',
});

const typeToIcon: Record<string, React.ReactElement> = {
  success: <CheckCircleOutline />,
  info: <InformationCircleOutline />,
  error: <XCircleOutline />,
  warning: <ExclamationTriangleOutline />,
};

// ==============================================================================
// ==                                   Hook                                   ==
// ==============================================================================
export function useInternalNotification(
  notificationConfig?: NotificationConfig,
): readonly [NotificationInstance, React.ReactElement] {
  const {
    top,
    bottom,
    duration = DEFAULT_DURATION,
    stack = true,
    transition = DEFAULT_TRANSITION,
    closable = true,
    className,
    ...restProps
  } = notificationConfig ?? {};

  const holderRef = React.useRef<NotificationAPI>(null);

  const warning = devUseWarning('Notification');

  // =============================== Style ===============================
  const getStyle = (placement: NotificationPlacement): React.CSSProperties => ({
    ...getPlacementStyle(placement, top ?? DEFAULT_OFFSET, bottom ?? DEFAULT_OFFSET),
  });

  const getClassName = (placement: NotificationPlacement) =>
    mergeSemanticCls(
      {
        root: clsx('text-text fixed z-2050 text-sm', {
          'ml-6': placement === 'topLeft' || placement === 'bottomLeft',
          'mr-6': placement === 'topRight' || placement === 'bottomRight',
        }),
        wrapper: clsx(
          'bg-elevated ring-border-secondary relative ms-auto mb-4 rounded-lg shadow-lg ring-1 ring-inset',
          {
            'absolute transition-transform duration-200 after:pointer-events-auto after:absolute after:-bottom-4 after:h-4 after:w-full after:bg-transparent':
              !!stack,
          },
          !!stack && {
            'top-0 left-0': placement === 'top' || placement === 'topLeft',
            'top-0 right-0': placement === 'topRight',
            'bottom-0 left-0': placement === 'bottom' || placement === 'bottomLeft',
            'right-0 bottom-0': placement === 'bottomRight',
          },
        ),
        collapsedWrapper: clsx(
          'collapsed-wrapper not-nth-last-[-n+3]:pointer-events-none not-nth-last-[-n+3]:overflow-hidden not-nth-last-[-n+3]:text-transparent not-nth-last-[-n+3]:opacity-0 after:hidden nth-last-2:bg-transparent nth-last-2:backdrop-blur-md nth-last-3:bg-transparent nth-last-3:backdrop-blur-md',
        ),
        notice: clsx(
          'relative flex w-[24rem] gap-3 overflow-hidden p-4 break-words',
          '[.collapsed-wrapper:nth-last-child(2)_&]:opacity-0 [.collapsed-wrapper:nth-last-child(2)_&]:transition-opacity [.collapsed-wrapper:nth-last-child(3)_&]:opacity-0 [.collapsed-wrapper:nth-last-child(3)_&]:transition-opacity',
        ),
        close: clsx(
          'text-text-secondary hover:bg-fill-tertiary hover:text-text-secondary ml-1 flex h-6 w-6 shrink-0 cursor-pointer items-center justify-center rounded-sm text-xl',
        ),
        progress: clsx(
          '[&::-webkit-progress-bar]:bg-fill-quinary [&::-webkit-progress-value]:bg-primary absolute right-2 bottom-0 left-2 block appearance-none border-0 [block-size:2px] [inline-size:calc(100%-1rem)] [&::-moz-progress-bar]:bg-violet-400 [&::-webkit-progress-bar]:rounded-lg [&::-webkit-progress-value]:rounded-lg',
        ),
      },
      className,
    );

  // ================================ API ================================
  const wrapAPI = React.useMemo<NotificationInstance>(() => {
    // Wrap with notification content

    // >>> Open
    const open = (config: ArgsProps) => {
      if (!holderRef.current) {
        warning(
          false,
          'usage',
          'You are calling notice in render which will break in React 18 concurrent mode. Please trigger in effect instead.',
        );
        return;
      }

      const { open: originOpen, prefixCls, className: contextClassName } = holderRef.current;

      const noticePrefixCls = `${prefixCls}-notice`;

      const {
        message,
        description,
        icon,
        type,
        btn,
        className: internalClassName,
        role = 'alert',
        ...restConfig
      } = config;
      const semanticCls = getSemanticCls([contextClassName, className, internalClassName]);

      const messageCls = clsx(`${prefixCls}-message`, 'truncate font-medium', semanticCls.message);
      const descriptionCls = clsx(
        `${prefixCls}-description`,
        'text-text-secondary mt-1',
        semanticCls.description,
      );
      const iconCls = clsx(
        `${prefixCls}-icon`,
        !!type && `${prefixCls}-icon-${type}`,
        'text-2xl',
        {
          'text-primary': type === 'info',
          'text-success': type === 'success',
          'text-warning': type === 'warning',
          'text-error': type === 'error',
        },
        semanticCls.icon,
      );
      const btnCls = clsx(`${prefixCls}-btn`, 'mt-3', semanticCls.btn);

      let iconNode: React.ReactNode = null;
      if (icon || type) {
        iconNode = cloneElement(icon ?? typeToIcon[type!] ?? null, (originProps) => ({
          className: clsx(iconCls, originProps.className),
        }));
      }

      return originOpen({
        // use placement from props instead of hard-coding "topRight"
        placement: notificationConfig?.placement ?? DEFAULT_PLACEMENT,
        ...restConfig,
        content: (
          <>
            {iconNode}
            <div className={clsx({ [`${prefixCls}-with-icon`]: iconNode }, 'flex-1')} role={role}>
              <div className={messageCls}>{message}</div>
              <div className={descriptionCls}>{description}</div>
              {btn && <div className={btnCls}>{btn}</div>}
            </div>
          </>
        ),
        className: clsx(type && `${noticePrefixCls}-${type}`, semanticCls.root),
      });
    };

    // >>> destroy
    const destroy = (key?: React.Key) => {
      if (key !== undefined) {
        holderRef.current?.close(key);
      } else {
        holderRef.current?.destroy();
      }
    };

    const clone = {
      open,
      destroy,
    } as NotificationInstance;

    const keys = ['success', 'info', 'warning', 'error'] as const;
    keys.forEach((type) => {
      clone[type] = (config) =>
        open({
          ...config,
          type,
        });
    });

    return clone;
  }, []);

  // ============================== Return ===============================
  return [
    wrapAPI,
    <NotificationHolder
      key="notification-holder"
      duration={duration}
      stack={stack}
      transition={transition}
      closable={closable}
      {...restProps}
      style={getStyle}
      className={getClassName}
      ref={holderRef}
    />,
  ] as const;
}

export default function useNotification(notificationConfig?: NotificationConfig) {
  const globalConfig = getGlobalConfig();
  const mergedConfig = {
    ...globalConfig,
    ...notificationConfig,
    className: mergeSemanticCls(globalConfig.className, notificationConfig?.className),
  };
  return useInternalNotification(mergedConfig);
}
