import classNames from 'classnames';
import React from 'react';
import { devUseWarning } from '../_util/warning';
import type { NotificationConfig as CPNotificationConfig } from '../config-provider/context';
import type {
  ArgsProps,
  NotificationAPI,
  NotificationConfig,
  NotificationInstance,
  NotificationPlacement,
  OpenConfig,
} from './interface';
import Notifications, { NotificationsRef } from './Notifications';
import { getCloseIcon, PureContent } from './PurePanel';
import { getPlacementStyle, mergeConfig } from './util';

const DEFAULT_OFFSET = 24;
const DEFAULT_DURATION = 4.5;
const DEFAULT_PLACEMENT: NotificationPlacement = 'topRight';

// ==============================================================================
// ==                                  Holder                                  ==
// ==============================================================================
type HolderProps = NotificationConfig & {
  onAllRemoved?: VoidFunction;
};

interface HolderRef extends NotificationAPI {
  prefixCls: string;
  notification?: CPNotificationConfig;
}

interface OpenTask {
  type: 'open';
  config: OpenConfig;
}

interface CloseTask {
  type: 'close';
  key: React.Key;
}

interface DestroyTask {
  type: 'destroy';
}

type Task = OpenTask | CloseTask | DestroyTask;

const Holder = React.forwardRef<HolderRef, HolderProps>((props, ref) => {
  const {
    getContainer = defaultGetContainer,
    prefixCls,
    maxCount,
    className,
    style,
    onAllRemoved,
    stack,
    renderNotifications,
    ...shareConfig
  } = props;

  const [container, setContainer] = React.useState<HTMLElement | ShadowRoot>();
  const notificationsRef = React.useRef<NotificationsRef>(null);

  // =============================== Style ===============================
  const getStyle = (placement: NotificationPlacement): React.CSSProperties =>
    getPlacementStyle(placement, top ?? DEFAULT_OFFSET, bottom ?? DEFAULT_OFFSET);

  const contextHolder = (
    <Notifications
      container={container}
      ref={notificationsRef}
      prefixCls={prefixCls}
      transition={motion}
      maxCount={maxCount}
      className={className}
      style={getStyle}
      onAllRemoved={onAllRemoved}
      stack={stack}
    />
  );

  const [taskQueue, setTaskQueue] = React.useState<Task[]>([]);

  // ========================= Refs =========================
  const api = React.useMemo<NotificationAPI>(() => {
    return {
      open: (config) => {
        const mergedConfig = mergeConfig(shareConfig, config);
        if (mergedConfig.key === null || mergedConfig.key === undefined) {
          mergedConfig.key = `rc-notification-${uniqueKey}`;
          uniqueKey += 1;
        }

        setTaskQueue((queue) => [...queue, { type: 'open', config: mergedConfig }]);
      },
      close: (key) => {
        setTaskQueue((queue) => [...queue, { type: 'close', key }]);
      },
      destroy: () => {
        setTaskQueue((queue) => [...queue, { type: 'destroy' }]);
      },
    };
  }, []);

  // ================================ Ref ================================
  React.useImperativeHandle(ref, () => ({ ...api, prefixCls, notification }));

  return holder;
});

// ==============================================================================
// ==                                   Hook                                   ==
// ==============================================================================
export function useInternalNotification(
  notificationConfig?: HolderProps,
): readonly [NotificationInstance, React.ReactElement] {
  const holderRef = React.useRef<HolderRef>(null);

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

      const { open: originOpen, prefixCls, notification } = holderRef.current;

      const noticePrefixCls = `${prefixCls}-notice`;

      const {
        message,
        description,
        icon,
        type,
        btn,
        className,
        style,
        role = 'alert',
        closeIcon,
        closable,
        ...restConfig
      } = config;

      const realCloseIcon = getCloseIcon(
        noticePrefixCls,
        typeof closeIcon !== 'undefined' ? closeIcon : notification?.closeIcon,
      );

      return originOpen({
        // use placement from props instead of hard-coding "topRight"
        placement: notificationConfig?.placement ?? DEFAULT_PLACEMENT,
        ...restConfig,
        content: (
          <PureContent
            prefixCls={noticePrefixCls}
            icon={icon}
            type={type}
            message={message}
            description={description}
            btn={btn}
            role={role}
          />
        ),
        className: classNames(
          type && `${noticePrefixCls}-${type}`,
          className,
          notification?.className,
        ),
        style: { ...notification?.style, ...style },
        closeIcon: realCloseIcon,
        closable: closable ?? !!realCloseIcon,
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
    <Holder key="notification-holder" {...notificationConfig} ref={holderRef} />,
  ] as const;
}

export default function useNotification(notificationConfig?: NotificationConfig) {
  return useInternalNotification(notificationConfig);
}
