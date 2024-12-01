import * as React from 'react';
import { clsx } from '@util/classNameUtils';
import { collapseTransition } from '@util/transition';
import Transition, { TransitionList } from '../transition';
import { FormItemPrefixContext } from './context';
import type { ValidateStatus } from './FormItem';
import useDebounce from './hooks/useDebounce';

const EMPTY_LIST: React.ReactNode[] = [];

interface ErrorEntity {
  error: React.ReactNode;
  errorStatus?: ValidateStatus;
  key: string;
}

function toErrorEntity(
  error: React.ReactNode,
  prefix: string,
  errorStatus?: ValidateStatus,
  index = 0,
): ErrorEntity {
  return {
    key: typeof error === 'string' ? error : `${prefix}-${index}`,
    error,
    errorStatus,
  };
}

export interface ErrorListProps {
  fieldId?: string;
  help?: React.ReactNode;
  helpStatus?: ValidateStatus;
  errors?: React.ReactNode[];
  warnings?: React.ReactNode[];
  className?: string;
  onVisibleChanged?: (visible: boolean) => void;
}

const ErrorList: React.FC<ErrorListProps> = ({
  help,
  helpStatus,
  errors = EMPTY_LIST,
  warnings = EMPTY_LIST,
  className: rootClassName,
  fieldId,
  onVisibleChanged,
}) => {
  const { prefixCls } = React.useContext(FormItemPrefixContext);

  const baseClassName = clsx(`${prefixCls}-item-explain`, 'h-auto text-xs text-text-tertiary');

  // We have to debounce here again since somewhere use ErrorList directly still need no shaking
  const debounceErrors = useDebounce(errors);
  const debounceWarnings = useDebounce(warnings);

  const fullKeyList = React.useMemo<ErrorEntity[]>(() => {
    if (help !== undefined && help !== null) {
      return [toErrorEntity(help, 'help', helpStatus)];
    }

    return [
      ...debounceErrors.map((error, index) => toErrorEntity(error, 'error', 'error', index)),
      ...debounceWarnings.map((warning, index) =>
        toErrorEntity(warning, 'warning', 'warning', index),
      ),
    ];
  }, [help, helpStatus, debounceErrors, debounceWarnings]);

  const helpProps: { id?: string } = {};

  if (fieldId) {
    helpProps.id = `${fieldId}_help`;
  }

  return (
    <Transition
      enter="transition-opacity"
      enterFrom="opacity-0"
      enterTo="opacity-100"
      leave="transition-opacity"
      leaveFrom="opacity-100"
      leaveTo="opacity-0"
      deadline={collapseTransition.deadline}
      visible={!!fullKeyList.length}
      onVisibleChanged={onVisibleChanged}
    >
      {({ className: holderClassName, style: holderStyle }) => {
        return (
          <div
            {...helpProps}
            className={clsx(baseClassName, holderClassName, rootClassName)}
            style={holderStyle}
            role="alert"
          >
            <TransitionList keys={fullKeyList} {...collapseTransition} component={false}>
              {(itemProps) => {
                const {
                  key,
                  error,
                  errorStatus,
                  className: itemClassName,
                  style: itemStyle,
                } = itemProps;

                return (
                  <div
                    key={key}
                    className={clsx(
                      itemClassName,
                      {
                        [`${prefixCls}-item-explain-${errorStatus}`]: errorStatus,
                      },
                      {
                        'text-error': errorStatus === 'error',
                        'text-warning': errorStatus === 'warning',
                      },
                    )}
                    style={itemStyle}
                  >
                    {error}
                  </div>
                );
              }}
            </TransitionList>
          </div>
        );
      }}
    </Transition>
  );
};

export default ErrorList;
