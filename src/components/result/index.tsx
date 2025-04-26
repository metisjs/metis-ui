import * as React from 'react';
import {
  CheckCircleSolid,
  ExclamationTriangleSolid,
  InformationCircleSolid,
  XCircleSolid,
} from '@metisjs/icons';
import type { SemanticClassName } from '@util/classNameUtils';
import { clsx } from '@util/classNameUtils';
import useSemanticCls from '@util/hooks/useSemanticCls';
import { cloneElement } from '@util/reactNode';
import { ConfigContext } from '../config-provider';
import NoFound from './NoFound';
import ServerError from './ServerError';
import Unauthorized from './Unauthorized';

export const IconMap = {
  success: CheckCircleSolid,
  error: XCircleSolid,
  info: InformationCircleSolid,
  warning: ExclamationTriangleSolid,
};

export const ExceptionMap = {
  '404': NoFound,
  '500': ServerError,
  '403': Unauthorized,
};

export type ExceptionStatusType = 403 | 404 | 500 | '403' | '404' | '500';
export type ResultStatusType = ExceptionStatusType | keyof typeof IconMap;

export interface ResultProps {
  icon?: React.ReactNode;
  status?: ResultStatusType;
  title?: React.ReactNode;
  subTitle?: React.ReactNode;
  extra?: React.ReactNode;
  prefixCls?: string;
  className?: SemanticClassName<{
    icon?: string;
    image?: string;
    title?: string;
    subTitle?: string;
    content?: string;
    extra?: string;
  }>;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

// ExceptionImageMap keys
const ExceptionStatus = Object.keys(ExceptionMap);

/**
 * Render icon if ExceptionStatus includes ,render svg image else render iconNode
 *
 * @param prefixCls
 * @param {status, icon}
 */

interface IconProps {
  icon: React.ReactNode;
  status: ResultStatusType;
  iconClassName?: string;
  imageClassName?: string;
}

const Icon: React.FC<IconProps> = ({ icon, status, iconClassName, imageClassName }) => {
  if (ExceptionStatus.includes(`${status}`)) {
    const SVGComponent = ExceptionMap[status as ExceptionStatusType];
    return (
      <div className={imageClassName}>
        <SVGComponent />
      </div>
    );
  }

  const iconNode = React.createElement(
    IconMap[status as Exclude<ResultStatusType, ExceptionStatusType>],
    {
      className: clsx('h-24 w-24', {
        'text-primary': status === 'info',
        'text-success': status === 'success',
        'text-warning': status === 'warning',
        'text-error': status === 'error',
      }),
    },
  );

  if (icon === null || icon === false) {
    return null;
  }

  return (
    <div className={iconClassName}>
      {cloneElement(icon, (props) => ({
        className: clsx('text-primary h-24 w-24', props.className),
      })) || iconNode}
    </div>
  );
};

interface ExtraProps {
  className?: string;
  extra: React.ReactNode;
}

const Extra: React.FC<ExtraProps> = ({ className, extra }) => {
  if (!extra) {
    return null;
  }
  return <div className={className}>{extra}</div>;
};

export interface ResultType extends React.FC<ResultProps> {
  PRESENTED_IMAGE_404: React.FC;
  PRESENTED_IMAGE_403: React.FC;
  PRESENTED_IMAGE_500: React.FC;
}

const Result: ResultType = ({
  prefixCls: customizePrefixCls,
  className,
  subTitle,
  title,
  style,
  children,
  status = 'info',
  icon,
  extra,
}) => {
  const { getPrefixCls } = React.useContext(ConfigContext);
  const prefixCls = getPrefixCls('result', customizePrefixCls);
  const semanticCls = useSemanticCls(className, 'result');

  const rootCls = clsx(
    prefixCls,
    `${prefixCls}-${status}`,
    'text-text px-8 py-12 text-sm',
    semanticCls.root,
  );
  const iconCls = clsx(`${prefixCls}-icon`, 'mb-6 text-center', semanticCls.icon);
  const imageCls = clsx(
    `${prefixCls}-image`,
    'm-auto mb-6 h-[295px] w-[250px] text-center',
    semanticCls.image,
  );
  const titleCls = clsx(`${prefixCls}-title`, 'my-2 text-center text-2xl', semanticCls.title);
  const subTitleCls = clsx(
    `${prefixCls}-subtitle`,
    'text-text-tertiary text-center',
    semanticCls.subTitle,
  );
  const contentCls = clsx(`${prefixCls}-content`, 'bg-fill-quinary mt-6 p-6', semanticCls.content);
  const extraCls = clsx(
    `${prefixCls}-extra`,
    'mt-6 flex justify-center gap-2 text-center',
    semanticCls.extra,
  );

  return (
    <div className={rootCls} style={style}>
      <Icon status={status} icon={icon} iconClassName={iconCls} imageClassName={imageCls} />
      <div className={titleCls}>{title}</div>
      {subTitle && <div className={subTitleCls}>{subTitle}</div>}
      <Extra className={extraCls} extra={extra} />
      {children && <div className={contentCls}>{children}</div>}
    </div>
  );
};

Result.PRESENTED_IMAGE_403 = ExceptionMap['403'];
Result.PRESENTED_IMAGE_404 = ExceptionMap['404'];
Result.PRESENTED_IMAGE_500 = ExceptionMap['500'];

if (process.env.NODE_ENV !== 'production') {
  Result.displayName = 'Result';
}

export default Result;
