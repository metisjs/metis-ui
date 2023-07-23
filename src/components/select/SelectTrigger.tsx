import * as React from 'react';
import { clsx } from '../_util/classNameUtils';
import { TransitionProps } from '../transition';
import Trigger, { AlignType, BuildInPlacements } from '../trigger';
import type { Placement, RenderDOMFunc } from './BaseSelect';

const getBuiltInPlacements = (
  popupMatchSelectWidth?: number | boolean,
): Record<string, AlignType> => {
  // Enable horizontal overflow auto-adjustment when a custom dropdown width is provided
  const adjustX = popupMatchSelectWidth === true ? 0 : 1;
  return {
    bottomLeft: {
      points: ['tl', 'bl'],
      offset: [0, 4],
      overflow: {
        adjustX,
        adjustY: 1,
      },
      htmlRegion: 'scroll',
    },
    bottomRight: {
      points: ['tr', 'br'],
      offset: [0, 4],
      overflow: {
        adjustX,
        adjustY: 1,
      },
      htmlRegion: 'scroll',
    },
    topLeft: {
      points: ['bl', 'tl'],
      offset: [0, -4],
      overflow: {
        adjustX,
        adjustY: 1,
      },
      htmlRegion: 'scroll',
    },
    topRight: {
      points: ['br', 'tr'],
      offset: [0, -4],
      overflow: {
        adjustX,
        adjustY: 1,
      },
      htmlRegion: 'scroll',
    },
  };
};

export interface RefTriggerProps {
  getPopupElement: () => HTMLDivElement;
}

export interface SelectTriggerProps {
  prefixCls: string;
  children: React.ReactElement;
  disabled: boolean;
  open: boolean;
  popupElement: React.ReactElement;

  transition?: Partial<TransitionProps>;
  containerWidth: number;
  placement?: Placement;
  builtinPlacements?: BuildInPlacements;
  popupClassName?: string;
  popupMatchSelectWidth?: boolean | number;
  popupRender?: (menu: React.ReactElement) => React.ReactElement;
  getPopupContainer?: RenderDOMFunc;
  popupAlign?: AlignType;
  empty: boolean;

  getTriggerDOMNode: () => HTMLElement;
  onPopupOpenChange?: (visible: boolean) => void;

  onPopupMouseEnter: () => void;
}

const SelectTrigger: React.ForwardRefRenderFunction<RefTriggerProps, SelectTriggerProps> = (
  props,
  ref,
) => {
  const {
    prefixCls,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    disabled,
    open,
    children,
    popupElement,
    containerWidth,
    transition,
    popupClassName,
    placement,
    builtinPlacements,
    popupMatchSelectWidth,
    popupRender,
    popupAlign,
    getPopupContainer,
    empty,
    getTriggerDOMNode,
    onPopupOpenChange,
    onPopupMouseEnter,
    ...restProps
  } = props;

  const popupPrefixCls = `${prefixCls}-popup`;

  let popupNode = popupElement;
  if (popupRender) {
    popupNode = popupRender(popupElement);
  }

  const mergedBuiltinPlacements = React.useMemo(
    () => builtinPlacements || getBuiltInPlacements(popupMatchSelectWidth),
    [builtinPlacements, popupMatchSelectWidth],
  );

  // ======================= Ref =======================
  const popupRef = React.useRef<HTMLDivElement>(null);

  React.useImperativeHandle(ref, () => ({
    getPopupElement: () => popupRef.current!,
  }));

  const popupStyle: React.CSSProperties = {
    minWidth: containerWidth,
  };

  if (typeof popupMatchSelectWidth === 'number') {
    popupStyle.width = popupMatchSelectWidth;
  } else if (popupMatchSelectWidth) {
    popupStyle.width = containerWidth;
  }

  return (
    <Trigger
      {...restProps}
      showAction={onPopupOpenChange ? ['click'] : []}
      hideAction={onPopupOpenChange ? ['click'] : []}
      popupPlacement={placement || 'bottomLeft'}
      builtinPlacements={mergedBuiltinPlacements}
      prefixCls={popupPrefixCls}
      popupTransition={transition}
      popup={
        <div ref={popupRef} onMouseEnter={onPopupMouseEnter}>
          {popupNode}
        </div>
      }
      popupAlign={popupAlign}
      popupOpen={open}
      getPopupContainer={getPopupContainer}
      className={{
        popup: clsx(
          {
            [`${popupPrefixCls}-empty`]: empty,
          },
          popupClassName,
        ),
      }}
      popupStyle={popupStyle}
      getTriggerDOMNode={getTriggerDOMNode}
      onPopupOpenChange={onPopupOpenChange}
    >
      {children}
    </Trigger>
  );
};

const RefSelectTrigger = React.forwardRef<RefTriggerProps, SelectTriggerProps>(SelectTrigger);
RefSelectTrigger.displayName = 'SelectTrigger';

export default RefSelectTrigger;
