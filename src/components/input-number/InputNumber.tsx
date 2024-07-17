import getMiniDecimal, {
  DecimalClass,
  getNumberPrecision,
  num2str,
  toFixed,
  validateNumber,
  ValueType,
} from '@rc-component/mini-decimal';
import { useLayoutUpdateEffect } from 'rc-util/lib/hooks/useLayoutEffect';
import proxyObject from 'rc-util/lib/proxyObject';
import { composeRef } from 'rc-util/lib/ref';
import * as React from 'react';
import { clsx, getSemanticCls, SemanticClassName } from '../_util/classNameUtils';
import BaseInput, { HolderRef } from '../input/BaseInput';
import { InputFocusOptions } from '../input/interface';
import { triggerFocus } from '../input/utils';
import useCursor from './hooks/useCursor';
import useFrame from './hooks/useFrame';
import StepHandler from './StepHandler';
import { getDecimalIfValidate, getDecimalValue, getDecupleSteps } from './utils';

export type { ValueType };

export interface InputNumberRef extends HTMLInputElement {
  nativeElement: HTMLElement;
}

export interface InputNumberProps<T extends ValueType = ValueType>
  extends Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    'value' | 'defaultValue' | 'onInput' | 'onChange' | 'prefix' | 'suffix' | 'className'
  > {
  /** value will show as string */
  stringMode?: boolean;

  defaultValue?: T;
  value?: T;

  prefixCls?: string;
  className?: SemanticClassName<'input' | 'prefix' | 'suffix'>;
  style?: React.CSSProperties;
  min?: T;
  max?: T;
  step?: ValueType;
  tabIndex?: number;
  controls?: boolean;
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
  addonBefore?: React.ReactNode;
  addonAfter?: React.ReactNode;

  // Customize handler node
  upHandler?: React.ReactNode;
  downHandler?: React.ReactNode;
  keyboard?: boolean;
  changeOnWheel?: boolean;

  /** Parse display value to validate number */
  parser?: (displayValue: string | undefined) => T;
  /** Transform `value` to display value show in input */
  formatter?: (value: T | undefined, info: { userTyping: boolean; input: string }) => string;
  /** Syntactic sugar of `formatter`. Config precision of display. */
  precision?: number;
  /** Syntactic sugar of `formatter`. Config decimal separator of display. */
  decimalSeparator?: string;

  onInput?: (text: string) => void;
  onChange?: (value: T | null) => void;
  onPressEnter?: React.KeyboardEventHandler<HTMLInputElement>;

  onStep?: (value: T, info: { offset: ValueType; type: 'up' | 'down' }) => void;

  /**
   * Trigger change onBlur event.
   * If disabled, user must press enter or click handler to confirm the value update
   */
  changeOnBlur?: boolean;
}

type InternalInputNumberProps = Omit<InputNumberProps, 'prefix' | 'suffix' | 'className'> & {
  prefixCls: string;
  domRef: React.Ref<HTMLDivElement>;
  className?: string;
};

const InternalInputNumber = React.forwardRef(
  (props: InternalInputNumberProps, ref: React.Ref<HTMLInputElement>) => {
    const {
      prefixCls,
      className,
      style,
      min,
      max,
      step = 1,
      defaultValue,
      value,
      disabled,
      readOnly,
      upHandler,
      downHandler,
      keyboard,
      changeOnWheel = false,
      controls = true,

      stringMode,

      parser,
      formatter,
      precision,
      decimalSeparator,

      onChange,
      onInput,
      onPressEnter,
      onStep,

      changeOnBlur = true,

      domRef,

      ...inputProps
    } = props;

    const inputClassName = `${prefixCls}-input`;

    const inputRef = React.useRef<HTMLInputElement>(null!);

    const [focus, setFocus] = React.useState(false);

    const userTypingRef = React.useRef(false);
    const compositionRef = React.useRef(false);
    const shiftKeyRef = React.useRef(false);

    // ============================ Value =============================
    // Real value control
    const [decimalValue, setDecimalValue] = React.useState<DecimalClass>(() =>
      getMiniDecimal(value ?? defaultValue!),
    );

    function setUncontrolledDecimalValue(newDecimal: DecimalClass) {
      if (value === undefined) {
        setDecimalValue(newDecimal);
      }
    }

    // ====================== Parser & Formatter ======================
    /**
     * `precision` is used for formatter & onChange.
     * It will auto generate by `value` & `step`.
     * But it will not block user typing.
     *
     * Note: Auto generate `precision` is used for legacy logic.
     * We should remove this since we already support high precision with BigInt.
     *
     * @param number  Provide which number should calculate precision
     * @param userTyping  Change by user typing
     */
    const getPrecision = React.useCallback(
      (numStr: string, userTyping: boolean) => {
        if (userTyping) {
          return undefined;
        }

        if (precision && precision >= 0) {
          return precision;
        }

        return Math.max(getNumberPrecision(numStr), getNumberPrecision(step));
      },
      [precision, step],
    );

    // >>> Parser
    const mergedParser = React.useCallback(
      (num?: string | number) => {
        const numStr = String(num);

        if (parser) {
          return parser(numStr);
        }

        let parsedStr = numStr;
        if (decimalSeparator) {
          parsedStr = parsedStr.replace(decimalSeparator, '.');
        }

        // [Legacy] We still support auto convert `$ 123,456` to `123456`
        return parsedStr.replace(/[^\w.-]+/g, '');
      },
      [parser, decimalSeparator],
    );

    // >>> Formatter
    const inputValueRef = React.useRef<string | number>('');
    const mergedFormatter = React.useCallback(
      (number: string, userTyping: boolean) => {
        if (formatter) {
          return formatter(number, { userTyping, input: String(inputValueRef.current) });
        }

        let str = typeof number === 'number' ? num2str(number) : number;

        // User typing will not auto format with precision directly
        if (!userTyping) {
          const mergedPrecision = getPrecision(str, userTyping);

          if (
            validateNumber(str) &&
            (decimalSeparator || (mergedPrecision && mergedPrecision >= 0))
          ) {
            // Separator
            const separatorStr = decimalSeparator || '.';

            str = toFixed(str, separatorStr, mergedPrecision);
          }
        }

        return str;
      },
      [formatter, getPrecision, decimalSeparator],
    );

    // ========================== InputValue ==========================
    /**
     * Input text value control
     *
     * User can not update input content directly. It updates with follow rules by priority:
     *  1. controlled `value` changed
     *    * [SPECIAL] Typing like `1.` should not immediately convert to `1`
     *  2. User typing with format (not precision)
     *  3. Blur or Enter trigger revalidate
     */
    const [inputValue, setInternalInputValue] = React.useState(() => {
      const initValue = defaultValue ?? value;
      if (decimalValue.isInvalidate() && ['string', 'number'].includes(typeof initValue)) {
        return Number.isNaN(initValue) ? '' : initValue;
      }
      return mergedFormatter(decimalValue.toString(), false);
    });
    inputValueRef.current = inputValue ?? '';

    // Should always be string
    function setInputValue(newValue: DecimalClass, userTyping: boolean) {
      setInternalInputValue(
        mergedFormatter(
          // Invalidate number is sometime passed by external control, we should let it go
          // Otherwise is controlled by internal interactive logic which check by userTyping
          // You can ref 'show limited value when input is not focused' test for more info.
          newValue.isInvalidate() ? newValue.toString(false) : newValue.toString(!userTyping),
          userTyping,
        ),
      );
    }

    // >>> Max & Min limit
    const maxDecimal = React.useMemo(() => getDecimalIfValidate(max), [max, precision]);
    const minDecimal = React.useMemo(() => getDecimalIfValidate(min), [min, precision]);

    const upDisabled = React.useMemo(() => {
      if (!maxDecimal || !decimalValue || decimalValue.isInvalidate()) {
        return false;
      }

      return maxDecimal.lessEquals(decimalValue);
    }, [maxDecimal, decimalValue]);

    const downDisabled = React.useMemo(() => {
      if (!minDecimal || !decimalValue || decimalValue.isInvalidate()) {
        return false;
      }

      return decimalValue.lessEquals(minDecimal);
    }, [minDecimal, decimalValue]);

    // Cursor controller
    const [recordCursor, restoreCursor] = useCursor(inputRef.current, focus);

    // ============================= Data =============================
    /**
     * Find target value closet within range.
     * e.g. [11, 28]:
     *    3  => 11
     *    23 => 23
     *    99 => 28
     */
    const getRangeValue = (target: DecimalClass) => {
      // target > max
      if (maxDecimal && !target.lessEquals(maxDecimal)) {
        return maxDecimal;
      }

      // target < min
      if (minDecimal && !minDecimal.lessEquals(target)) {
        return minDecimal;
      }

      return null;
    };

    /**
     * Check value is in [min, max] range
     */
    const isInRange = (target: DecimalClass) => !getRangeValue(target);

    /**
     * Trigger `onChange` if value validated and not equals of origin.
     * Return the value that re-align in range.
     */
    const triggerValueUpdate = (newValue: DecimalClass, userTyping: boolean): DecimalClass => {
      let updateValue = newValue;

      let isRangeValidate = isInRange(updateValue) || updateValue.isEmpty();

      // Skip align value when trigger value is empty.
      // We just trigger onChange(null)
      // This should not block user typing
      if (!updateValue.isEmpty() && !userTyping) {
        // Revert value in range if needed
        updateValue = getRangeValue(updateValue) || updateValue;
        isRangeValidate = true;
      }

      if (!readOnly && !disabled && isRangeValidate) {
        const numStr = updateValue.toString();
        const mergedPrecision = getPrecision(numStr, userTyping);
        if (mergedPrecision && mergedPrecision >= 0) {
          updateValue = getMiniDecimal(toFixed(numStr, '.', mergedPrecision));

          if (!isInRange(updateValue)) {
            updateValue = getMiniDecimal(toFixed(numStr, '.', mergedPrecision, true));
          }
        }

        // Trigger event
        if (!updateValue.equals(decimalValue)) {
          setUncontrolledDecimalValue(updateValue);
          onChange?.(updateValue.isEmpty() ? null : getDecimalValue(stringMode, updateValue));

          // Reformat input if value is not controlled
          if (value === undefined) {
            setInputValue(updateValue, userTyping);
          }
        }

        return updateValue;
      }

      return decimalValue;
    };

    // ========================== User Input ==========================
    const onNextPromise = useFrame();

    // >>> Collect input value
    const collectInputValue = (inputStr: string) => {
      recordCursor();

      // Update inputValue in case input can not parse as number
      // Refresh ref value immediately since it may used by formatter
      inputValueRef.current = inputStr;
      setInternalInputValue(inputStr);

      // Parse number
      if (!compositionRef.current) {
        const finalValue = mergedParser(inputStr);
        const finalDecimal = getMiniDecimal(finalValue);
        if (!finalDecimal.isNaN()) {
          triggerValueUpdate(finalDecimal, true);
        }
      }

      // Trigger onInput later to let user customize value if they want to handle something after onChange
      onInput?.(inputStr);

      // optimize for chinese input experience
      // https://github.com/ant-design/ant-design/issues/8196
      onNextPromise(() => {
        let nextInputStr = inputStr;
        if (!parser) {
          nextInputStr = inputStr.replace(/。/g, '.');
        }

        if (nextInputStr !== inputStr) {
          collectInputValue(nextInputStr);
        }
      });
    };

    // >>> Composition
    const onCompositionStart = () => {
      compositionRef.current = true;
    };

    const onCompositionEnd = () => {
      compositionRef.current = false;

      collectInputValue(inputRef.current.value);
    };

    // >>> Input
    const onInternalInput: React.ChangeEventHandler<HTMLInputElement> = (e) => {
      collectInputValue(e.target.value);
    };

    // ============================= Step =============================
    const onInternalStep = (up: boolean) => {
      // Ignore step since out of range
      if ((up && upDisabled) || (!up && downDisabled)) {
        return;
      }

      // Clear typing status since it may be caused by up & down key.
      // We should sync with input value.
      userTypingRef.current = false;

      let stepDecimal = getMiniDecimal(shiftKeyRef.current ? getDecupleSteps(step) : step);
      if (!up) {
        stepDecimal = stepDecimal.negate();
      }

      const target = (decimalValue || getMiniDecimal(0)).add(stepDecimal.toString());

      const updatedValue = triggerValueUpdate(target, false);

      onStep?.(getDecimalValue(stringMode, updatedValue), {
        offset: shiftKeyRef.current ? getDecupleSteps(step) : step,
        type: up ? 'up' : 'down',
      });

      inputRef.current?.focus();
    };

    // ============================ Flush =============================
    /**
     * Flush current input content to trigger value change & re-formatter input if needed.
     * This will always flush input value for update.
     * If it's invalidate, will fallback to last validate value.
     */
    const flushInputValue = (userTyping: boolean) => {
      const parsedValue = getMiniDecimal(mergedParser(inputValue));
      let formatValue: DecimalClass;

      if (!parsedValue.isNaN()) {
        // Only validate value or empty value can be re-fill to inputValue
        // Reassign the formatValue within ranged of trigger control
        formatValue = triggerValueUpdate(parsedValue, userTyping);
      } else {
        formatValue = triggerValueUpdate(decimalValue, userTyping);
      }

      if (value !== undefined) {
        // Reset back with controlled value first
        setInputValue(decimalValue, false);
      } else if (!formatValue.isNaN()) {
        // Reset input back since no validate value
        setInputValue(formatValue, false);
      }
    };

    // Solve the issue of the event triggering sequence when entering numbers in chinese input (Safari)
    const onBeforeInput = () => {
      userTypingRef.current = true;
    };

    const onKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (event) => {
      const { key, shiftKey } = event;
      userTypingRef.current = true;

      shiftKeyRef.current = shiftKey;

      if (key === 'Enter') {
        if (!compositionRef.current) {
          userTypingRef.current = false;
        }
        flushInputValue(false);
        onPressEnter?.(event);
      }

      if (keyboard === false) {
        return;
      }

      // Do step
      if (!compositionRef.current && ['Up', 'ArrowUp', 'Down', 'ArrowDown'].includes(key)) {
        onInternalStep(key === 'Up' || key === 'ArrowUp');
        event.preventDefault();
      }
    };

    const onKeyUp = () => {
      userTypingRef.current = false;
      shiftKeyRef.current = false;
    };

    React.useEffect(() => {
      if (changeOnWheel && focus) {
        const onWheel = (event: HTMLElementEventMap['wheel']) => {
          // moving mouse wheel rises wheel event with deltaY < 0
          // scroll value grows from top to bottom, as screen Y coordinate
          onInternalStep(event.deltaY < 0);
          event.preventDefault();
        };
        const input = inputRef.current;
        if (input) {
          // React onWheel is passive and we can't preventDefault() in it.
          // That's why we should subscribe with DOM listener
          // https://stackoverflow.com/questions/63663025/react-onwheel-handler-cant-preventdefault-because-its-a-passive-event-listenev
          input.addEventListener('wheel', onWheel, { passive: false });
          return () => input.removeEventListener('wheel', onWheel);
        }
      }
    });

    // >>> Focus & Blur
    const onBlur = () => {
      if (changeOnBlur) {
        flushInputValue(false);
      }

      setFocus(false);

      userTypingRef.current = false;
    };

    // ========================== Controlled ==========================
    // Input by precision & formatter
    useLayoutUpdateEffect(() => {
      if (!decimalValue.isInvalidate()) {
        setInputValue(decimalValue, false);
      }
    }, [precision, formatter]);

    // Input by value
    useLayoutUpdateEffect(() => {
      const newValue = getMiniDecimal(value!);
      setDecimalValue(newValue);

      const currentParsedValue = getMiniDecimal(mergedParser(inputValue));

      // When user typing from `1.2` to `1.`, we should not convert to `1` immediately.
      // But let it go if user set `formatter`
      if (!newValue.equals(currentParsedValue) || !userTypingRef.current || formatter) {
        // Update value as effect
        setInputValue(newValue, userTypingRef.current);
      }
    }, [value]);

    // ============================ Cursor ============================
    useLayoutUpdateEffect(() => {
      if (formatter) {
        restoreCursor();
      }
    }, [inputValue]);

    // ============================ Render ============================
    return (
      <div
        ref={domRef}
        className={clsx(
          prefixCls,
          {
            [`${prefixCls}-focused`]: focus,
            [`${prefixCls}-disabled`]: disabled,
            [`${prefixCls}-readonly`]: readOnly,
            [`${prefixCls}-not-a-number`]: decimalValue.isNaN(),
            [`${prefixCls}-out-of-range`]: !decimalValue.isInvalidate() && !isInRange(decimalValue),
          },
          className,
        )}
        style={style}
        onFocus={() => {
          setFocus(true);
        }}
        onBlur={onBlur}
        onKeyDown={onKeyDown}
        onKeyUp={onKeyUp}
        onCompositionStart={onCompositionStart}
        onCompositionEnd={onCompositionEnd}
        onBeforeInput={onBeforeInput}
      >
        {controls && (
          <StepHandler
            prefixCls={prefixCls}
            upNode={upHandler}
            downNode={downHandler}
            upDisabled={upDisabled}
            downDisabled={downDisabled}
            onStep={onInternalStep}
          />
        )}
        <div className={`${inputClassName}-wrap`}>
          <input
            autoComplete="off"
            role="spinbutton"
            aria-valuemin={min as any}
            aria-valuemax={max as any}
            aria-valuenow={decimalValue.isInvalidate() ? null : (decimalValue.toString() as any)}
            step={step}
            {...inputProps}
            ref={composeRef(inputRef, ref)}
            className={inputClassName}
            value={inputValue}
            onChange={onInternalInput}
            disabled={disabled}
            readOnly={readOnly}
          />
        </div>
      </div>
    );
  },
);

const InputNumber = React.forwardRef<InputNumberRef, InputNumberProps>((props, ref) => {
  const {
    disabled,
    style,
    prefixCls = 'rc-input-number',
    value,
    prefix,
    suffix,
    addonBefore,
    addonAfter,
    className,
    ...rest
  } = props;

  const semanticCls = getSemanticCls(className);

  const holderRef = React.useRef<HolderRef>(null!);
  const inputNumberDomRef = React.useRef<HTMLDivElement>(null);
  const inputFocusRef = React.useRef<HTMLInputElement>(null!);

  const focus = (option?: InputFocusOptions) => {
    if (inputFocusRef.current) {
      triggerFocus(inputFocusRef.current, option);
    }
  };

  React.useImperativeHandle(
    ref,
    () =>
      proxyObject(inputFocusRef.current, {
        nativeElement: holderRef.current.nativeElement || inputNumberDomRef.current,
      }) as InputNumberRef,
  );

  return (
    <BaseInput
      className={className}
      triggerFocus={focus}
      prefixCls={prefixCls}
      value={value}
      disabled={disabled}
      style={style}
      prefix={prefix}
      suffix={suffix}
      addonAfter={addonAfter}
      addonBefore={addonBefore}
      components={{
        affixWrapper: 'div',
        groupWrapper: 'div',
        wrapper: 'div',
        groupAddon: 'div',
      }}
      ref={holderRef}
    >
      <InternalInputNumber
        prefixCls={prefixCls}
        disabled={disabled}
        ref={inputFocusRef}
        domRef={inputNumberDomRef}
        className={semanticCls.input}
        {...rest}
      />
    </BaseInput>
  );
}) as (<T extends ValueType = ValueType>(
  props: React.PropsWithChildren<InputNumberProps<T>> & {
    ref?: React.Ref<HTMLInputElement>;
  },
) => React.ReactElement) & { displayName?: string };

if (process.env.NODE_ENV !== 'production') {
  InputNumber.displayName = 'InputNumber';
}

export default InputNumber;
