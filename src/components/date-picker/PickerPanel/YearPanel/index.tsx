import * as React from 'react';
import { clsx } from '@util/classNameUtils';
import type { DisabledDate, SharedPanelProps } from '../../interface';
import { formatValue, isInRange, isSameYear } from '../../utils/dateUtil';
import { PanelContext, useInfo } from '../context';
import PanelBody from '../PanelBody';
import PanelHeader from '../PanelHeader';

export default function YearPanel<DateType extends object = any>(
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

  const panelPrefixCls = `${prefixCls}-year-panel`;

  // ========================== Base ==========================
  const [info] = useInfo(props, 'year');
  const getStartYear = (date: DateType) => {
    const startYear = Math.floor(generateConfig.getYear(pickerValue) / 10) * 10;
    return generateConfig.setYear(date, startYear);
  };
  const getEndYear = (date: DateType) => {
    const startYear = getStartYear(date);
    return generateConfig.addYear(startYear, 9);
  };

  const startYearDate = getStartYear(pickerValue);
  const endYearDate = getEndYear(pickerValue);

  const baseDate = generateConfig.addYear(startYearDate, -1);

  // ========================= Cells ==========================
  const getCellDate = (date: DateType, offset: number) => {
    return generateConfig.addYear(date, offset);
  };

  const getCellText = (date: DateType) => {
    return formatValue(date, {
      locale,
      format: locale.cellYearFormat,
      generateConfig,
    });
  };

  const getCellInfo = (date: DateType) => {
    return {
      inView:
        isSameYear(generateConfig, date, startYearDate) ||
        isSameYear(generateConfig, date, endYearDate) ||
        isInRange(generateConfig, startYearDate, endYearDate, date),
    };
  };

  // ======================== Disabled ========================
  const mergedDisabledDate: DisabledDate<DateType> | undefined = disabledDate
    ? (currentDate, disabledInfo) => {
        // Start
        const startMonth = generateConfig.setMonth(currentDate, 0);
        const startDate = generateConfig.setDate(startMonth, 1);

        // End
        const endMonth = generateConfig.addYear(startDate, 1);
        const endDate = generateConfig.addDate(endMonth, -1);
        return disabledDate(startDate, disabledInfo) && disabledDate(endDate, disabledInfo);
      }
    : undefined;

  // ========================= Header =========================
  const yearNode: React.ReactNode = (
    <button
      type="button"
      key="decade"
      aria-label="decade panel"
      onClick={() => {
        onModeChange('decade');
      }}
      tabIndex={-1}
      className={`${prefixCls}-decade-btn`}
    >
      {formatValue(startYearDate, {
        locale,
        format: locale.yearFormat,
        generateConfig,
      })}
      -
      {formatValue(endYearDate, {
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
  const cellInnerCls = clsx('rounded-1/2 w-16');

  // ========================= Render =========================
  return (
    <PanelContext.Provider value={info}>
      <div className={panelCls}>
        {/* Header */}
        <PanelHeader
          superOffset={(distance) => generateConfig.addYear(pickerValue, distance * 10)}
          onChange={onPickerValueChange}
          // Limitation
          getStart={getStartYear}
          getEnd={getEndYear}
        >
          {yearNode}
        </PanelHeader>

        {/* Body */}
        <PanelBody
          {...props}
          disabledDate={mergedDisabledDate}
          titleFormat={locale.fieldYearFormat}
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
