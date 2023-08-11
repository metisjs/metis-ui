import { ArrowLeftOutline, ArrowRightOutline, ListBulletOutline } from '@metaoa/icons';
import omit from 'rc-util/lib/omit';
import * as React from 'react';
import { useContext, useEffect, useRef, useState } from 'react';
import { clsx } from '../_util/classNameUtils';
import isNumeric from '../_util/isNumeric';
import { ConfigContext } from '../config-provider';
import { LayoutContext } from './Layout';

const dimensionMaxMap = {
  sm: '639.98px',
  md: '767.98px',
  lg: '1023.98px',
  xl: '1279.98px',
  '2xl': '1535.98px',
};

export interface SiderContextProps {
  siderCollapsed?: boolean;
}

export const SiderContext: React.Context<SiderContextProps> = React.createContext({});

export type CollapseType = 'clickTrigger' | 'responsive';

export type SiderTheme = 'light' | 'dark';

export interface SiderProps extends React.HTMLAttributes<HTMLDivElement> {
  prefixCls?: string;
  collapsible?: boolean;
  collapsed?: boolean;
  defaultCollapsed?: boolean;
  reverseArrow?: boolean;
  onCollapse?: (collapsed: boolean, type: CollapseType) => void;
  zeroWidthTriggerStyle?: React.CSSProperties;
  trigger?: React.ReactNode;
  width?: number | string;
  collapsedWidth?: number | string;
  breakpoint?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  theme?: SiderTheme;
  onBreakpoint?: (broken: boolean) => void;
}

export interface SiderState {
  collapsed?: boolean;
  below: boolean;
}

const generateId = (() => {
  let i = 0;
  return (prefix: string = '') => {
    i += 1;
    return `${prefix}${i}`;
  };
})();

const Sider = React.forwardRef<HTMLDivElement, SiderProps>((props, ref) => {
  const {
    prefixCls: customizePrefixCls,
    className,
    trigger,
    children,
    defaultCollapsed = false,
    theme = 'dark',
    style = {},
    collapsible = false,
    reverseArrow = false,
    width = 200,
    collapsedWidth = 80,
    zeroWidthTriggerStyle,
    breakpoint,
    onCollapse,
    onBreakpoint,
    ...otherProps
  } = props;
  const { siderHook } = useContext(LayoutContext);

  const [collapsed, setCollapsed] = useState(
    'collapsed' in props ? props.collapsed : defaultCollapsed,
  );
  const [below, setBelow] = useState(false);

  useEffect(() => {
    if ('collapsed' in props) {
      setCollapsed(props.collapsed);
    }
  }, [props.collapsed]);

  const handleSetCollapsed = (value: boolean, type: CollapseType) => {
    if (!('collapsed' in props)) {
      setCollapsed(value);
    }
    onCollapse?.(value, type);
  };

  // ========================= Responsive =========================
  const responsiveHandlerRef = useRef<(mql: MediaQueryListEvent | MediaQueryList) => void>();
  responsiveHandlerRef.current = (mql: MediaQueryListEvent | MediaQueryList) => {
    setBelow(mql.matches);
    onBreakpoint?.(mql.matches);

    if (collapsed !== mql.matches) {
      handleSetCollapsed(mql.matches, 'responsive');
    }
  };

  useEffect(() => {
    function responsiveHandler(mql: MediaQueryListEvent | MediaQueryList) {
      return responsiveHandlerRef.current!(mql);
    }

    let mql: MediaQueryList;
    if (typeof window !== 'undefined') {
      const { matchMedia } = window;
      if (matchMedia! && breakpoint && breakpoint in dimensionMaxMap) {
        mql = matchMedia(`(max-width: ${dimensionMaxMap[breakpoint]})`);
        try {
          mql.addEventListener('change', responsiveHandler);
        } catch (error) {
          mql.addListener(responsiveHandler);
        }
        responsiveHandler(mql);
      }
    }
    return () => {
      try {
        mql?.removeEventListener('change', responsiveHandler);
      } catch (error) {
        mql?.removeListener(responsiveHandler);
      }
    };
  }, [breakpoint]); // in order to accept dynamic 'breakpoint' property, we need to add 'breakpoint' into dependency array.

  useEffect(() => {
    const uniqueId = generateId('meta-sider-');
    siderHook.addSider(uniqueId);
    return () => siderHook.removeSider(uniqueId);
  }, []);

  const toggle = () => {
    handleSetCollapsed(!collapsed, 'clickTrigger');
  };

  const { getPrefixCls } = useContext(ConfigContext);

  const renderSider = () => {
    const prefixCls = getPrefixCls('layout-sider', customizePrefixCls);
    const divProps = omit(otherProps, ['collapsed']);
    const rawWidth = collapsed ? collapsedWidth : width;
    // use "px" as fallback unit for width
    const siderWidth = isNumeric(rawWidth) ? `${rawWidth}px` : String(rawWidth);
    // special trigger when collapsedWidth == 0
    const zeroWidthTrigger =
      parseFloat(String(collapsedWidth || 0)) === 0 ? (
        <span
          onClick={toggle}
          className={clsx(
            `${prefixCls}-zero-width-trigger`,
            `${prefixCls}-zero-width-trigger-${reverseArrow ? 'right' : 'left'}`,
            reverseArrow && 'order-1',
          )}
          style={zeroWidthTriggerStyle}
        >
          {trigger || <ListBulletOutline />}
        </span>
      ) : null;
    const iconObj = {
      expanded: reverseArrow ? <ArrowRightOutline /> : <ArrowLeftOutline />,
      collapsed: reverseArrow ? <ArrowLeftOutline /> : <ArrowRightOutline />,
    };
    const status = collapsed ? 'collapsed' : 'expanded';
    const defaultTrigger = iconObj[status];
    const triggerDom =
      trigger !== null
        ? zeroWidthTrigger || (
            <div
              className={clsx(
                `${prefixCls}-trigger`,
                'fixed bottom-0 z-[1] flex h-12 cursor-pointer items-center justify-center bg-slate-800 text-center leading-[3rem] text-white transition-all duration-200',
              )}
              onClick={toggle}
              style={{ width: siderWidth }}
            >
              {trigger || defaultTrigger}
            </div>
          )
        : null;

    const divStyle: React.CSSProperties = {
      ...style,
      flex: `0 0 ${siderWidth}`,
      maxWidth: siderWidth,
      minWidth: siderWidth,
      width: siderWidth,
    };

    const siderCls = clsx(
      prefixCls,
      `${prefixCls}-${theme}`,
      'relative min-w-0 bg-slate-900 transition-all duration-200',
      {
        [`${prefixCls}-collapsed`]: !!collapsed,
        [`${prefixCls}-has-trigger pb-12`]: collapsible && trigger !== null && !zeroWidthTrigger,
        [`${prefixCls}-below`]: !!below,
        [`${prefixCls}-zero-width`]: parseFloat(siderWidth) === 0,
      },
      className,
    );
    return (
      <aside className={siderCls} {...divProps} style={divStyle} ref={ref}>
        <div className={clsx(`${prefixCls}-children`, '-mt-[0.1] h-full pt-[0.1]')}>{children}</div>
        {collapsible || (below && zeroWidthTrigger) ? triggerDom : null}
      </aside>
    );
  };

  const contextValue = React.useMemo(() => ({ siderCollapsed: collapsed }), [collapsed]);

  return <SiderContext.Provider value={contextValue}>{renderSider()}</SiderContext.Provider>;
});

if (process.env.NODE_ENV !== 'production') {
  Sider.displayName = 'Sider';
}

export default Sider;
