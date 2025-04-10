import * as React from 'react';
import useLayoutEffect from '@rc-component/util/es/hooks/useLayoutEffect';
import useMergedState from '@rc-component/util/es/hooks/useMergedState';
import omit from '@rc-component/util/es/omit';
import raf from '@rc-component/util/es/raf';
import { clsx } from '@util/classNameUtils';
import ResizeObserver from 'rc-resize-observer';
import type { ResizableTextAreaRef, TextAreaProps } from './interface';
import { calculateAutoSizeStyle } from './utils';

const RESIZE_START = 0;
const RESIZE_MEASURING = 1;
const RESIZE_STABLE = 2;

const ResizableTextArea = React.forwardRef<
  ResizableTextAreaRef,
  Omit<TextAreaProps, 'className'> & { className?: string; onInternalAutoSize?: VoidFunction }
>((props, ref) => {
  const {
    prefixCls,
    defaultValue,
    value,
    autoSize,
    onResize,
    className,
    style,
    disabled,
    onChange,
    // Test only
    onInternalAutoSize,
    ...restProps
  } = props;

  // =============================== Value ================================
  const [mergedValue, setMergedValue] = useMergedState(defaultValue, {
    value,
    postState: (val) => val ?? '',
  });

  const onInternalChange: React.ChangeEventHandler<HTMLTextAreaElement> = (event) => {
    setMergedValue(event.target.value);
    onChange?.(event.target.value, event);
  };

  // ================================ Ref =================================
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);

  React.useImperativeHandle(ref, () => ({
    textArea: textareaRef.current!,
  }));

  // ============================== AutoSize ==============================
  const [minRows, maxRows] = React.useMemo(() => {
    if (autoSize && typeof autoSize === 'object') {
      return [autoSize.minRows, autoSize.maxRows];
    }

    return [];
  }, [autoSize]);

  const needAutoSize = !!autoSize;

  // =============================== Scroll ===============================
  const fixFirefoxAutoScroll = () => {
    try {
      if (textareaRef.current && document.activeElement === textareaRef.current) {
        const { selectionStart, selectionEnd, scrollTop } = textareaRef.current;

        textareaRef.current.setSelectionRange(selectionStart, selectionEnd);
        textareaRef.current.scrollTop = scrollTop;
      }
    } catch (e) {
      // Fix error in Chrome:
      // Failed to read the 'selectionStart' property from 'HTMLInputElement'
      // http://stackoverflow.com/q/21177489/3040605
    }
  };

  // =============================== Resize ===============================
  const [resizeState, setResizeState] = React.useState(RESIZE_STABLE);
  const [autoSizeStyle, setAutoSizeStyle] = React.useState<React.CSSProperties>();

  const startResize = () => {
    setResizeState(RESIZE_START);
    if (process.env.NODE_ENV === 'test') {
      onInternalAutoSize?.();
    }
  };

  // Change to trigger resize measure
  useLayoutEffect(() => {
    if (needAutoSize) {
      startResize();
    }
  }, [value, minRows, maxRows, needAutoSize]);

  useLayoutEffect(() => {
    if (resizeState === RESIZE_START) {
      setResizeState(RESIZE_MEASURING);
    } else if (resizeState === RESIZE_MEASURING) {
      const textareaStyles = calculateAutoSizeStyle(textareaRef.current!, false, minRows, maxRows);

      setResizeState(RESIZE_STABLE);
      setAutoSizeStyle(textareaStyles);
    } else {
      fixFirefoxAutoScroll();
    }
  }, [resizeState]);

  // We lock resize trigger by raf to avoid Safari warning
  const resizeRafRef = React.useRef<number>(null);
  const cleanRaf = () => {
    raf.cancel(resizeRafRef.current!);
  };

  const onInternalResize = (size: { width: number; height: number }) => {
    if (resizeState === RESIZE_STABLE) {
      onResize?.(size);

      if (autoSize) {
        cleanRaf();
        resizeRafRef.current = raf(() => {
          startResize();
        });
      }
    }
  };

  React.useEffect(() => cleanRaf, []);

  // =============================== Render ===============================
  const mergedAutoSizeStyle = needAutoSize ? autoSizeStyle : null;

  const mergedStyle = {
    ...style,
    ...mergedAutoSizeStyle,
  };

  if (resizeState === RESIZE_START || resizeState === RESIZE_MEASURING) {
    mergedStyle.overflowY = 'hidden';
    mergedStyle.overflowX = 'hidden';
  }

  const otherProps = omit(restProps, ['onPressEnter', 'size', 'status', 'variant']);

  return (
    <ResizeObserver onResize={onInternalResize} disabled={!(autoSize || onResize)}>
      <textarea
        {...otherProps}
        ref={textareaRef}
        style={mergedStyle}
        className={clsx(
          prefixCls,
          {
            [`${prefixCls}-disabled`]: disabled,
          },
          className,
        )}
        disabled={disabled}
        value={mergedValue as string}
        onChange={onInternalChange}
      />
    </ResizeObserver>
  );
});

export default ResizableTextArea;
