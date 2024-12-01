import * as React from 'react';
import { clsx } from '@util/classNameUtils';
import type { SharedPanelProps } from '../../interface';
import { formatValue } from '../../utils/dateUtil';
import { PanelContext, PickerHackContext, useInfo } from '../context';
import TimePanelBody from './TimePanelBody';

export type TimePanelProps<DateType extends object> = SharedPanelProps<DateType>;

export default function TimePanel<DateType extends object = any>(props: TimePanelProps<DateType>) {
  const {
    prefixCls,
    value,
    locale,
    generateConfig,

    // Format
    showTime,
  } = props;

  const { hideHeader } = React.useContext(PickerHackContext);

  const { format = '' } = showTime || {};

  // ========================== Base ==========================
  const [info] = useInfo(props, 'time');

  // ========================= Style =========================
  const semanticCls = info.semanticClassName;
  const rootCls = clsx(`${prefixCls}-time-panel`, 'flex w-auto flex-col', semanticCls.root);

  // ========================= Render =========================
  return (
    <PanelContext.Provider value={info}>
      <div className={rootCls}>
        {!hideHeader && (
          <div
            className={clsx(
              `${prefixCls}-header`,
              'flex items-center justify-center border-b border-border-secondary px-2 font-semibold leading-10',
              semanticCls.header,
            )}
          >
            {value
              ? formatValue(value, {
                  locale,
                  format,
                  generateConfig,
                })
              : '\u00A0'}
          </div>
        )}
        <TimePanelBody {...showTime} />
      </div>
    </PanelContext.Provider>
  );
}
