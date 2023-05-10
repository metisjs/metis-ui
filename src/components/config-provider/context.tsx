import * as React from 'react';
// import type { RequiredMark } from '../form/Form';
// import type { Locale } from '../locale-provider';
import type { SizeType } from './SizeContext';
// import type { RenderEmptyHandler } from './defaultRenderEmpty';

export interface Theme {
  primaryColor?: string;
  infoColor?: string;
  successColor?: string;
  processingColor?: string;
  errorColor?: string;
  warningColor?: string;
}

export interface CSPConfig {
  nonce?: string;
}

export interface ConfigConsumerProps {
  getTargetContainer?: () => HTMLElement;
  getPopupContainer?: (triggerNode?: HTMLElement) => HTMLElement;
  // renderEmpty?: RenderEmptyHandler;
  csp?: CSPConfig;
  input?: {
    autoComplete?: string;
  };
  pagination?: {
    showSizeChanger?: boolean;
  };
  // locale?: Locale;
  pageHeader?: {
    ghost: boolean;
  };
  space?: {
    size?: SizeType | number;
  };
  virtual?: boolean;
  dropdownMatchSelectWidth?: boolean;
  form?: {
    // requiredMark?: RequiredMark;
    colon?: boolean;
  };
}

// 🚨 Do not pass `defaultRenderEmpty` here since it will case circular dependency.
export const ConfigContext = React.createContext<ConfigConsumerProps>({});

export const ConfigConsumer = ConfigContext.Consumer;
