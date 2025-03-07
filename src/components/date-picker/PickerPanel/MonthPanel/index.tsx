import * as React from 'react';
import { clsx } from '@util/classNameUtils';
import type { DisabledDate, SharedPanelProps } from '../../interface';
import { formatValue } from '../../utils/dateUtil';
import { PanelContext, useInfo } from '../context';
import PanelBody from '../PanelBody';
import PanelHeader from '../PanelHeader';

export default function MonthPanel<DateType extends object = any>(
  props: SharedPanelProps<DateType>,
) {
  const {
    prefixCls,
    locale,
    generateConfig,
    pickerValue,
    disabledDate,
    onPickerValueChange,
    onModeChange,
  } = props;

  const panelPrefixCls = `${prefixCls}-month-panel`;

  // ========================== Base ==========================
  const [info] = useInfo(props, 'month');
  const baseDate = generateConfig.setMonth(pickerValue, 0);

  // ========================= Month ==========================
  const monthsLocale: string[] =
    locale.shortMonths ||
    (generateConfig.locale.getShortMonths
      ? generateConfig.locale.getShortMonths(locale.locale)
      : []);

  // ========================= Cells ==========================
  const getCellDate = (date: DateType, offset: number) => {
    return generateConfig.addMonth(date, offset);
  };

  const getCellText = (date: DateType) => {
    const month = generateConfig.getMonth(date);

    return locale.monthFormat
      ? formatValue(date, {
          locale,
          format: locale.monthFormat,
          generateConfig,
        })
      : monthsLocale[month];
  };

  const getCellInfo = () => ({
    inView: true,
  });

  // ======================== Disabled ========================
  const mergedDisabledDate: DisabledDate<DateType> | undefined = disabledDate
    ? (currentDate, disabledInfo) => {
        const startDate = generateConfig.setDate(currentDate, 1);
        const nextMonthStartDate = generateConfig.setMonth(
          startDate,
          generateConfig.getMonth(startDate) + 1,
        );
        const endDate = generateConfig.addDate(nextMonthStartDate, -1);

        return disabledDate(startDate, disabledInfo) && disabledDate(endDate, disabledInfo);
      }
    : undefined;

  // ========================= Header =========================
  const yearNode: React.ReactNode = (
    <button
      type="button"
      key="year"
      aria-label="year panel"
      onClick={() => {
        onModeChange('year');
      }}
      tabIndex={-1}
      className={`${prefixCls}-year-btn`}
    >
      {formatValue(pickerValue, {
        locale,
        format: locale.yearFormat,
        generateConfig,
      })}
    </button>
  );

  // ========================= Style =========================
  const panelCls = clsx(panelPrefixCls, 'flex w-72 flex-col', info.semanticClassName.root);
  const bodyCls = clsx('p-2');
  const contentCls = clsx('h-40');
  const cellInnerCls = clsx('w-16');

  // ========================= Render =========================
  return (
    <PanelContext.Provider value={info}>
      <div className={panelCls}>
        {/* Header */}
        <PanelHeader
          superOffset={(distance) => generateConfig.addYear(pickerValue, distance)}
          onChange={onPickerValueChange}
          // Limitation
          getStart={(date) => generateConfig.setMonth(date, 0)}
          getEnd={(date) => generateConfig.setMonth(date, 11)}
        >
          {yearNode}
        </PanelHeader>

        {/* Body */}
        <PanelBody
          {...props}
          disabledDate={mergedDisabledDate}
          titleFormat={locale.fieldMonthFormat}
          colNum={3}
          rowNum={4}
          baseDate={baseDate}
          // Body
          getCellDate={getCellDate}
          getCellText={getCellText}
          getCellInfo={getCellInfo}
          className={{ root: bodyCls, content: contentCls, cellInner: cellInnerCls }}
        />
      </div>
    </PanelContext.Provider>
  );
}
