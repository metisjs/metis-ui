import * as React from 'react';
import { useEffect } from 'react';
import useMemo from 'rc-util/lib/hooks/useMemo';
import pickAttrs from 'rc-util/lib/pickAttrs';
import { clsx, getSemanticCls } from '../_util/classNameUtils';
import useSemanticCls from '../_util/hooks/useSemanticCls';
import { isPlatformMac } from '../_util/platform';
import Spin from '../spin';
import type { ScrollConfig, VirtualListRef } from '../virtual-list';
import VirtualList from '../virtual-list';
import type { RefOptionListProps } from './BaseSelect';
import { SelectContext } from './context';
import useBaseProps from './hooks/useBaseProps';
import type { BaseOptionType, FlattenOptionData, RawValueType } from './interface';
import TransBtn from './TransBtn';

export type OptionListProps = Record<string, never>;

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
    disabled,
    notFoundContent,
    onPopupScroll,
  } = useBaseProps();
  const {
    flattenOptions,
    optionRender,
    onActiveValue,
    defaultActiveFirstOption,
    onSelect,
    menuItemSelectedIcon,
    rawValues,
    virtual,
    listHeight,
    listItemHeight,
    className,
  } = React.useContext(SelectContext);

  const semanticCls = useSemanticCls(className, 'select', { open, disabled });

  const itemPrefixCls = `${prefixCls}-item`;

  const memoFlattenOptions = useMemo(
    () => flattenOptions,
    [open, flattenOptions],
    (prev, next) => !!next[0] && prev[1] !== next[1],
  );

  // =========================== List ===========================
  const listRef = React.useRef<VirtualListRef>(null);

  const onListMouseDown: React.MouseEventHandler<HTMLDivElement> = (event) => {
    event.preventDefault();
  };

  const scrollIntoView = (args: number | ScrollConfig) => {
    if (listRef.current) {
      listRef.current.scrollTo(
        typeof args === 'number' ? { index: args, align: 'center' } : { align: 'center', ...args },
      );
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
      const { key, ctrlKey } = event;
      switch (key) {
        // >>> Arrow keys & ctrl + n/p on Mac
        case 'n':
        case 'N':
        case 'p':
        case 'P':
        case 'ArrowUp':
        case 'ArrowDown': {
          let offset = 0;
          if (key === 'ArrowUp') {
            offset = -1;
          } else if (key === 'ArrowDown') {
            offset = 1;
          } else if (isPlatformMac() && ctrlKey) {
            if (key === 'n' || key === 'N') {
              offset = 1;
            } else if (key === 'p' || key === 'P') {
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
        case 'Enter': {
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
        case 'Escape': {
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

  const useVirtual = virtual ? memoFlattenOptions.length > listHeight / listItemHeight + 8 : false;

  return (
    <>
      {virtual && (
        <div {...a11yProps} style={{ height: 0, width: 0, overflow: 'hidden' }}>
          {renderItem(activeIndex - 1)}
          {renderItem(activeIndex)}
          {renderItem(activeIndex + 1)}
        </div>
      )}
      <VirtualList<FlattenOptionData<BaseOptionType>>
        itemKey="key"
        ref={listRef}
        data={memoFlattenOptions}
        onMouseDown={onListMouseDown}
        onScroll={onPopupScroll}
        virtual={useVirtual}
        {...(useVirtual && { style: { height: listHeight } })}
        increaseViewportBy={200}
        autoHeight={[0, listHeight]}
        // virtuoso 容器不支持 padding，使用Header,Footer占位解决
        components={{
          Header: () => <div className="h-1" />,
          Footer: () => <div className="h-1" />,
        }}
        renderItem={(item, itemIndex) => {
          const { group, groupOption, data, label, value, disabled } = item;

          const selected = isSelected(value!);

          const optionSemanticCls = getSemanticCls([semanticCls.option, data.className], {
            group,
            active: activeIndex === itemIndex && !disabled,
            disabled,
            grouped: groupOption,
            selected,
          });

          // 远程分页请求 Loading
          if (data.__loading__) {
            return (
              <div
                className={clsx(
                  itemPrefixCls,
                  `${itemPrefixCls}-loading`,
                  'relative flex cursor-default select-none items-center justify-center px-3 py-1',
                )}
              >
                <Spin size="small" />
              </div>
            );
          }

          // Group
          if (group) {
            const groupTitle = data.title ?? (isTitleType(label) ? label!.toString() : undefined);

            return (
              <div
                className={clsx(
                  itemPrefixCls,
                  `${itemPrefixCls}-group cursor-auto px-3 py-2 text-xs text-text-tertiary`,
                  optionSemanticCls.label,
                )}
                title={groupTitle}
              >
                {label}
              </div>
            );
          }

          const { title, style } = data;

          // Option
          const optionPrefixCls = `${itemPrefixCls}-option`;
          const optionClassName = clsx(
            itemPrefixCls,
            optionPrefixCls,
            'relative flex cursor-pointer select-none items-center py-2 pl-3 pr-10 text-sm',
            {
              [`${optionPrefixCls}-grouped`]: groupOption,
              [`${optionPrefixCls}-active`]: activeIndex === itemIndex && !disabled,
              [`${optionPrefixCls}-disabled`]: disabled,
              [`${optionPrefixCls}-selected`]: selected,
            },
            {
              'pl-6': groupOption,
              'bg-primary text-white': activeIndex === itemIndex && !disabled,
              'cursor-not-allowed text-text-tertiary': disabled,
              'font-semibold': selected,
            },
            optionSemanticCls.root,
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
              <div
                className={clsx(
                  `${optionPrefixCls}-content`,
                  'w-full truncate',
                  optionSemanticCls.label,
                )}
              >
                {typeof optionRender === 'function'
                  ? optionRender(item, { index: itemIndex })
                  : content}
              </div>
              {iconVisible && (
                <TransBtn
                  className={clsx(
                    `${itemPrefixCls}-option-state`,
                    'absolute inset-y-0 right-0 flex items-center pr-3',
                    {
                      'text-primary': selected,
                      'text-white': activeIndex === itemIndex && !disabled,
                    },
                    optionSemanticCls.state,
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
      ></VirtualList>
    </>
  );
};

const RefOptionList = React.forwardRef(OptionList);
RefOptionList.displayName = 'OptionList';

export default RefOptionList;
