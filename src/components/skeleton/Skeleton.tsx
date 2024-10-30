import * as React from 'react';
import type { SemanticClassName } from '../_util/classNameUtils';
import { clsx } from '../_util/classNameUtils';
import useSemanticCls from '../_util/hooks/useSemanticCls';
import { ConfigContext } from '../config-provider';
import type { AvatarProps } from './Avatar';
import SkeletonAvatar from './Avatar';
import SkeletonButton from './Button';
import Element from './Element';
import SkeletonImage from './Image';
import SkeletonInput from './Input';
import type { SkeletonParagraphProps } from './Paragraph';
import SkeletonParagraph from './Paragraph';
import type { SkeletonTitleProps } from './Title';
import SkeletonTitle from './Title';

/* This only for skeleton internal. */
type SkeletonAvatarProps = Omit<AvatarProps, 'active'>;

export interface SkeletonProps {
  active?: boolean;
  loading?: boolean;
  prefixCls?: string;
  className?: SemanticClassName<'avatar' | 'title' | 'paragraph'>;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  avatar?: SkeletonAvatarProps | boolean;
  title?: SkeletonTitleProps | boolean;
  paragraph?: SkeletonParagraphProps | boolean;
  round?: boolean;
}

function getComponentProps<T>(prop?: T | boolean): T | Record<string, string> {
  if (prop && typeof prop === 'object') {
    return prop;
  }
  return {};
}

function getAvatarBasicProps(hasTitle: boolean, hasParagraph: boolean): SkeletonAvatarProps {
  if (hasTitle && !hasParagraph) {
    // Square avatar
    return { shape: 'square' };
  }

  return { shape: 'circle' };
}

function getTitleBasicProps(hasAvatar: boolean, hasParagraph: boolean): SkeletonTitleProps {
  if (!hasAvatar && hasParagraph) {
    return { width: '38%' };
  }

  if (hasAvatar && hasParagraph) {
    return { width: '50%' };
  }

  return {};
}

function getParagraphBasicProps(hasAvatar: boolean, hasTitle: boolean): SkeletonParagraphProps {
  const basicProps: SkeletonParagraphProps = {};

  basicProps.width = '61%';

  // Rows
  if (!hasAvatar && hasTitle) {
    basicProps.rows = 3;
  } else {
    basicProps.rows = 2;
  }

  return basicProps;
}

type CompoundedComponent = {
  Button: typeof SkeletonButton;
  Avatar: typeof SkeletonAvatar;
  Input: typeof SkeletonInput;
  Image: typeof SkeletonImage;
};

const Skeleton: React.FC<SkeletonProps> & CompoundedComponent = (props) => {
  const {
    prefixCls: customizePrefixCls,
    loading,
    className,
    style,
    children,
    avatar = false,
    title = true,
    paragraph = true,
    active,
    round,
  } = props;

  const { getPrefixCls } = React.useContext(ConfigContext);
  const prefixCls = getPrefixCls('skeleton', customizePrefixCls);
  const semanticCls = useSemanticCls(className, 'skeleton');

  if (loading || !('loading' in props)) {
    const hasAvatar = !!avatar;
    const hasTitle = !!title;
    const hasParagraph = !!paragraph;

    // Avatar
    let avatarNode: React.ReactNode;
    if (hasAvatar) {
      const customizeProps = getComponentProps(avatar);
      const sizeCls = clsx('h-10 w-10 leading-10', {
        'h-12 w-12 leading-10': customizeProps.size === 'large',
        'h-8 w-8 leading-8': customizeProps.size === 'small',
      });
      const avatarProps: SkeletonAvatarProps = {
        prefixCls: `${prefixCls}-avatar`,
        ...getAvatarBasicProps(hasTitle, hasParagraph),
        ...customizeProps,
        className: clsx(sizeCls, customizeProps.className),
      };
      avatarNode = <Element {...avatarProps} />;
    }

    let contentNode: React.ReactNode;
    if (hasTitle || hasParagraph) {
      // Title
      let titleNode: React.ReactNode;
      if (hasTitle) {
        const customizeProps = getComponentProps(title);
        const titleProps: SkeletonTitleProps = {
          prefixCls: `${prefixCls}-title`,
          ...getTitleBasicProps(hasAvatar, hasParagraph),
          ...customizeProps,
          className: clsx(hasAvatar && 'mt-3', semanticCls.title, customizeProps.className),
        };

        titleNode = <SkeletonTitle {...titleProps} />;
      }

      // Paragraph
      let paragraphNode: React.ReactNode;
      if (hasParagraph) {
        const customizeProps = getComponentProps(paragraph);
        const paragraphProps: SkeletonParagraphProps = {
          prefixCls: `${prefixCls}-paragraph`,
          ...getParagraphBasicProps(hasAvatar, hasTitle),
          ...customizeProps,
          className: clsx(semanticCls.paragraph, customizeProps.className),
        };

        paragraphNode = <SkeletonParagraph {...paragraphProps} />;
      }

      contentNode = (
        <div className={clsx(`${prefixCls}-content`, 'flex flex-1 flex-col gap-4')}>
          {titleNode}
          {paragraphNode}
        </div>
      );
    }

    const cls = clsx(
      prefixCls,
      {
        [`${prefixCls}-with-avatar`]: hasAvatar,
        [`${prefixCls}-active`]: active,
        [`${prefixCls}-round`]: round,
      },
      'flex gap-4',
      active && 'animate-pulse',
      semanticCls.root,
    );

    return (
      <div className={cls} style={style}>
        {avatarNode}
        {contentNode}
      </div>
    );
  }
  return <>{children ?? null}</>;
};

Skeleton.Button = SkeletonButton;
Skeleton.Avatar = SkeletonAvatar;
Skeleton.Input = SkeletonInput;
Skeleton.Image = SkeletonImage;

if (process.env.NODE_ENV !== 'production') {
  Skeleton.displayName = 'Skeleton';
}

export default Skeleton;
