import * as React from 'react';
import { flushSync } from 'react-dom';
import raf from 'rc-util/es/raf';
import { ConfigContext } from '../../config-provider';
import type { TooltipPlacement } from '../../tooltip';
import SliderContext, { SliderInternalContext } from '../context';
import useRafLock from '../hooks/useRafLock';
import type { OnStartMove, SliderTooltipProps } from '../interface';
import { getIndex, getTipFormatter } from '../util';
import type { HandleProps } from './Handle';
import Handle from './Handle';
import SliderTooltip from './Tooltip';

export interface HandlesProps {
  prefixCls: string;
  style?: React.CSSProperties | React.CSSProperties[];
  values: number[];
  onStartMove: OnStartMove;
  onOffsetChange: (value: number | 'min' | 'max', valueIndex: number) => void;
  onFocus?: (e: React.FocusEvent<HTMLDivElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLDivElement>) => void;
  draggingIndex: number;
  onChangeComplete?: () => void;
  tooltip?: SliderTooltipProps;
}

export interface HandlesRef {
  focus: (index: number) => void;
  hideHelp: VoidFunction;
}

const Handles = React.forwardRef<HandlesRef, HandlesProps>((props, ref) => {
  const {
    prefixCls,
    style,
    onStartMove,
    onOffsetChange,
    values,
    draggingIndex,
    onFocus,
    onBlur,
    tooltip = {},
    ...restProps
  } = props;
  const { getPopupContainer } = React.useContext(ConfigContext);
  const { range, direction } = React.useContext(SliderContext);
  const { handleRender: contextHandleRender } = React.useContext(SliderInternalContext);

  const handlesRef = React.useRef<Record<number, HTMLDivElement>>({});

  // =========================== Active ===========================
  const [activeVisible, setActiveVisible] = React.useState(false);
  const [activeIndex, setActiveIndex] = React.useState(-1);

  const [hoverOpen, setHoverOpen] = useRafLock();
  const [focusOpen, setFocusOpen] = useRafLock();

  const tooltipProps: SliderTooltipProps = {
    ...tooltip,
  };
  const {
    open: tooltipOpen,
    placement: tooltipPlacement,
    getPopupContainer: getTooltipPopupContainer,
    prefixCls: customizeTooltipPrefixCls,
    formatter: tipFormatter,
  } = tooltipProps;

  const lockOpen = tooltipOpen;
  const activeOpen = (hoverOpen || focusOpen) && lockOpen !== false;

  const mergedTipFormatter = getTipFormatter(tipFormatter);

  const getTooltipPlacement = (placement?: TooltipPlacement) => {
    if (placement) {
      return placement;
    }
    if (direction === 'ltr' || direction === 'rtl') {
      return 'top';
    }
    return 'right';
  };

  React.useEffect(() => {
    const onMouseUp = () => {
      // Delay for 1 frame to make the click to enable hide tooltip
      // even when the handle is focused
      raf(() => {
        setFocusOpen(false);
      }, 1);
    };
    document.addEventListener('mouseup', onMouseUp);

    return () => {
      document.removeEventListener('mouseup', onMouseUp);
    };
  }, []);

  const useActiveTooltipHandle = range && !lockOpen;

  const onActive = (index: number) => {
    setActiveIndex(index);
    setActiveVisible(true);
  };

  const onHandleFocus = (e: React.FocusEvent<HTMLDivElement>, index: number) => {
    onActive(index);
    onFocus?.(e);
  };

  const onHandleMouseEnter = (e: React.MouseEvent<HTMLDivElement>, index: number) => {
    onActive(index);
  };

  React.useImperativeHandle(ref, () => ({
    focus: (index: number) => {
      handlesRef.current[index]?.focus();
    },
    hideHelp: () => {
      flushSync(() => {
        setActiveVisible(false);
      });
    },
  }));

  // =========================== Render ===========================
  const handleRender: HandleProps['render'] = (node, info) => {
    const { index } = info;

    const nodeProps = node.props;

    const passedProps: typeof nodeProps = {
      ...nodeProps,
      onMouseEnter: (e) => {
        setHoverOpen(true);
        nodeProps.onMouseEnter?.(e);
      },
      onMouseLeave: (e) => {
        setHoverOpen(false);
        nodeProps.onMouseLeave?.(e);
      },
      onMouseDown: (e) => {
        setFocusOpen(true);
        nodeProps.onMouseDown?.(e);
      },
      onFocus: (e) => {
        setFocusOpen(true);
        onFocus?.(e);
        nodeProps.onFocus?.(e);
      },
      onBlur: (e) => {
        setFocusOpen(false);
        onBlur?.(e);
        nodeProps.onBlur?.(e);
      },
    };

    const cloneNode = React.cloneElement(node, passedProps);

    const open = (!!lockOpen || activeOpen) && mergedTipFormatter !== null;

    // Wrap on handle with Tooltip when is single mode or multiple with all show tooltip
    if (!useActiveTooltipHandle) {
      return (
        <SliderTooltip
          {...tooltipProps}
          prefixCls={customizeTooltipPrefixCls ?? `${prefixCls}-tooltip`}
          title={mergedTipFormatter ? mergedTipFormatter(info.value) : ''}
          open={open}
          placement={getTooltipPlacement(tooltipPlacement)}
          key={index}
          getPopupContainer={getTooltipPopupContainer || getPopupContainer}
        >
          {cloneNode}
        </SliderTooltip>
      );
    }

    return cloneNode;
  };

  const activeHandleRender: HandleProps['render'] = useActiveTooltipHandle
    ? (handle, info) => {
        const cloneNode = React.cloneElement(handle, {
          style: {
            ...handle.props.style,
            visibility: 'hidden',
          },
        });

        return (
          <SliderTooltip
            {...tooltipProps}
            prefixCls={customizeTooltipPrefixCls ?? `${prefixCls}-tooltip`}
            title={mergedTipFormatter ? mergedTipFormatter(info.value) : ''}
            open={mergedTipFormatter !== null && activeOpen}
            placement={getTooltipPlacement(tooltipPlacement)}
            key="tooltip"
            getPopupContainer={getTooltipPopupContainer || getPopupContainer}
          >
            {cloneNode}
          </SliderTooltip>
        );
      }
    : undefined;

  const handleProps = {
    prefixCls,
    onStartMove,
    onOffsetChange,
    render: contextHandleRender ?? handleRender,
    onFocus: onHandleFocus,
    onMouseEnter: onHandleMouseEnter,
    ...restProps,
  };

  return (
    <>
      {values.map<React.ReactNode>((value, index) => {
        const dragging = draggingIndex === index;

        return (
          <Handle
            ref={(node) => {
              if (!node) {
                delete handlesRef.current[index];
              } else {
                handlesRef.current[index] = node;
              }
            }}
            dragging={dragging}
            style={getIndex(style, index)}
            key={index}
            value={value}
            valueIndex={index}
            {...handleProps}
          />
        );
      })}

      {/* Used for render tooltip, this is not a real handle */}
      {activeHandleRender && activeVisible && (
        <Handle
          key="a11y"
          {...handleProps}
          value={values[activeIndex]}
          valueIndex={null}
          dragging={draggingIndex !== -1}
          render={activeHandleRender}
          style={{ pointerEvents: 'none' }}
          tabIndex={undefined}
          aria-hidden
        />
      )}
    </>
  );
});

export default Handles;
