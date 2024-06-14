'use client';

import * as React from 'react';
import { ComplexClassName, clsx, getComplexCls } from '../_util/classNameUtils';
import { ConfigContext } from '../config-provider';
import { useLocale } from '../locale';
import DefaultEmptyImg from './EmptyImage';

const defaultEmptyImg = <DefaultEmptyImg />;

export interface EmptyLocale {
  description: string;
}

export interface EmptyProps {
  prefixCls?: string;
  className?: ComplexClassName<'image' | 'description' | 'footer'>;
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
  const complexCls = getComplexCls(className);
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
      className={clsx(prefixCls, 'mx-2 my-8 text-center text-sm', complexCls.root)}
      style={style}
      {...restProps}
    >
      <div
        className={clsx(`${prefixCls}-image mb-2 flex h-10 justify-center`, complexCls.image)}
        style={imageStyle}
      >
        {imageNode}
      </div>
      {des && (
        <div
          className={clsx(
            `${prefixCls}-description`,
            'text-neutral-text-quaternary',
            complexCls.description,
          )}
        >
          {des}
        </div>
      )}
      {children && (
        <div className={clsx(`${prefixCls}-footer mt-4`, complexCls.footer)}>{children}</div>
      )}
    </div>
  );
};

if (process.env.NODE_ENV !== 'production') {
  Empty.displayName = 'Empty';
}

export default Empty;
