import * as React from 'react';
// import type { RequiredMark } from '../form/Form';
// import type { Locale } from '../locale-provider';
import type { SizeType } from './SizeContext';
import type { RenderEmptyHandler } from './defaultRenderEmpty';

export type PopupOverflow = 'viewport' | 'scroll';

export interface RequestConfig {
  dataField?: string;
  paginationField?: { total: string; list: string };
}

export interface ConfigConsumerProps {
  getTargetContainer?: () => HTMLElement;
  getPopupContainer?: (triggerNode?: HTMLElement) => HTMLElement;
  getPrefixCls: (suffixCls?: string, customizePrefixCls?: string) => string;
  renderEmpty?: RenderEmptyHandler;
  input?: {
    autoComplete?: string;
  };
  pagination?: {
    showSizeChanger?: boolean;
  };
  // locale?: Locale;
  space?: {
    size?: SizeType | number;
  };
  virtual?: boolean;
  popupMatchSelectWidth?: boolean;
  popupOverflow?: PopupOverflow;
  form?: {
    // requiredMark?: RequiredMark;
    colon?: boolean;
  };
  request?: RequestConfig;
}

const defaultGetPrefixCls = (suffixCls?: string, customizePrefixCls?: string) => {
  if (customizePrefixCls) {
    return customizePrefixCls;
  }
  return suffixCls ? `metis-${suffixCls}` : 'metis';
};

export const ConfigContext = React.createContext<ConfigConsumerProps>({
  // We provide a default function for Context without provider
  getPrefixCls: defaultGetPrefixCls,
});

export const ConfigConsumer = ConfigContext.Consumer;
