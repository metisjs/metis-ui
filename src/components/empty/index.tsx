'use client';

import * as React from 'react';
import type { SemanticClassName } from '../_util/classNameUtils';
import { clsx } from '../_util/classNameUtils';
import useSemanticCls from '../_util/hooks/useSemanticCls';
import { ConfigContext } from '../config-provider';
import { useLocale } from '../locale';
import DefaultEmptyImg from './EmptyImage';

const defaultEmptyImg = <DefaultEmptyImg />;

export interface EmptyLocale {
  description: string;
}

export interface EmptyProps {
  prefixCls?: string;
  className?: SemanticClassName<{ image?: string; description?: string; footer?: string }>;
  style?: React.CSSProperties;
  imageStyle?: React.CSSProperties;
  image?: React.ReactNode;
  description?: React.ReactNode;
  children?: React.ReactNode;
}

type CompoundedComponent = React.FC<EmptyProps>;

const Empty: CompoundedComponent = ({
  className,
  prefixCls: customizePrefixCls,
  image = defaultEmptyImg,
  description,
  children,
  imageStyle,
  style,
  ...restProps
}) => {
  const semanticCls = useSemanticCls(className, 'empty');
  const { getPrefixCls } = React.useContext(ConfigContext);

  const prefixCls = getPrefixCls('empty', customizePrefixCls);

  const [locale] = useLocale('Empty');

  const des = typeof description !== 'undefined' ? description : locale?.description;
  const alt = typeof des === 'string' ? des : 'empty';

  let imageNode: React.ReactNode = null;

  if (typeof image === 'string') {
    imageNode = <img alt={alt} src={image} className="h-full" />;
  } else {
    imageNode = image;
  }

  return (
    <div
      className={clsx(prefixCls, 'mx-2 my-8 text-center text-sm', semanticCls.root)}
      style={style}
      {...restProps}
    >
      <div
        className={clsx(`${prefixCls}-image mb-2 flex h-10 justify-center`, semanticCls.image)}
        style={imageStyle}
      >
        {imageNode}
      </div>
      {des && (
        <div
          className={clsx(
            `${prefixCls}-description`,
            'text-text-quaternary',
            semanticCls.description,
          )}
        >
          {des}
        </div>
      )}
      {children && (
        <div className={clsx(`${prefixCls}-footer mt-4`, semanticCls.footer)}>{children}</div>
      )}
    </div>
  );
};

if (process.env.NODE_ENV !== 'production') {
  Empty.displayName = 'Empty';
}

export default Empty;
