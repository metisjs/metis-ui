import * as React from 'react';
import classNames from 'classnames';
import type { AlignType, BuildInPlacements } from '../../trigger';
import Trigger from '../../trigger';
import PickerContext from '../PickerInput/context';
import { getRealPlacement } from '../utils/uiUtil';

const BUILT_IN_PLACEMENTS = {
  bottomLeft: {
    points: ['tl', 'bl'],
    offset: [0, 4],
    overflow: {
      adjustX: 1,
      adjustY: 1,
    },
  },
  bottomRight: {
    points: ['tr', 'br'],
    offset: [0, 4],
    overflow: {
      adjustX: 1,
      adjustY: 1,
    },
  },
  topLeft: {
    points: ['bl', 'tl'],
    offset: [0, -4],
    overflow: {
      adjustX: 0,
      adjustY: 1,
    },
  },
  topRight: {
    points: ['br', 'tr'],
    offset: [0, -4],
    overflow: {
      adjustX: 0,
      adjustY: 1,
    },
  },
};

export type PickerTriggerProps = {
  popupElement: React.ReactElement;
  popupStyle?: React.CSSProperties;
  children: React.ReactElement;
  transitionName?: string;
  getPopupContainer?: (node: HTMLElement) => HTMLElement;
  popupAlign?: AlignType;
  range?: boolean;

  // Placement
  popupClassName?: string;
  placement?: string;
  builtinPlacements?: BuildInPlacements;

  // Visible
  visible: boolean;
  onClose: () => void;
};

function PickerTrigger({
  popupElement,
  popupStyle,
  popupClassName,
  popupAlign,
  transitionName,
  getPopupContainer,
  children,
  range,
  placement,
  builtinPlacements = BUILT_IN_PLACEMENTS,

  // Visible
  visible,
  onClose,
}: PickerTriggerProps) {
  const { prefixCls } = React.useContext(PickerContext);
  const dropdownPrefixCls = `${prefixCls}-dropdown`;

  const realPlacement = getRealPlacement(placement);

  return (
    <Trigger
      showAction={[]}
      hideAction={['click']}
      popupPlacement={realPlacement}
      builtinPlacements={builtinPlacements}
      prefixCls={dropdownPrefixCls}
      popupTransitionName={transitionName}
      popup={popupElement}
      popupAlign={popupAlign}
      popupVisible={visible}
      popupClassName={classNames(popupClassName, {
        [`${dropdownPrefixCls}-range`]: range,
        [`${dropdownPrefixCls}-rtl`]: direction === 'rtl',
      })}
      popupStyle={popupStyle}
      stretch="minWidth"
      getPopupContainer={getPopupContainer}
      onPopupVisibleChange={(nextVisible) => {
        if (!nextVisible) {
          onClose();
        }
      }}
    >
      {children}
    </Trigger>
  );
}

export default PickerTrigger;
