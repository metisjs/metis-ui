import * as React from 'react';
import toArray from '@rc-component/util/es/Children/toArray';
import type { SemanticClassName } from '@util/classNameUtils';
import { clsx, getSemanticCls } from '@util/classNameUtils';
import useSemanticCls from '@util/hooks/useSemanticCls';
import { cloneElement } from '@util/reactNode';
import type { DisabledDate } from '../interface';
import { formatValue, isInRange, isSame, isSameWeek } from '../utils/dateUtil';
import { PickerHackContext, usePanelContext } from './context';

export interface PanelBodyProps<DateType = any> {
  className?: SemanticClassName<{ content?: string; cell?: string; cellInner?: string }>;
  rowNum: number;
  colNum: number;
  baseDate: DateType;

  titleFormat?: string;

  // Render
  getCellDate: (date: DateType, offset: number) => DateType;
  getCellText: (date: DateType) => React.ReactNode;
  getCellInfo: (date: DateType) => { inView?: boolean; today?: boolean };

  disabledDate?: DisabledDate<DateType>;

  // Used for date panel
  headerCells?: React.ReactNode[];

  // Used for week panel
  prefixColumn?: (date: DateType) => React.ReactNode;
  rowClassName?: (date: DateType) => string;
  cellSelection?: boolean;
}

export default function PanelBody<DateType extends object = any>(props: PanelBodyProps<DateType>) {
  const {
    className,
    rowNum,
    colNum,
    baseDate,
    getCellDate,
    prefixColumn,
    rowClassName,
    titleFormat,
    getCellText,
    getCellInfo,
    headerCells,
    cellSelection = true,
    disabledDate,
  } = props;

  const {
    prefixCls,
    semanticClassName: contextSemanticCls,
    panelType: type,
    disabledDate: contextDisabledDate,
    cellRender,
    onHover,
    hoverValue,
    hoverRangeValue,
    generateConfig,
    values,
    locale,
    onSelect,
  } = usePanelContext<DateType>();

  const semanticCls = useSemanticCls(className);

  const mergedDisabledDate = disabledDate || contextDisabledDate;

  const cellPrefixCls = `${prefixCls}-cell`;

  // ============================= Context ==============================
  const { onCellDblClick } = React.useContext(PickerHackContext);

  // ============================== Value ===============================
  const matchValues = (date: DateType) =>
    values?.some(
      (singleValue) => singleValue && isSame(generateConfig, locale, date, singleValue, type),
    );

  // =============================== Body ===============================
  const rows: React.ReactNode[] = [];

  for (let row = 0; row < rowNum; row += 1) {
    const rowNode: React.ReactNode[] = [];
    let rowStartDate: DateType;

    for (let col = 0; col < colNum; col += 1) {
      const offset = row * colNum + col;
      const currentDate = getCellDate(baseDate, offset);

      const disabled = mergedDisabledDate?.(currentDate, {
        type: type,
      });

      // Row Start Cell
      if (col === 0) {
        rowStartDate = currentDate;

        if (prefixColumn) {
          rowNode.push(prefixColumn(rowStartDate));
        }
      }

      const { inView, today } = getCellInfo(currentDate);

      // Range
      let inRange = false;
      let rangeStart = false;
      let rangeEnd = false;

      if (hoverRangeValue) {
        const [hoverStart, hoverEnd] = hoverRangeValue;
        if (cellSelection) {
          rangeStart = isSame(generateConfig, locale, currentDate, hoverStart, type);
          rangeEnd = isSame(generateConfig, locale, currentDate, hoverEnd, type);
        } else {
          rangeStart = isSameWeek(generateConfig, locale.locale, hoverStart, currentDate);
          rangeEnd = isSameWeek(generateConfig, locale.locale, hoverEnd, currentDate);
        }
        inRange =
          !rangeStart && !rangeEnd && isInRange(generateConfig, hoverStart, hoverEnd, currentDate);
      }

      const selected = !hoverRangeValue && matchValues(currentDate);

      const hover = (hoverValue || []).some((date) =>
        cellSelection
          ? isSame(generateConfig, locale, currentDate, date, type)
          : isSameWeek(generateConfig, locale.locale, currentDate, date),
      );

      // Title
      const title = titleFormat
        ? formatValue(currentDate, {
            locale,
            format: titleFormat,
            generateConfig,
          })
        : undefined;

      const cellCls = getSemanticCls(contextSemanticCls.cell, {
        disabled,
        hover,
        inRange,
        rangeStart,
        rangeEnd,
        selected,
        today,
        inView,
      });

      // Render
      const inner = (
        <div
          className={clsx(
            `${cellPrefixCls}-inner`,
            'relative z-2 inline-block h-7 min-w-7 rounded-sm leading-7 transition-colors',
            type !== 'week' && {
              'bg-primary text-white': inView && (selected || rangeStart || rangeEnd),
              'group-hover/cell:bg-fill-quaternary':
                !inView || (!selected && !rangeStart && !rangeEnd),
            },
            type === 'week' && {
              'bg-primary text-white': selected || rangeStart || rangeEnd,
            },
            disabled && [
              type !== 'week' && {
                'opacity-disabled': inView && (selected || rangeStart || rangeEnd || today),
                'group-hover/cell:bg-transparent':
                  !inView || (!selected && !rangeStart && !rangeEnd),
              },
            ],
            semanticCls.cellInner,
            cellCls.inner,
          )}
        >
          {getCellText(currentDate)}
        </div>
      );

      rowNode.push(
        <td
          key={col}
          title={title}
          className={clsx(
            cellPrefixCls,
            {
              [`${cellPrefixCls}-disabled`]: disabled,
              [`${cellPrefixCls}-hover`]: hover,
              [`${cellPrefixCls}-in-range`]: inRange,
              [`${cellPrefixCls}-range-start`]: rangeStart,
              [`${cellPrefixCls}-range-end`]: rangeEnd,
              [`${prefixCls}-cell-selected`]: selected,
              [`${prefixCls}-cell-today`]: today,
              [`${prefixCls}-cell-in-view`]: inView,
            },
            'group/cell text-text-tertiary relative min-w-7 cursor-pointer py-1 font-normal transition-colors',
            'before:absolute before:start-0 before:end-0 before:top-1/2 before:z-1 before:h-7 before:-translate-y-1/2 before:transition-colors first:before:rounded-ss first:before:rounded-es last:before:rounded-se last:before:rounded-ee',
            {
              'text-text': inView,
              'text-primary': today,
            },
            type !== 'week' && {
              'before:bg-primary-bg first:before:rounded-none last:before:rounded-none':
                inView && (inRange || rangeStart || rangeEnd),
              'before:start-1/2': inView && rangeStart,
              'before:end-1/2': inView && rangeEnd,
            },
            type === 'week' && {
              'before:bg-fill-quaternary': hover && !selected,
              'before:bg-primary': selected || rangeStart || rangeEnd,
              'before:bg-primary-bg': inRange,
            },
            disabled && [
              'text-text-tertiary before:bg-fill-quaternary cursor-not-allowed first:before:rounded-none last:before:rounded-none',
              {
                'text-primary': today,
              },
              type !== 'week' && {
                'before:bg-primary-bg before:opacity-disabled':
                  inView && (inRange || rangeStart || rangeEnd),
              },
              type === 'week' && {
                'before:bg-none': hover && !selected,
                'before:bg-primary before:opacity-disabled':
                  selected || rangeStart || rangeEnd || inRange,
              },
            ],
            semanticCls.cell,
            cellCls.root,
          )}
          onClick={() => {
            if (!disabled) {
              onSelect(currentDate);
            }
          }}
          onDoubleClick={() => {
            if (!disabled && onCellDblClick) {
              onCellDblClick();
            }
          }}
          onMouseEnter={() => {
            if (!disabled) {
              onHover?.(currentDate);
            }
          }}
          onMouseLeave={() => {
            if (!disabled) {
              onHover?.(null);
            }
          }}
        >
          {cellRender
            ? cellRender(currentDate, {
                prefixCls,
                originNode: inner,
                type: type,
                locale,
                disabled,
                hover,
                inRange,
                rangeStart,
                rangeEnd,
                selected,
                today,
                inView,
              })
            : inner}
        </td>,
      );
    }

    rows.push(
      <tr key={row} className={rowClassName?.(rowStartDate!)}>
        {rowNode}
      </tr>,
    );
  }
  // ============================== Style ==============================
  const bodyCls = clsx(`${prefixCls}-body`, semanticCls.root, contextSemanticCls.body);
  const contentCls = clsx(
    `${prefixCls}-content`,
    'w-full table-fixed border-collapse',
    semanticCls.content,
  );
  const thCls = 'font-normal relative min-w-6 h-9';

  // ============================== Render ==============================
  return (
    <div className={bodyCls}>
      <table className={contentCls}>
        {headerCells && (
          <thead>
            <tr>
              {toArray(headerCells).map((child) =>
                cloneElement(child, (origin) => ({
                  className: clsx(thCls, origin?.className),
                })),
              )}
            </tr>
          </thead>
        )}
        <tbody>{rows}</tbody>
      </table>
    </div>
  );
}
