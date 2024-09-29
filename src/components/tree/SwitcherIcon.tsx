import * as React from 'react';
import {
  CaretDownSolid,
  LoadingOutline,
  MinusSquareOutline,
  PlusSquareOutline,
} from '@metisjs/icons';
import classNames from 'classnames';
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
      className: classNames(switcher.props.className || '', switcherCls),
    });
  }

  if (switcher !== undefined) {
    return switcher as unknown as React.ReactElement;
  }

  if (showLine) {
    return expanded ? (
      <MinusSquareOutline className={`${prefixCls}-switcher-line-icon`} />
    ) : (
      <PlusSquareOutline className={`${prefixCls}-switcher-line-icon`} />
    );
  }
  return <CaretDownSolid className={switcherCls} />;
};

export default SwitcherIcon;
