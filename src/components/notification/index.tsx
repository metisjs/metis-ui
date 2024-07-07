import { render } from 'rc-util/lib/React/render';
import React, { useContext } from 'react';
import { ConfigContext } from '../config-provider';
import type { ArgsProps, GlobalConfigProps, NotificationInstance } from './interface';
import useNotification, { useInternalNotification } from './useNotification';

export type { ArgsProps };

let notification: GlobalNotification | null = null;

let act: (callback: VoidFunction) => Promise<void> | void = (callback: VoidFunction) => callback();

interface GlobalNotification {
  fragment: DocumentFragment;
  instance?: NotificationInstance | null;
  sync?: VoidFunction;
}

type Task =
  | {
      type: 'open';
      config: ArgsProps;
    }
  | {
      type: 'destroy';
      key?: React.Key;
    };

let taskQueue: Task[] = [];

let defaultGlobalConfig: GlobalConfigProps = {};

function getGlobalContext() {
  const { getContainer, maxCount, top, bottom, showProgress, pauseOnHover } = defaultGlobalConfig;
  const mergedContainer = getContainer?.() || document.body;

  return {
    getContainer: () => mergedContainer,
    maxCount,
    top,
    bottom,
    showProgress,
    pauseOnHover,
  };
}

interface GlobalHolderRef {
  instance: NotificationInstance;
  sync: () => void;
}

const GlobalHolder = React.forwardRef<
  GlobalHolderRef,
  { notificationConfig: GlobalConfigProps; sync: () => void }
>((props, ref) => {
  const { notificationConfig, sync } = props;

  const { getPrefixCls } = useContext(ConfigContext);
  const prefixCls = defaultGlobalConfig.prefixCls || getPrefixCls('notification');

  const [api, holder] = useInternalNotification({
    ...notificationConfig,
    prefixCls,
  });

  React.useEffect(sync, []);

  React.useImperativeHandle(ref, () => {
    const instance: NotificationInstance = { ...api };

    Object.keys(instance).forEach((method) => {
      instance[method as keyof NotificationInstance] = (...args: any[]) => {
        sync();
        return (api as any)[method](...args);
      };
    });

    return {
      instance,
      sync,
    };
  });

  return holder;
});

const GlobalHolderWrapper = React.forwardRef<GlobalHolderRef, unknown>((_, ref) => {
  const [notificationConfig, setNotificationConfig] =
    React.useState<GlobalConfigProps>(getGlobalContext);

  const sync = () => {
    setNotificationConfig(getGlobalContext);
  };

  React.useEffect(sync, []);

  return <GlobalHolder ref={ref} sync={sync} notificationConfig={notificationConfig} />;
});

function flushNotice() {
  if (!notification) {
    const holderFragment = document.createDocumentFragment();

    const newNotification: GlobalNotification = {
      fragment: holderFragment,
    };

    notification = newNotification;

    // Delay render to avoid sync issue
    act(() => {
      render(
        <GlobalHolderWrapper
          ref={(node) => {
            const { instance, sync } = node || {};

            Promise.resolve().then(() => {
              if (!newNotification.instance && instance) {
                newNotification.instance = instance;
                newNotification.sync = sync;
                flushNotice();
              }
            });
          }}
        />,
        holderFragment,
      );
    });

    return;
  }

  // Notification not ready
  if (!notification.instance) {
    return;
  }

  // >>> Execute task
  taskQueue.forEach((task) => {
    // eslint-disable-next-line default-case
    switch (task.type) {
      case 'open': {
        act(() => {
          notification!.instance!.open({
            ...defaultGlobalConfig,
            ...task.config,
          });
        });
        break;
      }

      case 'destroy':
        act(() => {
          notification?.instance!.destroy(task.key);
        });
        break;
    }
  });

  // Clean up
  taskQueue = [];
}

// ==============================================================================
// ==                                  Export                                  ==
// ==============================================================================

function setNotificationGlobalConfig(config: GlobalConfigProps) {
  defaultGlobalConfig = {
    ...defaultGlobalConfig,
    ...config,
  };

  // Trigger sync for it
  act(() => {
    notification?.sync?.();
  });
}

function open(config: ArgsProps) {
  taskQueue.push({
    type: 'open',
    config,
  });
  flushNotice();
}

const destroy: BaseMethods['destroy'] = (key) => {
  taskQueue.push({
    type: 'destroy',
    key,
  });
  flushNotice();
};

interface BaseMethods {
  open: (config: ArgsProps) => void;
  destroy: (key?: React.Key) => void;
  config: (config: GlobalConfigProps) => void;
  useNotification: typeof useNotification;
}

type StaticFn = (config: ArgsProps) => void;

interface NoticeMethods {
  success: StaticFn;
  info: StaticFn;
  warning: StaticFn;
  error: StaticFn;
}

const methods: (keyof NoticeMethods)[] = ['success', 'info', 'warning', 'error'];

const baseStaticMethods: BaseMethods = {
  open,
  destroy,
  config: setNotificationGlobalConfig,
  useNotification,
};

const staticMethods = baseStaticMethods as NoticeMethods & BaseMethods;

methods.forEach((type: keyof NoticeMethods) => {
  staticMethods[type] = (config) => open({ ...config, type });
});

// ==============================================================================
// ==                                   Test                                   ==
// ==============================================================================
const noop = () => {};

/** @internal Only Work in test env */
export let actWrapper: (wrapper: any) => void = noop;

if (process.env.NODE_ENV === 'test') {
  actWrapper = (wrapper) => {
    act = wrapper;
  };
}

/** @internal Only Work in test env */
export let actDestroy = noop;

if (process.env.NODE_ENV === 'test') {
  actDestroy = () => {
    notification = null;
  };
}

export default staticMethods;
