import React from 'react';
import type { SemanticRecord } from '@util/classNameUtils';
import { clsx } from '@util/classNameUtils';
import useSemanticCls from '@util/hooks/useSemanticCls';
import type { AnyObject, GetProp } from '@util/type';
import type { Dayjs } from 'dayjs';
import { SolarDay } from 'tyme4ts';
import type { CellRenderInfo } from '../../date-picker/interface';
import type { PickerPanelProps } from '../../date-picker/PickerPanel';
import PickerPanel from '../../date-picker/PickerPanel';
import { isSameDate } from '../../date-picker/utils/dateUtil';
import type { SharedPanelProps } from '../interface';

type CellSemanticClassName = GetProp<
  SemanticRecord<GetProp<PickerPanelProps, 'className'>>,
  'cell'
>;

const MonthPanel = <DateType extends AnyObject = Dayjs>(props: SharedPanelProps<DateType>) => {
  const { prefixCls, className, locale, generateConfig, value, lunar } = props;

  const semanticCls = useSemanticCls(className);

  const today = generateConfig.getNow();

  // ========================= Style =========================
  const rootCls = clsx(`${prefixCls}-month-panel`, 'h-full w-full', semanticCls.root);

  const bodyCls = clsx(
    'h-full p-0 *:h-full [&_th]:border-b [&_th]:border-b-border [&_th]:px-3 [&_th]:text-right [&_tr:last-of-type_>_td]:border-b-0',
  );

  const cellCls: CellSemanticClassName = ({ inView }) =>
    clsx(
      'cursor-default border border-border-secondary px-1 py-1 first-of-type:border-l-0 last-of-type:border-r-0',
      {
        'bg-fill-quinary': !inView,
      },
    );

  const innerCellCls = clsx(
    `${prefixCls}-cell-inner`,
    `${prefixCls}-date`,
    'flex h-full flex-col gap-1',
  );

  const cellRender = React.useCallback(
    (date: DateType, info: CellRenderInfo): React.ReactNode => {
      const isToday = isSameDate(generateConfig, today, date);
      let lunarName;

      if (lunar) {
        const solarDay = SolarDay.fromYmd(
          generateConfig.getYear(date),
          generateConfig.getMonth(date) + 1,
          generateConfig.getDate(date),
        );
        const lunarDay = solarDay.getLunarDay();
        lunarName = lunarDay.getName();
      }

      return (
        <div
          className={clsx(innerCellCls, {
            [`${prefixCls}-date-today`]: isToday,
          })}
        >
          <div className={clsx(`${prefixCls}-date-value`, 'flex items-center')}>
            {lunar && (
              <span
                className={clsx('text-text-secondary', {
                  'text-text-tertiary': !info.inView,
                })}
              >
                {lunarName}
              </span>
            )}
            <span
              className={clsx(
                'ml-auto inline-flex h-7 w-7 items-center justify-end rounded-full px-2',
                {
                  'justify-center bg-primary text-white': isToday,
                },
              )}
            >
              {generateConfig.getDate(date)}
            </span>
          </div>
        </div>
      );
    },
    [generateConfig, today, innerCellCls, lunar],
  );

  // ========================= Render =========================
  return (
    <PickerPanel
      pickerValue={value}
      prefixCls={prefixCls}
      locale={{ ...locale, shortWeekDays: locale.weekDays }}
      generateConfig={generateConfig}
      cellRender={cellRender}
      mode="date"
      picker="date"
      hideHeader
      className={{ root: rootCls, body: bodyCls, cell: cellCls }}
      hoverValue={null}
    />
  );
};

export default MonthPanel;
