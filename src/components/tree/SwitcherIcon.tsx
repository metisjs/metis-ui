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

  const { leaf, expanded, loading } = treeNodeProps;

  if (loading) {
    return <LoadingOutline className={`${prefixCls}-switcher-loading-icon`} />;
  }

  if (leaf) {
    if (!showLine) {
      return null;
    }
    return <span className={`${prefixCls}-switcher-leaf-line`} />;
  }

  const switcherCls = `${prefixCls}-switcher-icon`;

  const switcher = typeof switcherIcon === 'function' ? switcherIcon(treeNodeProps) : switcherIcon;

  if (React.isValidElement(switcher)) {
    return cloneElement(switcher, {
      className: clsx(switcherCls, 'h-4 w-4', switcher.props.className || ''),
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
