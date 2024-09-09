import * as React from 'react';
import ResizeObserver from 'rc-resize-observer';
import { useEvent } from 'rc-util';
import { clsx, getSemanticCls } from '../../../_util/classNameUtils';
import type { RangePickerRef, SelectorProps } from '../../interface';
import { pickProps } from '../../utils/miscUtil';
import { getOffsetUnit } from '../../utils/uiUtil';
import PickerContext from '../context';
import type { RangeValueType } from '../RangePicker';
import useInputProps from './hooks/useInputProps';
import Icon, { ClearIcon } from './Icon';
import Input, { type InputRef } from './Input';
import SeparatorIcon from './SeparatorIcon';

export type SelectorIdType =
  | string
  | {
      start?: string;
      end?: string;
    };

export interface RangeSelectorProps<DateType = any> extends SelectorProps<DateType> {
  id?: SelectorIdType;

  activeIndex: number;

  separator?: React.ReactNode;

  value?: RangeValueType<DateType>;
  onChange: (date: DateType, index?: number) => void;

  disabled: [boolean, boolean];

  /** All the field show as `placeholder` */
  allHelp: boolean;

  placeholder?: string | [string, string];

  // Invalid
  invalid: [boolean, boolean];
  placement?: string;
  // Offset
  /**
   * Trigger when the active bar offset position changed.
   * This is used for popup panel offset.
   */
  onActiveOffset: (offset: number) => void;
}

function RangeSelector<DateType extends object = any>(
  props: RangeSelectorProps<DateType>,
  ref: React.Ref<RangePickerRef>,
) {
  const {
    id,

    clearIcon,
    suffixIcon,
    separator,
    activeIndex,

    focused,

    // Placeholder
    placeholder,

    // Style
    className,
    style,

    // Click
    onClick,
    onClear,

    // Change
    value = [],

    // Disabled
    disabled,
    invalid,

    // Offset
    onActiveOffset,
    placement,

    // Native
    onMouseDown,

    autoFocus,
  } = props;

  // ======================== Prefix ========================
  const { prefixCls } = React.useContext(PickerContext);

  const semanticCls = getSemanticCls(className);

  // ========================== Id ==========================
  const ids = React.useMemo(() => {
    if (typeof id === 'string') {
      return [id];
    }

    const mergedId = id || {};

    return [mergedId.start, mergedId.end];
  }, [id]);

  // ========================= Refs =========================
  const rootRef = React.useRef<HTMLDivElement>(null);
  const inputStartRef = React.useRef<InputRef>(null);
  const inputEndRef = React.useRef<InputRef>(null);

  const getInput = (index: number) => [inputStartRef, inputEndRef][index]?.current;

  React.useImperativeHandle(ref, () => ({
    nativeElement: rootRef.current!,
    focus: (options) => {
      if (typeof options === 'object') {
        const { index = 0, ...rest } = options || {};
        getInput(index)?.focus(rest);
      } else {
        getInput(options ?? 0)?.focus();
      }
    },
    blur: () => {
      getInput(0)?.blur();
      getInput(1)?.blur();
    },
  }));

  // ===================== Placeholder ======================
  const mergedPlaceholder = React.useMemo<[string | undefined, string | undefined]>(
    () => (Array.isArray(placeholder) ? placeholder : [placeholder, placeholder]),
    [placeholder],
  );

  // ======================== Inputs ========================
  const [getInputProps] = useInputProps({
    ...(props as any),
    id: ids,
    placeholder: mergedPlaceholder,
  });

  // ====================== ActiveBar =======================
  const offsetUnit = getOffsetUnit(placement);
  const placementRight = placement?.toLowerCase().endsWith('right');
  const [activeBarStyle, setActiveBarStyle] = React.useState<React.CSSProperties>({
    position: 'absolute',
    width: 0,
  });

  const syncActiveOffset = useEvent(() => {
    const input = getInput(activeIndex);
    if (input) {
      const { offsetWidth, offsetLeft, offsetParent } = input.nativeElement;
      const parentWidth = (offsetParent as HTMLElement)?.offsetWidth | 0;
      const activeOffset = placementRight ? parentWidth - offsetWidth - offsetLeft : offsetLeft;
      setActiveBarStyle((ori) => ({
        ...ori,
        width: offsetWidth,
        [offsetUnit]: activeOffset,
      }));
      onActiveOffset(activeOffset);
    }
  });

  React.useEffect(() => {
    syncActiveOffset();
  }, [activeIndex]);

  // ======================== Clear =========================
  const showClear = clearIcon && ((value[0] && !disabled[0]) || (value[1] && !disabled[1]));

  // ======================= Disabled =======================
  const startAutoFocus = autoFocus && !disabled[0];
  const endAutoFocus = autoFocus && !startAutoFocus && !disabled[1];

  // ======================== Style ========================
  const rootCls = clsx(
    prefixCls,
    `${prefixCls}-range`,
    {
      [`${prefixCls}-focused`]: focused,
      [`${prefixCls}-disabled`]: disabled.every((i) => i),
      [`${prefixCls}-invalid`]: invalid.some((i) => i),
    },
    semanticCls.root,
  );
  const separatorCls = clsx(
    `${prefixCls}-range-separator`,
    'flex h-6 items-center px-2 text-lg leading-6 text-text-quaternary',
  );
  const activeBarCls = clsx(
    `${prefixCls}-active-bar`,
    'pointer-events-none bottom-px h-0.5 rounded-full bg-primary opacity-0 transition-all duration-300 ease-out',
    {
      'opacity-100': activeIndex > -1,
    },
  );

  // ======================== Render ========================
  return (
    <ResizeObserver onResize={syncActiveOffset}>
      <div
        {...pickProps(props, ['onMouseEnter', 'onMouseLeave'])}
        className={rootCls}
        style={style}
        ref={rootRef}
        onClick={onClick}
        // Not lose current input focus
        onMouseDown={(e) => {
          const { target } = e;
          if (
            target !== inputStartRef.current?.inputElement &&
            target !== inputEndRef.current?.inputElement
          ) {
            e.preventDefault();
          }

          onMouseDown?.(e);
        }}
      >
        <Input
          ref={inputStartRef}
          {...getInputProps(0)}
          autoFocus={startAutoFocus}
          date-range="start"
        />
        <div className={separatorCls}>{separator ?? <SeparatorIcon />}</div>
        <Input ref={inputEndRef} {...getInputProps(1)} autoFocus={endAutoFocus} date-range="end" />
        <div className={activeBarCls} style={activeBarStyle} />
        <Icon
          type="suffix"
          icon={suffixIcon}
          className="transition-opacity group-hover/selector:opacity-0 group-hover/selector:last:opacity-100"
        />
        {showClear && <ClearIcon icon={clearIcon} onClear={onClear} className="end-3" />}
      </div>
    </ResizeObserver>
  );
}

const RefRangeSelector = React.forwardRef(RangeSelector);

if (process.env.NODE_ENV !== 'production') {
  RefRangeSelector.displayName = 'RangeSelector';
}

export default RefRangeSelector;
