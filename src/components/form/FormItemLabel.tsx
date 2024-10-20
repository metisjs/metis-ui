import * as React from 'react';
import { QuestionMarkCircleOutline } from '@metisjs/icons';
import { useGetState } from 'ahooks';
import type { ResizeObserverProps } from 'rc-resize-observer';
import ResizeObserver from 'rc-resize-observer';
import { clsx } from '../_util/classNameUtils';
import { useLocale } from '../locale';
import defaultLocale from '../locale/en_US';
import type { TooltipProps } from '../tooltip';
import Tooltip from '../tooltip';
import type { FormContextProps } from './context';
import { FormContext } from './context';
import type { FormLayout, RequiredMark } from './Form';
import type { FormLabelAlign } from './interface';

export type WrapperTooltipProps = TooltipProps & {
  icon?: React.ReactElement;
};

export type LabelTooltipType = WrapperTooltipProps | React.ReactNode;

function toTooltipProps(tooltip: LabelTooltipType): WrapperTooltipProps | null {
  if (!tooltip) {
    return null;
  }

  if (typeof tooltip === 'object' && !React.isValidElement(tooltip)) {
    return tooltip as WrapperTooltipProps;
  }

  return {
    title: tooltip,
  };
}

export interface FormItemLabelProps {
  colon?: boolean;
  htmlFor?: string;
  label?: React.ReactNode;
  labelAlign?: FormLabelAlign;
  labelWidth?: string | number;
  /**
   * @internal Used for pass `requiredMark` from `<Form />`
   */
  requiredMark?: RequiredMark;
  tooltip?: LabelTooltipType;
  layout: FormLayout;
}

const FormItemLabel: React.FC<FormItemLabelProps & { required?: boolean; prefixCls: string }> = ({
  prefixCls,
  label,
  htmlFor,
  labelWidth,
  labelAlign,
  colon,
  required,
  requiredMark,
  tooltip,
  layout,
}) => {
  const [formLocale] = useLocale('Form');

  const {
    labelAlign: contextLabelAlign,
    labelWidth: contextLabelWidth,
    labelWrap,
    colon: contextColon,
    size,
    autoLabelWidth,
    registerLabelWidth,
    deregisterLabelWidth,
  } = React.useContext<FormContextProps>(FormContext);

  const [plainLabelWidth, setPlainLabelWidth, getPlainLabelWidth] = useGetState<number>();
  const labelRef = React.useRef<HTMLLabelElement>(null);

  const mergedLabelWidth = labelWidth ?? contextLabelWidth;
  const isAutoWidth = mergedLabelWidth === 'auto' && layout === 'horizontal';

  React.useLayoutEffect(() => {
    if (isAutoWidth) {
      const width = Math.ceil(Number.parseFloat(getComputedStyle(labelRef.current!).width));
      registerLabelWidth?.(width);
      setPlainLabelWidth(width);
    }
    return () => {
      const width = getPlainLabelWidth();
      if (isAutoWidth && width) {
        deregisterLabelWidth?.(width);
      }
    };
  }, [isAutoWidth]);

  if (!label && (layout !== 'horizontal' || !mergedLabelWidth)) {
    return null;
  }

  const mergedLabelAlign: FormLabelAlign | undefined = labelAlign || contextLabelAlign || 'right';

  let labelChildren: React.ReactNode = label;

  // Keep label is original where there should have no colon
  const computedColon = colon === true || (contextColon !== false && colon !== false);
  const haveColon = computedColon && layout !== 'vertical';

  // Remove duplicated user input colon
  if (haveColon && typeof label === 'string' && label.trim()) {
    labelChildren = label.replace(/[:|：]\s*$/, '');
  }

  const isOptionalMark = requiredMark === 'optional';
  const isRenderMark = typeof requiredMark === 'function';

  // =============================== Style ===============================
  const labelWrapperCls = clsx(
    `${prefixCls}-item-label`,
    mergedLabelAlign === 'left' && `${prefixCls}-item-label-left`,
    {
      [`${prefixCls}-item-label-wrap`]: !!labelWrap,
    },
    'overflow-hidden whitespace-nowrap text-right',
    {
      'text-left': mergedLabelAlign === 'left',
      'pb-2 text-left': layout === 'vertical',
      'overflow-visible whitespace-normal': labelWrap,
    },
  );
  const labelCls = clsx(
    {
      [`${prefixCls}-item-required`]: required,
      [`${prefixCls}-item-required-mark-optional`]: isOptionalMark || isRenderMark,
      [`${prefixCls}-item-no-colon`]: !computedColon,
    },
    'relative inline-flex h-9 max-w-full items-center text-sm font-medium text-text',
    label && [
      'after:relative after:me-2.5 after:ms-0.5 after:content-[":"]',
      {
        'after:content-["\\a0"]': !computedColon,
        'before:me-1 before:inline-block before:leading-[1] before:text-error before:content-["*"]':
          required && !isOptionalMark && !isRenderMark && requiredMark !== false,
        'after:hidden': layout === 'vertical',
      },
    ],
    {
      'h-7': size === 'mini',
      'h-8': size === 'small',
      'h-10': size === 'large',
    },
    {
      'h-auto': layout === 'vertical',
    },
  );

  const optionalCls = clsx(`${prefixCls}-item-optional`, 'font-normal text-text-tertiary');

  const tooltipCls = clsx(
    `${prefixCls}-item-tooltip`,
    'ml-1 h-4 w-4 cursor-help text-text-tertiary',
  );

  // ============================== Tooltip ==============================
  const tooltipProps = toTooltipProps(tooltip);

  if (tooltipProps) {
    const { icon = <QuestionMarkCircleOutline />, ...restTooltipProps } = tooltipProps;
    const tooltipNode: React.ReactNode = (
      <Tooltip {...restTooltipProps}>
        {React.cloneElement(icon, {
          className: tooltipCls,
          title: '',
          onClick: (e: React.MouseEvent) => {
            // Prevent label behavior in tooltip icon
            e.preventDefault();
          },
          tabIndex: null,
        })}
      </Tooltip>
    );

    labelChildren = (
      <>
        {labelChildren}
        {tooltipNode}
      </>
    );
  }

  // ========================== Required Mark ============================
  if (isRenderMark) {
    labelChildren = requiredMark(labelChildren, { required: !!required });
  } else if (isOptionalMark && !required) {
    labelChildren = (
      <>
        {labelChildren}
        <span className={optionalCls} title="">
          {formLocale?.optional || defaultLocale.Form?.optional}
        </span>
      </>
    );
  }

  // ============================= AutoWidth ==============================
  const onResize: ResizeObserverProps['onResize'] = (info) => {
    const width = Math.ceil(info.offsetWidth);
    if (isAutoWidth && width && width !== plainLabelWidth) {
      registerLabelWidth?.(info.offsetWidth, plainLabelWidth);
      setPlainLabelWidth(info.offsetWidth);
    }
  };

  const style: React.CSSProperties = {};
  if (isAutoWidth && autoLabelWidth) {
    const marginWidth = Math.max(0, autoLabelWidth - (plainLabelWidth ?? 0));

    const marginPosition = mergedLabelAlign === 'left' ? 'marginRight' : 'marginLeft';

    if (marginWidth) {
      style[marginPosition] = `${marginWidth}px`;
    }
  } else if (mergedLabelWidth) {
    style.width = mergedLabelWidth;
  }

  // =============================== Render ===============================
  return (
    <div className={labelWrapperCls} style={style}>
      <ResizeObserver onResize={onResize}>
        <label
          ref={labelRef}
          htmlFor={htmlFor}
          className={labelCls}
          title={typeof label === 'string' ? label : ''}
        >
          {labelChildren}
        </label>
      </ResizeObserver>
    </div>
  );
};

export default FormItemLabel;
