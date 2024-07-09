import {
  CheckCircleOutline,
  ExclamationTriangleOutline,
  InformationCircleOutline,
  XCircleOutline,
} from '@metisjs/icons';
import React from 'react';
import { getGlobalConfig } from '..';
import { clsx, getSemanticCls, mergeSemanticCls } from '../../_util/classNameUtils';
import { cloneElement } from '../../_util/reactNode';
import { devUseWarning } from '../../_util/warning';
import { ConfigContext } from '../../config-provider';
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
  enter: 'transition-[transform,opacity,top,bottom] duration-300',
  enterFrom: clsx('opacity-0', {
    '!-top-[9rem]': placement === 'top',
    '!-bottom-[9rem]': placement === 'bottom',
    '!translate-x-full': placement === 'topRight' || placement === 'bottomRight',
    '!-translate-x-full': placement === 'topLeft' || placement === 'bottomLeft',
  }),
  enterTo: clsx('opacity-100', {
    '!top-0': placement === 'top',
    '!bottom-0': placement === 'bottom',
    '!translate-x-0':
      placement === 'topRight' ||
      placement === 'bottomRight' ||
      placement === 'topLeft' ||
      placement === 'bottomLeft',
  }),
  leave: 'transition-[transform,opacity,margin,max-height] duration-300',
  leaveFrom: 'opacity-100 max-h-[9rem] mb-4',
  leaveTo: 'opacity-0 max-h-0 mb-0',
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
    prefixCls: customizedPrefix,
    top,
    bottom,
    duration = DEFAULT_DURATION,
    stack = true,
    transition = DEFAULT_TRANSITION,
    closable = true,
    className,
    style,
    ...restProps
  } = notificationConfig ?? {};

  const { getPrefixCls } = React.useContext(ConfigContext);
  const prefixCls = getPrefixCls('notification', customizedPrefix);

  const holderRef = React.useRef<NotificationAPI>(null);

  const warning = devUseWarning('Notification');

  // =============================== Style ===============================
  const getStyle = (placement: NotificationPlacement): React.CSSProperties => ({
    ...getPlacementStyle(placement, top ?? DEFAULT_OFFSET, bottom ?? DEFAULT_OFFSET),
    ...style?.(placement),
  });

  const getClassName = (placement: NotificationPlacement) =>
    mergeSemanticCls(
      {
        root: clsx('fixed z-[2050] text-sm text-neutral-text', {
          'ml-6': placement === 'topLeft' || placement === 'bottomLeft',
          'mr-6': placement === 'topRight' || placement === 'bottomRight',
        }),
        wrapper: clsx(
          'relative mb-4 ms-auto rounded-lg bg-neutral-bg-elevated shadow-lg ring-1 ring-inset ring-neutral-border-secondary',
          {
            'absolute transition-transform duration-300 after:pointer-events-auto after:absolute after:-bottom-4 after:h-4 after:w-full after:bg-transparent':
              !!stack,
          },
          !!stack && {
            'left-0 top-0': placement === 'top' || placement === 'topLeft',
            'right-0 top-0': placement === 'topRight',
            'bottom-0 left-0': placement === 'bottom' || placement === 'bottomLeft',
            'bottom-0 right-0': placement === 'bottomRight',
          },
        ),
        collapsedWrapper: clsx(
          'collapsed-wrapper after:hidden [&:not(:nth-last-child(-n+3))]:pointer-events-none [&:not(:nth-last-child(-n+3))]:overflow-hidden [&:not(:nth-last-child(-n+3))]:text-transparent [&:not(:nth-last-child(-n+3))]:opacity-0 [&:nth-last-child(2)]:bg-transparent [&:nth-last-child(2)]:backdrop-blur-md [&:nth-last-child(3)]:bg-transparent [&:nth-last-child(3)]:backdrop-blur-md',
        ),
        notice: clsx(
          'w-[24rem] overflow-hidden break-words p-4 duration-300 ',
          '[.collapsed-wrapper:nth-last-child(2)_&]:opacity-0 [.collapsed-wrapper:nth-last-child(2)_&]:transition-opacity [.collapsed-wrapper:nth-last-child(3)_&]:opacity-0 [.collapsed-wrapper:nth-last-child(3)_&]:transition-opacity',
        ),
        content: clsx('flex gap-3'),
        close: clsx(
          'ml-1 flex h-6 w-6 shrink-0 cursor-pointer items-center justify-center rounded text-xl !text-neutral-text-tertiary hover:bg-neutral-fill-tertiary hover:!text-neutral-text',
        ),
      },
      className?.(placement),
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

      const { open: originOpen } = holderRef.current;

      const noticePrefixCls = `${prefixCls}-notice`;

      const {
        message,
        description,
        icon,
        type,
        btn,
        className,
        role = 'alert',
        ...restConfig
      } = config;
      const semanticCls = getSemanticCls(className);

      const messageCls = clsx(`${prefixCls}-message`, 'truncate font-medium', semanticCls.message);
      const descriptionCls = clsx(
        `${prefixCls}-description`,
        'mt-1 text-neutral-text-secondary',
        semanticCls.message,
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
      const btnCls = clsx(`${prefixCls}-btn`, semanticCls.btn);

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
      prefixCls={prefixCls}
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
  const mergedConfig = { ...globalConfig, ...notificationConfig };
  return useInternalNotification(mergedConfig);
}
