import * as React from 'react';
import CheckCircleFilled from '@ant-design/icons/CheckCircleFilled';
import CloseCircleFilled from '@ant-design/icons/CloseCircleFilled';
import ExclamationCircleFilled from '@ant-design/icons/ExclamationCircleFilled';
import LoadingOutlined from '@ant-design/icons/LoadingOutlined';
import classNames from 'classnames';
import type { Metis } from 'rc-field-form/lib/interface';
import useLayoutEffect from 'rc-util/lib/hooks/useLayoutEffect';
import omit from 'rc-util/lib/omit';
import type { FormItemProps, ValidateStatus } from '.';
import { Row } from '../../grid';
import type { FormItemStatusContextProps, ReportMetisChange } from '../context';
import { FormContext, FormItemInputContext, NoStyleItemContext } from '../context';
import FormItemInput from '../FormItemInput';
import FormItemLabel from '../FormItemLabel';
import useDebounce from '../hooks/useDebounce';

const iconMap = {
  success: CheckCircleFilled,
  warning: ExclamationCircleFilled,
  error: CloseCircleFilled,
  validating: LoadingOutlined,
};

export interface ItemHolderProps extends FormItemProps {
  prefixCls: string;
  className?: string;
  style?: React.CSSProperties;
  errors: React.ReactNode[];
  warnings: React.ReactNode[];
  metis: Metis;
  children?: React.ReactNode;
  fieldId?: string;
  isRequired?: boolean;
  onSubItemMetisChange: ReportMetisChange;
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
    metis,
    hasFeedback,
    hidden,
    children,
    fieldId,
    isRequired,
    onSubItemMetisChange,
    ...restProps
  } = props;

  const itemPrefixCls = `${prefixCls}-item`;
  const { requiredMark } = React.useContext(FormContext);

  // ======================== Margin ========================
  const itemRef = React.useRef<HTMLDivElement>(null);
  const debounceErrors = useDebounce(errors);
  const debounceWarnings = useDebounce(warnings);
  const hasHelp = help !== undefined && help !== null;
  const hasError = !!(hasHelp || errors.length || warnings.length);
  const [marginBottom, setMarginBottom] = React.useState<number | null>(null);

  useLayoutEffect(() => {
    if (hasError && itemRef.current) {
      const itemStyle = getComputedStyle(itemRef.current);
      setMarginBottom(parseInt(itemStyle.marginBottom, 10));
    }
  }, [hasError]);

  const onErrorVisibleChanged = (nextVisible: boolean) => {
    if (!nextVisible) {
      setMarginBottom(null);
    }
  };

  // ======================== Status ========================
  let mergedValidateStatus: ValidateStatus = '';
  if (validateStatus !== undefined) {
    mergedValidateStatus = validateStatus;
  } else if (metis.validating) {
    mergedValidateStatus = 'validating';
  } else if (debounceErrors.length) {
    mergedValidateStatus = 'error';
  } else if (debounceWarnings.length) {
    mergedValidateStatus = 'warning';
  } else if (metis.touched) {
    mergedValidateStatus = 'success';
  }

  const formItemStatusContext = React.useMemo<FormItemStatusContextProps>(() => {
    let feedbackIcon: React.ReactNode;
    if (hasFeedback) {
      const IconNode = mergedValidateStatus && iconMap[mergedValidateStatus];
      feedbackIcon = IconNode ? (
        <span
          className={classNames(
            `${itemPrefixCls}-feedback-icon`,
            `${itemPrefixCls}-feedback-icon-${mergedValidateStatus}`,
          )}
        >
          <IconNode />
        </span>
      ) : null;
    }

    return {
      status: mergedValidateStatus,
      hasFeedback,
      feedbackIcon,
      isFormItemInput: true,
    };
  }, [mergedValidateStatus, hasFeedback]);

  // ======================== Render ========================
  const itemClassName = {
    [itemPrefixCls]: true,
    [`${itemPrefixCls}-with-help`]: hasHelp || debounceErrors.length || debounceWarnings.length,
    [`${className}`]: !!className,

    // Status
    [`${itemPrefixCls}-has-feedback`]: mergedValidateStatus && hasFeedback,
    [`${itemPrefixCls}-has-success`]: mergedValidateStatus === 'success',
    [`${itemPrefixCls}-has-warning`]: mergedValidateStatus === 'warning',
    [`${itemPrefixCls}-has-error`]: mergedValidateStatus === 'error',
    [`${itemPrefixCls}-is-validating`]: mergedValidateStatus === 'validating',
    [`${itemPrefixCls}-hidden`]: hidden,
  };

  return (
    <div className={classNames(itemClassName)} style={style} ref={itemRef}>
      <Row
        className={`${itemPrefixCls}-row`}
        {...omit(restProps, [
          '_internalItemRender' as any,
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
          'labelCol',
          'labelWrap',
          'messageVariables',
          'name',
          'normalize',
          'noStyle',
          'preserve',
          'required',
          'requiredMark',
          'rules',
          'shouldUpdate',
          'trigger',
          'tooltip',
          'validateFirst',
          'validateTrigger',
          'valuePropName',
          'wrapperCol',
        ])}
      >
        {/* Label */}
        <FormItemLabel
          htmlFor={fieldId}
          required={isRequired}
          requiredMark={requiredMark}
          {...props}
          prefixCls={prefixCls}
        />
        {/* Input Group */}
        <FormItemInput
          {...props}
          {...metis}
          errors={debounceErrors}
          warnings={debounceWarnings}
          prefixCls={prefixCls}
          status={mergedValidateStatus}
          help={help}
          marginBottom={marginBottom}
          onErrorVisibleChanged={onErrorVisibleChanged}
        >
          <NoStyleItemContext.Provider value={onSubItemMetisChange}>
            <FormItemInputContext.Provider value={formItemStatusContext}>
              {children}
            </FormItemInputContext.Provider>
          </NoStyleItemContext.Provider>
        </FormItemInput>
      </Row>

      {!!marginBottom && (
        <div
          className={`${itemPrefixCls}-margin-offset`}
          style={{
            marginBottom: -marginBottom,
          }}
        />
      )}
    </div>
  );
}
