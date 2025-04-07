import * as React from 'react';
import type { SemanticClassName } from '@util/classNameUtils';
import { clsx, mergeSemanticCls } from '@util/classNameUtils';
import usePlaceholder from '@util/hooks/usePlaceholder';
import useSemanticCls from '@util/hooks/useSemanticCls';
import type { InputStatus } from '@util/statusUtils';
import { getMergedStatus, getStatusClassNames } from '@util/statusUtils';
import useLayoutEffect from 'rc-util/es/hooks/useLayoutEffect';
import useMergedState from 'rc-util/es/hooks/useMergedState';
import type { Variant } from '../config-provider';
import DisabledContext from '../config-provider/DisabledContext';
import useSize from '../config-provider/hooks/useSize';
import type { SizeType } from '../config-provider/SizeContext';
import { FormItemInputContext } from '../form/context';
import useVariant from '../form/hooks/useVariant';
import type { ScrollbarProps } from '../scrollbar';
import { useCompactItemContext } from '../space/Compact';
import type { TransitionProps } from '../transition';
import type { AlignType, BuildInPlacements } from '../trigger';
import type { ScrollConfig, ScrollTo } from '../virtual-list';
import { BaseSelectContext } from './hooks/useBaseProps';
import useDelayReset from './hooks/useDelayReset';
import useLock from './hooks/useLock';
import useSelectTriggerControl from './hooks/useSelectTriggerControl';
import type { BaseOptionType } from './interface';
import type { InnerSelectorProps, RefSelectorProps } from './Selector';
import Selector from './Selector';
import type { RefTriggerProps } from './SelectTrigger';
import SelectTrigger from './SelectTrigger';
import TransBtn from './TransBtn';
import { getSeparatedContent } from './utils/valueUtil';

const DEFAULT_OMIT_PROPS = [
  'value',
  'onChange',
  'removeIcon',
  'placeholder',
  'autoFocus',
  'maxTagCount',
  'maxTagTextLength',
  'maxTagPlaceholder',
  'onInputKeyDown',
  'onPopupScroll',
  'tabIndex',
] as const;

export type RenderNode = React.ReactNode | ((props: any) => React.ReactNode);

export type RenderDOMFunc = (props: any) => HTMLElement;

export type Mode = 'multiple' | 'tags' | 'combobox';

export type Placement = 'bottomLeft' | 'bottomRight' | 'topLeft' | 'topRight';

export type RawValueType = string | number;

export type DisplayInfoType = 'add' | 'remove' | 'clear';

export interface RefOptionListProps {
  onKeyDown: React.KeyboardEventHandler;
  onKeyUp: React.KeyboardEventHandler;
  scrollTo?: (args: number | ScrollConfig) => void;
}

export type CustomTagProps = {
  label: React.ReactNode;
  value: any;
  disabled: boolean;
  onClose: (event?: React.MouseEvent<HTMLElement, MouseEvent>) => void;
  closable: boolean;
};

export interface DisplayValueType {
  key?: React.Key;
  value?: RawValueType;
  label?: React.ReactNode;
  title?: string | number;
  disabled?: boolean;
}

export interface BaseSelectRef {
  focus: () => void;
  blur: () => void;
  scrollTo: ScrollTo;
}

export interface BaseSelectPrivateProps {
  // >>> MISC
  id: string;
  prefixCls: string;
  omitDomProps?: string[];

  // >>> Value
  displayValues: DisplayValueType[];
  onDisplayValuesChange: (
    values: DisplayValueType[],
    info: {
      type: DisplayInfoType;
      values: DisplayValueType[];
    },
  ) => void;

  // >>> Active
  /** Current dropdown list active item string value */
  activeValue?: string;
  /** Link search input with target element */
  activeDescendantId?: string;
  onActiveValueChange?: (value: string | null) => void;

  // >>> Search
  searchValue: string;
  autoClearSearchValue?: boolean;
  /** Trigger onSearch, return false to prevent trigger open event */
  onSearch: (
    searchValue: string,
    info: {
      source:
        | 'typing' //User typing
        | 'effect' // Code logic trigger
        | 'submit' // tag mode only
        | 'blur-sm'; // Not trigger event
    },
  ) => void;
  /** Trigger when search text match the `tokenSeparators`. Will provide split content */
  onSearchSplit?: (words: string[]) => void;

  // >>> Dropdown
  OptionList: React.ForwardRefExoticComponent<
    React.PropsWithoutRef<any> & React.RefAttributes<RefOptionListProps>
  >;
  /** Tell if provided `options` is empty */
  emptyOptions: boolean;
  zIndex?: number;
}

export type BaseSelectPropsWithoutPrivate = Omit<BaseSelectProps, keyof BaseSelectPrivateProps>;

export interface BaseSelectProps extends BaseSelectPrivateProps, React.AriaAttributes {
  className?: SemanticClassName<
    {
      popup?: string;
      arrow?: string;
      option?: BaseOptionType['className'];
      selector?: InnerSelectorProps['className'];
      clear?: string;
    },
    { open?: boolean; disabled?: boolean }
  >;
  style?: React.CSSProperties;
  title?: string;
  showSearch?: boolean;
  tagRender?: (props: CustomTagProps) => React.ReactElement;
  maxLength?: number;

  // MISC
  tabIndex?: number;
  autoFocus?: boolean;
  notFoundContent?: React.ReactNode;
  placeholder?: React.ReactNode;
  onClear?: () => void;

  // >>> Size
  size?: SizeType;

  // >>> Variant
  variant?: Variant;

  status?: InputStatus;

  // >>> Mode
  mode?: Mode;

  // >>> Status
  disabled?: boolean;
  loading?: boolean;

  // >>> Open
  open?: boolean;
  defaultOpen?: boolean;
  onPopupOpenChange?: (open: boolean) => void;

  // >>> Customize Input
  /** @private Internal usage. Do not use in your production. */
  getInputElement?: () => JSX.Element;

  // >>> Selector
  maxTagTextLength?: number;
  maxTagCount?: number | 'responsive';
  maxTagPlaceholder?: React.ReactNode | ((omittedValues: DisplayValueType[]) => React.ReactNode);

  // >>> Search
  tokenSeparators?: string[];

  // >>> Icons
  allowClear?: boolean | { clearIcon?: RenderNode };
  suffixIcon?: RenderNode;
  /** Selector remove icon */
  removeIcon?: RenderNode;

  // >>> Popup
  transition?: Partial<TransitionProps>;
  popupMatchSelectWidth?: boolean | number;
  popupRender?: (menu: React.ReactElement) => React.ReactElement;
  popupAlign?: AlignType;
  placement?: Placement;
  builtinPlacements?: BuildInPlacements;
  getPopupContainer?: RenderDOMFunc;

  // >>> Focus
  showAction?: ('focus' | 'click')[];
  onBlur?: React.FocusEventHandler<HTMLElement>;
  onFocus?: React.FocusEventHandler<HTMLElement>;

  // >>> Rest Events
  onKeyUp?: React.KeyboardEventHandler<HTMLDivElement>;
  onKeyDown?: React.KeyboardEventHandler<HTMLDivElement>;
  onMouseDown?: React.MouseEventHandler<HTMLDivElement>;
  onPopupScroll?: ScrollbarProps['onScroll'];
  onInputKeyDown?: React.KeyboardEventHandler<HTMLInputElement | HTMLTextAreaElement>;
  onMouseEnter?: React.MouseEventHandler<HTMLDivElement>;
  onMouseLeave?: React.MouseEventHandler<HTMLDivElement>;
  onClick?: React.MouseEventHandler<HTMLDivElement>;
}

export function isMultiple(mode?: Mode) {
  return mode === 'tags' || mode === 'multiple';
}

const BaseSelect = React.forwardRef((props: BaseSelectProps, ref: React.Ref<BaseSelectRef>) => {
  const {
    id,
    prefixCls,
    className,
    showSearch,
    tagRender,
    omitDomProps,
    size: customizeSize,
    variant: customizeVariant,
    status: customStatus,

    // Value
    displayValues,
    onDisplayValuesChange,
    emptyOptions,
    notFoundContent = 'Not Found',
    onClear,

    // Mode
    mode,

    // Status
    disabled: customDisabled,
    loading,

    // Customize Input
    getInputElement,

    // Open
    open,
    defaultOpen,
    onPopupOpenChange,

    // Active
    activeValue,
    onActiveValueChange,
    activeDescendantId,

    // Search
    searchValue,
    autoClearSearchValue,
    onSearch,
    onSearchSplit,
    tokenSeparators,

    // Icons
    allowClear,
    suffixIcon,

    // Dropdown
    OptionList,
    transition,
    popupMatchSelectWidth,
    popupRender,
    popupAlign,
    placement,
    builtinPlacements,
    getPopupContainer,

    // Focus
    showAction = [],
    onFocus,
    onBlur,

    // Rest Events
    onKeyUp,
    onKeyDown,
    onMouseDown,

    zIndex,

    placeholder: customPlaceholder,

    // Rest Props
    ...restProps
  } = props;

  // ============================== MISC ==============================
  const multiple = isMultiple(mode);

  const placeholder = usePlaceholder('select', customPlaceholder);

  const domProps = {
    ...restProps,
  } as Omit<keyof typeof restProps, (typeof DEFAULT_OMIT_PROPS)[number]>;

  DEFAULT_OMIT_PROPS.forEach((propName) => {
    // @ts-ignore
    delete domProps[propName];
  });

  omitDomProps?.forEach((propName) => {
    // @ts-ignore
    delete domProps[propName];
  });

  const { isCompactItem, compactSize, compactItemClassnames } = useCompactItemContext(prefixCls);
  const mergedSize = useSize((ctx) => customizeSize ?? compactSize ?? ctx);

  const [variant, enableVariantCls] = useVariant(customizeVariant);

  // ===================== Disabled =====================
  const disabled = React.useContext(DisabledContext);
  const mergedDisabled = customDisabled ?? disabled;

  // ===================== Form Status =====================
  const { status: contextStatus, isFormItemInput } = React.useContext(FormItemInputContext);
  const mergedStatus = getMergedStatus(contextStatus, customStatus);

  // ============================== Refs ==============================
  const containerRef = React.useRef<HTMLDivElement>(null);
  const selectorDomRef = React.useRef<HTMLDivElement>(null);
  const triggerRef = React.useRef<RefTriggerProps>(null);
  const selectorRef = React.useRef<RefSelectorProps>(null);
  const listRef = React.useRef<RefOptionListProps>(null);

  /** Used for component focused management */
  const [mockFocused, setMockFocused, cancelSetMockFocused] = useDelayReset();

  // =========================== Imperative ===========================
  React.useImperativeHandle(ref, () => ({
    focus: () => selectorRef.current?.focus(),
    blur: () => selectorRef.current?.blur(),
    scrollTo: (arg) => listRef.current?.scrollTo?.(arg),
  }));

  // ========================== Search Value ==========================
  const mergedSearchValue = React.useMemo(() => {
    if (mode !== 'combobox') {
      return searchValue;
    }

    const val = displayValues[0]?.value;

    return typeof val === 'string' || typeof val === 'number' ? String(val) : '';
  }, [searchValue, mode, displayValues]);

  // ========================== Custom Input ==========================
  // Only works in `combobox`
  const customizeInputElement =
    (mode === 'combobox' && typeof getInputElement === 'function' && getInputElement()) || null;

  // ============================== Open ==============================
  // SSR not support Portal which means we need delay `open` for the first time render
  const [rendered, setRendered] = React.useState(false);
  useLayoutEffect(() => {
    setRendered(true);
  }, []);

  const [innerOpen, setInnerOpen] = useMergedState<boolean>(false, {
    defaultValue: defaultOpen,
    value: open,
  });

  let mergedOpen = rendered ? innerOpen : false;

  // Not trigger `open` in `combobox` when `notFoundContent` is empty
  const emptyListContent = !notFoundContent && emptyOptions;
  if (mergedDisabled || (emptyListContent && mergedOpen && mode === 'combobox')) {
    mergedOpen = false;
  }
  const triggerOpen = emptyListContent ? false : mergedOpen;

  const onToggleOpen = React.useCallback(
    (newOpen?: boolean) => {
      const nextOpen = newOpen !== undefined ? newOpen : !mergedOpen;

      if (!mergedDisabled) {
        setInnerOpen(nextOpen);

        if (mergedOpen !== nextOpen) {
          onPopupOpenChange?.(nextOpen);
        }
      }
    },
    [mergedDisabled, mergedOpen, setInnerOpen, onPopupOpenChange],
  );

  // ============================= Search =============================
  const tokenWithEnter = React.useMemo(
    () => (tokenSeparators || []).some((tokenSeparator) => ['\n', '\r\n'].includes(tokenSeparator)),
    [tokenSeparators],
  );

  const onInternalSearch = (searchText: string, fromTyping: boolean, isCompositing: boolean) => {
    let ret = true;
    let newSearchText = searchText;
    onActiveValueChange?.(null);

    // Check if match the `tokenSeparators`
    const patchLabels = isCompositing ? null : getSeparatedContent(searchText, tokenSeparators);

    // Ignore combobox since it's not split-able
    if (mode !== 'combobox' && patchLabels) {
      newSearchText = '';

      onSearchSplit?.(patchLabels);

      // Should close when paste finish
      onToggleOpen(false);

      // Tell Selector that break next actions
      ret = false;
    }

    if (onSearch && mergedSearchValue !== newSearchText) {
      onSearch(newSearchText, {
        source: fromTyping ? 'typing' : 'effect',
      });
    }

    return ret;
  };

  // Only triggered when menu is closed & mode is tags
  // If menu is open, OptionList will take charge
  // If mode isn't tags, press enter is not meaningful when you can't see any option
  const onInternalSearchSubmit = (searchText: string) => {
    // prevent empty tags from appearing when you click the Enter button
    if (!searchText || !searchText.trim()) {
      return;
    }
    onSearch(searchText, { source: 'submit' });
  };

  // Close will clean up single mode search text
  React.useEffect(() => {
    if (!mergedOpen && !multiple && mode !== 'combobox') {
      onInternalSearch('', false, false);
    }
  }, [mergedOpen]);

  // ============================ Disabled ============================
  // Close dropdown & remove focus state when disabled change
  React.useEffect(() => {
    if (innerOpen && mergedDisabled) {
      setInnerOpen(false);
    }

    if (mergedDisabled) {
      setMockFocused(false);
    }
  }, [mergedDisabled]);

  // ============================ Keyboard ============================
  /**
   * We record input value here to check if can press to clean up by backspace
   * - null: Key is not down, this is reset by key up
   * - true: Search text is empty when first time backspace down
   * - false: Search text is not empty when first time backspace down
   */
  const [getClearLock, setClearLock] = useLock();

  // KeyDown
  const onInternalKeyDown: React.KeyboardEventHandler<HTMLDivElement> = (event, ...rest) => {
    const clearLock = getClearLock();
    const { key } = event;

    if (key === 'Enter') {
      // Do not submit form when type in the input
      if (mode !== 'combobox') {
        event.preventDefault();
      }

      // We only manage open state here, close logic should handle by list component
      if (!mergedOpen) {
        onToggleOpen(true);
      }
    }

    setClearLock(!!mergedSearchValue);

    // Remove value by `backspace`
    if (
      key === 'Backspace' &&
      !clearLock &&
      multiple &&
      !mergedSearchValue &&
      displayValues.length
    ) {
      const cloneDisplayValues = [...displayValues];
      let removedDisplayValue = null;

      for (let i = cloneDisplayValues.length - 1; i >= 0; i -= 1) {
        const current = cloneDisplayValues[i];

        if (!current.disabled) {
          cloneDisplayValues.splice(i, 1);
          removedDisplayValue = current;
          break;
        }
      }

      if (removedDisplayValue) {
        onDisplayValuesChange(cloneDisplayValues, {
          type: 'remove',
          values: [removedDisplayValue],
        });
      }
    }

    if (mergedOpen && listRef.current) {
      listRef.current.onKeyDown(event, ...rest);
    }

    onKeyDown?.(event, ...rest);
  };

  // KeyUp
  const onInternalKeyUp: React.KeyboardEventHandler<HTMLDivElement> = (event, ...rest) => {
    if (mergedOpen && listRef.current) {
      listRef.current.onKeyUp(event, ...rest);
    }

    onKeyUp?.(event, ...rest);
  };

  // ============================ Selector ============================
  const onSelectorRemove = (val: DisplayValueType) => {
    const newValues = displayValues.filter((i) => i !== val);

    onDisplayValuesChange(newValues, {
      type: 'remove',
      values: [val],
    });
  };

  // ========================== Focus / Blur ==========================
  /** Record real focus status */
  const focusRef = React.useRef<boolean>(false);

  const onContainerFocus: React.FocusEventHandler<HTMLElement> = (...args) => {
    setMockFocused(true);

    if (!mergedDisabled) {
      if (onFocus && !focusRef.current) {
        onFocus(...args);
      }

      // `showAction` should handle `focus` if set
      if (showAction.includes('focus')) {
        onToggleOpen(true);
      }
    }

    focusRef.current = true;
  };

  const onContainerBlur: React.FocusEventHandler<HTMLElement> = (...args) => {
    setMockFocused(false, () => {
      focusRef.current = false;
      onToggleOpen(false);
    });

    if (mergedDisabled) {
      return;
    }

    if (mergedSearchValue) {
      // `tags` mode should move `searchValue` into values
      if (mode === 'tags') {
        onSearch(mergedSearchValue, { source: 'submit' });
      } else if (mode === 'multiple') {
        // `multiple` mode only clean the search value but not trigger event
        onSearch('', {
          source: 'blur-sm',
        });
      }
    }

    if (onBlur) {
      onBlur(...args);
    }
  };

  // Give focus back of Select
  const activeTimeoutIds: any[] = [];
  React.useEffect(
    () => () => {
      activeTimeoutIds.forEach((timeoutId) => clearTimeout(timeoutId));
      activeTimeoutIds.splice(0, activeTimeoutIds.length);
    },
    [],
  );

  const onInternalMouseDown: React.MouseEventHandler<HTMLDivElement> = (event, ...restArgs) => {
    const { target } = event;
    const popupElement = triggerRef.current?.getPopupElement();

    // We should give focus back to selector if clicked item is not focusable
    if (popupElement && popupElement.contains(target as HTMLElement)) {
      const timeoutId = setTimeout(() => {
        const index = activeTimeoutIds.indexOf(timeoutId);
        if (index !== -1) {
          activeTimeoutIds.splice(index, 1);
        }

        cancelSetMockFocused();
        setMockFocused(false);

        // if (!popupElement.contains(document.activeElement)) {
        //   selectorRef.current?.focus();
        // }
      });

      activeTimeoutIds.push(timeoutId);
    }

    onMouseDown?.(event, ...restArgs);
  };

  // ============================ Dropdown ============================
  const [, forceUpdate] = React.useState({});
  // We need force update here since popup dom is render async
  function onPopupMouseEnter() {
    forceUpdate({});
  }

  // Close when click on non-select element
  useSelectTriggerControl(
    () => [containerRef.current, triggerRef.current?.getPopupElement()],
    triggerOpen,
    onToggleOpen,
  );

  // ============================ Context =============================
  const baseSelectContext = React.useMemo(
    () => ({
      ...props,
      placeholder,
      notFoundContent,
      open: mergedOpen,
      triggerOpen,
      id,
      showSearch,
      multiple,
      toggleOpen: onToggleOpen,
      disabled: mergedDisabled,
    }),
    [props, notFoundContent, triggerOpen, mergedOpen, id, showSearch, multiple, onToggleOpen],
  );

  // ==================================================================
  // ==                            Render                            ==
  // ==================================================================

  const semanticCls = useSemanticCls(className, 'select', {
    open: mockFocused || mergedOpen,
    disabled: mergedDisabled,
  });

  // ============================= Clear ==============================
  let clearNode: React.ReactNode;
  const onClearMouseDown: React.MouseEventHandler<HTMLSpanElement> = () => {
    onClear?.();

    // selectorRef.current?.focus();

    onDisplayValuesChange([], {
      type: 'clear',
      values: displayValues,
    });
    onInternalSearch('', false, false);
  };

  if (
    !mergedDisabled &&
    allowClear &&
    (displayValues.length || mergedSearchValue) &&
    !(mode === 'combobox' && mergedSearchValue === '')
  ) {
    const clearIcon = typeof allowClear === 'object' ? allowClear.clearIcon : undefined;
    clearNode = (
      <TransBtn
        className={clsx(
          `${prefixCls}-clear`,
          'text-text-tertiary hover:text-text-secondary absolute inset-y-0 right-3 z-1 flex cursor-pointer items-center opacity-0 transition-all',
          'group-hover/select:opacity-100',
          mode === 'combobox' && 'opacity-100',
          semanticCls.clear,
        )}
        onMouseDown={onClearMouseDown}
        customizeIcon={clearIcon}
      />
    );
  }

  // ============================= Arrow ==============================
  const showSuffixIcon = !!suffixIcon || loading;
  let arrowNode: React.ReactNode;

  if (showSuffixIcon) {
    arrowNode = (
      <TransBtn
        className={clsx(
          `${prefixCls}-arrow`,
          'text-text-tertiary pointer-events-none absolute inset-y-0 right-3 inline-flex items-center gap-2',
          {
            [`${prefixCls}-arrow-loading`]: loading,
            'group-hover/select:opacity-0': !!clearNode,
            'opacity-0': !!clearNode && mode === 'combobox',
            'right-2': mergedSize === 'mini',
          },
          semanticCls.arrow,
        )}
        customizeIcon={suffixIcon}
        customizeIconProps={{
          loading,
          searchValue: mergedSearchValue,
          open: mergedOpen,
          focused: mockFocused,
          showSearch,
        }}
      />
    );
  }

  // =========================== OptionList ===========================
  const optionList = <OptionList ref={listRef} />;

  // ============================= Style =============================
  const rootCls = clsx(
    prefixCls,
    {
      [`${prefixCls}-focused`]: mockFocused,
      [`${prefixCls}-multiple`]: multiple,
      [`${prefixCls}-single`]: !multiple,
      [`${prefixCls}-allow-clear`]: allowClear,
      [`${prefixCls}-show-arrow`]: showSuffixIcon,
      [`${prefixCls}-disabled`]: mergedDisabled,
      [`${prefixCls}-loading`]: loading,
      [`${prefixCls}-open`]: mergedOpen,
      [`${prefixCls}-customize-input`]: customizeInputElement,
      [`${prefixCls}-show-search`]: showSearch,
      [`${prefixCls}-lg`]: mergedSize === 'large',
      [`${prefixCls}-sm`]: mergedSize === 'small',
      [`${prefixCls}-mini`]: mergedSize === 'mini',
      [`${prefixCls}-in-form-item`]: isFormItemInput,
      [`${prefixCls}-${variant}`]: enableVariantCls,
    },
    !customizeInputElement && [
      'group/select bg-container text-text outline-border relative inline-block rounded-md text-sm shadow-xs outline-1 -outline-offset-1',
      { ['rounded-sm']: mergedSize === 'mini' },
      {
        'bg-container outline-1': variant === 'outlined',
        'bg-transparent shadow-none outline-0': variant === 'borderless',
        'bg-fill-quinary outline-0': variant === 'filled',
      },
      'in-[.input-addon]:-mx-3 in-[.input-addon]:bg-transparent in-[.input-addon]:shadow-none in-[.input-addon]:outline-0',
      { 'w-full': isFormItemInput },
      compactItemClassnames,
      (mockFocused || mergedOpen) && {
        'outline-primary outline-2 -outline-offset-2': true,
        'outline-0': variant === 'borderless',
        'bg-container': variant === 'filled',
        'z-2': isCompactItem,
      },
      getStatusClassNames(mergedStatus, variant, mockFocused || mergedOpen),
      mergedDisabled && {
        'bg-fill-quaternary text-text-tertiary': true,
        'not-allowed bg-fill-quaternary text-text-tertiary outline-border':
          variant !== 'borderless',
      },
    ],
    semanticCls.root,
  );

  const selectorCls = clsx(
    !customizeInputElement && {
      'px-2 py-1 after:leading-5': mergedSize === 'mini',
      'px-3 py-1 after:leading-6': mergedSize === 'small',
      'px-3 py-1 after:leading-7': mergedSize === 'middle',
      'px-3 py-1 after:leading-8': mergedSize === 'large',
      'py-0.5 ps-1 pe-9 after:my-0.5': multiple,
    },
  );

  const selectorSearchCls = clsx(
    !customizeInputElement && [
      {
        'pe-7': showSuffixIcon && !multiple,
        'start-2 end-2': mergedSize === 'mini' && !multiple,
      },
      multiple && {
        'ms-1': mergedSize === 'mini' && displayValues.length === 0,
        'h-6': mergedSize === 'mini',
        'h-5': mergedSize === 'small',
      },
    ],
  );

  const selectorPlaceholderCls = clsx({
    'pe-7': showSuffixIcon,
    'start-2 end-2': mergedSize === 'mini' && multiple,
  });

  const selectorItemCls = clsx(
    { 'pe-7': showSuffixIcon && !multiple },
    {
      'rounded-xs leading-4': mergedSize === 'mini',
      'leading-5': mergedSize === 'small',
      'leading-6': mergedSize === 'middle',
      'leading-7': mergedSize === 'large',
    },
    multiple && {
      'ps-2 pe-1 leading-5': mergedSize === 'mini',
      'leading-6': mergedSize === 'small',
      'leading-7': mergedSize === 'middle',
      'leading-8': mergedSize === 'large',
    },
  );

  const popupCls = clsx(
    'bg-container outline-border-secondary absolute rounded-md text-sm shadow-lg outline-1 backdrop-blur-2xl',
    semanticCls.popup,
  );

  // ============================= Select =============================
  // >>> Selector
  const selectorNode = (
    <SelectTrigger
      ref={triggerRef}
      disabled={!!mergedDisabled}
      prefixCls={prefixCls}
      open={triggerOpen}
      popupElement={optionList}
      transition={transition}
      popupClassName={popupCls}
      popupMatchSelectWidth={popupMatchSelectWidth}
      popupRender={popupRender}
      popupAlign={popupAlign}
      placement={placement}
      zIndex={zIndex}
      builtinPlacements={builtinPlacements}
      getPopupContainer={getPopupContainer}
      empty={emptyOptions}
      getTriggerDOMNode={() => selectorDomRef.current!}
      onPopupMouseEnter={onPopupMouseEnter}
    >
      <Selector
        {...props}
        placeholder={placeholder}
        domRef={selectorDomRef}
        prefixCls={prefixCls}
        className={mergeSemanticCls(
          {
            root: selectorCls,
            search: selectorSearchCls,
            item: selectorItemCls,
            placeholder: selectorPlaceholderCls,
          },
          semanticCls.selector,
        )}
        inputElement={customizeInputElement}
        ref={selectorRef}
        id={id}
        showSearch={showSearch}
        autoClearSearchValue={!!autoClearSearchValue}
        mode={mode}
        activeDescendantId={activeDescendantId}
        tagRender={tagRender}
        values={displayValues}
        open={mergedOpen}
        onToggleOpen={onToggleOpen}
        activeValue={activeValue!}
        searchValue={mergedSearchValue}
        onSearch={onInternalSearch}
        onSearchSubmit={onInternalSearchSubmit}
        onRemove={onSelectorRemove}
        tokenWithEnter={tokenWithEnter}
      />
    </SelectTrigger>
  );

  // >>> Render
  let renderNode = (
    <div
      className={rootCls}
      {...domProps}
      ref={containerRef}
      onMouseDown={onInternalMouseDown}
      onKeyDown={onInternalKeyDown}
      onKeyUp={onInternalKeyUp}
      onFocus={onContainerFocus}
      onBlur={onContainerBlur}
    >
      {mockFocused && !mergedOpen && (
        <span
          style={{
            width: 0,
            height: 0,
            position: 'absolute',
            overflow: 'hidden',
            opacity: 0,
          }}
          aria-live="polite"
        >
          {/* Merge into one string to make screen reader work as expect */}
          {`${displayValues
            .map(({ label, value }) =>
              ['number', 'string'].includes(typeof label) ? label : value,
            )
            .join(', ')}`}
        </span>
      )}
      {selectorNode}
      {arrowNode}
      {clearNode}
    </div>
  );

  return (
    <BaseSelectContext.Provider value={baseSelectContext}>{renderNode}</BaseSelectContext.Provider>
  );
});

// Set display name for dev
if (process.env.NODE_ENV !== 'production') {
  BaseSelect.displayName = 'BaseSelect';
}

export default BaseSelect;
