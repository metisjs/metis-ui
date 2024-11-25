import React, { useContext } from 'react';
import { ConfigContext } from '../config-provider';
import type { NotificationAPI, NotificationConfig, OpenConfig } from './interface';
import type { NotificationsProps, NotificationsRef } from './Notifications';
import Notifications from './Notifications';
import { mergeConfig } from './util';

export type NotificationHolderProps = Omit<NotificationConfig, 'top' | 'bottom' | 'className'> & {
  className?: NotificationsProps['className'];
  style?: NotificationsProps['style'];
};

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

let uniqueKey = 0;

const NotificationHolder = React.forwardRef<NotificationAPI, NotificationHolderProps>(
  (props, ref) => {
    const {
      getContainer: staticGetContainer,
      transition,
      prefixCls: staticPrefixCls,
      maxCount,
      className,
      style,
      onAllRemoved,
      stack,
      ...shareConfig
    } = props;

    const { getPrefixCls, getPopupContainer, notification } = useContext(ConfigContext);

    const prefixCls = staticPrefixCls || getPrefixCls('notification');
    const getContainer = () => staticGetContainer?.() || getPopupContainer?.() || document.body;

    const [container, setContainer] = React.useState<HTMLElement | ShadowRoot>();
    const notificationsRef = React.useRef<NotificationsRef>(null);

    const contextHolder = (
      <Notifications
        container={container}
        ref={notificationsRef}
        prefixCls={prefixCls}
        transition={transition}
        maxCount={maxCount}
        className={className}
        style={style}
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
            mergedConfig.key = `metis-notification-${uniqueKey}`;
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
        prefixCls,
        className: notification?.className,
      };
    }, [JSON.stringify(shareConfig), JSON.stringify(notification), prefixCls]);

    // ======================= Container ======================
    // React 18 should all in effect that we will check container in each render
    // Which means getContainer should be stable.
    React.useEffect(() => {
      setContainer(getContainer());
    });

    // ======================== Effect ========================
    React.useEffect(() => {
      // Flush task when node ready
      if (notificationsRef.current && taskQueue.length) {
        taskQueue.forEach((task) => {
          switch (task.type) {
            case 'open':
              notificationsRef.current!.open(task.config);
              break;

            case 'close':
              notificationsRef.current!.close(task.key);
              break;

            case 'destroy':
              notificationsRef.current!.destroy();
              break;
          }
        });

        // React 17 will mix order of effect & setState in async
        // - open: setState[0]
        // - effect[0]
        // - open: setState[1]
        // - effect setState([]) * here will clean up [0, 1] in React 17
        setTaskQueue((oriQueue) => oriQueue.filter((task) => !taskQueue.includes(task)));
      }
    }, [taskQueue]);

    // ================================ Ref ================================
    React.useImperativeHandle(ref, () => ({ ...api }));

    return contextHolder;
  },
);

export default NotificationHolder;
