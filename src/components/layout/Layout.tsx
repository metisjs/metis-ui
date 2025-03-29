import * as React from 'react';
import { clsx } from '@util/classNameUtils';
import omit from 'rc-util/es/omit';
import { ConfigContext } from '../config-provider';

export interface GeneratorProps {
  suffixCls?: string;
  tagName: 'header' | 'footer' | 'main' | 'div';
  displayName: string;
  innerClassName?: string;
}
export interface BasicProps extends React.HTMLAttributes<HTMLDivElement> {
  prefixCls?: string;
  suffixCls?: string;
  hasSider?: boolean;
  innerClassName?: string;
}

export interface LayoutContextProps {
  siderHook: {
    addSider: (id: string) => void;
    removeSider: (id: string) => void;
  };
}
export const LayoutContext = React.createContext<LayoutContextProps>({
  siderHook: {
    addSider: () => null,
    removeSider: () => null,
  },
});

interface BasicPropsWithTagName extends BasicProps {
  tagName: 'header' | 'footer' | 'main' | 'div';
}

function generator({ suffixCls, tagName, displayName, innerClassName }: GeneratorProps) {
  return (BasicComponent: any) => {
    const Adapter = React.forwardRef<HTMLElement, BasicProps>((props, ref) => (
      <BasicComponent
        ref={ref}
        suffixCls={suffixCls}
        tagName={tagName}
        innerClassName={innerClassName}
        {...props}
      />
    ));
    if (process.env.NODE_ENV !== 'production') {
      Adapter.displayName = displayName;
    }
    return Adapter;
  };
}

const Basic = React.forwardRef<HTMLDivElement, BasicPropsWithTagName>((props, ref) => {
  const {
    prefixCls: customizePrefixCls,
    suffixCls,
    className,
    innerClassName,
    tagName: TagName,
    ...others
  } = props;

  const { getPrefixCls } = React.useContext(ConfigContext);
  const prefixCls = getPrefixCls('layout', customizePrefixCls);

  const prefixWithSuffixCls = suffixCls ? `${prefixCls}-${suffixCls}` : prefixCls;

  return (
    <TagName
      className={clsx(customizePrefixCls || prefixWithSuffixCls, innerClassName, className)}
      ref={ref}
      {...others}
    />
  );
});

const BasicLayout = React.forwardRef<HTMLDivElement, BasicPropsWithTagName>((props, ref) => {
  const [siders, setSiders] = React.useState<string[]>([]);

  const {
    prefixCls: customizePrefixCls,
    className,
    innerClassName,
    children,
    hasSider,
    tagName: Tag,
    style,
    ...others
  } = props;

  const passedProps = omit(others, ['suffixCls']);

  const { getPrefixCls } = React.useContext(ConfigContext);
  const prefixCls = getPrefixCls('layout', customizePrefixCls);

  const classString = clsx(
    prefixCls,
    innerClassName,
    {
      [`${prefixCls}-has-sider flex-row`]:
        typeof hasSider === 'boolean' ? hasSider : siders.length > 0,
    },
    className,
  );

  const contextValue = React.useMemo(
    () => ({
      siderHook: {
        addSider: (id: string) => {
          setSiders((prev) => [...prev, id]);
        },
        removeSider: (id: string) => {
          setSiders((prev) => prev.filter((currentId) => currentId !== id));
        },
      },
    }),
    [],
  );

  return (
    <LayoutContext.Provider value={contextValue}>
      <Tag ref={ref} className={classString} style={style} {...passedProps}>
        {children}
      </Tag>
    </LayoutContext.Provider>
  );
});

const Layout = generator({
  tagName: 'div',
  displayName: 'Layout',
  innerClassName: clsx('flex min-h-0 flex-auto flex-col bg-layout text-sm'),
})(BasicLayout);

const Header = generator({
  suffixCls: 'header',
  tagName: 'header',
  displayName: 'Header',
  innerClassName: clsx(
    'h-16 flex-shrink-0 flex-grow-0 basis-auto bg-slate-800 px-[3.125rem] leading-[3rem]',
  ),
})(Basic);

const Footer = generator({
  suffixCls: 'footer',
  tagName: 'footer',
  displayName: 'Footer',
  innerClassName: clsx('flex-shrink-0 flex-grow-0 basis-auto bg-layout px-[3.125rem] py-6'),
})(Basic);

const Content = generator({
  suffixCls: 'content',
  tagName: 'main',
  displayName: 'Content',
  innerClassName: clsx('min-h-0 flex-auto'),
})(Basic);

export { Content, Footer, Header };

export default Layout;
