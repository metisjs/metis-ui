import * as React from 'react';
import pickAttrs from '@rc-component/util/es/pickAttrs';
import { clsx } from '@util/classNameUtils';
import useSemanticCls from '@util/hooks/useSemanticCls';
import type { InnerSelectorProps } from '.';
import { getTitle } from '../utils/commonUtil';
import Input from './Input';

interface SelectorProps extends InnerSelectorProps {
  inputElement: React.ReactElement | null;
  activeValue: string;
}

const SingleSelector: React.FC<SelectorProps> = (props) => {
  const {
    inputElement,
    prefixCls,
    className,
    id,
    inputRef,
    disabled,
    autoFocus,
    autoComplete,
    activeDescendantId,
    mode,
    open,
    values,
    placeholder,
    tabIndex,

    showSearch,
    searchValue,
    activeValue,
    maxLength,

    onInputKeyDown,
    onInputMouseDown,
    onInputChange,
    onInputPaste,
    onInputCompositionStart,
    onInputCompositionEnd,
    title,
  } = props;
  const semanticCls = useSemanticCls(className);

  const [inputChanged, setInputChanged] = React.useState(false);

  const combobox = mode === 'combobox';
  const inputEditable = combobox || showSearch;
  const item = values[0];
  const customizeInputElement = !!inputElement;

  let inputValue: string = searchValue || '';
  if (combobox && activeValue && !inputChanged) {
    inputValue = activeValue;
  }

  React.useEffect(() => {
    if (combobox) {
      setInputChanged(false);
    }
  }, [combobox, activeValue]);

  // Not show text when closed expect combobox mode
  const hasTextInput = mode !== 'combobox' && !open && !showSearch ? false : !!inputValue;

  // Get title of selection item
  const selectionTitle = title === undefined ? getTitle(item) : title;

  const renderPlaceholder = () => {
    if (item) {
      return null;
    }
    const hiddenStyle = hasTextInput
      ? ({ visibility: 'hidden' } as React.CSSProperties)
      : undefined;
    return (
      <span
        className={clsx(
          `${prefixCls}-selection-placeholder`,
          'text-text-quaternary pointer-events-none flex-1 truncate',
          semanticCls.placeholder,
        )}
        style={hiddenStyle}
      >
        {placeholder}
      </span>
    );
  };

  return (
    <>
      <span
        className={clsx(
          `${prefixCls}-selection-search absolute start-3 end-3 top-0 bottom-0`,
          customizeInputElement && 'static w-full',
          semanticCls.search,
        )}
      >
        <Input
          ref={inputRef}
          prefixCls={prefixCls}
          className={clsx(disabled && 'cursor-not-allowed', semanticCls.input)}
          id={id}
          open={open}
          inputElement={inputElement}
          disabled={!!disabled}
          autoFocus={!!autoFocus}
          autoComplete={autoComplete}
          editable={!!inputEditable}
          activeDescendantId={activeDescendantId}
          value={inputValue}
          onKeyDown={onInputKeyDown}
          onMouseDown={onInputMouseDown}
          onChange={(e) => {
            setInputChanged(true);
            onInputChange(e as any);
          }}
          onPaste={onInputPaste}
          onCompositionStart={onInputCompositionStart}
          onCompositionEnd={onInputCompositionEnd}
          tabIndex={tabIndex}
          attrs={pickAttrs(props, true)}
          maxLength={combobox ? maxLength : undefined}
        />
      </span>

      {/* Display value */}
      {!combobox && item ? (
        <span
          className={clsx(
            `${prefixCls}-selection-item relative flex-1 items-center truncate text-sm/6 select-none`,
            open && showSearch && 'text-text-quaternary',
            semanticCls.item,
          )}
          title={selectionTitle}
          // 当 Select 已经选中选项时，还需 selection 隐藏但留在原地占位
          style={hasTextInput ? ({ visibility: 'hidden' } as React.CSSProperties) : undefined}
        >
          {item.label}
        </span>
      ) : null}

      {/* Display placeholder */}
      {!customizeInputElement && renderPlaceholder()}
    </>
  );
};

export default SingleSelector;
