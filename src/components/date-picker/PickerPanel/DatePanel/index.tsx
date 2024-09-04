import * as React from 'react';
import { clsx } from '../../../_util/classNameUtils';
import type { PanelMode, SharedPanelProps } from '../../interface';
import {
  formatValue,
  getWeekStartDate,
  isSameDate,
  isSameMonth,
  WEEK_DAY_COUNT,
} from '../../utils/dateUtil';
import { PanelContext, useInfo } from '../context';
import PanelBody from '../PanelBody';
import PanelHeader from '../PanelHeader';

export interface DatePanelProps<DateType extends object> extends SharedPanelProps<DateType> {
  panelName?: PanelMode;
  rowClassName?: (date: DateType) => string;

  /** Used for `WeekPanel` */
  mode?: PanelMode;
  cellSelection?: boolean;
}

export default function DatePanel<DateType extends object = any>(props: DatePanelProps<DateType>) {
  const {
    prefixCls,
    className,
    panelName = 'date',
    locale,
    generateConfig,
    pickerValue,
    onPickerValueChange,
    onModeChange,
    mode = 'date',
    disabledDate,
    onSelect,
    onHover,
    showWeek,
  } = props;

  const panelPrefixCls = `${prefixCls}-${panelName}-panel`;

  const cellPrefixCls = `${prefixCls}-cell`;

  const isWeek = mode === 'week';

  // ========================== Base ==========================
  const [info, now] = useInfo(props, mode);
  const weekFirstDay = generateConfig.locale.getWeekFirstDay(locale.locale);
  const monthStartDate = generateConfig.setDate(pickerValue, 1);
  const baseDate = getWeekStartDate(locale.locale, generateConfig, monthStartDate);
  const month = generateConfig.getMonth(pickerValue);

  // =========================== PrefixColumn ===========================
  const showPrefixColumn = showWeek === undefined ? isWeek : showWeek;
  const prefixColumn = showPrefixColumn
    ? (date: DateType) => {
        // >>> Additional check for disabled
        const disabled = disabledDate?.(date, { type: 'week' });

        return (
          <td
            key="week"
            className={clsx(
              cellPrefixCls,
              `${cellPrefixCls}-week`,
              {
                [`${cellPrefixCls}-disabled`]: disabled,
              },
              'font-normal relative min-w-7 text-text-tertiary py-1 cursor-pointer',
            )}
            // Operation: Same as code in PanelBody
            onClick={() => {
              if (!disabled) {
                onSelect(date);
              }
            }}
            onMouseEnter={() => {
              if (!disabled) {
                onHover?.(date);
              }
            }}
            onMouseLeave={() => {
              if (!disabled) {
                onHover?.(null);
              }
            }}
          >
            <div className={clsx(`${cellPrefixCls}-inner`)}>
              {generateConfig.locale.getWeek(locale.locale, date)}
            </div>
          </td>
        );
      }
    : undefined;

  // ========================= Cells ==========================
  // >>> Header Cells
  const headerCells: React.ReactNode[] = [];
  const weekDaysLocale: string[] =
    locale.shortWeekDays ||
    (generateConfig.locale.getShortWeekDays
      ? generateConfig.locale.getShortWeekDays(locale.locale)
      : []);

  if (prefixColumn) {
    headerCells.push(<th key="empty" aria-label="empty cell" />);
  }
  for (let i = 0; i < WEEK_DAY_COUNT; i += 1) {
    headerCells.push(<th key={i}>{weekDaysLocale[(i + weekFirstDay) % WEEK_DAY_COUNT]}</th>);
  }

  // >>> Body Cells
  const getCellDate = (date: DateType, offset: number) => {
    return generateConfig.addDate(date, offset);
  };

  const getCellText = (date: DateType) => {
    return formatValue(date, {
      locale,
      format: locale.cellDateFormat,
      generateConfig,
    });
  };

  const getCellInfo = (date: DateType) => {
    return {
      inView: isSameMonth(generateConfig, date, pickerValue),
      today: isSameDate(generateConfig, date, now),
    };
  };

  // ========================= Header =========================
  const monthsLocale: string[] =
    locale.shortMonths ||
    (generateConfig.locale.getShortMonths
      ? generateConfig.locale.getShortMonths(locale.locale)
      : []);

  const yearNode: React.ReactNode = (
    <button
      type="button"
      aria-label="year panel"
      key="year"
      onClick={() => {
        onModeChange('year', pickerValue);
      }}
      tabIndex={-1}
      className={clsx(`${prefixCls}-year-btn`, 'hover:text-primary')}
    >
      {formatValue(pickerValue, {
        locale,
        format: locale.yearFormat,
        generateConfig,
      })}
    </button>
  );
  const monthNode: React.ReactNode = (
    <button
      type="button"
      aria-label="month panel"
      key="month"
      onClick={() => {
        onModeChange('month', pickerValue);
      }}
      tabIndex={-1}
      className={clsx(`${prefixCls}-month-btn`, 'hover:text-primary')}
    >
      {locale.monthFormat
        ? formatValue(pickerValue, {
            locale,
            format: locale.monthFormat,
            generateConfig,
          })
        : monthsLocale[month]}
    </button>
  );

  const monthYearNodes = locale.monthBeforeYear ? [monthNode, yearNode] : [yearNode, monthNode];

  // ========================= Style =========================
  const panelCls = clsx(panelPrefixCls, { [`${panelPrefixCls}-show-week`]: showWeek }, className);
  const bodyCls = clsx('px-[1.125rem] py-2', {
    'p-2': showWeek,
  });

  // ========================= Render =========================
  return (
    <PanelContext.Provider value={info}>
      <div className={panelCls}>
        {/* Header */}
        <PanelHeader<DateType>
          offset={(distance) => generateConfig.addMonth(pickerValue, distance)}
          superOffset={(distance) => generateConfig.addYear(pickerValue, distance)}
          onChange={onPickerValueChange}
          // Limitation
          getStart={(date) => generateConfig.setDate(date, 1)}
          getEnd={(date) => {
            let clone = generateConfig.setDate(date, 1);
            clone = generateConfig.addMonth(clone, 1);
            return generateConfig.addDate(clone, -1);
          }}
        >
          {monthYearNodes}
        </PanelHeader>

        {/* Body */}
        <PanelBody
          titleFormat={locale.fieldDateFormat}
          {...props}
          colNum={WEEK_DAY_COUNT}
          rowNum={6}
          baseDate={baseDate}
          // Header
          headerCells={headerCells}
          // Body
          getCellDate={getCellDate}
          getCellText={getCellText}
          getCellInfo={getCellInfo}
          prefixColumn={prefixColumn}
          cellSelection={!isWeek}
          className={{ root: bodyCls }}
        />
      </div>
    </PanelContext.Provider>
  );
}
