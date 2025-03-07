import * as React from 'react';
import { clsx } from '@util/classNameUtils';
import type { SharedPanelProps } from '../../interface';
import { formatValue } from '../../utils/dateUtil';
import { PanelContext, useInfo } from '../context';
import PanelBody from '../PanelBody';
import PanelHeader from '../PanelHeader';

export default function QuarterPanel<DateType extends object = any>(
  props: SharedPanelProps<DateType>,
) {
  const { prefixCls, locale, generateConfig, pickerValue, onPickerValueChange, onModeChange } =
    props;

  const panelPrefixCls = `${prefixCls}-quarter-panel`;

  // ========================== Base ==========================
  const [info] = useInfo(props, 'quarter');
  const baseDate = generateConfig.setMonth(pickerValue, 0);

  // ========================= Cells ==========================
  const getCellDate = (date: DateType, offset: number) => {
    return generateConfig.addMonth(date, offset * 3);
  };

  const getCellText = (date: DateType) => {
    return formatValue(date, {
      locale,
      format: locale.cellQuarterFormat,
      generateConfig,
    });
  };

  const getCellInfo = () => ({
    inView: true,
  });

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
  const bodyCls = clsx('px-2');
  const contentCls = clsx('h-14');
  const cellInnerCls = clsx('rounded-1/2 w-16');

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
          titleFormat={locale.fieldQuarterFormat}
          colNum={4}
          rowNum={1}
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
