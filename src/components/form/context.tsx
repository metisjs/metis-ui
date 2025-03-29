import type { PropsWithChildren, ReactNode } from 'react';
import * as React from 'react';
import { createContext, useContext, useMemo } from 'react';
import type { Breakpoint } from '@util/responsiveObserver';
import { FormProvider as RcFormProvider } from 'rc-field-form';
import type { FormProviderProps as RcFormProviderProps } from 'rc-field-form/lib/FormContext';
import type { Meta } from 'rc-field-form/lib/interface';
import omit from 'rc-util/es/omit';
import type { Variant } from '../config-provider';
import type { SizeType } from '../config-provider/SizeContext';
import type { PopoverProps } from '../popover';
import type { FormInstance, FormLayout, FormProps, RequiredMark } from './Form';
import type { FeedbackIcons, ValidateStatus } from './FormItem';
import type { FormLabelAlign } from './interface';

/** Form Context. Set top form style and pass to Form Item usage. */
export interface FormContextProps {
  layout: FormLayout;
  name?: string;
  colon?: boolean;
  labelAlign?: FormLabelAlign;
  labelWrap?: boolean;
  labelWidth?: string | number;
  requiredMark?: RequiredMark;
  size?: SizeType;
  column?: number;
  screens: Partial<Record<Breakpoint, boolean>>;
  itemRef: (name: (string | number)[]) => (node: React.ReactElement) => void;
  form?: FormInstance;
  feedbackIcons?: FeedbackIcons;
  autoLabelWidth?: number;
  registerLabelWidth?: (val: number, oldVal?: number) => void;
  deregisterLabelWidth?: (val: number) => void;
  className?: FormProps<any>['className'];
  errorPopover?: true | Omit<PopoverProps, 'content'>;
}

export const FormContext = React.createContext<FormContextProps>({
  labelAlign: 'right',
  layout: 'horizontal',
  itemRef: (() => {}) as any,
  screens: {},
});

/** `noStyle` Form Item Context. Used for error collection */
export type ReportMetaChange = (meta: Meta, uniqueKeys: React.Key[]) => void;
export const NoStyleItemContext = React.createContext<ReportMetaChange | null>(null);

/** Form Provider */
export interface FormProviderProps extends Omit<RcFormProviderProps, 'validateMessages'> {
  prefixCls?: string;
}

export const FormProvider: React.FC<FormProviderProps> = (props) => {
  const providerProps = omit(props, ['prefixCls']);
  return <RcFormProvider {...providerProps} />;
};

/** Used for ErrorList only */
export interface FormItemPrefixContextProps {
  prefixCls: string;
  status?: ValidateStatus;
}

export const FormItemPrefixContext = React.createContext<FormItemPrefixContextProps>({
  prefixCls: '',
});

export interface FormItemStatusContextProps {
  isFormItemInput?: boolean;
  status?: ValidateStatus;
  errors?: React.ReactNode[];
  warnings?: React.ReactNode[];
  hasFeedback?: boolean;
  feedbackIcon?: ReactNode;
}

export const FormItemInputContext = React.createContext<FormItemStatusContextProps>({});

if (process.env.NODE_ENV !== 'production') {
  FormItemInputContext.displayName = 'FormItemInputContext';
}

export type NoFormStyleProps = PropsWithChildren<{
  status?: boolean;
  override?: boolean;
}>;

export const NoFormStyle: React.FC<NoFormStyleProps> = ({ children, status, override }) => {
  const formItemInputContext = useContext(FormItemInputContext);

  const newFormItemInputContext = useMemo(() => {
    const newContext = { ...formItemInputContext };
    if (override) {
      delete newContext.isFormItemInput;
    }
    if (status) {
      delete newContext.status;
      delete newContext.hasFeedback;
      delete newContext.feedbackIcon;
    }
    return newContext;
  }, [status, override, formItemInputContext]);

  return (
    <FormItemInputContext.Provider value={newFormItemInputContext}>
      {children}
    </FormItemInputContext.Provider>
  );
};

export const VariantContext = createContext<Variant | undefined>(undefined);
