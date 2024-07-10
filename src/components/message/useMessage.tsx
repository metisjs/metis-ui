import {
  CheckCircleOutline,
  ExclamationTriangleOutline,
  InformationCircleOutline,
  LoadingOutline,
  XCircleOutline,
} from '@metisjs/icons';
import * as React from 'react';
import { getGlobalConfig } from '.';
import { clsx } from '../_util/classNameUtils';
import { cloneElement } from '../_util/reactNode';
import { devUseWarning } from '../_util/warning';
import { ConfigContext } from '../config-provider';
import { NotificationAPI } from '../notification/interface';
import NotificationHolder from '../notification/NotificationHolder';
import type {
  ArgsProps,
  ConfigOptions,
  MessageInstance,
  MessageType,
  NoticeType,
  TypeOpen,
} from './interface';
import { wrapPromiseFn } from './util';

const DEFAULT_OFFSET = 8;
const DEFAULT_DURATION = 3;
const DEFAULT_TRANSITION: ConfigOptions['transition'] = {
  appear: true,
  enter: 'transition-[transform,opacity] duration-200',
  enterFrom: '!-translate-y-full opacity-0',
  enterTo: 'opacity-100 !translate-y-0',
  leave: 'transition-[opacity,margin,max-height] duration-150',
  leaveFrom: 'opacity-100 mb-4 max-h-11',
  leaveTo: 'opacity-0 mb-0 max-h-0',
};

const typeToIcon: Record<string, React.ReactElement> = {
  success: <CheckCircleOutline />,
  info: <InformationCircleOutline />,
  error: <XCircleOutline />,
  warning: <ExclamationTriangleOutline />,
  loading: <LoadingOutline className="animate-spin" />,
};

// ==============================================================================
// ==                                   Hook                                   ==
// ==============================================================================
let keyIndex = 0;

export function useInternalMessage(
  messageConfig?: ConfigOptions,
): readonly [MessageInstance, React.ReactElement] {
  const {
    prefixCls: customizedPrefix,
    top,
    duration = DEFAULT_DURATION,
    transition = DEFAULT_TRANSITION,
    ...restProps
  } = messageConfig ?? {};

  const { getPrefixCls } = React.useContext(ConfigContext);
  const prefixCls = getPrefixCls('message', customizedPrefix);

  const holderRef = React.useRef<NotificationAPI>(null);

  const warning = devUseWarning('Message');

  // =============================== Style ===============================
  const getStyle = (): React.CSSProperties => ({
    left: '50%',
    transform: 'translateX(-50%)',
    top: top ?? DEFAULT_OFFSET,
  });

  const getClassName = () => ({
    root: clsx('fixed top-2 z-[2010] text-center text-sm text-neutral-text'),
    wrapper: clsx(
      'relative mx-auto mb-3 w-fit rounded-lg bg-neutral-bg-elevated shadow-lg ring-1 ring-inset ring-neutral-border-secondary',
    ),
    notice: clsx('relative overflow-hidden break-words p-3'),
    content: clsx('flex items-center gap-2'),
  });

  // ================================ API ================================
  const wrapAPI = React.useMemo<MessageInstance>(() => {
    // Wrap with notification content

    // >>> close
    const close = (key: React.Key) => {
      holderRef.current?.close(key);
    };

    // >>> Open
    const open = (config: ArgsProps): MessageType => {
      if (!holderRef.current) {
        warning(
          false,
          'usage',
          'You are calling notice in render which will break in React 18 concurrent mode. Please trigger in effect instead.',
        );

        const fakeResult: any = () => {};
        fakeResult.then = () => {};
        return fakeResult;
      }

      const { open: originOpen } = holderRef.current;
      const noticePrefixCls = `${prefixCls}-notice`;

      const { content, icon, type, key, className, onClose, ...restConfig } = config;

      const iconCls = clsx(`${prefixCls}-icon`, !!type && `${prefixCls}-icon-${type}`, 'h-5 w-5', {
        'text-primary': type === 'info' || type === 'loading',
        'text-success': type === 'success',
        'text-warning': type === 'warning',
        'text-error': type === 'error',
      });

      let mergedKey: React.Key = key!;
      if (mergedKey === undefined || mergedKey === null) {
        keyIndex += 1;
        mergedKey = `antd-message-${keyIndex}`;
      }

      let iconNode: React.ReactNode = null;
      if (icon || type) {
        iconNode = cloneElement(icon ?? typeToIcon[type!] ?? null, (originProps) => ({
          className: clsx(iconCls, originProps.className),
        }));
      }

      return wrapPromiseFn((resolve) => {
        originOpen({
          ...restConfig,
          key: mergedKey,
          content: (
            <>
              {iconNode}
              <span>{content}</span>
            </>
          ),
          placement: 'top',
          className: clsx(type && `${noticePrefixCls}-${type}`, className),
          onClose: () => {
            onClose?.();
            resolve();
          },
        });

        // Return close function
        return () => {
          close(mergedKey);
        };
      });
    };

    // >>> destroy
    const destroy = (key?: React.Key) => {
      if (key !== undefined) {
        close(key);
      } else {
        holderRef.current?.destroy();
      }
    };

    const clone = {
      open,
      destroy,
    } as MessageInstance;

    const keys: NoticeType[] = ['info', 'success', 'warning', 'error', 'loading'];
    keys.forEach((type) => {
      const typeOpen: TypeOpen = (jointContent, duration, onClose) => {
        let config: ArgsProps;
        if (jointContent && typeof jointContent === 'object' && 'content' in jointContent) {
          config = jointContent;
        } else {
          config = {
            content: jointContent,
          };
        }

        // Params
        let mergedDuration: number | undefined;
        let mergedOnClose: VoidFunction | undefined;
        if (typeof duration === 'function') {
          mergedOnClose = duration;
        } else {
          mergedDuration = duration;
          mergedOnClose = onClose;
        }

        const mergedConfig = {
          onClose: mergedOnClose,
          duration: mergedDuration,
          ...config,
          type,
        };

        return open(mergedConfig);
      };

      clone[type] = typeOpen;
    });

    return clone;
  }, []);

  // ============================== Return ===============================
  return [
    wrapAPI,
    <NotificationHolder
      key="message-holder"
      prefixCls={prefixCls}
      duration={duration}
      transition={transition}
      closable={false}
      {...restProps}
      className={getClassName}
      style={getStyle}
      ref={holderRef}
    />,
  ] as const;
}

export default function useMessage(messageConfig?: ConfigOptions) {
  const globalConfig = getGlobalConfig();
  const mergedConfig = { ...globalConfig, ...messageConfig };
  return useInternalMessage(mergedConfig);
}
