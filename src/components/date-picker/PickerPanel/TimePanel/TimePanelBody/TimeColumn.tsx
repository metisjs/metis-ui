import * as React from 'react';
import useLayoutEffect from '@rc-component/util/es/hooks/useLayoutEffect';
import type { SemanticClassName } from '@util/classNameUtils';
import { clsx, getSemanticCls } from '@util/classNameUtils';
import type { ScrollbarProps, ScrollbarRef } from '../../../../scrollbar';
import Scrollbar from '../../../../scrollbar';
import { usePanelContext } from '../../context';
import useScrollTo from './useScrollTo';

const SCROLL_DELAY = 300;

export type Unit<ValueType = number | string> = {
  label: string | number;
  value: ValueType;
  disabled?: boolean;
};

export interface TimeUnitColumnProps {
  className?: string;
  cellClassName?: SemanticClassName<
    {
      inner?: string;
    },
    {
      disabled?: boolean;
      selected?: boolean;
    }
  >;
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
  const {
    className,
    cellClassName,
    units,
    value,
    optionalValue,
    type,
    onChange,
    onHover,
    onDblClick,
    changeOnScroll,
  } = props;

  const { prefixCls, cellRender, locale } = usePanelContext<DateType>();

  // ========================== Refs ==========================
  const scrollbarRef = React.useRef<ScrollbarRef>(null);

  // ========================= Scroll =========================
  const checkDelayRef = React.useRef<any>(null);

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
    'border-border-secondary my-1 h-auto w-16 flex-auto border-l first:border-l-0',
  );
  const viewCls = clsx('after:block after:h-[calc(100%-1.75rem)]', className);

  // ========================= Render =========================
  return (
    <Scrollbar
      ref={scrollbarRef}
      className={{ root: rootCls, view: viewCls }}
      onScroll={onInternalScroll}
      component="ul"
    >
      {units.map(({ label, value: unitValue, disabled }) => {
        const semanticCls = getSemanticCls(cellClassName, {
          disabled,
          selected: value === unitValue,
        });

        const inner = (
          <div
            className={clsx(
              `${cellPrefixCls}-inner`,
              'block cursor-pointer rounded-sm leading-7',
              {
                'hover:bg-fill-quaternary': value !== unitValue,
                'bg-primary-bg': value === unitValue,
              },
              disabled && [
                'text-text-tertiary cursor-not-allowed',
                {
                  'hover:bg-transparent': value !== unitValue,
                  'opacity-disabled': value === unitValue,
                },
              ],
              semanticCls.inner,
            )}
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
              semanticCls.root,
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
                  disabled,
                  selected: value === unitValue,
                  type: 'time',
                  subType: type,
                  locale,
                })
              : inner}
          </li>
        );
      })}
    </Scrollbar>
  );
}
