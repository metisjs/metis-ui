import React from 'react';
import type { SemanticClassName } from '@util/classNameUtils';
import { clsx } from '@util/classNameUtils';
import useSemanticCls from '@util/hooks/useSemanticCls';
import type { AnyObject } from '@util/type';
import type { Dayjs } from 'dayjs';
import PickerPanel from '../../date-picker/PickerPanel';
import Scrollbar from '../../scrollbar';
import type { SharedPanelProps } from '../interface';

export type YearPanelClassName = SemanticClassName<{
  item?: string;
  title?: string;
  cell?: string;
}>;

export type YearPanelProps<DateType extends AnyObject = Dayjs> = SharedPanelProps<DateType> & {
  className?: YearPanelClassName;
};

const YearPanel = <DateType extends AnyObject = Dayjs>(props: YearPanelProps<DateType>) => {
  const { prefixCls, className, locale, generateConfig, value, prevMode, onChange, onModeChange } =
    props;

  const semanticCls = useSemanticCls(className);

  const year = generateConfig.getYear(value);

  const monthsLocale: string[] =
    locale.shortMonths ||
    (generateConfig.locale.getShortMonths
      ? generateConfig.locale.getShortMonths(locale.locale)
      : []);

  // ========================= Events =========================
  const handleGotoMonth = (month: number) => {
    onChange(generateConfig.setMonth(value, month));
    onModeChange('month');
  };

  const handleGoto = (date: DateType) => {
    onChange(date);
    onModeChange(prevMode ?? 'month');
  };

  // ========================= Style =========================
  const rootCls = clsx(
    `${prefixCls}-year-panel`,
    'grid h-full w-full select-none grid-cols-4 grid-rows-3 gap-6 px-6 pb-6 pt-2 lg:grid-cols-3 lg:grid-rows-4 lg:gap-4 lg:px-4 lg:pb-4 md:grid-cols-2 md:grid-rows-none sm:grid-cols-1',
    semanticCls.root,
  );

  const itemCls = clsx('flex flex-col', semanticCls.item);

  const titleCls = clsx(`${prefixCls}-year-title`, 'mb-1 mt-2 px-2 text-lg', semanticCls.title);

  const bodyCls = clsx(
    'h-full w-full p-0 text-sm *:h-full lg:text-xs [&_th]:h-auto [&_th]:w-auto [&_th]:text-text-secondary',
  );

  const cellCls = clsx('cursor-default p-0 before:hidden md:py-1', semanticCls.cell);

  // ========================= Render =========================
  const cellRender = React.useCallback(
    (date: DateType): React.ReactNode => (
      <div onDoubleClick={() => handleGoto(date)}>{generateConfig.getDate(date)}</div>
    ),
    [generateConfig],
  );

  return (
    <Scrollbar className={{ view: rootCls }}>
      {Array.from({ length: 12 }).map((_, index) => {
        const date = generateConfig.get(`${year}-${index + 1}-1`);
        return (
          <div key={index} className={itemCls}>
            <div className={titleCls} onDoubleClick={() => handleGotoMonth(index)}>
              {monthsLocale[index]}
            </div>
            <PickerPanel
              pickerValue={date}
              prefixCls={prefixCls}
              locale={locale}
              generateConfig={generateConfig}
              cellRender={cellRender}
              mode="date"
              picker="date"
              hideHeader
              className={{ root: 'h-full w-full', body: bodyCls, cell: cellCls }}
              hoverValue={null}
            />
          </div>
        );
      })}
    </Scrollbar>
  );
};

export default YearPanel;
