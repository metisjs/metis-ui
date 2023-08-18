import useMemo from 'rc-util/lib/hooks/useMemo';
import isEqual from 'rc-util/lib/isEqual';
import * as React from 'react';
import { TransitionProps } from '../../transition';
import type {
  BuiltinPlacements,
  MenuClickEventHandler,
  MenuMode,
  RenderIconType,
  TriggerSubMenuAction,
} from '../interface';

const noop = () => {};

export type MenuTheme = 'light' | 'dark';

export interface MenuContextProps {
  prefixCls: string;
  className?: string;
  openKeys: string[];

  inlineCollapsed: boolean;
  theme?: MenuTheme;

  // Mode
  mode: MenuMode;

  // Disabled
  disabled?: boolean;
  // Used for overflow only. Prevent hidden node trigger open
  overflowDisabled?: boolean;

  // Active
  activeKey: string;
  onActive: (key: string) => void;
  onInactive: (key: string) => void;

  // Selection
  selectedKeys: string[];

  // Level
  inlineIndent: number;

  // Transition
  transition?: TransitionProps;
  defaultTransitions?: Partial<{ [key in MenuMode | 'other']: TransitionProps }>;

  // Popup
  subMenuOpenDelay: number;
  subMenuCloseDelay: number;
  forceSubMenuRender?: boolean;
  builtinPlacements?: BuiltinPlacements;
  triggerSubMenuAction?: TriggerSubMenuAction;

  // Icon
  itemIcon?: RenderIconType;
  expandIcon?: RenderIconType;

  // Function
  onItemClick: MenuClickEventHandler;
  onOpenChange: (key: string, open: boolean) => void;
  getPopupContainer: (node: HTMLElement) => HTMLElement;
}

export const MenuContext = React.createContext<MenuContextProps>({
  prefixCls: '',
  openKeys: [],
  mode: 'horizontal',
  activeKey: '',
  onActive: noop,
  onInactive: noop,
  selectedKeys: [],
  inlineIndent: 0,
  subMenuOpenDelay: 0,
  subMenuCloseDelay: 0,
  onItemClick: noop,
  onOpenChange: noop,
  getPopupContainer: (node) => node,
  inlineCollapsed: false,
  firstLevel: true,
});

function mergeProps(origin: MenuContextProps, target: Partial<MenuContextProps>): MenuContextProps {
  const clone: MenuContextProps = { ...origin };

  Object.keys(target).forEach((key: keyof MenuContextProps) => {
    const value = target[key];
    if (value !== undefined) {
      clone[key] = value as never;
    }
  });

  return clone;
}

export interface InheritableContextProps extends Partial<MenuContextProps> {
  children?: React.ReactNode;
  locked?: boolean;
}

export default function InheritableContextProvider({
  children,
  locked,
  ...restProps
}: InheritableContextProps) {
  const context = React.useContext(MenuContext);

  const inheritableContext = useMemo(
    () => mergeProps(context, restProps),
    [context, restProps],
    (prev, next) => !locked && (prev[0] !== next[0] || !isEqual(prev[1], next[1], true)),
  );

  return <MenuContext.Provider value={inheritableContext}>{children}</MenuContext.Provider>;
}
