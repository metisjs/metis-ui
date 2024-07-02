import { isEmpty } from 'lodash';
import type { SliderProps as RcSliderProps } from 'rc-slider';
import RcSlider from 'rc-slider';
import { SemanticName } from 'rc-slider/lib/interface';
import type { SliderProps, SliderRef } from 'rc-slider/lib/Slider';
import raf from 'rc-util/lib/raf';
import React from 'react';
import { SemanticClassName, clsx, getSemanticCls } from '../_util/classNameUtils';
import { ConfigContext } from '../config-provider';
import DisabledContext from '../config-provider/DisabledContext';
import type { AbstractTooltipProps, TooltipPlacement } from '../tooltip';
import SliderTooltip from './SliderTooltip';
import useRafLock from './useRafLock';

export type SliderMarks = RcSliderProps['marks'];

interface HandleGeneratorInfo {
  value?: number;
  dragging?: boolean;
  index: number;
}

export type HandleGeneratorFn = (config: {
  tooltipPrefixCls?: string;
  prefixCls?: string;
  info: HandleGeneratorInfo;
}) => React.ReactElement;

export type Formatter = ((value?: number) => React.ReactNode) | null;

export interface SliderTooltipProps extends AbstractTooltipProps {
  prefixCls?: string;
  open?: boolean;
  placement?: TooltipPlacement;
  getPopupContainer?: (triggerNode: HTMLElement) => HTMLElement;
  formatter?: Formatter;
  autoAdjustOverflow?: boolean;
}

export interface SliderBaseProps {
  prefixCls?: string;
  reverse?: boolean;
  min?: number;
  max?: number;
  step?: null | number;
  marks?: SliderMarks;
  dots?: boolean;
  included?: boolean;
  disabled?: boolean;
  keyboard?: boolean;
  vertical?: boolean;
  className?: SemanticClassName<SemanticName>;
  id?: string;
  style?: React.CSSProperties;
  tooltip?: SliderTooltipProps;
  autoFocus?: boolean;

  onFocus?: React.FocusEventHandler<HTMLDivElement>;
  onBlur?: React.FocusEventHandler<HTMLDivElement>;
}

export interface SliderSingleProps extends SliderBaseProps {
  range?: false;
  value?: number;
  defaultValue?: number;
  onChange?: (value: number) => void;
  onChangeComplete?: (value: number) => void;
}

export interface SliderRangeProps extends SliderBaseProps {
  range: true | SliderRange;
  value?: number[];
  defaultValue?: number[];
  onChange?: (value: number[]) => void;
  onChangeComplete?: (value: number[]) => void;
}

interface SliderRange {
  draggableTrack?: boolean;
}

export type Opens = { [index: number]: boolean };

function getTipFormatter(tipFormatter?: Formatter) {
  if (tipFormatter || tipFormatter === null) {
    return tipFormatter;
  }
  return (val?: number) => (typeof val === 'number' ? val.toString() : '');
}

const Slider = React.forwardRef<SliderRef, SliderSingleProps | SliderRangeProps>((props, ref) => {
  const {
    prefixCls: customizePrefixCls,
    range,
    className,
    style,
    disabled,
    tooltip = {},
    marks,
    onChangeComplete,
    ...restProps
  } = props;

  const { vertical } = props;

  const { getPrefixCls, getPopupContainer } = React.useContext(ConfigContext);
  const contextDisabled = React.useContext(DisabledContext);
  const mergedDisabled = disabled ?? contextDisabled;

  // =============================== Open ===============================
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

  // ============================= Change ==============================
  const [dragging, setDragging] = useRafLock();

  const onInternalChangeComplete: RcSliderProps['onChangeComplete'] = (nextValues) => {
    onChangeComplete?.(nextValues as any);
    setDragging(false);
  };

  // ============================ Placement ============================
  const getTooltipPlacement = (placement?: TooltipPlacement, vert?: boolean) => {
    if (placement) {
      return placement;
    }
    if (!vert) {
      return 'top';
    }
    return 'right';
  };

  // ============================== Style ===============================
  const prefixCls = getPrefixCls('slider', customizePrefixCls);

  const semanticCls = getSemanticCls(className);

  const rootCls = clsx(
    {
      [`${prefixCls}-lock`]: dragging,
    },
    'group relative cursor-pointer py-1 text-sm text-neutral-text',
    { '': vertical, 'mx-1 my-3 h-3 py-1': !vertical },
    !isEmpty(marks) && 'mb-8',
    mergedDisabled && 'cursor-not-allowed opacity-disabled',
    semanticCls.root,
  );

  const railCls = clsx(
    'absolute rounded-full bg-neutral-fill-quaternary transition-colors',
    { '': vertical, 'h-1 w-full': !vertical },
    !mergedDisabled && 'group-hover:bg-neutral-fill-tertiary',
    semanticCls.rail,
  );

  const trackCls = clsx(
    'absolute rounded-full bg-primary',
    { 'w-1': vertical, 'h-1': !vertical },
    !mergedDisabled && 'group-hover:bg-primary-hover',
    semanticCls.track,
  );

  const handleCls = clsx(
    'absolute h-2 w-2 rounded-full',
    'after:absolute after:left-0 after:top-0 after:h-2 after:w-2 after:cursor-pointer after:rounded-full after:bg-neutral-bg-elevated after:ring-2 after:ring-primary after:transition-all',
    !mergedDisabled &&
      'hover:after:-left-[0.0626rem] hover:after:-top-[0.0626rem] hover:after:h-[0.625rem] hover:after:w-[0.625rem] hover:after:ring-primary-hover',
    !mergedDisabled &&
      'focus:after:-left-[0.0626rem] focus:after:-top-[0.0626rem] focus:after:h-[0.625rem] focus:after:w-[0.625rem] focus:after:ring-primary-hover',
    mergedDisabled && 'after:cursor-not-allowed',
    { 'left-[0.125rem]': vertical, 'top-[0.125rem]': !vertical },
    semanticCls.handle,
  );

  const marksCls = clsx(
    'absolute rounded-full bg-primary',
    { 'w-1': vertical, 'h-1': !vertical },
    !mergedDisabled && 'group-hover:bg-primary-hover',
    semanticCls.track,
  );

  // ============================= Multiple =============================
  // Range config
  const [mergedRange, draggableTrack] = React.useMemo(() => {
    if (!range) {
      return [false];
    }

    return typeof range === 'object' ? [true, range.draggableTrack] : [true, false];
  }, [range]);

  // ============================== Handle ==============================

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

  const useActiveTooltipHandle = mergedRange && !lockOpen;

  const handleRender: RcSliderProps['handleRender'] = (node, info) => {
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
        setDragging(true);
        nodeProps.onMouseDown?.(e);
      },
      onFocus: (e) => {
        setFocusOpen(true);
        restProps.onFocus?.(e);
        nodeProps.onFocus?.(e);
      },
      onBlur: (e) => {
        setFocusOpen(false);
        restProps.onBlur?.(e);
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
          prefixCls={getPrefixCls('tooltip', customizeTooltipPrefixCls)}
          title={mergedTipFormatter ? mergedTipFormatter(info.value) : ''}
          open={open}
          placement={getTooltipPlacement(tooltipPlacement, vertical)}
          key={index}
          getPopupContainer={getTooltipPopupContainer || getPopupContainer}
        >
          {cloneNode}
        </SliderTooltip>
      );
    }

    return cloneNode;
  };

  // ========================== Active Handle ===========================
  const activeHandleRender: SliderProps['activeHandleRender'] = useActiveTooltipHandle
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
            prefixCls={getPrefixCls('tooltip', customizeTooltipPrefixCls)}
            title={mergedTipFormatter ? mergedTipFormatter(info.value) : ''}
            open={mergedTipFormatter !== null && activeOpen}
            placement={getTooltipPlacement(tooltipPlacement, vertical)}
            key="tooltip"
            getPopupContainer={getTooltipPopupContainer || getPopupContainer}
          >
            {cloneNode}
          </SliderTooltip>
        );
      }
    : undefined;

  // ============================== Render ==============================

  const classNames = React.useMemo(
    () => ({
      rail: railCls,
      track: trackCls,
      handle: handleCls,
      mark: semanticCls.mark,
      marks: marksCls,
      tracks: semanticCls.tracks,
    }),
    [railCls, trackCls, handleCls, marksCls, semanticCls.tracks, semanticCls.mark],
  );

  return (
    <RcSlider
      {...restProps}
      step={restProps.step}
      range={mergedRange}
      marks={marks}
      draggableTrack={draggableTrack}
      className={rootCls}
      classNames={classNames}
      style={style}
      disabled={mergedDisabled}
      ref={ref}
      prefixCls={prefixCls}
      handleRender={handleRender}
      activeHandleRender={activeHandleRender}
      onChangeComplete={onInternalChangeComplete}
    />
  );
});

if (process.env.NODE_ENV !== 'production') {
  Slider.displayName = 'Slider';
}

export default Slider;
