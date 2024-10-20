import * as React from 'react';
import { useMemo } from 'react';
import FieldForm, { List, useWatch } from 'rc-field-form';
import type { FormProps as RcFormProps } from 'rc-field-form/lib/Form';
import type { FormRef, InternalNamePath, ValidateErrorEntity } from 'rc-field-form/lib/interface';
import type { Options } from 'scroll-into-view-if-needed';
import type { SemanticClassName } from '../_util/classNameUtils';
import { clsx, getSemanticCls } from '../_util/classNameUtils';
import useBreakpoint from '../_util/hooks/useBreakpoint';
import { matchScreen, type Breakpoint } from '../_util/responsiveObserver';
import { ConfigContext } from '../config-provider';
import type { Variant } from '../config-provider';
import DisabledContext, { DisabledContextProvider } from '../config-provider/DisabledContext';
import useSize from '../config-provider/hooks/useSize';
import type { SizeType } from '../config-provider/SizeContext';
import SizeContext from '../config-provider/SizeContext';
import type { FormContextProps } from './context';
import { FormContext, FormProvider, VariantContext } from './context';
import type { FeedbackIcons, FormItemProps } from './FormItem';
import useForm from './hooks/useForm';
import type { FormInstance } from './hooks/useForm';
import useFormLabelWidth from './hooks/useFormLabelWidth';
import useFormWarning from './hooks/useFormWarning';
import type { FormLabelAlign } from './interface';
import ValidateMessagesContext from './validateMessagesContext';

export type RequiredMark =
  | boolean
  | 'optional'
  | ((labelNode: React.ReactNode, info: { required: boolean }) => React.ReactNode);
export type FormLayout = 'horizontal' | 'inline' | 'vertical';
export type FormItemLayout = 'horizontal' | 'vertical';

export interface FormProps<Values = any> extends Omit<RcFormProps<Values>, 'form' | 'className'> {
  prefixCls?: string;
  className?: SemanticClassName<'', void, { item: FormItemProps['className'] }>;
  colon?: boolean;
  name?: string;
  layout?: FormLayout;
  labelAlign?: FormLabelAlign;
  labelWrap?: boolean;
  labelWidth?: number | string;
  form?: FormInstance<Values>;
  feedbackIcons?: FeedbackIcons;
  size?: SizeType;
  disabled?: boolean;
  scrollToFirstError?: Options | boolean;
  requiredMark?: RequiredMark;
  variant?: Variant;
  column?: number | Partial<Record<Breakpoint, number>>;
}

const InternalForm: React.ForwardRefRenderFunction<FormRef, FormProps> = (props, ref) => {
  const contextDisabled = React.useContext(DisabledContext);
  const { getPrefixCls, form: contextForm } = React.useContext(ConfigContext);

  const {
    prefixCls: customizePrefixCls,
    className,
    size,
    disabled = contextDisabled,
    form,
    colon,
    labelAlign,
    labelWrap,
    labelWidth = 'auto',
    layout = 'horizontal',
    scrollToFirstError,
    requiredMark,
    onFinishFailed,
    name,
    style,
    feedbackIcons,
    variant,
    column,
    ...restFormProps
  } = props;

  const mergedSize = useSize(size);

  const contextValidateMessages = React.useContext(ValidateMessagesContext);

  const { autoLabelWidth, registerLabelWidth, deregisterLabelWidth } = useFormLabelWidth();

  const screens = useBreakpoint();
  const mergedColumn = React.useMemo(() => {
    if (typeof column === 'number') {
      return column;
    }

    return matchScreen(screens, column);
  }, [screens, column]);

  if (process.env.NODE_ENV !== 'production') {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useFormWarning(props);
  }

  const mergedRequiredMark = useMemo(() => {
    if (requiredMark !== undefined) {
      return requiredMark;
    }

    if (contextForm && contextForm.requiredMark !== undefined) {
      return contextForm.requiredMark;
    }

    return true;
  }, [requiredMark, contextForm]);

  const mergedColon = colon ?? contextForm?.colon;

  const prefixCls = getPrefixCls('form', customizePrefixCls);

  const semanticCls = getSemanticCls(className);

  const rootCls = clsx(
    prefixCls,
    `${prefixCls}-${layout}`,
    {
      [`${prefixCls}-hide-required-mark`]: mergedRequiredMark === false,
      [`${prefixCls}-${mergedSize}`]: mergedSize,
    },
    'text-sm text-text',
    {
      'flex flex-wrap gap-x-6': layout === 'inline',
      'grid gap-x-6': mergedColumn,
    },
    semanticCls.root,
  );
  const mergedStyle = {
    ...(!!mergedColumn && {
      gridTemplateColumns: `repeat(${mergedColumn}, minmax(0, 1fr))`,
    }),
    ...style,
  };

  const [wrapForm] = useForm(form);
  const { __INTERNAL__ } = wrapForm;
  __INTERNAL__.name = name;

  const formContextValue = useMemo<FormContextProps>(
    () => ({
      name,
      labelAlign,
      labelWidth,
      labelWrap,
      layout,
      colon: mergedColon,
      requiredMark: mergedRequiredMark,
      size: mergedSize,
      itemRef: __INTERNAL__.itemRef,
      form: wrapForm,
      feedbackIcons,
      column: mergedColumn,
      screens,
      autoLabelWidth,
      registerLabelWidth,
      deregisterLabelWidth,
      className,
    }),
    [
      name,
      labelAlign,
      labelWidth,
      layout,
      mergedColon,
      mergedRequiredMark,
      mergedSize,
      wrapForm,
      mergedColumn,
      screens,
      feedbackIcons,
      autoLabelWidth,
      registerLabelWidth,
      deregisterLabelWidth,
      JSON.stringify(className),
    ],
  );

  const nativeElementRef = React.useRef<FormRef>(null);
  React.useImperativeHandle(ref, () => ({
    ...wrapForm,
    nativeElement: nativeElementRef.current?.nativeElement,
  }));

  const scrollToField = (options: boolean | Options, fieldName: InternalNamePath) => {
    if (options) {
      let defaultScrollToFirstError: Options = { block: 'nearest' };
      if (typeof options === 'object') {
        defaultScrollToFirstError = options;
      }
      wrapForm.scrollToField(fieldName, defaultScrollToFirstError);
    }
  };

  const onInternalFinishFailed = (errorInfo: ValidateErrorEntity) => {
    onFinishFailed?.(errorInfo);
    if (errorInfo.errorFields.length) {
      const fieldName = errorInfo.errorFields[0].name;
      if (scrollToFirstError !== undefined) {
        scrollToField(scrollToFirstError, fieldName);
        return;
      }

      if (contextForm && contextForm.scrollToFirstError !== undefined) {
        scrollToField(contextForm.scrollToFirstError, fieldName);
      }
    }
  };

  return (
    <VariantContext.Provider value={variant}>
      <DisabledContextProvider disabled={disabled}>
        <SizeContext.Provider value={mergedSize}>
          <FormProvider
            {...{
              // This is not list in API, we pass with spread
              validateMessages: contextValidateMessages,
            }}
          >
            <FormContext.Provider value={formContextValue}>
              <FieldForm
                id={name}
                {...restFormProps}
                name={name}
                onFinishFailed={onInternalFinishFailed}
                form={wrapForm}
                ref={nativeElementRef}
                style={mergedStyle}
                className={rootCls}
              />
            </FormContext.Provider>
          </FormProvider>
        </SizeContext.Provider>
      </DisabledContextProvider>
    </VariantContext.Provider>
  );
};

const Form = React.forwardRef<FormRef, FormProps>(InternalForm) as (<Values = any>(
  props: React.PropsWithChildren<FormProps<Values>> & React.RefAttributes<FormRef<Values>>,
) => React.ReactElement) &
  Pick<React.FC, 'displayName'>;

if (process.env.NODE_ENV !== 'production') {
  Form.displayName = 'Form';
}

export { List, useForm, useWatch, type FormInstance };

export default Form;
