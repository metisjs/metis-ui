import * as React from 'react';
import type { SemanticClassName } from '@util/classNameUtils';
import { clsx } from '@util/classNameUtils';
import useSemanticCls from '@util/hooks/useSemanticCls';
import Overflow from 'rc-overflow';
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
  className?: SemanticClassName<{ item?: string; placeholder?: string }>;
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

  const semanticCls = useSemanticCls(className);

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
          'bg-fill-tertiary relative my-0.5 me-1 box-border flex h-full max-w-full flex-none cursor-default rounded-sm ps-2 pe-2 leading-7 select-none',
          {
            'bg-fill-tertiary cursor-not-allowed': disabled,
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
              'text-text-secondary hover:text-text inline-flex cursor-pointer items-center font-bold',
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
            'text-text-quaternary pointer-events-none absolute start-2 end-2 top-1/2 -translate-y-1/2 truncate',
            semanticCls.placeholder,
          )}
        >
          {placeholder}
        </span>
      )}
    </div>
  );
}
