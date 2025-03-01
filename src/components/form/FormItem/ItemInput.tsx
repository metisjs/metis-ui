import * as React from 'react';
import { clsx } from '@util/classNameUtils';
import omit from 'rc-util/lib/omit';
import type { ValidateStatus } from '.';
import { FormContext, FormItemPrefixContext } from '../context';
import ErrorList from '../ErrorList';
import ItemErrorPopover from './ItemErrorPopover';

interface ItemInputMiscProps {
  prefixCls: string;
  className?: string;
  children: React.ReactNode;
  errors: React.ReactNode[];
  warnings: React.ReactNode[];
  marginBottom?: number | null;
  onErrorVisibleChanged?: (visible: boolean) => void;
}

export interface ItemInputProps {
  extra?: React.ReactNode;
  status?: ValidateStatus;
  help?: React.ReactNode;
  fieldId?: string;
}

const ItemInput: React.FC<ItemInputProps & ItemInputMiscProps> = (props) => {
  const {
    prefixCls,
    className,
    status,
    children,
    errors,
    warnings,
    extra,
    help,
    fieldId,
    marginBottom,
    onErrorVisibleChanged,
  } = props;
  const formContext = React.useContext(FormContext);

  const rootCls = clsx(`${prefixCls}-item-control`, 'flex flex-1 flex-col', className);
  const inputCls = clsx(`${prefixCls}-item-control-input`, 'relative flex min-h-9 items-center', {
    'min-h-7': formContext.size === 'mini',
    'min-h-8': formContext.size === 'small',
    'min-h-10': formContext.size === 'large',
  });
  const inputContentCls = clsx(`${prefixCls}-item-control-input-content`, 'max-w-full flex-auto');
  const errorListCls = clsx(`${prefixCls}-item-explain-connected`, 'w-full', {
    'text-sm': formContext.errorPopover,
  });
  const extraCls = clsx(`${prefixCls}-item-extra`, 'text-text-tertiary');

  // Pass to sub FormItem should not with width info
  const subFormContext = React.useMemo(
    () => ({
      ...omit(formContext, [
        'errorPopover',
        'autoLabelWidth',
        'labelWidth',
        'registerLabelWidth',
        'deregisterLabelWidth',
      ]),
    }),
    [formContext],
  );

  const inputDom: React.ReactNode = (
    <div className={inputCls}>
      <div className={inputContentCls}>{children}</div>
    </div>
  );
  const formItemContext = React.useMemo(() => ({ prefixCls, status }), [prefixCls, status]);
  const errorListDom: React.ReactNode =
    marginBottom !== null || errors.length || warnings.length ? (
      <div className="flex flex-nowrap">
        <FormItemPrefixContext.Provider value={formItemContext}>
          <ErrorList
            fieldId={fieldId}
            errors={errors}
            warnings={warnings}
            help={help}
            helpStatus={status}
            className={errorListCls}
            onVisibleChanged={onErrorVisibleChanged}
          />
        </FormItemPrefixContext.Provider>
        {!!marginBottom && <div style={{ width: 0, height: marginBottom }} />}
      </div>
    ) : null;

  const extraProps: { id?: string } = {};

  if (fieldId) {
    extraProps.id = `${fieldId}_extra`;
  }

  // If extra = 0, && will goes wrong
  // 0&&error -> 0
  const extraDom: React.ReactNode = extra ? (
    <div {...extraProps} className={extraCls}>
      {extra}
    </div>
  ) : null;

  const dom: React.ReactNode = formContext.errorPopover ? (
    <ItemErrorPopover
      inputProps={props}
      popoverProps={formContext.errorPopover === true ? {} : formContext.errorPopover}
      input={inputDom}
      errorList={errorListDom}
      extra={extraDom}
    />
  ) : (
    <>
      {inputDom}
      {errorListDom}
      {extraDom}
      {!!marginBottom && (
        <div
          style={{
            marginBottom: -marginBottom,
          }}
        />
      )}
    </>
  );

  return (
    <FormContext.Provider value={subFormContext}>
      <div className={rootCls}>{dom}</div>
    </FormContext.Provider>
  );
};

export default ItemInput;
