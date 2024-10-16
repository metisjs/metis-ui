import * as React from 'react';
import type { Options as RequestOptions } from 'ahooks/lib/useRequest/src/types';
import type { ButtonProps } from '../button';
import type { FormProps } from '../form';
import type { InputProps } from '../input';
import type { Locale } from '../locale';
import type { PaginationProps } from '../pagination';
import type { SpaceProps } from '../space';
import type { RenderEmptyHandler } from './defaultRenderEmpty';

export type PopupOverflow = 'viewport' | 'scroll';

export const Variants = ['outlined', 'borderless', 'filled'] as const;
export type Variant = (typeof Variants)[number];

export type ButtonConfig = Pick<ButtonProps, 'autoInsertSpace'>;
export type PaginationConfig = Pick<PaginationProps, 'showSizeChanger'>;
export type InputConfig = Pick<InputProps, 'autoComplete'>;
export type SpaceConfig = Pick<SpaceProps, 'size'>;
export type FormConfig = Pick<
  FormProps,
  'requiredMark' | 'colon' | 'scrollToFirstError' | 'validateMessages' | 'variant'
>;
export type RouteConfig = {
  history: 'browser' | 'hash';
  basename: string;
};
export type RequestConfig = Omit<RequestOptions<any, any>, 'manual' | 'refreshDepsAction'>;

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
  form?: FormConfig;
  route: RouteConfig;
  request: RequestConfig;
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
  request: { debounceWait: 200 },
});

export const ConfigConsumer = ConfigContext.Consumer;
