import classNames from 'classnames';
import raf from 'rc-util/lib/raf';
import * as React from 'react';
import Transition, { TransitionProps } from '../../transition';
import { MenuContext } from '../context/MenuContext';
import type { MenuMode } from '../interface';
import { placements } from '../placements';
import { getTransition } from '../utils/transitionUtil';

const popupPlacementMap = {
  horizontal: 'bottomLeft',
  vertical: 'rightTop',
  'vertical-left': 'rightTop',
  'vertical-right': 'leftTop',
};

export interface PopupTriggerProps {
  prefixCls: string;
  mode: MenuMode;
  visible: boolean;
  children: React.ReactElement;
  popup: React.ReactNode;
  popupStyle?: React.CSSProperties;
  popupClassName?: string;
  popupOffset?: number[];
  disabled: boolean;
  onVisibleChange: (visible: boolean) => void;
}

export default function PopupTrigger({
  prefixCls,
  visible,
  children,
  popup,
  popupStyle,
  popupClassName,
  popupOffset,
  disabled,
  mode,
  onVisibleChange,
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

  const [innerVisible, setInnerVisible] = React.useState(false);

  const placement = { ...placements, ...builtinPlacements };

  const popupPlacement = popupPlacementMap[mode];

  const targetMotion = getTransition(mode, transition, defaultTransitions);
  const targetMotionRef = React.useRef(targetMotion);

  if (mode !== 'inline') {
    /**
     * PopupTrigger is only used for vertical and horizontal types.
     * When collapsed is unfolded, the inline animation will destroy the vertical animation.
     */
    targetMotionRef.current = targetMotion;
  }

  const mergedMotion: TransitionProps = {
    ...targetMotionRef.current,
    removeOnLeave: false,
    appear: true,
  };

  // Delay to change visible
  const visibleRef = React.useRef<number>();
  React.useEffect(() => {
    visibleRef.current = raf(() => {
      setInnerVisible(visible);
    });

    return () => {
      raf.cancel(visibleRef.current!);
    };
  }, [visible]);

  return (
    <Transition
      prefixCls={prefixCls}
      popupClassName={classNames(`${prefixCls}-popup`, popupClassName, className)}
      stretch={mode === 'horizontal' ? 'minWidth' : null}
      getPopupContainer={getPopupContainer}
      builtinPlacements={placement}
      popupPlacement={popupPlacement}
      popupVisible={innerVisible}
      popup={popup}
      popupStyle={popupStyle}
      popupAlign={popupOffset && { offset: popupOffset }}
      action={disabled ? [] : [triggerSubMenuAction]}
      mouseEnterDelay={subMenuOpenDelay}
      mouseLeaveDelay={subMenuCloseDelay}
      onPopupVisibleChange={onVisibleChange}
      forceRender={forceSubMenuRender}
      popupMotion={mergedMotion}
    >
      {children}
    </Transition>
  );
}
