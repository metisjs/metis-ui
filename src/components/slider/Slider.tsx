import { useEvent, useMergedState } from 'rc-util';
import isEqual from 'rc-util/es/isEqual';

import React from 'react';
import { clsx, getSemanticCls } from '../_util/classNameUtils';
import { devUseWarning } from '../_util/warning';
import { ConfigContext } from '../config-provider';
import DisabledContext from '../config-provider/DisabledContext';
import Handles, { HandlesRef } from './Handles';
import Marks, { InternalMarkObj } from './Marks';
import Steps from './Steps';
import Tracks from './Tracks';
import SliderContext, { SliderContextProps } from './context';
import useDrag from './hooks/useDrag';
import useOffset from './hooks/useOffset';
import { Direction, SliderRangeProps, SliderRef, SliderSingleProps } from './interface';

const Slider = React.forwardRef<SliderRef, SliderSingleProps | SliderRangeProps>((props, ref) => {
  const {
    prefixCls: customizePrefixCls,
    range,
    className,
    style,
    disabled,
    tooltip,
    marks,
    vertical,
    reverse,
    min = 0,
    max = 100,
    step = 1,
    value,
    defaultValue,
    autoFocus,
    dots,
    keyboard = true,
    included = true,
    track,
    railStyle,
    handleStyle,
    onChange,
    onChangeComplete,
    onFocus,
    onBlur,
  } = props;

  const handlesRef = React.useRef<HandlesRef>(null);
  const containerRef = React.useRef<HTMLDivElement>(null);

  const { getPrefixCls } = React.useContext(ConfigContext);
  const contextDisabled = React.useContext(DisabledContext);
  const mergedDisabled = disabled ?? contextDisabled;

  const direction = React.useMemo<Direction>(() => {
    if (vertical) {
      return reverse ? 'ttb' : 'btt';
    }
    return reverse ? 'rtl' : 'ltr';
  }, [reverse, vertical]);

  const mergedMin = React.useMemo(() => (isFinite(min) ? min : 0), [min]);
  const mergedMax = React.useMemo(() => (isFinite(max) ? max : 100), [max]);

  // ============================= Range =============================
  const [mergedRange, draggableTrack] = React.useMemo(() => {
    if (!range) {
      return [false];
    }

    return typeof range === 'object' ? [true, range.draggableTrack] : [true, false];
  }, [range]);

  // ============================= Step =============================
  const mergedStep = React.useMemo(() => (step !== null && step <= 0 ? 1 : step), [step]);

  // ============================ Marks =============================
  const markList = React.useMemo<InternalMarkObj[]>(() => {
    return Object.entries(marks || {})
      .map<InternalMarkObj>(([key, mark]) => {
        const markObj: InternalMarkObj = {
          value: Number(key),
        };

        if (
          mark &&
          typeof mark === 'object' &&
          !React.isValidElement(mark) &&
          ('label' in mark || 'style' in mark)
        ) {
          markObj.style = mark.style;
          markObj.label = mark.label;
        } else {
          markObj.label = mark as React.ReactNode;
        }

        return markObj;
      })
      .filter(({ label }) => label || typeof label === 'number')
      .sort((a, b) => a.value - b.value);
  }, [marks]);

  // ============================ Format ============================
  const [formatValue, offsetValues] = useOffset(mergedMin, mergedMax, mergedStep, markList);

  // ============================ Values ============================
  const [mergedValue, setValue] = useMergedState<number | number[] | undefined, number[]>(
    defaultValue,
    {
      value,
    },
  );

  const rawValues = React.useMemo(() => {
    const valueList =
      mergedValue === null || mergedValue === undefined
        ? []
        : Array.isArray(mergedValue)
        ? mergedValue
        : [mergedValue];

    const [val0 = mergedMin] = valueList;
    let returnValues = mergedValue === null ? [] : [val0];

    // Format as range
    if (mergedRange) {
      returnValues = [...valueList];

      if (mergedValue === undefined) {
        const pointCount = 2;
        returnValues = returnValues.slice(0, pointCount);

        // Fill with count
        while (returnValues.length < pointCount) {
          returnValues.push(returnValues[returnValues.length - 1] ?? mergedMin);
        }
      }
      returnValues.sort((a, b) => a - b);
    }

    // Align in range
    returnValues.forEach((val, index) => {
      returnValues[index] = formatValue(val);
    });

    return returnValues;
  }, [mergedValue, mergedRange, mergedMin, formatValue]);

  // ============================= Change ==============================
  const getTriggerValue = (triggerValues: number[]) =>
    mergedRange ? triggerValues : triggerValues[0];

  const triggerChange = useEvent((nextValues: number[]) => {
    // Order first
    const cloneNextValues = [...nextValues].sort((a, b) => a - b);

    // Trigger event if needed
    if (onChange && !isEqual(cloneNextValues, rawValues, true)) {
      onChange(getTriggerValue(cloneNextValues) as any);
    }

    // We set this later since it will re-render component immediately
    setValue(cloneNextValues);
  });

  const finishChange = useEvent(() => {
    const finishValue = getTriggerValue(rawValues);
    onChangeComplete?.(finishValue as any);
  });

  const [draggingIndex, draggingValue, cacheValues, onStartDrag] = useDrag(
    containerRef,
    direction,
    rawValues,
    mergedMin,
    mergedMax,
    formatValue,
    triggerChange,
    finishChange,
    offsetValues,
  );

  const changeToCloseValue = (newValue: number, e?: React.MouseEvent) => {
    if (!mergedDisabled) {
      // Create new values
      const cloneNextValues = [...rawValues];

      let valueIndex = 0;
      let valueDist = mergedMax - mergedMin;

      rawValues.forEach((val, index) => {
        const dist = Math.abs(newValue - val);
        if (dist <= valueDist) {
          valueDist = dist;
          valueIndex = index;
        }
      });

      let focusIndex = valueIndex;
      cloneNextValues[valueIndex] = newValue;

      const nextValue = getTriggerValue(cloneNextValues);
      triggerChange(cloneNextValues);

      if (e) {
        (document.activeElement as HTMLElement)?.blur?.();
        handlesRef.current?.focus(focusIndex);
        onStartDrag(e, focusIndex, cloneNextValues);
      } else {
        onChangeComplete?.(nextValue as any);
      }
    }
  };

  // ============================ Click =============================
  const onSliderMouseDown: React.MouseEventHandler<HTMLDivElement> = (e) => {
    e.preventDefault();

    const { width, height, left, top, bottom, right } =
      containerRef.current!.getBoundingClientRect();
    const { clientX, clientY } = e;

    let percent: number;
    switch (direction) {
      case 'btt':
        percent = (bottom - clientY) / height;
        break;

      case 'ttb':
        percent = (clientY - top) / height;
        break;

      case 'rtl':
        percent = (right - clientX) / width;
        break;

      default:
        percent = (clientX - left) / width;
    }

    const nextValue = mergedMin + percent * (mergedMax - mergedMin);
    changeToCloseValue(formatValue(nextValue), e);
  };

  // =========================== Keyboard ===========================
  const [keyboardValue, setKeyboardValue] = React.useState<number | null>(null);

  const onHandleOffsetChange = (offset: number | 'min' | 'max', valueIndex: number) => {
    if (!mergedDisabled) {
      const next = offsetValues(rawValues, offset, valueIndex);

      triggerChange(next.values);

      setKeyboardValue(next.value);
    }
  };

  React.useEffect(() => {
    if (keyboardValue !== null) {
      const valueIndex = rawValues.indexOf(keyboardValue);
      if (valueIndex >= 0) {
        handlesRef.current?.focus(valueIndex);
      }
    }

    setKeyboardValue(null);
  }, [keyboardValue]);

  // ============================= Drag =============================
  const mergedDraggableTrack = React.useMemo(() => {
    if (draggableTrack && mergedStep === null) {
      if (process.env.NODE_ENV !== 'production') {
        const warning = devUseWarning('Slider');
        warning(false, 'usage', '`draggableTrack` is not supported when `step` is `null`.');
      }
      return false;
    }
    return draggableTrack;
  }, [draggableTrack, mergedStep]);

  // Auto focus for updated handle
  const dragging = draggingIndex !== -1;
  React.useEffect(() => {
    if (!dragging) {
      const valueIndex = rawValues.lastIndexOf(draggingValue!);
      handlesRef.current?.focus(valueIndex);
    }
  }, [dragging]);

  // =========================== Included ===========================
  const sortedCacheValues = React.useMemo(
    () => [...cacheValues].sort((a, b) => a - b),
    [cacheValues],
  );

  // Provide a range values with included [min, max]
  // Used for Track, Mark & Dot
  const [includedStart, includedEnd] = React.useMemo(() => {
    if (!mergedRange) {
      return [mergedMin, sortedCacheValues[0]];
    }

    return [sortedCacheValues[0], sortedCacheValues[sortedCacheValues.length - 1]];
  }, [sortedCacheValues, mergedRange, mergedMin]);

  // ============================= Refs =============================
  React.useImperativeHandle(ref, () => ({
    focus: () => {
      handlesRef.current?.focus(0);
    },
    blur: () => {
      const { activeElement } = document;
      if (containerRef.current?.contains(activeElement)) {
        (activeElement as HTMLElement)?.blur();
      }
    },
  }));

  // ========================== Auto Focus ==========================
  React.useEffect(() => {
    if (autoFocus) {
      handlesRef.current?.focus(0);
    }
  }, []);

  // ============================== Style ===============================
  const prefixCls = getPrefixCls('slider', customizePrefixCls);

  const semanticCls = getSemanticCls(className);

  const rootCls = clsx(
    prefixCls,
    {
      [`${prefixCls}-disabled`]: mergedDisabled,
      [`${prefixCls}-vertical`]: vertical,
      [`${prefixCls}-horizontal`]: !vertical,
      [`${prefixCls}-with-marks`]: markList.length,
    },
    'group relative cursor-pointer text-sm text-text',
    { 'mx-3 my-1 h-full px-1': vertical, 'mx-1 my-3 h-3 py-1': !vertical },
    markList.length && { 'mr-8': vertical, 'mb-8': !vertical },
    mergedDisabled && 'cursor-not-allowed opacity-disabled',
    semanticCls.root,
  );

  const railCls = clsx(
    `${prefixCls}-rail`,
    'absolute rounded-full bg-fill-quaternary transition-colors',
    { 'h-full w-1': vertical, 'h-1 w-full': !vertical },
    !mergedDisabled && 'group-hover:bg-fill-tertiary',
    semanticCls.rail,
  );

  // =========================== Context ============================
  const context = React.useMemo<SliderContextProps>(
    () => ({
      min: mergedMin,
      max: mergedMax,
      direction,
      disabled: mergedDisabled,
      keyboard,
      step: mergedStep,
      included,
      includedStart,
      includedEnd,
      range: mergedRange,
      classNames: semanticCls as any,
    }),
    [
      mergedMin,
      mergedMax,
      direction,
      mergedDisabled,
      keyboard,
      mergedStep,
      included,
      includedStart,
      includedEnd,
      mergedRange,
      JSON.stringify(className),
    ],
  );

  // ============================ Render ============================
  return (
    <SliderContext.Provider value={context}>
      <div ref={containerRef} className={rootCls} style={style} onMouseDown={onSliderMouseDown}>
        <div className={railCls} style={railStyle} />

        {track !== false && (
          <Tracks
            prefixCls={prefixCls}
            values={rawValues}
            onStartMove={mergedDraggableTrack ? onStartDrag : undefined}
          />
        )}

        <Steps prefixCls={prefixCls} marks={markList} dots={dots} />

        <Handles
          ref={handlesRef}
          prefixCls={prefixCls}
          values={cacheValues}
          draggingIndex={draggingIndex}
          tooltip={tooltip}
          style={handleStyle}
          onStartMove={onStartDrag}
          onOffsetChange={onHandleOffsetChange}
          onFocus={onFocus}
          onBlur={onBlur}
          onChangeComplete={finishChange}
        />

        <Marks prefixCls={prefixCls} marks={markList} onClick={changeToCloseValue} />
      </div>
    </SliderContext.Provider>
  );
});

if (process.env.NODE_ENV !== 'production') {
  Slider.displayName = 'Slider';
}

export default Slider;
