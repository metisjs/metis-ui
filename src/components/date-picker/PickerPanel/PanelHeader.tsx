import * as React from 'react';
import { clsx } from '../../_util/classNameUtils';
import { isSameOrAfter } from '../utils/dateUtil';
import { PickerHackContext, usePanelContext } from './context';

const HIDDEN_STYLE: React.CSSProperties = {
  visibility: 'hidden',
};

export interface HeaderProps<DateType extends object> {
  offset?: (distance: number, date: DateType) => DateType;
  superOffset?: (distance: number, date: DateType) => DateType;
  onChange?: (date: DateType) => void;

  // Limitation
  getStart?: (date: DateType) => DateType;
  getEnd?: (date: DateType) => DateType;

  children?: React.ReactNode;
}

function PanelHeader<DateType extends object>(props: HeaderProps<DateType>) {
  const {
    offset,
    superOffset,
    onChange,

    getStart,
    getEnd,

    children,
  } = props;

  const {
    prefixCls,

    // Icons
    prevIcon,
    nextIcon,
    superPrevIcon,
    superNextIcon,

    // Limitation
    minDate,
    maxDate,
    generateConfig,
    locale,
    pickerValue,
    panelType: type,
  } = usePanelContext<DateType>();

  const headerPrefixCls = `${prefixCls}-header`;

  const { hidePrev, hideNext, hideHeader } = React.useContext(PickerHackContext);

  // ======================= Limitation =======================
  const disabledOffsetPrev = React.useMemo(() => {
    if (!minDate || !offset || !getEnd) {
      return false;
    }

    const prevPanelLimitDate = getEnd(offset(-1, pickerValue));

    return !isSameOrAfter(generateConfig, locale, prevPanelLimitDate, minDate, type);
  }, [minDate, offset, pickerValue, getEnd, generateConfig, locale, type]);

  const disabledSuperOffsetPrev = React.useMemo(() => {
    if (!minDate || !superOffset || !getEnd) {
      return false;
    }

    const prevPanelLimitDate = getEnd(superOffset(-1, pickerValue));

    return !isSameOrAfter(generateConfig, locale, prevPanelLimitDate, minDate, type);
  }, [minDate, superOffset, pickerValue, getEnd, generateConfig, locale, type]);

  const disabledOffsetNext = React.useMemo(() => {
    if (!maxDate || !offset || !getStart) {
      return false;
    }

    const nextPanelLimitDate = getStart(offset(1, pickerValue));

    return !isSameOrAfter(generateConfig, locale, maxDate, nextPanelLimitDate, type);
  }, [maxDate, offset, pickerValue, getStart, generateConfig, locale, type]);

  const disabledSuperOffsetNext = React.useMemo(() => {
    if (!maxDate || !superOffset || !getStart) {
      return false;
    }

    const nextPanelLimitDate = getStart(superOffset(1, pickerValue));

    return !isSameOrAfter(generateConfig, locale, maxDate, nextPanelLimitDate, type);
  }, [maxDate, superOffset, pickerValue, getStart, generateConfig, locale, type]);

  // ========================= Offset =========================
  const onOffset = (distance: number) => {
    if (offset) {
      onChange?.(offset(distance, pickerValue));
    }
  };

  const onSuperOffset = (distance: number) => {
    if (superOffset) {
      onChange?.(superOffset(distance, pickerValue));
    }
  };

  // ========================= Style =========================
  const commonBtnCLs = clsx(
    'relative text-text-tertiary enabled:hover:text-text inline-flex items-center justify-center min-w-[1.6em] disabled:opacity-disabled disabled:pointer-events-none',
  );
  const commonIconCls = [
    clsx(
      'relative -rotate-45 w-[7px] h-[7px]',
      'before:absolute before:top-0 before:left-0 before:w-[7px] before:h-[7px] before:border-current before:border-l-[1.5px] before:border-t-[1.5px]',
    ),
    clsx(
      'after:absolute after:top-1 after:left-1 after:w-[7px] after:h-[7px] after:border-current after:border-l-[1.5px] after:border-t-[1.5px] after:inline-block',
    ),
  ];

  const rootCls = clsx(
    headerPrefixCls,
    'flex px-2 border-b border-border-secondary *:transition-colors',
  );

  const viewCls = clsx(
    `${headerPrefixCls}-view`,
    'flex-auto font-semibold leading-10 flex justify-center gap-2',
  );

  const superPrevBtnCls = clsx(
    `${headerPrefixCls}-super-prev-btn`,
    {
      [`${headerPrefixCls}-super-prev-btn-disabled`]: disabledSuperOffsetPrev,
    },
    commonBtnCLs,
  );
  const superPrevIconCls = clsx(`${headerPrefixCls}-super-prev-icon`, commonIconCls);
  const prevBtnCls = clsx(
    `${headerPrefixCls}-prev-btn`,
    {
      [`${headerPrefixCls}-prev-btn-disabled`]: disabledOffsetPrev,
    },
    commonBtnCLs,
  );
  const prevIconCls = clsx(`${prefixCls}-prev-icon`, commonIconCls[0]);

  const superNextBtnCls = clsx(
    `${headerPrefixCls}-super-next-btn`,
    {
      [`${headerPrefixCls}-super-next-btn-disabled`]: disabledSuperOffsetNext,
    },
    commonBtnCLs,
  );
  const superNextIconCls = clsx(
    `${headerPrefixCls}-super-next-icon`,
    commonIconCls,
    'rotate-[135deg]',
  );
  const nextBtnCls = clsx(
    `${headerPrefixCls}-next-btn`,
    {
      [`${headerPrefixCls}-next-btn-disabled`]: disabledSuperOffsetNext,
    },
    commonBtnCLs,
  );
  const nextIconCls = clsx(`${prefixCls}-next-icon`, commonIconCls[0], 'rotate-[135deg]');

  // ========================= Render =========================
  if (hideHeader) {
    return null;
  }

  return (
    <div className={rootCls}>
      {superOffset && (
        <button
          type="button"
          aria-label="super-prev-year"
          onClick={() => onSuperOffset(-1)}
          tabIndex={-1}
          className={superPrevBtnCls}
          disabled={disabledSuperOffsetPrev}
          style={hidePrev ? HIDDEN_STYLE : {}}
        >
          {superPrevIcon ?? <span className={superPrevIconCls} />}
        </button>
      )}
      {offset && (
        <button
          type="button"
          aria-label="prev-year"
          onClick={() => onOffset(-1)}
          tabIndex={-1}
          className={prevBtnCls}
          disabled={disabledOffsetPrev}
          style={hidePrev ? HIDDEN_STYLE : {}}
        >
          {prevIcon ?? <span className={prevIconCls} />}
        </button>
      )}
      <div className={viewCls}>{children}</div>
      {offset && (
        <button
          type="button"
          aria-label="next-year"
          onClick={() => onOffset(1)}
          tabIndex={-1}
          className={nextBtnCls}
          disabled={disabledOffsetNext}
          style={hideNext ? HIDDEN_STYLE : {}}
        >
          {nextIcon ?? <span className={nextIconCls} />}
        </button>
      )}
      {superOffset && (
        <button
          type="button"
          aria-label="super-next-year"
          onClick={() => onSuperOffset(1)}
          tabIndex={-1}
          className={superNextBtnCls}
          disabled={disabledSuperOffsetNext}
          style={hideNext ? HIDDEN_STYLE : {}}
        >
          {superNextIcon ?? <span className={superNextIconCls} />}
        </button>
      )}
    </div>
  );
}

export default PanelHeader;
