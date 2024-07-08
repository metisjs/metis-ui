import {
  CheckCircleSolid,
  ExclamationTriangleSolid,
  InformationCircleSolid,
  XCircleSolid,
} from '@metisjs/icons';
import classNames from 'classnames';
import { clsx, mergeSemanticCls } from 'metis-ui/es/_util/classNameUtils';
import { ConfigContext } from 'metis-ui/es/config-provider';
import React from 'react';
import { getGlobalConfig } from '..';
import { devUseWarning } from '../../_util/warning';
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

const typeToIcon = {
  success: CheckCircleSolid,
  info: InformationCircleSolid,
  error: XCircleSolid,
  warning: ExclamationTriangleSolid,
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
    className,
    style,
    ...restProps
  } = notificationConfig ?? {};

  const { getPrefixCls } = React.useContext(ConfigContext);
  const prefixCls = getPrefixCls('notification', customizedPrefix);

  const holderRef = React.useRef<NotificationAPI>(null);

  const warning = devUseWarning('Notification');

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

      let iconNode: React.ReactNode = null;
      if (icon) {
        iconNode = <span className={`${prefixCls}-icon`}>{icon}</span>;
      } else if (type) {
        iconNode = React.createElement(typeToIcon[type] || null, {
          className: classNames(`${prefixCls}-icon`, `${prefixCls}-icon-${type}`),
        });
      }

      return originOpen({
        // use placement from props instead of hard-coding "topRight"
        placement: notificationConfig?.placement ?? DEFAULT_PLACEMENT,
        ...restConfig,
        content: (
          <div className={classNames({ [`${prefixCls}-with-icon`]: iconNode })} role={role}>
            {iconNode}
            <div className={`${prefixCls}-message`}>{message}</div>
            <div className={`${prefixCls}-description`}>{description}</div>
            {btn && <div className={`${prefixCls}-btn`}>{btn}</div>}
          </div>
        ),
        className: classNames(type && `${noticePrefixCls}-${type}`, className),
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

  // =============================== Style ===============================
  const getStyle = (placement: NotificationPlacement): React.CSSProperties => ({
    ...getPlacementStyle(placement, top ?? DEFAULT_OFFSET, bottom ?? DEFAULT_OFFSET),
    ...style?.(placement),
  });

  const getClassName = (placement: NotificationPlacement) =>
    mergeSemanticCls(
      {
        root: clsx('fixed z-[2050] mr-6 text-sm text-neutral-text'),
        notice: clsx(''),
      },
      className?.(placement),
    );

  // ============================== Return ===============================
  return [
    wrapAPI,
    <NotificationHolder
      key="notification-holder"
      prefixCls={prefixCls}
      duration={duration}
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
