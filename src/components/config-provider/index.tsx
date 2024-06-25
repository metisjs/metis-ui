// import { FormProvider as RcFormProvider } from 'rc-field-form';
// import type { ValidateMessages } from 'rc-field-form/lib/interface';
import useMemo from 'rc-util/lib/hooks/useMemo';
import * as React from 'react';
// import type { RequiredMark } from '../form/Form';
// import type { Locale } from '../locale-provider';
// import LocaleProvider, { METIS_MARK } from '../locale-provider';
// import LocaleReceiver from '../locale-provider/LocaleReceiver';
// import defaultLocale from '../locale/default';
// import message from '../message';
// import notification from '../notification';
// import type { Theme } from './context';
import { DisabledContextProvider } from './DisabledContext';
import type { SizeType } from './SizeContext';
import SizeContext, { SizeContextProvider } from './SizeContext';
import type { ConfigConsumerProps } from './context';
import { ConfigConsumer, ConfigContext } from './context';
import { RenderEmptyHandler } from './defaultRenderEmpty';

export { ConfigConsumer, ConfigConsumerProps, ConfigContext };

export const configConsumerProps = [
  'getTargetContainer',
  'getPopupContainer',
  'renderEmpty',
  'locale',
  'pageHeader',
];

// These props is used by `useContext` directly in sub component
const PASSED_PROPS: (keyof ConfigConsumerProps)[] = [
  'getTargetContainer',
  'getPopupContainer',
  'renderEmpty',
  'input',
  'pagination',
  'form',
];

export interface ConfigProviderProps {
  getTargetContainer?: () => HTMLElement | Window;
  getPopupContainer?: (triggerNode?: HTMLElement) => HTMLElement;
  children?: React.ReactNode;
  renderEmpty?: RenderEmptyHandler;
  form?: {
    // validateMessages?: ValidateMessages;
    // requiredMark?: RequiredMark;
    colon?: boolean;
  };
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
  componentSize?: SizeType;
  componentDisabled?: boolean;
  space?: {
    size?: SizeType | number;
  };
  virtual?: boolean;
  popupMatchSelectWidth?: boolean;
}

interface ProviderChildrenProps extends ConfigProviderProps {
  parentContext: ConfigConsumerProps;
  // legacyLocale: Locale;
}

const ProviderChildren: React.FC<ProviderChildrenProps> = (props) => {
  const {
    children,
    // form,
    // locale,
    componentSize,
    space,
    virtual,
    popupMatchSelectWidth,
    // legacyLocale,
    parentContext,
    componentDisabled,
  } = props;

  const config = {
    ...parentContext,
    // locale: locale || legacyLocale,
    space,
    virtual,
    popupMatchSelectWidth,
  };

  // Pass the props used by `useContext` directly with child component.
  // These props should merged into `config`.
  PASSED_PROPS.forEach((propName) => {
    const propValue = props[propName];
    if (propValue) {
      (config as any)[propName] = propValue;
    }
  });

  // https://github.com/ant-design/ant-design/issues/27617
  const memoedConfig = useMemo(
    () => config,
    config,
    (prevConfig, currentConfig) => {
      const prevKeys = Object.keys(prevConfig) as Array<keyof typeof config>;
      const currentKeys = Object.keys(currentConfig) as Array<keyof typeof config>;
      return (
        prevKeys.length !== currentKeys.length ||
        prevKeys.some((key) => prevConfig[key] !== currentConfig[key])
      );
    },
  );

  // const memoIconContextValue = React.useMemo(() => ({ csp }), [csp]);

  let childNode = children;
  // Additional Form provider
  // let validateMessages: ValidateMessages = {};

  // if (locale) {
  //   validateMessages =
  //     locale.Form?.defaultValidateMessages || defaultLocale.Form?.defaultValidateMessages || {};
  // }
  // if (form && form.validateMessages) {
  //   validateMessages = { ...validateMessages, ...form.validateMessages };
  // }

  // if (Object.keys(validateMessages).length > 0) {
  //   childNode = <RcFormProvider validateMessages={validateMessages}>{children}</RcFormProvider>;
  // }

  // if (locale) {
  //   childNode = (
  //     <LocaleProvider locale={locale} _METIS_MARK__={METIS_MARK}>
  //       {childNode}
  //     </LocaleProvider>
  //   );
  // }

  // if (csp) {
  //   childNode = (
  //     <IconContext.Provider value={memoIconContextValue}>{childNode}</IconContext.Provider>
  //   );
  // }

  if (componentSize) {
    childNode = <SizeContextProvider size={componentSize}>{childNode}</SizeContextProvider>;
  }

  if (componentDisabled !== undefined) {
    childNode = (
      <DisabledContextProvider disabled={componentDisabled}>{childNode}</DisabledContextProvider>
    );
  }

  return <ConfigContext.Provider value={memoedConfig}>{childNode}</ConfigContext.Provider>;
};

const ConfigProvider: React.FC<ConfigProviderProps> & {
  ConfigContext: typeof ConfigContext;
  SizeContext: typeof SizeContext;
} = (props) => {
  return (
    // <LocaleReceiver>
    // {(_, __, legacyLocale) => (
    <ConfigConsumer>
      {(context) => <ProviderChildren parentContext={context} {...props} />}
    </ConfigConsumer>
    // )}
    // </LocaleReceiver>
  );
};

/** @private internal Usage. do not use in your production */
ConfigProvider.ConfigContext = ConfigContext;
ConfigProvider.SizeContext = SizeContext;

export default ConfigProvider;
