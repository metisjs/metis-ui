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
import type { ArgsProps, NoticeType } from './interface';

export const TypeIcon = {
  success: <CheckCircleOutline />,
  info: <InformationCircleOutline />,
  error: <XCircleOutline />,
  warning: <ExclamationTriangleOutline />,
  loading: <LoadingOutline className="animate-spin" />,
};

export interface PurePanelProps extends Omit<NoticeProps, 'prefixCls' | 'eventKey' | 'className'> {
  prefixCls?: string;
  className?: ArgsProps['className'];
  type?: NoticeType;
  icon?: React.ReactNode;
}

/** @private Internal Component. Do not use in your production. */
const PurePanel: React.FC<PurePanelProps> = (props) => {
  const { prefixCls: staticPrefixCls, className, type, icon, content, ...restProps } = props;
  const { getPrefixCls } = React.useContext(ConfigContext);

  const prefixCls = staticPrefixCls || getPrefixCls('message');

  const semanticCls = useSemanticCls(className);

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
      className={clsx(
        'relative mx-auto mb-3 flex w-fit items-center gap-2 overflow-hidden break-words rounded-lg bg-elevated p-3 shadow-lg ring-1 ring-inset ring-border-secondary',
        semanticCls.root,
      )}
      eventKey="pure"
      duration={0}
      content={
        <>
          {iconNode}
          <span className={semanticCls.content}>{content}</span>
        </>
      }
    />
  );
};

export default PurePanel;
