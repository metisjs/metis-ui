import * as React from 'react';
import type { SemanticClassName } from '../_util/classNameUtils';
import { clsx } from '../_util/classNameUtils';
import useSemanticCls from '../_util/hooks/useSemanticCls';
import type { ConfigConsumerProps } from '../config-provider';
import { ConfigContext } from '../config-provider';

export interface CardMetaProps {
  prefixCls?: string;
  style?: React.CSSProperties;
  className?: SemanticClassName<{ avatar?: string; title?: string; description?: string }>;
  avatar?: React.ReactNode;
  title?: React.ReactNode;
  description?: React.ReactNode;
}

const Meta: React.FC<CardMetaProps> = (props) => {
  const { prefixCls: customizePrefixCls, className, avatar, title, description, ...others } = props;

  const { getPrefixCls } = React.useContext<ConfigConsumerProps>(ConfigContext);
  const prefixCls = getPrefixCls('card', customizePrefixCls);
  const semanticCLs = useSemanticCls(className);

  const classString = clsx(`${prefixCls}-meta`, '-my-1 flex gap-4', semanticCLs.root);

  const avatarDom: React.ReactNode = avatar ? (
    <div className={clsx(`${prefixCls}-meta-avatar`, semanticCLs.avatar)}>{avatar}</div>
  ) : null;

  const titleDom: React.ReactNode = title ? (
    <div className={clsx(`${prefixCls}-meta-title`, 'font-medium', semanticCLs.title)}>{title}</div>
  ) : null;

  const descriptionDom: React.ReactNode = description ? (
    <div
      className={clsx(
        `${prefixCls}-meta-description`,
        'text-text-secondary',
        title && 'mt-1',
        semanticCLs.description,
      )}
    >
      {description}
    </div>
  ) : null;

  const MetaDetail: React.ReactNode =
    titleDom || descriptionDom ? (
      <div className={`${prefixCls}-meta-detail`}>
        {titleDom}
        {descriptionDom}
      </div>
    ) : null;

  return (
    <div {...others} className={classString}>
      {avatarDom}
      {MetaDetail}
    </div>
  );
};

export default Meta;
