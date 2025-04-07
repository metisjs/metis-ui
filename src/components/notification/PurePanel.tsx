import * as React from 'react';
import {
  CheckCircleOutline,
  ExclamationTriangleOutline,
  InformationCircleOutline,
  LoadingOutline,
  XCircleOutline,
} from '@metisjs/icons';
import { clsx } from '@util/classNameUtils';
import useSemanticCls from '@util/hooks/useSemanticCls';
import { cloneElement } from '@util/reactNode';
import { ConfigContext } from '../config-provider';
import type { NoticeProps } from '../notification/Notice';
import Notice from '../notification/Notice';
import type { ArgsProps, IconType } from './interface';

export const TypeIcon = {
  success: <CheckCircleOutline />,
  info: <InformationCircleOutline />,
  error: <XCircleOutline />,
  warning: <ExclamationTriangleOutline />,
  loading: <LoadingOutline className="animate-spin" />,
};

export interface PurePanelProps extends Omit<NoticeProps, 'prefixCls' | 'eventKey' | 'className'> {
  prefixCls?: string;
  type?: IconType;
  icon?: React.ReactNode;
  className?: ArgsProps['className'];
  message?: string;
  description?: string;
  btn?: React.ReactNode;
}

/** @private Internal Component. Do not use in your production. */
const PurePanel: React.FC<PurePanelProps> = (props) => {
  const {
    prefixCls: staticPrefixCls,
    className,
    type,
    icon,
    message,
    description,
    btn,
    ...restProps
  } = props;
  const { getPrefixCls } = React.useContext(ConfigContext);

  const prefixCls = staticPrefixCls || getPrefixCls('message');

  const semanticCls = useSemanticCls(className);

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
    iconNode = cloneElement(icon ?? TypeIcon[type!] ?? null, (originProps) => ({
      className: clsx(iconCls, originProps.className),
    }));
  }

  return (
    <Notice
      {...restProps}
      prefixCls={prefixCls}
      className={{
        root: clsx(
          'bg-container ring-border-secondary relative flex w-[24rem] gap-3 overflow-hidden rounded-lg p-4 break-words shadow-lg ring-1 backdrop-blur-2xl ring-inset',
          semanticCls.root,
        ),
        close: clsx(
          'text-text-secondary hover:bg-fill-tertiary hover:text-text-secondary ml-1 flex h-6 w-6 shrink-0 cursor-pointer items-center justify-center rounded-sm text-xl',
          semanticCls.close,
        ),
        progress: clsx(
          '[&::-webkit-progress-bar]:bg-fill-quinary [&::-webkit-progress-value]:bg-primary absolute right-2 bottom-0 left-2 block appearance-none border-0 [block-size:2px] [inline-size:calc(100%-1rem)] [&::-moz-progress-bar]:bg-violet-400 [&::-webkit-progress-bar]:rounded-lg [&::-webkit-progress-value]:rounded-lg',
          semanticCls.progress,
        ),
      }}
      eventKey="pure"
      content={
        <>
          {iconNode}
          <div className="flex-1">
            <div className={messageCls}>{message}</div>
            <div className={descriptionCls}>{description}</div>
            {btn && <div className={btnCls}>{btn}</div>}
          </div>
        </>
      }
    />
  );
};

export default PurePanel;
