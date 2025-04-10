import * as React from 'react';
import isVisible from '@rc-component/util/es/Dom/isVisible';
import useLayoutEffect from '@rc-component/util/es/hooks/useLayoutEffect';
import omit from '@rc-component/util/es/omit';
import { clsx, getSemanticCls } from '@util/classNameUtils';
import useSemanticCls from '@util/hooks/useSemanticCls';
import { matchScreen } from '@util/responsiveObserver';
import type { Meta } from 'rc-field-form/lib/interface';
import type { FormItemProps } from '.';
import type { ReportMetaChange } from '../context';
import { FormContext, NoStyleItemContext } from '../context';
import useDebounce from '../hooks/useDebounce';
import { getStatus } from '../util';
import ItemInput from './ItemInput';
import ItemLabel from './ItemLabel';
import StatusProvider from './StatusProvider';

export interface ItemHolderProps extends FormItemProps {
  prefixCls: string;
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
    span = 1,
    ...restProps
  } = props;

  const itemPrefixCls = `${prefixCls}-item`;
  const {
    requiredMark,
    layout: formLayout,
    screens,
    className: formClassName,
  } = React.useContext(FormContext);

  // ======================== Layout ========================
  const mergedLayout = layout ?? formLayout;

  // ======================== Column span ========================
  const mergedSpan = React.useMemo(() => {
    if (typeof span === 'number') {
      return span;
    }

    return matchScreen(screens, span);
  }, [screens, span]);

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
  const semanticCls = useSemanticCls([getSemanticCls(formClassName).item, className]);

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
    semanticCls.root,
  );

  // ======================== Render ========================

  return (
    <div
      className={itemCls}
      style={{ ...(mergedSpan && { gridColumn: `span ${mergedSpan}` }), ...style }}
      ref={itemRef}
      {...omit(restProps, [
        'colon',
        'dependencies',
        'extra',
        'getValueFromEvent',
        'getValueProps',
        'htmlFor',
        'id', // It is deprecated because `htmlFor` is its replacement.
        'initialValue',
        'isListField',
        'label',
        'labelAlign',
        'labelWidth',
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
      <ItemLabel
        htmlFor={fieldId}
        {...props}
        requiredMark={requiredMark}
        required={required ?? isRequired}
        prefixCls={prefixCls}
        layout={mergedLayout}
        className={semanticCls.label}
      />
      {/* Input Group */}
      <ItemInput
        {...props}
        {...meta}
        errors={debounceErrors}
        warnings={debounceWarnings}
        prefixCls={prefixCls}
        status={mergedValidateStatus}
        help={help}
        marginBottom={marginBottom}
        onErrorVisibleChanged={onErrorVisibleChanged}
        className={semanticCls.field}
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
      </ItemInput>
    </div>
  );
}
