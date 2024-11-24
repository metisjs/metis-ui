import * as React from 'react';
import {
  CheckCircleOutline,
  ExclamationTriangleOutline,
  InformationCircleOutline,
  LoadingOutline,
  XCircleOutline,
} from '@metisjs/icons';
import { clsx } from '../_util/classNameUtils';
import { ConfigContext } from '../config-provider';
import type { NoticeProps } from '../notification/Notice';
import Notice from '../notification/Notice';
import type { NoticeType } from './interface';

export const TypeIcon = {
  success: <CheckCircleOutline />,
  info: <InformationCircleOutline />,
  error: <XCircleOutline />,
  warning: <ExclamationTriangleOutline />,
  loading: <LoadingOutline className="animate-spin" />,
};

export interface PureContentProps {
  prefixCls: string;
  type?: NoticeType;
  icon?: React.ReactNode;
  children: React.ReactNode;
}

export const PureContent: React.FC<PureContentProps> = ({ prefixCls, type, icon, children }) => (
  <div className={clsx(`${prefixCls}-custom-content`, `${prefixCls}-${type}`)}>
    {icon || TypeIcon[type!]}
    <span>{children}</span>
  </div>
);

export interface PurePanelProps
  extends Omit<NoticeProps, 'prefixCls' | 'eventKey'>,
    Omit<PureContentProps, 'prefixCls' | 'children'> {
  prefixCls?: string;
}

/** @private Internal Component. Do not use in your production. */
const PurePanel: React.FC<PurePanelProps> = (props) => {
  const { prefixCls: staticPrefixCls, className, type, icon, content, ...restProps } = props;
  const { getPrefixCls } = React.useContext(ConfigContext);

  const prefixCls = staticPrefixCls || getPrefixCls('message');

  return (
    <Notice
      {...restProps}
      prefixCls={prefixCls}
      className={''}
      eventKey="pure"
      duration={0}
      content={
        <PureContent prefixCls={prefixCls} type={type} icon={icon}>
          {content}
        </PureContent>
      }
    />
  );
};

export default PurePanel;
