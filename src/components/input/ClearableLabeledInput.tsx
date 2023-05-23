import { XCircleSolid } from '@metaoa/icons';
import * as React from 'react';
import { clsx } from '../_util/classNameUtils';
import { cloneElement } from '../_util/reactNode';
import type { InputStatus } from '../_util/statusUtils';
import { getMergedStatus, getStatusClassNames } from '../_util/statusUtils';
import { tuple } from '../_util/type';
import type { SizeType } from '../config-provider/SizeContext';
import type { FormItemStatusContextProps } from '../form/context';
import { FormItemInputContext } from '../form/context';
import type { InputProps } from './Input';

const ClearableInputType = tuple('text', 'input');

function hasAddon(props: InputProps | ClearableInputProps) {
  return !!(props.addonBefore || props.addonAfter);
}

/** This basic props required for input and textarea. */
interface BasicProps {
  inputType: (typeof ClearableInputType)[number];
  value?: any;
  allowClear?: boolean;
  element: React.ReactElement;
  handleReset: (event: React.MouseEvent<HTMLElement, MouseEvent>) => void;
  className?: string;
  style?: React.CSSProperties;
  disabled?: boolean;
  focused?: boolean;
  readOnly?: boolean;
  bordered: boolean;
  hidden?: boolean;
}

/** This props only for input. */
export interface ClearableInputProps extends BasicProps {
  size?: SizeType;
  suffix?: React.ReactNode;
  prefix?: React.ReactNode;
  addonBefore?: React.ReactNode;
  addonAfter?: React.ReactNode;
  triggerFocus?: () => void;
  status?: InputStatus;
}

class ClearableLabeledInput extends React.Component<ClearableInputProps> {
  renderClearIcon() {
    const { value, disabled, readOnly, handleReset, suffix } = this.props;
    const needClear = !disabled && !readOnly && value;
    const className = `-clear-icon`;
    return (
      <span
        onClick={handleReset}
        onMouseDown={(e) => e.preventDefault()}
        className={clsx(
          {
            [`${className}-hidden`]: !needClear,
            [`${className}-has-suffix`]: !!suffix,
          },
          className,
        )}
        role="button"
      >
        <XCircleSolid />
      </span>
    );
  }

  renderTextAreaWithClearIcon(
    element: React.ReactElement,
    statusContext: FormItemStatusContextProps,
  ) {
    const {
      value,
      allowClear,
      className,
      focused,
      style,
      bordered,
      hidden,
      status: customStatus,
    } = this.props;

    const { status: contextStatus, hasFeedback } = statusContext;

    if (!allowClear) {
      return cloneElement(element, {
        value,
      });
    }
    const affixWrapperCls = clsx(
      `-affix-wrapper`,
      `-affix-wrapper-textarea-with-clear-btn`,
      getStatusClassNames(getMergedStatus(contextStatus, customStatus), hasFeedback),
      {
        [`-affix-wrapper-focused`]: focused,
        [`-affix-wrapper-borderless`]: !bordered,
        // className will go to addon wrapper
        [`${className}`]: !hasAddon(this.props) && className,
      },
    );
    return (
      <span className={affixWrapperCls} style={style} hidden={hidden}>
        {cloneElement(element, {
          style: null,
          value,
        })}
        {this.renderClearIcon()}
      </span>
    );
  }

  render() {
    return (
      <FormItemInputContext.Consumer>
        {(statusContext) => {
          const { inputType, element } = this.props;
          if (inputType === ClearableInputType[0]) {
            return this.renderTextAreaWithClearIcon(element, statusContext);
          }
        }}
      </FormItemInputContext.Consumer>
    );
  }
}

export default ClearableLabeledInput;
