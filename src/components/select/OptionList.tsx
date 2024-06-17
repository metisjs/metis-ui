import KeyCode from 'rc-util/lib/KeyCode';
import useMemo from 'rc-util/lib/hooks/useMemo';
import omit from 'rc-util/lib/omit';
import pickAttrs from 'rc-util/lib/pickAttrs';
import type { ListRef } from 'rc-virtual-list';
import List from 'rc-virtual-list';
import type { ScrollConfig } from 'rc-virtual-list/lib/List';
import * as React from 'react';
import { useEffect } from 'react';
import { clsx } from '../_util/classNameUtils';
import { isPlatformMac } from '../_util/platform';
import SelectContext from './SelectContext';
import TransBtn from './TransBtn';
import useBaseProps from './hooks/useBaseProps';
import type { BaseOptionType, FlattenOptionData, RawValueType } from './interface';

// export interface OptionListProps<OptionsType extends object[]> {
export type OptionListProps = Record<string, never>;

export interface RefOptionListProps {
  onKeyDown: React.KeyboardEventHandler;
  onKeyUp: React.KeyboardEventHandler;
  scrollTo?: (args: number | ScrollConfig) => void;
}

function isTitleType(content: any) {
  return typeof content === 'string' || typeof content === 'number';
}

/**
 * Using virtual list of option display.
 * Will fallback to dom if use customize render.
 */
const OptionList: React.ForwardRefRenderFunction<RefOptionListProps, Record<string, never>> = (
  _,
  ref,
) => {
  const {
    prefixCls,
    id,
    open,
    multiple,
    mode,
    searchValue,
    toggleOpen,
    notFoundContent,
    onPopupScroll,
  } = useBaseProps();
  const {
    flattenOptions,
    onActiveValue,
    defaultActiveFirstOption,
    onSelect,
    menuItemSelectedIcon,
    rawValues,
    fieldNames = {},
    virtual,
    listHeight,
    listItemHeight,
  } = React.useContext(SelectContext);

  const itemPrefixCls = `${prefixCls}-item`;

  const memoFlattenOptions = useMemo(
    () => flattenOptions,
    [open, flattenOptions],
    (prev, next) => !!next[0] && prev[1] !== next[1],
  );

  // =========================== List ===========================
  const listRef = React.useRef<ListRef>(null);

  const onListMouseDown: React.MouseEventHandler<HTMLDivElement> = (event) => {
    event.preventDefault();
  };

  const scrollIntoView = (args: number | ScrollConfig) => {
    if (listRef.current) {
      listRef.current.scrollTo(typeof args === 'number' ? { index: args } : args);
    }
  };

  // ========================== Active ==========================
  const getEnabledActiveIndex = (index: number, offset: number = 1): number => {
    const len = memoFlattenOptions.length;

    for (let i = 0; i < len; i += 1) {
      const current = (index + i * offset + len) % len;

      const { group, data } = memoFlattenOptions[current];
      if (!group && !data.disabled) {
        return current;
      }
    }

    return -1;
  };

  const [activeIndex, setActiveIndex] = React.useState(() => getEnabledActiveIndex(0));
  const setActive = (index: number, fromKeyboard = false) => {
    setActiveIndex(index);

    const info = { source: fromKeyboard ? ('keyboard' as const) : ('mouse' as const) };

    // Trigger active event
    const flattenItem = memoFlattenOptions[index];
    if (!flattenItem) {
      onActiveValue(null, -1, info);
      return;
    }
    onActiveValue(flattenItem.value!, index, info);
  };

  // Auto active first item when list length or searchValue changed
  useEffect(() => {
    setActive(defaultActiveFirstOption !== false ? getEnabledActiveIndex(0) : -1);
  }, [memoFlattenOptions.length, searchValue]);

  const isSelected = React.useCallback(
    (value: RawValueType) => rawValues.has(value) && mode !== 'combobox',
    [mode, [...rawValues].toString(), rawValues.size],
  );

  // Auto scroll to item position in single mode
  useEffect(() => {
    /**
     * React will skip `onChange` when component update.
     * `setActive` function will call root accessibility state update which makes re-render.
     * So we need to delay to let Input component trigger onChange first.
     */
    const timeoutId = setTimeout(() => {
      if (!multiple && open && rawValues.size === 1) {
        const value: RawValueType = Array.from(rawValues)[0];
        const index = memoFlattenOptions.findIndex(({ data }) => data.value === value);

        if (index !== -1) {
          setActive(index);
          scrollIntoView(index);
        }
      }
    });

    // Force trigger scrollbar visible when open
    if (open) {
      //@ts-ignore
      listRef.current?.scrollTo(undefined);
    }

    return () => clearTimeout(timeoutId);
  }, [open, searchValue, flattenOptions.length]);

  // ========================== Values ==========================
  const onSelectValue = (value?: RawValueType) => {
    if (value !== undefined) {
      onSelect(value, { selected: !rawValues.has(value) });
    }

    // Single mode should always close by select
    if (!multiple) {
      toggleOpen(false);
    }
  };

  // ========================= Keyboard =========================
  React.useImperativeHandle(ref, () => ({
    onKeyDown: (event) => {
      const { which, ctrlKey } = event;
      switch (which) {
        // >>> Arrow keys & ctrl + n/p on Mac
        case KeyCode.N:
        case KeyCode.P:
        case KeyCode.UP:
        case KeyCode.DOWN: {
          let offset = 0;
          if (which === KeyCode.UP) {
            offset = -1;
          } else if (which === KeyCode.DOWN) {
            offset = 1;
          } else if (isPlatformMac() && ctrlKey) {
            if (which === KeyCode.N) {
              offset = 1;
            } else if (which === KeyCode.P) {
              offset = -1;
            }
          }

          if (offset !== 0) {
            const nextActiveIndex = getEnabledActiveIndex(activeIndex + offset, offset);
            scrollIntoView(nextActiveIndex);
            setActive(nextActiveIndex, true);
          }

          break;
        }

        // >>> Select
        case KeyCode.ENTER: {
          // value
          const item = memoFlattenOptions[activeIndex];
          if (item && !item.data.disabled) {
            onSelectValue(item.value);
          } else {
            onSelectValue(undefined);
          }

          if (open) {
            event.preventDefault();
          }

          break;
        }

        // >>> Close
        case KeyCode.ESC: {
          toggleOpen(false);
          if (open) {
            event.stopPropagation();
          }
        }
      }
    },
    onKeyUp: () => {},

    scrollTo: (index) => {
      scrollIntoView(index);
    },
  }));

  // ========================== Render ==========================
  if (memoFlattenOptions.length === 0) {
    return (
      <div
        role="listbox"
        id={`${id}_list`}
        className={`${itemPrefixCls}-empty`}
        onMouseDown={onListMouseDown}
      >
        {notFoundContent}
      </div>
    );
  }

  const omitFieldNameList = Object.keys(fieldNames);

  const getLabel = (item: Record<string, any>) => item.label;

  function getItemAriaProps(item: FlattenOptionData<BaseOptionType>, index: number) {
    const { group } = item;

    return {
      role: group ? 'presentation' : 'option',
      id: `${id}_list_${index}`,
    };
  }

  const renderItem = (index: number) => {
    const item = memoFlattenOptions[index];
    if (!item) return null;

    const itemData = item.data || {};
    const { value } = itemData;
    const { group } = item;
    const attrs = pickAttrs(itemData, true);
    const mergedLabel = getLabel(item);
    return item ? (
      <div
        aria-label={typeof mergedLabel === 'string' && !group ? mergedLabel : undefined}
        {...attrs}
        key={index}
        {...getItemAriaProps(item, index)}
        aria-selected={isSelected(value)}
      >
        {value}
      </div>
    ) : null;
  };

  const a11yProps = {
    role: 'listbox',
    id: `${id}_list`,
  };

  return (
    <>
      {virtual && (
        <div {...a11yProps} style={{ height: 0, width: 0, overflow: 'hidden' }}>
          {renderItem(activeIndex - 1)}
          {renderItem(activeIndex)}
          {renderItem(activeIndex + 1)}
        </div>
      )}
      <List<FlattenOptionData<BaseOptionType>>
        itemKey="key"
        ref={listRef}
        data={memoFlattenOptions}
        height={listHeight}
        itemHeight={listItemHeight}
        fullHeight={false}
        onMouseDown={onListMouseDown}
        onScroll={onPopupScroll}
        virtual={virtual}
        innerProps={virtual ? undefined : a11yProps}
        styles={{
          horizontalScrollBar: { height: 6 },
          verticalScrollBar: { width: 6 },
        }}
      >
        {(item, itemIndex) => {
          const { group, groupOption, data, label, value } = item;
          const { key } = data;

          // Group
          if (group) {
            const groupTitle = data.title ?? (isTitleType(label) ? label!.toString() : undefined);

            return (
              <div
                className={clsx(
                  itemPrefixCls,
                  `${itemPrefixCls}-group cursor-auto px-3 py-2 text-xs text-neutral-text-tertiary`,
                )}
                title={groupTitle}
              >
                {label !== undefined ? label : key}
              </div>
            );
          }

          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { disabled, title, children, style, className, ...otherProps } = data;
          const passedProps = omit(otherProps, omitFieldNameList);

          // Option
          const selected = isSelected(value!);

          const optionPrefixCls = `${itemPrefixCls}-option`;
          const optionClassName = clsx(
            itemPrefixCls,
            optionPrefixCls,
            'relative flex cursor-default select-none items-center py-2 pl-3 pr-8 text-sm',
            {
              [`${optionPrefixCls}-grouped pl-6`]: groupOption,
              [`${optionPrefixCls}-active bg-primary text-white`]:
                activeIndex === itemIndex && !disabled,
              [`${optionPrefixCls}-disabled text-neutral-text-quaternary`]: disabled,
              [`${optionPrefixCls}-selected font-semibold`]: selected,
            },
            className,
          );

          const mergedLabel = getLabel(item);

          const iconVisible =
            !menuItemSelectedIcon || typeof menuItemSelectedIcon === 'function' || selected;

          const content = typeof mergedLabel === 'number' ? mergedLabel : mergedLabel || value;
          let optionTitle = isTitleType(content) ? content.toString() : undefined;
          if (title !== undefined) {
            optionTitle = title;
          }

          return (
            <div
              {...pickAttrs(passedProps)}
              {...(!virtual ? getItemAriaProps(item, itemIndex) : {})}
              aria-selected={selected}
              className={optionClassName}
              title={optionTitle}
              onMouseMove={() => {
                if (activeIndex === itemIndex || disabled) {
                  return;
                }
                setActive(itemIndex);
              }}
              onClick={() => {
                if (!disabled) {
                  onSelectValue(value);
                }
              }}
              style={style}
            >
              <div className={clsx(`${optionPrefixCls}-content`, 'truncate')}>{content}</div>
              {React.isValidElement(menuItemSelectedIcon) || selected}
              {iconVisible && (
                <TransBtn
                  className={clsx(
                    `${itemPrefixCls}-option-state`,
                    'absolute inset-y-0 right-0 flex items-center pr-2',
                    {
                      'text-primary': selected,
                      'text-white': activeIndex === itemIndex && !disabled,
                    },
                  )}
                  customizeIcon={menuItemSelectedIcon}
                  customizeIconProps={{ isSelected: selected }}
                >
                  {selected ? '✓' : null}
                </TransBtn>
              )}
            </div>
          );
        }}
      </List>
    </>
  );
};

const RefOptionList = React.forwardRef(OptionList);
RefOptionList.displayName = 'OptionList';

export default RefOptionList;
