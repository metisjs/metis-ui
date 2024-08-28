import * as React from 'react';
import { clsx } from '../../_util/classNameUtils';
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

const TRANSITION = {
  leave: 'transition ease-in duration-100',
  leaveFrom: 'opacity-100',
  leaveTo: 'opacity-0',
};

export type PickerTriggerProps = {
  popupElement: React.ReactElement;
  children: React.ReactElement;
  getPopupContainer?: (node: HTMLElement) => HTMLElement;
  popupAlign?: AlignType;
  range?: boolean;

  // Placement
  popupClassName?: string;
  placement?: string;
  builtinPlacements?: BuildInPlacements;

  open: boolean;
  onClose: () => void;
};

function PickerTrigger({
  popupElement,
  popupClassName,
  popupAlign,
  getPopupContainer,
  children,
  range,
  placement,
  builtinPlacements = BUILT_IN_PLACEMENTS,

  open,
  onClose,
}: PickerTriggerProps) {
  const { prefixCls } = React.useContext(PickerContext);
  const popupPrefixCls = `${prefixCls}-popup`;

  const realPlacement = getRealPlacement(placement);

  return (
    <Trigger
      showAction={[]}
      hideAction={['click']}
      popupPlacement={realPlacement}
      builtinPlacements={builtinPlacements}
      prefixCls={popupPrefixCls}
      popupTransition={TRANSITION}
      popup={popupElement}
      popupAlign={popupAlign}
      popupOpen={open}
      className={{
        popup: clsx(popupClassName, {
          [`${popupPrefixCls}-range`]: range,
        }),
      }}
      stretch="minWidth"
      getPopupContainer={getPopupContainer}
      onPopupOpenChange={(nextOpen) => {
        if (!nextOpen) {
          onClose();
        }
      }}
    >
      {children}
    </Trigger>
  );
}

export default PickerTrigger;
