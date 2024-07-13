import * as React from 'react';
// import type { RequiredMark } from '../form/Form';
import { InputProps } from 'rc-input';
import { ButtonProps } from '../button';
import { Locale } from '../locale';
import { PaginationProps } from '../pagination';
import { SpaceProps } from '../space';
import type { RenderEmptyHandler } from './defaultRenderEmpty';

export type PopupOverflow = 'viewport' | 'scroll';

export const Variants = ['outlined', 'borderless', 'filled'] as const;
export type Variant = (typeof Variants)[number];

export type ButtonConfig = Pick<ButtonProps, 'autoInsertSpace'>;
export type PaginationConfig = Pick<PaginationProps, 'showSizeChanger'>;
export type InputConfig = Pick<InputProps, 'autoComplete'>;
export type SpaceConfig = Pick<SpaceProps, 'size'>;
export type RouteConfig = {
  history: 'browser' | 'hash';
  basename: string;
};

export interface ConfigConsumerProps {
  getTargetContainer?: () => HTMLElement;
  getPopupContainer?: (triggerNode?: HTMLElement) => HTMLElement;
  getPrefixCls: (suffixCls?: string, customizePrefixCls?: string) => string;
  renderEmpty?: RenderEmptyHandler;
  button?: ButtonConfig;
  input?: InputConfig;
  pagination?: PaginationConfig;
  locale?: Locale;
  space?: SpaceConfig;
  virtual?: boolean;
  variant?: Variant;
  popupMatchSelectWidth?: boolean;
  popupOverflow?: PopupOverflow;
  // TODO: form组件待开发
  // form?: {
  //    requiredMark?: RequiredMark;
  //   colon?: boolean;
  // };
  route: {
    history: 'browser' | 'hash';
    basename: string;
  };
}

const defaultGetPrefixCls = (suffixCls?: string, customizePrefixCls?: string) => {
  if (customizePrefixCls) {
    return customizePrefixCls;
  }
  return suffixCls ? `metis-${suffixCls}` : 'metis';
};

export const ConfigContext = React.createContext<ConfigConsumerProps>({
  getPrefixCls: defaultGetPrefixCls,
  route: { history: 'hash', basename: '/' },
});

export const ConfigConsumer = ConfigContext.Consumer;
