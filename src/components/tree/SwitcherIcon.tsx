import * as React from 'react';
import {
  CaretDownSolid,
  LoadingOutline,
  MinusSquareOutline,
  PlusSquareOutline,
} from '@metisjs/icons';
import { clsx } from '../_util/classNameUtils';
import { cloneElement } from '../_util/reactNode';
import type { IconType, TreeNodeProps } from './interface';

interface SwitcherIconProps {
  prefixCls: string;
  treeNodeProps: TreeNodeProps;
  switcherIcon?: IconType;
  showLine?: boolean;
}

const SwitcherIcon: React.FC<SwitcherIconProps> = (props) => {
  const { prefixCls, switcherIcon, treeNodeProps, showLine } = props;

  const { leaf, expanded, loading, isEnd } = treeNodeProps;

  if (loading) {
    return (
      <LoadingOutline
        className={clsx(`${prefixCls}-switcher-loading-icon`, 'animate-spin text-primary')}
      />
    );
  }

  if (leaf) {
    if (!showLine) {
      return null;
    }
    return (
      <span
        className={clsx(
          `${prefixCls}-switcher-leaf-line`,
          'relative z-[1] inline-block h-full w-full',
          'before:absolute before:-bottom-2 before:-top-2 before:start-2 before:border-r before:border-border',
          'after:absolute after:start-2 after:h-3 after:w-2 after:border-b after:border-border',
          {
            'before:bottom-auto before:h-5': isEnd?.[isEnd?.length - 1],
          },
        )}
      />
    );
  }

  const switcherCls = `${prefixCls}-switcher-icon`;

  const switcher = typeof switcherIcon === 'function' ? switcherIcon(treeNodeProps) : switcherIcon;

  if (React.isValidElement(switcher)) {
    return cloneElement(switcher, {
      className: clsx(
        switcherCls,
        'transition-transform duration-300',
        !expanded && '-rotate-90',
        switcher.props.className || '',
      ),
    });
  }

  if (switcher !== undefined) {
    return switcher as unknown as React.ReactElement;
  }

  if (showLine) {
    const clsString = clsx(`${prefixCls}-switcher-line-icon`, 'h-4 w-4');
    return expanded ? (
      <MinusSquareOutline className={clsString} />
    ) : (
      <PlusSquareOutline className={clsString} />
    );
  }
  return (
    <CaretDownSolid
      className={clsx(
        switcherCls,
        'h-3 w-3 transition-transform duration-300',
        !expanded && '-rotate-90',
      )}
    />
  );
};

export default SwitcherIcon;
