import * as React from 'react';
import { Bars3Outline, ChevronLeftOutline, ChevronRightOutline } from '@metisjs/icons';
import type { SemanticClassName } from '@util/classNameUtils';
import { clsx } from '@util/classNameUtils';
import { uniq, upperFirst } from 'lodash';
import Button from '../button';
import type { GenerateConfig } from '../date-picker/interface';
import { formatValue } from '../date-picker/utils/dateUtil';
import Divider from '../divider';
import Dropdown from '../dropdown';
import type { MenuProps } from '../menu';
import Segmented from '../segmented';
import Space from '../space';
import type { CalendarLocale, CalendarMode } from './interface';

export interface CalendarHeaderProps<DateType> {
  prefixCls: string;
  className?: SemanticClassName<{ title?: string; modeSwitcher?: string }>;
  value: DateType;
  generateConfig: GenerateConfig<DateType>;
  locale: CalendarLocale;
  mode: CalendarMode;
  modeOptions: CalendarMode[];
  extra?: React.ReactNode;
  onChange: (date: DateType) => void;
  onModeChange: (mode: CalendarMode) => void;
}
function CalendarHeader<DateType>(props: CalendarHeaderProps<DateType>) {
  const {
    prefixCls,
    locale,
    value,
    mode,
    modeOptions,
    generateConfig,
    extra,
    onChange,
    onModeChange,
  } = props;

  const title = React.useMemo(() => {
    switch (mode) {
      case 'year':
        return formatValue(value, {
          locale,
          format: locale.headerYearFormat ?? 'YYYY',
          generateConfig,
        });
      case 'month':
      case 'week':
        return formatValue(value, {
          locale,
          format: locale.headerMonthFormat ?? 'YYYY-MM',
          generateConfig,
        });

      default:
        return formatValue(value, {
          locale,
          format: locale.headerDateFormat ?? 'YYYY-MM-DD',
          generateConfig,
        });
    }
  }, [locale, value, mode, generateConfig]);

  const showModeSwitcher = modeOptions && modeOptions.length > 1;

  const mergedModeOptions = React.useMemo(
    () =>
      uniq(modeOptions)?.map((option) => ({
        label: locale[option],
        value: option,
      })),
    [modeOptions],
  );

  const handlePrev = () => {
    let prevDate;
    switch (mode) {
      case 'year': {
        prevDate = generateConfig.addYear(value, -1);
        prevDate = generateConfig.setMonth(prevDate, 0);
        prevDate = generateConfig.setDate(prevDate, 1);
        break;
      }

      case 'month': {
        prevDate = generateConfig.addMonth(value, -1);
        prevDate = generateConfig.setDate(prevDate, 1);
        break;
      }

      case 'week': {
        const weekFirst = generateConfig.locale.getWeekFirstDate(locale.locale, value);
        prevDate = generateConfig.addDate(weekFirst, -7);
        break;
      }

      default:
        prevDate = generateConfig.addDate(value, -1);
        break;
    }
    onChange(prevDate);
  };

  const handleNext = () => {
    let nextDate;
    switch (mode) {
      case 'year': {
        nextDate = generateConfig.addYear(value, 1);
        nextDate = generateConfig.setMonth(nextDate, 0);
        nextDate = generateConfig.setDate(nextDate, 1);
        break;
      }

      case 'month': {
        nextDate = generateConfig.addMonth(value, 1);
        nextDate = generateConfig.setDate(nextDate, 1);
        break;
      }

      case 'week': {
        const weekFirst = generateConfig.locale.getWeekFirstDate(locale.locale, value);
        nextDate = generateConfig.addDate(weekFirst, 7);
        break;
      }

      default:
        nextDate = generateConfig.addDate(value, 1);
        break;
    }
    onChange(nextDate);
  };

  // ========================= Style =========================
  const rootCls = clsx(`${prefixCls}-header`, 'relative flex items-center gap-4 px-4 pb-1 pt-4');
  const titleCls = clsx(`${prefixCls}-header-title`, 'text-2xl font-medium');
  const actionsCls = clsx(`${prefixCls}-header-actions`, 'ml-auto flex items-center gap-4');
  const iconCls = 'h-4 w-4 font-normal text-text-tertiary sm:text-text';
  const extraCls = clsx(`${prefixCls}-header-extra`);

  // ========================= Render =========================
  const actionMenu = React.useMemo<MenuProps>(() => {
    const items: MenuProps['items'] = [
      {
        key: 'prev',
        label: locale[`prev${upperFirst(mode)}` as keyof CalendarLocale],
        onClick: handlePrev,
      },
      {
        key: 'backToToday',
        label: locale.backToToday,
        onClick: () => onChange(generateConfig.getNow()),
      },
      {
        key: 'next',
        label: locale[`next${upperFirst(mode)}` as keyof CalendarLocale],
        onClick: handleNext,
      },
    ];

    if (mergedModeOptions.length) {
      items.push({ type: 'divider' });
      items.push(
        ...mergedModeOptions.map(({ value }) => ({
          label: locale[`${value}View`],
          key: value,
          onClick: () => onModeChange(value),
        })),
      );
    }

    return {
      items,
    };
  }, [locale, mode, mergedModeOptions]);

  return (
    <div className={rootCls}>
      <div className={titleCls}>{title}</div>
      <div className={actionsCls}>
        {showModeSwitcher && (
          <>
            <Segmented
              options={mergedModeOptions}
              value={mode}
              onChange={onModeChange}
              className="md:hidden"
            />
          </>
        )}
        <Space.Compact className="md:hidden">
          <Button icon={<ChevronLeftOutline className={iconCls} />} onClick={handlePrev} />
          <Button onClick={() => onChange(generateConfig.getNow())}>{locale.today}</Button>
          <Button icon={<ChevronRightOutline className={iconCls} />} onClick={handleNext} />
        </Space.Compact>
        <Dropdown menu={actionMenu} className="hidden md:inline-flex">
          <Button icon={<Bars3Outline />} />
        </Dropdown>
      </div>
      {extra && (
        <>
          <Divider type="vertical" className="top-0 mx-1 h-6" />
          <div className={extraCls}>{extra}</div>
        </>
      )}
    </div>
  );
}

export default CalendarHeader;
