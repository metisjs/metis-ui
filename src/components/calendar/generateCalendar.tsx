import * as React from 'react';
import { clsx } from '@util/classNameUtils';
import usePrevious from '@util/hooks/usePrevious';
import type { AnyObject } from '@util/type';
import { devUseWarning } from '@util/warning';
import type { Dayjs } from 'dayjs';
import useMergedState from 'rc-util/lib/hooks/useMergedState';
import { ConfigContext } from '../config-provider';
import type { GenerateConfig } from '../date-picker/interface';
import { isSameDate } from '../date-picker/utils/dateUtil';
import { useLocale } from '../locale';
import CalendarHeader from './Header';
import type { CalendarMode, CalendarProps } from './interface';
import enUS from './locale/en_US';
import Panel from './Panel';

const generateCalendar = <DateType extends AnyObject = Dayjs>(
  generateConfig: GenerateConfig<DateType>,
) => {
  const Calendar: React.FC<Readonly<CalendarProps<DateType>>> = (props) => {
    const {
      prefixCls: customizePrefixCls,
      className,
      style,
      headerRender,
      value,
      defaultValue,
      mode,
      defaultMode,
      modeOptions,
      extra,
      events,
      lunar,
      selectedEvents,
      onChange,
      onModeChange,
      onEventSelectChange,
    } = props;
    const { getPrefixCls } = React.useContext(ConfigContext);
    const prefixCls = getPrefixCls('calendar', customizePrefixCls);

    // ====================== Locale =======================
    const [contextLocale] = useLocale('Calendar', enUS);
    const locale = { ...contextLocale, ...props.locale! };

    // ====================== State =======================

    // Value
    const [mergedValue, setMergedValue] = useMergedState(() => value || generateConfig.getNow(), {
      defaultValue,
      value,
    });

    // Mode
    const [mergedMode, setMergedMode] = useMergedState('month', {
      value: mode,
      defaultValue: defaultMode,
    });

    // Event
    const [mergedSelectedEventKeys, setMergedSelectedEventKeys] = useMergedState([], {
      value: selectedEvents,
      onChange: onEventSelectChange,
    });

    const prevMode = usePrevious(mergedMode);

    const mergedModeOptions = React.useMemo<CalendarMode[]>(() => {
      if (modeOptions === null) return [mergedMode];

      if (modeOptions) return modeOptions;

      if (events) return ['day', 'week', 'month', 'year'];

      return ['month', 'year'];
    }, [mergedMode, modeOptions, events]);

    const mergedLunar = lunar && locale.locale === 'zh_CN';

    // ====================== Warning ======================
    if (!mergedModeOptions.includes(mergedMode)) {
      const warning = devUseWarning('Calendar');
      warning(false, 'usage', '`mode` is not valid.');

      mergedModeOptions.push(mergedMode);
    }

    // ====================== Events ======================
    const triggerChange = (date: DateType) => {
      setMergedValue(date);

      if (!isSameDate(generateConfig, date, mergedValue)) {
        onChange?.(date);
      }
    };

    const triggerModeChange = (newMode: CalendarMode) => {
      if (mergedModeOptions.includes(newMode)) {
        setMergedMode(newMode);
        onModeChange?.(newMode);
      }
    };

    // ====================== Render ======================
    return (
      <div className={clsx(prefixCls, 'flex flex-col', className)} style={style}>
        {headerRender ? (
          headerRender({
            value: mergedValue,
            mode: mergedMode,
            modeOptions: mergedModeOptions,
            onChange: triggerChange,
            onModeChange: triggerModeChange,
          })
        ) : (
          <CalendarHeader
            prefixCls={prefixCls}
            value={mergedValue}
            generateConfig={generateConfig}
            mode={mergedMode}
            modeOptions={mergedModeOptions}
            locale={locale}
            extra={extra}
            onChange={triggerChange}
            onModeChange={triggerModeChange}
          />
        )}
        <Panel
          prefixCls={prefixCls}
          locale={locale}
          generateConfig={generateConfig}
          value={mergedValue}
          prevMode={prevMode}
          mode={mergedMode}
          events={events}
          selectedEventKeys={mergedSelectedEventKeys}
          lunar={mergedLunar}
          onChange={triggerChange}
          onModeChange={triggerModeChange}
          onEventSelectChange={setMergedSelectedEventKeys}
        />
      </div>
    );
  };

  if (process.env.NODE_ENV !== 'production') {
    Calendar.displayName = 'Calendar';
  }

  return Calendar;
};

export default generateCalendar;
