import * as React from 'react';
import {
  CheckCircleOutline,
  ExclamationTriangleOutline,
  InformationCircleOutline,
  LoadingOutline,
  XCircleOutline,
} from '@metisjs/icons';
import { clsx, getSemanticCls, mergeSemanticCls } from '@util/classNameUtils';
import { cloneElement } from '@util/reactNode';
import { devUseWarning } from '@util/warning';
import { getGlobalConfig } from '.';
import { ConfigContext } from '../config-provider';
import type { NotificationAPI } from '../notification/interface';
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
  enter: 'transition-[transform,opacity] duration-300',
  enterFrom: '-translate-y-full! opacity-0',
  enterTo: 'opacity-100 translate-y-0!',
  leave: 'transition-[opacity,margin,max-height] duration-200',
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
// ==                                  Holder                                  ==
// ==============================================================================
type HolderProps = ConfigOptions;

interface HolderRef extends Omit<NotificationAPI, 'className'> {
  className?: ConfigOptions['className'];
}

const Holder = React.forwardRef<HolderRef, HolderProps>((props, ref) => {
  const {
    top,
    prefixCls: staticPrefixCls,
    getContainer: staticGetContainer,
    duration = DEFAULT_DURATION,
    transition = DEFAULT_TRANSITION,
    ...restProps
  } = props;
  const { getPrefixCls, getPopupContainer, message } = React.useContext(ConfigContext);

  const prefixCls = staticPrefixCls || getPrefixCls('message');

  const holderRef = React.useRef<NotificationAPI>(null);

  const getStyle = (): React.CSSProperties => ({
    left: '50%',
    transform: 'translateX(-50%)',
    top: top ?? DEFAULT_OFFSET,
  });

  const getClassName = () => ({
    root: clsx('text-text fixed top-2 z-2010 text-center text-sm'),
    wrapper: clsx(
      'bg-container ring-border-secondary relative mx-auto mb-3 w-fit rounded-lg shadow-lg ring-1 backdrop-blur-2xl ring-inset',
    ),
    notice: clsx('relative flex items-center gap-2 overflow-hidden p-3 break-words'),
  });

  // ================================ Ref ================================
  React.useImperativeHandle(ref, () => ({
    open: holderRef.current!.open,
    close: holderRef.current!.close,
    destroy: holderRef.current!.destroy,
    prefixCls,
    className: message?.className,
  }));

  return (
    <NotificationHolder
      key="message-holder"
      duration={duration}
      transition={transition}
      closable={false}
      {...restProps}
      className={getClassName}
      style={getStyle}
      ref={holderRef}
      getContainer={staticGetContainer || getPopupContainer}
    />
  );
});

// ==============================================================================
// ==                                   Hook                                   ==
// ==============================================================================
let keyIndex = 0;

export function useInternalMessage(
  messageConfig?: ConfigOptions,
): readonly [MessageInstance, React.ReactElement] {
  const {
    duration = DEFAULT_DURATION,
    transition = DEFAULT_TRANSITION,
    className,
    ...restProps
  } = messageConfig ?? {};

  const holderRef = React.useRef<HolderRef>(null);

  const warning = devUseWarning('Message');

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

      const { open: originOpen, prefixCls, className: contextClassName } = holderRef.current;
      const noticePrefixCls = `${prefixCls}-notice`;

      const {
        content,
        icon,
        type,
        key,
        className: internalClassName,
        onClose,
        ...restConfig
      } = config;

      const semanticCls = getSemanticCls([contextClassName, className, internalClassName]);

      const iconCls = clsx(
        `${prefixCls}-icon`,
        !!type && `${prefixCls}-icon-${type}`,
        'h-5 w-5',
        {
          'text-primary': type === 'info' || type === 'loading',
          'text-success': type === 'success',
          'text-warning': type === 'warning',
          'text-error': type === 'error',
        },
        semanticCls.icon,
      );

      let mergedKey: React.Key = key!;
      if (mergedKey === undefined || mergedKey === null) {
        keyIndex += 1;
        mergedKey = `metis-message-${keyIndex}`;
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
              <span className={semanticCls.content}>{content}</span>
            </>
          ),
          placement: 'top',
          className: clsx(type && `${noticePrefixCls}-${type}`, semanticCls.root),
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
    <Holder
      key="message-holder"
      duration={duration}
      transition={transition}
      {...restProps}
      ref={holderRef}
    />,
  ] as const;
}

export default function useMessage(messageConfig?: ConfigOptions) {
  const globalConfig = getGlobalConfig();
  const mergedConfig = {
    ...globalConfig,
    ...messageConfig,
    className: mergeSemanticCls(globalConfig.className, messageConfig?.className),
  };
  return useInternalMessage(mergedConfig);
}
