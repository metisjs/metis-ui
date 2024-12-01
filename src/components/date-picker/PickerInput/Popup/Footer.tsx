import * as React from 'react';
import { clsx } from '@util/classNameUtils';
import type { PopupShowTimeConfig } from '.';
import Button from '../../../button';
import useTimeInfo from '../../hooks/useTimeInfo';
import type {
  DisabledDate,
  GenerateConfig,
  InternalMode,
  PanelMode,
  SharedPickerProps,
} from '../../interface';
import PickerContext from '../context';

export interface FooterProps<DateType extends object = any> {
  className?: string;
  mode: PanelMode;
  internalMode: InternalMode;
  renderExtraFooter?: SharedPickerProps['renderExtraFooter'];
  showNow: boolean;
  generateConfig: GenerateConfig<DateType>;
  disabledDate: DisabledDate<DateType>;
  showTime?: PopupShowTimeConfig<DateType>;

  // Invalid
  /** From Footer component used only. Check if can OK button click */
  invalid?: boolean;

  // Submit
  onSubmit: (date?: DateType) => void;
  needConfirm: boolean;

  // Now
  onNow: (now: DateType) => void;
}

export default function Footer(props: FooterProps) {
  const {
    className,
    mode,
    internalMode,
    renderExtraFooter,
    showNow,
    showTime,
    onSubmit,
    onNow,
    invalid,
    needConfirm,
    generateConfig,
    disabledDate,
  } = props;

  const { prefixCls, locale } = React.useContext(PickerContext);

  // >>> Now
  const now = generateConfig.getNow();

  const [getValidTime] = useTimeInfo(generateConfig, showTime, now);

  // ======================== Extra =========================
  const extraNode = renderExtraFooter?.(mode);

  // ======================== Ranges ========================
  const nowDisabled = disabledDate(now, {
    type: mode,
  });

  const onInternalNow = () => {
    if (!nowDisabled) {
      const validateNow = getValidTime(now);
      onNow(validateNow);
    }
  };

  // ======================== Style ========================
  const nowPrefixCls = `${prefixCls}-now`;
  const nowBtnPrefixCls = `${nowPrefixCls}-btn`;

  const footerCls = clsx(`${prefixCls}-footer`, 'border-t border-border-secondary', className);
  const extraCls = clsx(
    `${prefixCls}-footer-extra`,
    'border-b border-border-secondary px-3 text-start leading-10 last:border-b-0',
  );
  const rangesCls = clsx(
    `${prefixCls}-ranges`,
    'flex items-center justify-center overflow-hidden px-3 leading-10',
  );

  const presetNode = showNow && (
    <li className={nowPrefixCls}>
      <a
        className={clsx(nowBtnPrefixCls, nowDisabled && `${nowBtnPrefixCls}-disabled`, {
          'cursor-pointer': !nowDisabled,
          'pointer-events-none cursor-not-allowed opacity-disabled': nowDisabled,
        })}
        aria-disabled={nowDisabled}
        onClick={onInternalNow}
      >
        {internalMode === 'date' ? locale.today : locale.now}
      </a>
    </li>
  );

  // >>> OK
  const okNode = needConfirm && (
    <li className={clsx(`${prefixCls}-ok`, 'ms-auto')}>
      <Button disabled={invalid} onClick={onSubmit} size="mini" type="primary">
        {locale.ok}
      </Button>
    </li>
  );

  const rangeNode = (presetNode || okNode) && (
    <ul className={rangesCls}>
      {presetNode}
      {okNode}
    </ul>
  );

  // ======================== Render ========================
  if (!extraNode && !rangeNode) {
    return null;
  }

  return (
    <div className={footerCls}>
      {extraNode && <div className={extraCls}>{extraNode}</div>}
      {rangeNode}
    </div>
  );
}
