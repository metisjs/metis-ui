import * as React from 'react';
import { useState } from 'react';
import useLayoutEffect from '@rc-component/util/es/hooks/useLayoutEffect';
import pickAttrs from '@rc-component/util/es/pickAttrs';
import { clsx } from '@util/classNameUtils';
import useSemanticCls from '@util/hooks/useSemanticCls';
import Overflow from 'rc-overflow';
import type { InnerSelectorProps } from '.';
import type { CustomTagProps, DisplayValueType, RawValueType, RenderNode } from '../BaseSelect';
import TransBtn from '../TransBtn';
import { getTitle } from '../utils/commonUtil';
import Input from './Input';

function itemKey(value: DisplayValueType) {
  return value.key ?? value.value ?? '';
}

interface SelectorProps extends InnerSelectorProps {
  // Icon
  removeIcon?: RenderNode;

  // Tags
  maxTagCount?: number | 'responsive';
  maxTagTextLength?: number;
  maxTagPlaceholder?: React.ReactNode | ((omittedValues: DisplayValueType[]) => React.ReactNode);
  tokenSeparators?: string[];
  tagRender?: (props: CustomTagProps) => React.ReactElement;
  onToggleOpen: (open?: boolean) => void;

  // Event
  onRemove: (value: DisplayValueType) => void;
}

const onPreventMouseDown = (event: React.MouseEvent) => {
  event.preventDefault();
  event.stopPropagation();
};
const SelectSelector: React.FC<SelectorProps> = (props) => {
  const {
    id,
    prefixCls,
    className,

    values,
    open,
    searchValue,
    autoClearSearchValue,
    inputRef,
    placeholder,
    disabled,
    mode,
    showSearch,
    autoFocus,
    autoComplete,
    activeDescendantId,
    tabIndex,

    removeIcon,

    maxTagCount,
    maxTagTextLength,
    maxTagPlaceholder = (omittedValues: DisplayValueType[]) => `+ ${omittedValues.length} ...`,
    tagRender,
    onToggleOpen,

    onRemove,
    onInputChange,
    onInputPaste,
    onInputKeyDown,
    onInputMouseDown,
    onInputCompositionStart,
    onInputCompositionEnd,
  } = props;
  const semanticCls = useSemanticCls(className);

  const measureRef = React.useRef<HTMLSpanElement>(null);
  const [inputWidth, setInputWidth] = useState(0);
  const [focused, setFocused] = useState(false);

  const selectionPrefixCls = `${prefixCls}-selection`;

  // ===================== Search ======================
  const inputValue =
    open || (mode === 'multiple' && autoClearSearchValue === false) || mode === 'tags'
      ? searchValue
      : '';
  const inputEditable: boolean =
    mode === 'tags' ||
    (mode === 'multiple' && autoClearSearchValue === false) ||
    (!!showSearch && (open || focused));

  // We measure width and set to the input immediately
  useLayoutEffect(() => {
    setInputWidth(measureRef.current!.scrollWidth);
  }, [inputValue]);

  // ===================== Render ======================
  // >>> Render Selector Node. Includes Item & Rest
  function defaultRenderSelector(
    item: DisplayValueType,
    content: React.ReactNode,
    itemDisabled: boolean,
    closable?: boolean,
    onClose?: React.MouseEventHandler,
  ) {
    return (
      <span
        className={clsx(
          `${selectionPrefixCls}-item`,
          'bg-fill-tertiary relative my-0.5 me-1 box-border flex h-full max-w-full flex-none cursor-default rounded-sm ps-2 pe-2 leading-7 select-none',
          {
            'bg-fill-tertiary cursor-not-allowed': disabled,
            [`${selectionPrefixCls}-item-disabled cursor-not-allowed`]: itemDisabled,
          },
          semanticCls.item,
        )}
        title={getTitle(item)}
      >
        <span
          className={clsx(
            `${selectionPrefixCls}-item-content`,
            'me-1 inline-block overflow-hidden text-ellipsis whitespace-pre',
          )}
        >
          {content}
        </span>
        {closable && (
          <TransBtn
            className={clsx(
              `${selectionPrefixCls}-item-remove`,
              'text-text-secondary hover:text-text inline-flex cursor-pointer items-center font-bold',
            )}
            onMouseDown={onPreventMouseDown}
            onClick={onClose}
            customizeIcon={removeIcon}
          >
            ×
          </TransBtn>
        )}
      </span>
    );
  }

  function customizeRenderSelector(
    value: RawValueType,
    content: React.ReactNode,
    itemDisabled: boolean,
    closable: boolean,
    onClose: React.MouseEventHandler<HTMLElement>,
  ) {
    const onMouseDown = (e: React.MouseEvent) => {
      onPreventMouseDown(e);
      onToggleOpen(!open);
    };

    return (
      <span onMouseDown={onMouseDown}>
        {tagRender?.({
          label: content,
          value,
          disabled: itemDisabled,
          closable,
          onClose,
        })}
      </span>
    );
  }

  function renderItem(valueItem: DisplayValueType) {
    const { disabled: itemDisabled, label, value } = valueItem;
    const closable = !disabled && !itemDisabled;

    let displayLabel: React.ReactNode = label;

    if (typeof maxTagTextLength === 'number') {
      if (typeof label === 'string' || typeof label === 'number') {
        const strLabel = String(displayLabel);

        if (strLabel.length > maxTagTextLength) {
          displayLabel = `${strLabel.slice(0, maxTagTextLength)}...`;
        }
      }
    }

    const onClose = (event?: React.MouseEvent) => {
      if (event) event.stopPropagation();
      onRemove(valueItem);
    };

    return typeof tagRender === 'function'
      ? customizeRenderSelector(value!, displayLabel, !!itemDisabled, closable, onClose)
      : defaultRenderSelector(valueItem, displayLabel, !!itemDisabled, closable, onClose);
  }

  function renderRest(omittedValues: DisplayValueType[]) {
    const content =
      typeof maxTagPlaceholder === 'function'
        ? maxTagPlaceholder(omittedValues)
        : maxTagPlaceholder;

    return defaultRenderSelector({ title: content as string }, content, false);
  }

  // >>> Input Node
  const inputNode = (
    <div
      className={clsx(
        `${selectionPrefixCls}-search`,
        'relative inline-flex h-8 max-w-full items-center',
        {
          'ms-2': !values.length,
        },
        semanticCls.search,
      )}
      style={{ width: inputWidth }}
      onFocus={() => {
        setFocused(true);
      }}
      onBlur={() => {
        setFocused(false);
      }}
    >
      <Input
        ref={inputRef}
        open={open}
        prefixCls={prefixCls}
        className={clsx(
          'w-full min-w-[5.1px]',
          !showSearch && 'cursor-pointer',
          disabled && 'cursor-not-allowed',
          semanticCls.input,
        )}
        id={id}
        inputElement={null}
        disabled={!!disabled}
        autoFocus={!!autoFocus}
        autoComplete={autoComplete}
        editable={inputEditable}
        activeDescendantId={activeDescendantId}
        value={inputValue}
        onKeyDown={onInputKeyDown}
        onMouseDown={onInputMouseDown}
        onChange={onInputChange}
        onPaste={onInputPaste}
        onCompositionStart={onInputCompositionStart}
        onCompositionEnd={onInputCompositionEnd}
        tabIndex={tabIndex}
        attrs={pickAttrs(props, true)}
      />

      {/* Measure Node */}
      <span
        ref={measureRef}
        className={clsx(
          `${selectionPrefixCls}-search-mirror`,
          'invisible absolute start-0 end-auto top-0 z-999 h-8 whitespace-pre',
        )}
        aria-hidden
      >
        {inputValue}&nbsp;
      </span>
    </div>
  );

  // >>> Selections
  const selectionNode = (
    <Overflow
      prefixCls={`${selectionPrefixCls}-overflow`}
      className="relative flex h-full max-w-full flex-auto flex-wrap"
      itemClassName="inline-flex max-w-full flex-none self-center"
      data={values}
      renderItem={renderItem}
      renderRest={renderRest}
      suffix={inputNode}
      itemKey={itemKey}
      maxCount={maxTagCount}
    />
  );

  return (
    <>
      {selectionNode}

      {!values.length && !inputValue && (
        <span
          className={clsx(
            `${selectionPrefixCls}-placeholder text-text-quaternary pointer-events-none absolute start-3 end-3 top-1/2 -translate-y-1/2 truncate`,
            semanticCls.placeholder,
          )}
        >
          {placeholder}
        </span>
      )}
    </>
  );
};

export default SelectSelector;
