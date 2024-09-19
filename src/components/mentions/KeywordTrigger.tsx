import type { FC } from 'react';
import * as React from 'react';
import { useMemo } from 'react';
import { clsx } from '../_util/classNameUtils';
import Trigger from '../trigger';
import DropdownMenu from './DropdownMenu';
import type { MentionPlacement, MentionsOptionProps } from './Mentions';

const BUILT_IN_PLACEMENTS = {
  bottomRight: {
    points: ['tl', 'br'],
    offset: [0, 4],
    overflow: {
      adjustX: 1,
      adjustY: 1,
    },
  },
  bottomLeft: {
    points: ['tr', 'bl'],
    offset: [0, 4],
    overflow: {
      adjustX: 1,
      adjustY: 1,
    },
  },
  topRight: {
    points: ['bl', 'tr'],
    offset: [0, -4],
    overflow: {
      adjustX: 1,
      adjustY: 1,
    },
  },
  topLeft: {
    points: ['br', 'tl'],
    offset: [0, -4],
    overflow: {
      adjustX: 1,
      adjustY: 1,
    },
  },
};

const TRANSITION = {
  leave: 'transition ease-in duration-100',
  leaveFrom: 'opacity-100',
  leaveTo: 'opacity-0',
};

interface KeywordTriggerProps {
  loading?: boolean;
  options: MentionsOptionProps[];
  prefixCls?: string;
  placement?: MentionPlacement;
  open?: boolean;
  children: React.ReactElement;
  getPopupContainer?: () => HTMLElement;
  popupClassName?: string;
}

const KeywordTrigger: FC<KeywordTriggerProps> = (props) => {
  const { prefixCls, options, children, open, getPopupContainer, placement, popupClassName } =
    props;

  const dropdownPrefix = `${prefixCls}-dropdown`;

  const dropdownElement = <DropdownMenu prefixCls={dropdownPrefix} options={options} />;

  const dropdownPlacement = useMemo(() => {
    return placement === 'top' ? 'topRight' : 'bottomRight';
  }, [placement]);

  const popupCls = clsx(
    'absolute rounded-md bg-elevated text-sm shadow-lg ring-1 ring-border-secondary focus:outline-none',
    popupClassName,
  );

  return (
    <Trigger
      prefixCls={dropdownPrefix}
      popupOpen={open}
      popup={dropdownElement}
      popupPlacement={dropdownPlacement}
      popupTransition={TRANSITION}
      builtinPlacements={BUILT_IN_PLACEMENTS}
      getPopupContainer={getPopupContainer}
      className={{ popup: popupCls }}
    >
      {children}
    </Trigger>
  );
};

export default KeywordTrigger;