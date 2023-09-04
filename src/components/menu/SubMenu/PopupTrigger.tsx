import raf from 'rc-util/lib/raf';
import * as React from 'react';
import { clsx } from '../../_util/classNameUtils';
import { TransitionProps } from '../../transition';
import Trigger from '../../trigger';
import { MenuContext } from '../context/MenuContext';
import type { MenuMode } from '../interface';
import { placements } from '../placements';
import { getTransition } from '../utils/transitionUtil';

const popupPlacementMap: Record<string, string> = {
  horizontal: 'bottomLeft',
  vertical: 'rightTop',
  'vertical-left': 'rightTop',
  'vertical-right': 'leftTop',
};

export interface PopupTriggerProps {
  prefixCls: string;
  mode: MenuMode;
  open: boolean;
  children: React.ReactElement;
  popup: React.ReactNode;
  popupStyle?: React.CSSProperties;
  popupClassName?: string;
  popupOffset?: number[];
  disabled: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function PopupTrigger({
  prefixCls,
  open,
  children,
  popup,
  popupStyle,
  popupClassName,
  popupOffset,
  disabled,
  mode,
  onOpenChange,
}: PopupTriggerProps) {
  const {
    getPopupContainer,
    subMenuOpenDelay,
    subMenuCloseDelay,
    builtinPlacements,
    triggerSubMenuAction,
    forceSubMenuRender,
    className,

    // Transition
    transition,
    defaultTransitions,
  } = React.useContext(MenuContext);

  const [innerOpen, setInnerOpen] = React.useState(false);

  const placement = { ...placements, ...builtinPlacements };

  const popupPlacement = popupPlacementMap[mode];

  const targetTransition = getTransition(mode, transition, defaultTransitions);
  const targetTransitionRef = React.useRef(targetTransition);

  if (mode !== 'inline') {
    /**
     * PopupTrigger is only used for vertical and horizontal types.
     * When collapsed is unfolded, the inline animation will destroy the vertical animation.
     */
    targetTransitionRef.current = targetTransition;
  }

  const mergedTransition: TransitionProps = {
    ...targetTransitionRef.current,
    removeOnLeave: false,
    appear: true,
  };

  // Delay to change visible
  const openRef = React.useRef<number>();
  React.useEffect(() => {
    openRef.current = raf(() => {
      setInnerOpen(open);
    });

    return () => {
      raf.cancel(openRef.current!);
    };
  }, [open]);

  return (
    <Trigger
      prefixCls={prefixCls}
      className={{
        popup: clsx(
          `${prefixCls}-popup`,
          'submenu-popup absolute z-[1050]',
          '[.placement-rightBottom&]:ps-1 [.placement-rightTop&]:ps-1',
          '[.placement-leftBottom&]:pe-1 [.placement-leftTop&]:pe-1',
          '[.placement-topLeft&]:pb-1 [.placement-topRight&]:pb-1',
          '[.placement-bottomLeft&]:pt-1 [.placement-bottomRight&]:pt-1',
          popupClassName,
          className,
        ),
      }}
      stretch={mode === 'horizontal' ? 'minWidth' : undefined}
      getPopupContainer={getPopupContainer}
      builtinPlacements={placement}
      popupPlacement={popupPlacement}
      popupOpen={innerOpen}
      popup={popup}
      popupStyle={popupStyle}
      popupAlign={popupOffset && { offset: popupOffset }}
      action={disabled ? [] : triggerSubMenuAction}
      mouseEnterDelay={subMenuOpenDelay}
      mouseLeaveDelay={subMenuCloseDelay}
      onPopupOpenChange={onOpenChange}
      forceRender={forceSubMenuRender}
      popupTransition={mergedTransition}
    >
      {children}
    </Trigger>
  );
}
