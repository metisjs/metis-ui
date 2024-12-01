import * as React from 'react';
import { LoadingOutline } from '@metisjs/icons';
import { clsx } from '@util/classNameUtils';
import ExpandIcon from '@util/ExpandIcon';
import { cloneElement } from '@util/reactNode';
import type { IconType, TreeNodeProps } from './interface';

interface SwitcherIconProps {
  prefixCls: string;
  treeNodeProps: TreeNodeProps;
  switcherIcon?: IconType;
  showLine?: boolean | 'hover';
}

const SwitcherIcon: React.FC<SwitcherIconProps> = (props) => {
  const { prefixCls, switcherIcon, treeNodeProps } = props;

  const { leaf, expanded, loading } = treeNodeProps;

  if (loading) {
    return (
      <LoadingOutline className={clsx(`${prefixCls}-switcher-loading-icon`, 'animate-spin')} />
    );
  }

  if (leaf) {
    return null;
  }

  const switcherCls = `${prefixCls}-switcher-icon`;

  const switcher = typeof switcherIcon === 'function' ? switcherIcon(treeNodeProps) : switcherIcon;

  if (React.isValidElement(switcher)) {
    return cloneElement(switcher, {
      className: clsx(switcherCls, !expanded && '-rotate-90', switcher.props.className || ''),
    });
  }

  if (switcher !== undefined) {
    return switcher as unknown as React.ReactElement;
  }

  return <ExpandIcon open={expanded} className={clsx(switcherCls, 'transition-none')} />;
};

export default SwitcherIcon;
