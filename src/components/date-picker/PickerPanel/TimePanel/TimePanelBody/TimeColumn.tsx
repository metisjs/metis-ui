import * as React from 'react';
import useLayoutEffect from 'rc-util/lib/hooks/useLayoutEffect';
import { clsx } from '../../../../_util/classNameUtils';
import type { ScrollbarProps, ScrollbarRef } from '../../../../scrollbar';
import Scrollbar from '../../../../scrollbar';
import { usePanelContext } from '../../context';
import useScrollTo from './useScrollTo';

const SCROLL_DELAY = 300;

export type Unit<ValueType = number | string> = {
  label: React.ReactText;
  value: ValueType;
  disabled?: boolean;
};

export interface TimeUnitColumnProps {
  units: Unit[];
  value: number | string | null;
  optionalValue?: number | string;
  type: 'hour' | 'minute' | 'second' | 'millisecond' | 'meridiem';
  onChange: (value: number | string) => void;
  onHover: (value: number | string | null) => void;
  onDblClick?: VoidFunction;
  changeOnScroll?: boolean;
}

export default function TimeColumn<DateType extends object>(props: TimeUnitColumnProps) {
  const { units, value, optionalValue, type, onChange, onHover, onDblClick, changeOnScroll } =
    props;

  const { prefixCls, cellRender, now, locale } = usePanelContext<DateType>();

  // ========================== Refs ==========================
  const scrollbarRef = React.useRef<ScrollbarRef>(null);

  // ========================= Scroll =========================
  const checkDelayRef = React.useRef<any>();

  const clearDelayCheck = () => {
    clearTimeout(checkDelayRef.current);
  };

  // ========================== Sync ==========================
  const [syncScroll, stopScroll, isScrolling] = useScrollTo(scrollbarRef, value ?? optionalValue);

  // Effect sync value scroll
  useLayoutEffect(() => {
    syncScroll();
    clearDelayCheck();

    return () => {
      stopScroll();
      clearDelayCheck();
    };
  }, [value, optionalValue, units]);

  // ========================= Change =========================
  // Scroll event if sync onScroll
  const onInternalScroll: ScrollbarProps['onScroll'] = ({ scrollTop }) => {
    clearDelayCheck();

    if (!isScrolling() && changeOnScroll) {
      checkDelayRef.current = setTimeout(() => {
        const view = scrollbarRef.current!.view!;
        const firstLiTop = view.querySelector<HTMLLIElement>(`li`)!.offsetTop;
        const liList = Array.from(view.querySelectorAll<HTMLLIElement>(`li`));
        const liTopList = liList.map((li) => li.offsetTop - firstLiTop);
        const liDistList = liTopList.map((top, index) => {
          if (units[index].disabled) {
            return Number.MAX_SAFE_INTEGER;
          }
          return Math.abs(top - scrollTop);
        });

        // Find min distance index
        const minDist = Math.min(...liDistList);
        const minDistIndex = liDistList.findIndex((dist) => dist === minDist);
        const targetUnit = units[minDistIndex];
        if (targetUnit && !targetUnit.disabled) {
          onChange(targetUnit.value);
        }
      }, SCROLL_DELAY);
    }
  };

  // ========================= Style =========================
  const cellPrefixCls = `${prefixCls}-time-panel-cell`;
  const rootCls = clsx(
    `${prefixCls}-time-panel-column`,
    'my-1 h-auto w-16 flex-auto overflow-auto border-l border-border-secondary first:border-l-0',
  );
  const viewCls = clsx('after:block after:h-[calc(100%-1.75rem)]');

  // ========================= Render =========================
  return (
    <Scrollbar
      ref={scrollbarRef}
      className={{ root: rootCls, view: viewCls }}
      onScroll={onInternalScroll}
    >
      <ul data-type={type}>
        {units.map(({ label, value: unitValue, disabled }) => {
          const inner = (
            <div
              className={clsx(`${cellPrefixCls}-inner`, 'block cursor-pointer rounded leading-7', {
                'hover:bg-fill-quaternary': value !== unitValue,
                'bg-primary-bg': value === unitValue,
              })}
            >
              {label}
            </div>
          );

          return (
            <li
              key={unitValue}
              className={clsx(
                cellPrefixCls,
                {
                  [`${cellPrefixCls}-selected`]: value === unitValue,
                  [`${cellPrefixCls}-disabled`]: disabled,
                },
                'mx-1',
              )}
              onClick={() => {
                if (!disabled) {
                  onChange(unitValue);
                }
              }}
              onDoubleClick={() => {
                if (!disabled && onDblClick) {
                  onDblClick();
                }
              }}
              onMouseEnter={() => {
                onHover(unitValue);
              }}
              onMouseLeave={() => {
                onHover(null);
              }}
              data-value={unitValue}
            >
              {cellRender
                ? cellRender(unitValue, {
                    prefixCls,
                    originNode: inner,
                    today: now,
                    type: 'time',
                    subType: type,
                    locale,
                  })
                : inner}
            </li>
          );
        })}
      </ul>
    </Scrollbar>
  );
}
