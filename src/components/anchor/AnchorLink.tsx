import * as React from 'react';
import type { SemanticClassName } from '@util/classNameUtils';
import { clsx } from '@util/classNameUtils';
import useSemanticCls from '@util/hooks/useSemanticCls';
import { devUseWarning } from '@util/warning';
import { ConfigContext } from '../config-provider';
import type { AntAnchor } from './Anchor';
import AnchorContext from './context';

export interface AnchorLinkBaseProps {
  prefixCls?: string;
  href: string;
  target?: string;
  title: React.ReactNode;
  className?: SemanticClassName<{ title?: string }>;
  replace?: boolean;
}

export interface AnchorLinkProps extends AnchorLinkBaseProps {
  children?: React.ReactNode;
}

const AnchorLink: React.FC<AnchorLinkProps> = (props) => {
  const {
    href,
    title,
    prefixCls: customizePrefixCls,
    children,
    className,
    target,
    replace,
  } = props;

  const semanticCls = useSemanticCls(className);

  const context = React.useContext<AntAnchor | undefined>(AnchorContext);

  const { registerLink, unregisterLink, scrollTo, onClick, activeLink, direction } = context || {};

  React.useEffect(() => {
    registerLink?.(href);
    return () => {
      unregisterLink?.(href);
    };
  }, [href]);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    onClick?.(e, { title, href });
    scrollTo?.(href);
    if (replace) {
      e.preventDefault();
      window.location.replace(href);
    }
  };

  // =================== Warning =====================
  if (process.env.NODE_ENV !== 'production') {
    const warning = devUseWarning('Anchor.Link');

    warning(
      !children || direction !== 'horizontal',
      'usage',
      '`Anchor.Link children` is not supported when `Anchor` direction is horizontal',
    );
  }

  const { getPrefixCls } = React.useContext(ConfigContext);

  const prefixCls = getPrefixCls('anchor', customizePrefixCls);

  const active = activeLink === href;

  const wrapperClassName = clsx(
    `${prefixCls}-link`,
    {
      [`${prefixCls}-link-active`]: active,
    },
    'flex flex-col gap-2 ps-4 leading-6',
    { 'first-of-type:ps-0': direction === 'horizontal' },
    semanticCls.root,
  );

  const titleClassName = clsx(
    `${prefixCls}-link-title`,
    {
      [`${prefixCls}-link-title-active`]: active,
    },
    'text-text block',
    {
      'text-primary': active,
    },
    semanticCls.title,
  );

  return (
    <div className={wrapperClassName}>
      <a
        className={titleClassName}
        href={href}
        title={typeof title === 'string' ? title : ''}
        target={target}
        onClick={handleClick}
      >
        {title}
      </a>
      {direction !== 'horizontal' ? children : null}
    </div>
  );
};

export default AnchorLink;
