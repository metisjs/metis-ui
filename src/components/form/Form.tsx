import * as React from 'react';
import { useMemo } from 'react';
import type { SemanticClassName } from '@util/classNameUtils';
import { clsx } from '@util/classNameUtils';
import useBreakpoint from '@util/hooks/useBreakpoint';
import useSemanticCls, { clsxDependency } from '@util/hooks/useSemanticCls';
import { matchScreen, type Breakpoint } from '@util/responsiveObserver';
import toArray from '@util/toArray';
import type { AnyObject } from '@util/type';
import FieldForm, { List, useWatch } from 'rc-field-form';
import type { FormProps as RcFormProps } from 'rc-field-form/lib/Form';
import type { FormRef, InternalNamePath, ValidateErrorEntity } from 'rc-field-form/lib/interface';
import type { Options } from 'scroll-into-view-if-needed';
import type { Variant } from '../config-provider';
import { ConfigContext } from '../config-provider';
import DisabledContext, { DisabledContextProvider } from '../config-provider/DisabledContext';
import useSize from '../config-provider/hooks/useSize';
import type { SizeType } from '../config-provider/SizeContext';
import SizeContext from '../config-provider/SizeContext';
import type { PopoverProps } from '../popover';
import type { FormContextProps } from './context';
import { FormContext, FormProvider, VariantContext } from './context';
import FieldComponent from './Field';
import type { FeedbackIcons, FormItemProps } from './FormItem';
import FormItem from './FormItem';
import type { FormInstance } from './hooks/useForm';
import useForm from './hooks/useForm';
import useFormLabelWidth from './hooks/useFormLabelWidth';
import useFormWarning from './hooks/useFormWarning';
import type { FormItemConfig, FormLabelAlign } from './interface';
import ValidateMessagesContext from './validateMessagesContext';

export type RequiredMark =
  | boolean
  | 'optional'
  | ((labelNode: React.ReactNode, info: { required: boolean }) => React.ReactNode);
export type FormLayout = 'horizontal' | 'inline' | 'vertical';
export type FormItemLayout = 'horizontal' | 'vertical';

export interface FormProps<Values = any> extends Omit<RcFormProps<Values>, 'form' | 'className'> {
  prefixCls?: string;
  className?: SemanticClassName<{ root?: string; item?: FormItemProps['className'] }>;
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
  errorPopover?: true | Omit<PopoverProps, 'content'>;
  items?: FormItemConfig<Values>[];
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
    errorPopover,
    items,
    children,
    ...restFormProps
  } = props;

  const mergedSize = useSize(size);

  const contextValidateMessages = React.useContext(ValidateMessagesContext);

  const { autoLabelWidth, registerLabelWidth, deregisterLabelWidth } = useFormLabelWidth();

  const needResponsive =
    Object.keys(column || {}).some((key) => ['xs', 'sm', 'md', 'lg', 'xl', '2xl'].includes(key)) &&
    layout !== 'inline';
  const screens = useBreakpoint(needResponsive);
  const mergedColumn = React.useMemo(() => {
    if (layout === 'inline') {
      return undefined;
    }
    if (typeof column === 'number') {
      return column;
    }

    return matchScreen(screens, column);
  }, [layout, screens, column]);

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

  const semanticCls = useSemanticCls(className, 'form');

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
      errorPopover,
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
      clsxDependency(className),
      errorPopover,
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

  const child = useMemo(() => {
    if (children) return children;

    return items?.map(({ key, valueType, valueEnum, fieldProps, fieldRender, ...rest }, index) => (
      <FormItem key={key ?? rest.id ?? rest.name ?? index} {...rest}>
        <FieldComponent
          mode="edit"
          valueType={valueType}
          valueEnum={valueEnum}
          fieldKey={String(key) ?? rest.id ?? toArray(rest.name).join('.')}
          editorProps={fieldProps as AnyObject}
          renderEditor={fieldRender ? () => fieldRender(wrapForm) : undefined}
        />
      </FormItem>
    ));
  }, [items, children]);

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
              >
                {child}
              </FieldForm>
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
