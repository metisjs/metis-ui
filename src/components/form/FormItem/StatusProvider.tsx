import * as React from 'react';
import {
  CheckCircleSolid,
  ExclamationCircleSolid,
  LoadingOutline,
  XCircleSolid,
} from '@metisjs/icons';
import type { Meta } from 'rc-field-form/lib/interface';
import type { FeedbackIcons, ValidateStatus } from '.';
import { clsx } from '../../_util/classNameUtils';
import type { FormItemStatusContextProps } from '../context';
import { FormContext, FormItemInputContext } from '../context';
import { getStatus } from '../util';

const iconMap = {
  success: <CheckCircleSolid className="text-success" />,
  warning: <ExclamationCircleSolid className="text-warning" />,
  error: <XCircleSolid className="text-error" />,
  validating: <LoadingOutline className="animate-spin text-primary" />,
};

export interface StatusProviderProps {
  children?: React.ReactNode;
  validateStatus?: ValidateStatus;
  prefixCls: string;
  meta: Meta;
  errors: React.ReactNode[];
  warnings: React.ReactNode[];
  hasFeedback?: boolean | { icons?: FeedbackIcons };
  noStyle?: boolean;
}

export default function StatusProvider({
  children,
  errors,
  warnings,
  hasFeedback,
  validateStatus,
  prefixCls,
  meta,
  noStyle,
}: StatusProviderProps) {
  const itemPrefixCls = `${prefixCls}-item`;
  const { feedbackIcons } = React.useContext(FormContext);

  const mergedValidateStatus = getStatus(
    errors,
    warnings,
    meta,
    null,
    !!hasFeedback,
    validateStatus,
  );

  const {
    isFormItemInput: parentIsFormItemInput,
    status: parentStatus,
    hasFeedback: parentHasFeedback,
    feedbackIcon: parentFeedbackIcon,
  } = React.useContext(FormItemInputContext);

  // ====================== Context =======================
  const formItemStatusContext = React.useMemo<FormItemStatusContextProps>(() => {
    let feedbackIcon: React.ReactNode;
    if (hasFeedback) {
      const customIcons = (hasFeedback !== true && hasFeedback.icons) || feedbackIcons;
      const customIconNode =
        mergedValidateStatus &&
        customIcons?.({ status: mergedValidateStatus, errors, warnings })?.[mergedValidateStatus];
      const iconNode = mergedValidateStatus && iconMap[mergedValidateStatus];
      feedbackIcon =
        customIconNode !== false && iconNode ? (
          <span
            className={clsx(
              `${itemPrefixCls}-feedback-icon`,
              `${itemPrefixCls}-feedback-icon-${mergedValidateStatus}`,
              'inline-flex items-center',
              {
                'text-success': mergedValidateStatus === 'success',
                'text-warning': mergedValidateStatus === 'warning',
                'text-error': mergedValidateStatus === 'error',
                'text-primary': mergedValidateStatus === 'validating',
              },
            )}
          >
            {customIconNode || iconNode}
          </span>
        ) : null;
    }

    const context: FormItemStatusContextProps = {
      status: mergedValidateStatus || '',
      errors,
      warnings,
      hasFeedback: !!hasFeedback,
      feedbackIcon,
      isFormItemInput: true,
    };

    // No style will follow parent context
    if (noStyle) {
      context.status = (mergedValidateStatus ?? parentStatus) || '';
      context.isFormItemInput = parentIsFormItemInput;
      context.hasFeedback = !!(hasFeedback ?? parentHasFeedback);
      context.feedbackIcon = hasFeedback !== undefined ? context.feedbackIcon : parentFeedbackIcon;
    }

    return context;
  }, [mergedValidateStatus, hasFeedback, noStyle, parentIsFormItemInput, parentStatus]);

  // ======================= Render =======================
  return (
    <FormItemInputContext.Provider value={formItemStatusContext}>
      {children}
    </FormItemInputContext.Provider>
  );
}
