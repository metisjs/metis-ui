import * as React from 'react';
import { clsx } from '@util/classNameUtils';
import type { DisabledDate, SharedPanelProps } from '../../interface';
import { formatValue, isInRange, isSameDecade } from '../../utils/dateUtil';
import { PanelContext, useInfo } from '../context';
import PanelBody from '../PanelBody';
import PanelHeader from '../PanelHeader';

export default function DecadePanel<DateType extends object = any>(
  props: SharedPanelProps<DateType>,
) {
  const { prefixCls, locale, generateConfig, pickerValue, disabledDate, onPickerValueChange } =
    props;

  const panelPrefixCls = `${prefixCls}-decade-panel`;

  // ========================== Base ==========================
  const [info] = useInfo(props, 'decade');

  const getStartYear = (date: DateType) => {
    const startYear = Math.floor(generateConfig.getYear(pickerValue) / 100) * 100;
    return generateConfig.setYear(date, startYear);
  };
  const getEndYear = (date: DateType) => {
    const startYear = getStartYear(date);
    return generateConfig.addYear(startYear, 99);
  };

  const startYearDate = getStartYear(pickerValue);
  const endYearDate = getEndYear(pickerValue);

  const baseDate = generateConfig.addYear(startYearDate, -10);

  // ========================= Cells ==========================
  const getCellDate = (date: DateType, offset: number) => {
    return generateConfig.addYear(date, offset * 10);
  };

  const getCellText = (date: DateType) => {
    const cellYearFormat = locale.cellYearFormat;

    const startYearStr = formatValue(date, {
      locale,
      format: cellYearFormat,
      generateConfig,
    });
    const endYearStr = formatValue(generateConfig.addYear(date, 9), {
      locale,
      format: cellYearFormat,
      generateConfig,
    });

    return `${startYearStr}-${endYearStr}`;
  };

  const getCellInfo = (date: DateType) => {
    return {
      inView:
        isSameDecade(generateConfig, date, startYearDate) ||
        isSameDecade(generateConfig, date, endYearDate) ||
        isInRange(generateConfig, startYearDate, endYearDate, date),
    };
  };

  // ======================== Disabled ========================
  const mergedDisabledDate: DisabledDate<DateType> | undefined = disabledDate
    ? (currentDate, disabledInfo) => {
        // Start
        const baseStartDate = generateConfig.setDate(currentDate, 1);
        const baseStartMonth = generateConfig.setMonth(baseStartDate, 0);
        const baseStartYear = generateConfig.setYear(
          baseStartMonth,
          Math.floor(generateConfig.getYear(baseStartMonth) / 10) * 10,
        );

        // End
        const baseEndYear = generateConfig.addYear(baseStartYear, 10);
        const baseEndDate = generateConfig.addDate(baseEndYear, -1);

        return disabledDate(baseStartYear, disabledInfo) && disabledDate(baseEndDate, disabledInfo);
      }
    : undefined;

  // ========================= Header =========================
  const yearNode = `${formatValue(startYearDate, {
    locale,
    format: locale.yearFormat,
    generateConfig,
  })}-${formatValue(endYearDate, {
    locale,
    format: locale.yearFormat,
    generateConfig,
  })}`;

  // ========================= Style =========================
  const panelCls = clsx(panelPrefixCls, 'flex w-72 flex-col', info.semanticClassName.root);
  const bodyCls = clsx('p-2');
  const contentCls = clsx('h-40');
  const cellInnerCls = clsx('rounded-1/2 px-1.5');

  // ========================= Render =========================
  return (
    <PanelContext.Provider value={info}>
      <div className={panelCls}>
        {/* Header */}
        <PanelHeader
          superOffset={(distance) => generateConfig.addYear(pickerValue, distance * 100)}
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
