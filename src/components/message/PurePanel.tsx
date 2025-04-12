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
    'size-5',
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
        'bg-container outline-border-secondary relative mx-auto mb-3 flex w-fit items-center gap-2 overflow-hidden rounded-lg p-3 break-words shadow-lg outline-1 -outline-offset-1 backdrop-blur-2xl',
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
