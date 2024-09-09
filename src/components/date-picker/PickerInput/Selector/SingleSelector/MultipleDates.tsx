import * as React from 'react';
import Overflow from 'rc-overflow';
import type { SemanticClassName } from '../../../../_util/classNameUtils';
import { clsx, getSemanticCls } from '../../../../_util/classNameUtils';
import type { InternalPickerProps } from '../../SinglePicker';

export interface MultipleDatesProps<DateType extends object = any>
  extends Pick<InternalPickerProps, 'maxTagCount'> {
  prefixCls: string;
  value?: DateType[];
  onRemove: (value: DateType) => void;
  removeIcon: React.ReactNode;
  formatDate: (date: DateType) => string;
  disabled?: boolean;
  placeholder?: React.ReactNode;
  className?: SemanticClassName<'item' | 'placeholder'>;
}

export default function MultipleDates<DateType extends object = any>(
  props: MultipleDatesProps<DateType>,
) {
  const {
    prefixCls,
    value = [],
    onRemove,
    removeIcon,
    formatDate,
    disabled,
    maxTagCount,
    placeholder,
    className,
  } = props;

  const semanticCls = getSemanticCls(className);

  // ========================= Style =========================
  const selectorCls = clsx(`${prefixCls}-selector`, 'relative flex-auto p-0');
  const selectionCls = `${prefixCls}-selection`;
  const overflowCls = `${selectionCls}-overflow`;

  // ========================= Item =========================
  function renderSelector(content: React.ReactNode, onClose?: React.MouseEventHandler) {
    return (
      <span
        className={clsx(
          `${selectionCls}-item`,
          'relative my-0.5 me-1 box-border flex h-full max-w-full flex-none cursor-default select-none rounded bg-fill-tertiary pe-2 ps-2 leading-7',
          {
            'cursor-not-allowed bg-fill-tertiary': disabled,
          },
          semanticCls.item,
        )}
        title={typeof content === 'string' ? content : undefined}
      >
        <span
          className={clsx(
            `${selectionCls}-item-content`,
            'me-1 inline-block overflow-hidden text-ellipsis whitespace-pre',
          )}
        >
          {content}
        </span>
        {!disabled && onClose && (
          <span
            onMouseDown={(e) => {
              e.preventDefault();
            }}
            onClick={onClose}
            className={clsx(
              `${selectionCls}-item-remove`,
              'inline-flex cursor-pointer items-center font-bold text-text-secondary hover:text-text',
            )}
          >
            {removeIcon}
          </span>
        )}
      </span>
    );
  }

  function renderItem(date: DateType) {
    const displayLabel: React.ReactNode = formatDate(date);

    const onClose = (event?: React.MouseEvent) => {
      if (event) event.stopPropagation();
      onRemove(date);
    };

    return renderSelector(displayLabel, onClose);
  }

  // ========================= Rest =========================
  function renderRest(omittedValues: DateType[]) {
    const content = `+ ${omittedValues.length} ...`;

    return renderSelector(content);
  }

  // ======================== Render ========================

  return (
    <div className={selectorCls}>
      <Overflow
        prefixCls={overflowCls}
        data={value}
        renderItem={renderItem}
        renderRest={renderRest}
        // suffix={inputNode}
        itemKey={(date) => formatDate(date)}
        maxCount={maxTagCount}
        className="relative flex h-full max-w-full flex-auto flex-wrap"
        itemClassName="inline-flex max-w-full flex-none self-center"
      />
      {!value.length && (
        <span
          className={clsx(
            `${prefixCls}-selection-placeholder`,
            'pointer-events-none absolute end-3 start-3 top-1/2 -translate-y-1/2 truncate text-text-quaternary',
            semanticCls.placeholder,
          )}
        >
          {placeholder}
        </span>
      )}
    </div>
  );
}
