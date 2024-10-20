import * as React from 'react';
import type { Meta } from 'rc-field-form/lib/interface';
import isVisible from 'rc-util/lib/Dom/isVisible';
import useLayoutEffect from 'rc-util/lib/hooks/useLayoutEffect';
import omit from 'rc-util/lib/omit';
import type { FormItemProps } from '.';
import { clsx } from '../../_util/classNameUtils';
import type { ReportMetaChange } from '../context';
import { FormContext, NoStyleItemContext } from '../context';
import FormItemInput from '../FormItemInput';
import FormItemLabel from '../FormItemLabel';
import useDebounce from '../hooks/useDebounce';
import { getStatus } from '../util';
import StatusProvider from './StatusProvider';

export interface ItemHolderProps extends FormItemProps {
  prefixCls: string;
  className?: string;
  style?: React.CSSProperties;
  errors: React.ReactNode[];
  warnings: React.ReactNode[];
  meta: Meta;
  children?: React.ReactNode;
  fieldId?: string;
  isRequired?: boolean;
  onSubItemMetaChange: ReportMetaChange;
}

export default function ItemHolder(props: ItemHolderProps) {
  const {
    prefixCls,
    className,
    style,
    help,
    errors,
    warnings,
    validateStatus,
    meta,
    hasFeedback,
    hidden,
    children,
    fieldId,
    required,
    isRequired,
    onSubItemMetaChange,
    layout,
    ...restProps
  } = props;

  const itemPrefixCls = `${prefixCls}-item`;
  const { requiredMark, layout: formLayout } = React.useContext(FormContext);

  // ======================== Layout ========================
  const mergedLayout = layout ?? formLayout;

  // ======================== Margin ========================
  const itemRef = React.useRef<HTMLDivElement>(null);
  const debounceErrors = useDebounce(errors);
  const debounceWarnings = useDebounce(warnings);
  const hasHelp = help !== undefined && help !== null;
  const hasError = !!(hasHelp || errors.length || warnings.length);
  const isOnScreen = !!itemRef.current && isVisible(itemRef.current);
  const [marginBottom, setMarginBottom] = React.useState<number | null>(null);

  useLayoutEffect(() => {
    if (hasError && itemRef.current) {
      // The element must be part of the DOMTree to use getComputedStyle
      // https://stackoverflow.com/questions/35360711/getcomputedstyle-returns-a-cssstyledeclaration-but-all-properties-are-empty-on-a
      const itemStyle = getComputedStyle(itemRef.current);
      setMarginBottom(parseInt(itemStyle.marginBottom, 10));
    }
  }, [hasError, isOnScreen]);

  const onErrorVisibleChanged = (nextVisible: boolean) => {
    if (!nextVisible) {
      setMarginBottom(null);
    }
  };

  // ======================== Status ========================

  const getValidateState = (isDebounce = false) => {
    const _errors = isDebounce ? debounceErrors : meta.errors;
    const _warnings = isDebounce ? debounceWarnings : meta.warnings;

    return getStatus(_errors, _warnings, meta, '', !!hasFeedback, validateStatus);
  };

  const mergedValidateStatus = getValidateState();

  // ======================== Style ========================
  const itemCls = clsx(
    itemPrefixCls,
    {
      [`${itemPrefixCls}-with-help`]: hasHelp || debounceErrors.length || debounceWarnings.length,

      // Status
      [`${itemPrefixCls}-has-feedback`]: mergedValidateStatus && hasFeedback,
      [`${itemPrefixCls}-has-success`]: mergedValidateStatus === 'success',
      [`${itemPrefixCls}-has-warning`]: mergedValidateStatus === 'warning',
      [`${itemPrefixCls}-has-error`]: mergedValidateStatus === 'error',
      [`${itemPrefixCls}-is-validating`]: mergedValidateStatus === 'validating',
      [`${itemPrefixCls}-hidden`]: hidden,

      // Layout
      [`${itemPrefixCls}-${layout}`]: layout,
    },
    'mb-[1.125rem] flex',
    {
      'flex-col': mergedLayout === 'vertical',
      'inline-flex': mergedLayout === 'inline',
    },
    className,
  );

  // ======================== Render ========================

  return (
    <div
      className={itemCls}
      style={style}
      ref={itemRef}
      {...omit(restProps, [
        'colon',
        'dependencies',
        'extra',
        'fieldKey',
        'getValueFromEvent',
        'getValueProps',
        'htmlFor',
        'id', // It is deprecated because `htmlFor` is its replacement.
        'initialValue',
        'isListField',
        'label',
        'labelAlign',
        'messageVariables',
        'name',
        'normalize',
        'noStyle',
        'preserve',
        'rules',
        'shouldUpdate',
        'trigger',
        'tooltip',
        'validateFirst',
        'validateTrigger',
        'valuePropName',
        'validateDebounce',
      ])}
    >
      {/* Label */}
      <FormItemLabel
        htmlFor={fieldId}
        {...props}
        requiredMark={requiredMark}
        required={required ?? isRequired}
        prefixCls={prefixCls}
        layout={mergedLayout}
      />
      {/* Input Group */}
      <FormItemInput
        {...props}
        {...meta}
        errors={debounceErrors}
        warnings={debounceWarnings}
        prefixCls={prefixCls}
        status={mergedValidateStatus}
        help={help}
        marginBottom={marginBottom}
        onErrorVisibleChanged={onErrorVisibleChanged}
      >
        <NoStyleItemContext.Provider value={onSubItemMetaChange}>
          <StatusProvider
            prefixCls={prefixCls}
            meta={meta}
            errors={meta.errors}
            warnings={meta.warnings}
            hasFeedback={hasFeedback}
            // Already calculated
            validateStatus={mergedValidateStatus}
          >
            {children}
          </StatusProvider>
        </NoStyleItemContext.Provider>
      </FormItemInput>
    </div>
  );
}
