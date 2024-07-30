import { ChevronLeftOutline, ChevronRightOutline } from '@metisjs/icons';
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
  trigger?: React.ReactNode;
  width?: number | string;
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

const COLLAPSED_WIDTH = 72;

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
    width = 288,
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
    const uniqueId = generateId('metis-sider-');
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
    const rawWidth = collapsed ? COLLAPSED_WIDTH : width;
    // use "px" as fallback unit for width
    const siderWidth = isNumeric(rawWidth) ? `${rawWidth}px` : String(rawWidth);
    const iconObj = {
      expanded: reverseArrow ? (
        <ChevronRightOutline className="h-5 w-5" />
      ) : (
        <ChevronLeftOutline className="h-5 w-5" />
      ),
      collapsed: reverseArrow ? (
        <ChevronLeftOutline className="h-5 w-5" />
      ) : (
        <ChevronRightOutline className="h-5 w-5" />
      ),
    };
    const status = collapsed ? 'collapsed' : 'expanded';
    const defaultTrigger = iconObj[status];
    const triggerDom =
      trigger !== null ? (
        <div
          className={clsx(
            `${prefixCls}-trigger`,
            'fixed bottom-0 z-[1] flex h-12 cursor-pointer items-center justify-center bg-gray-700 text-center leading-[3rem] text-white transition-[width]',
            theme === 'light' && 'bg-fill-quaternary',
          )}
          onClick={toggle}
          style={{ width: siderWidth }}
        >
          {trigger || defaultTrigger}
        </div>
      ) : null;

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
      'relative min-w-0 bg-gray-800 transition-all',
      {
        [`${prefixCls}-collapsed`]: !!collapsed,
        [`${prefixCls}-has-trigger pb-12`]: collapsible && trigger !== null,
        [`${prefixCls}-below`]: !!below,
        [`${prefixCls}-zero-width`]: parseFloat(siderWidth) === 0,
      },
      theme === 'light' && 'bg-container',
      className,
    );
    return (
      <aside className={siderCls} {...divProps} style={divStyle} ref={ref}>
        <div className={clsx(`${prefixCls}-children`, '-mt-[0.1px] h-full pt-[0.1px]')}>
          {children}
        </div>
        {collapsible || below ? triggerDom : null}
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
