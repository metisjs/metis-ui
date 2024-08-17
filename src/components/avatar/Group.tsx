import * as React from 'react';
import toArray from 'rc-util/lib/Children/toArray';
import { clsx } from '../_util/classNameUtils';
import { cloneElement } from '../_util/reactNode';
import { ConfigContext } from '../config-provider';
import Popover from '../popover';
import Avatar from './Avatar';
import type { AvatarSize } from './SizeContext';
import { SizeContextProvider } from './SizeContext';

export interface GroupProps {
  className?: string;
  children?: React.ReactNode;
  style?: React.CSSProperties;
  maxCount?: number;
  maxStyle?: React.CSSProperties;
  maxPopoverPlacement?: 'top' | 'bottom';
  maxPopoverTrigger?: 'hover' | 'focus' | 'click';
  size?: AvatarSize;
}

const Group: React.FC<GroupProps> = (props) => {
  const { getPrefixCls } = React.useContext(ConfigContext);
  const { className = '', maxCount, maxStyle, size } = props;

  const prefixCls = getPrefixCls('avatar-group');

  const cls = clsx(prefixCls, 'group relative -space-x-1 overflow-hidden', className);

  const { children, maxPopoverPlacement = 'top', maxPopoverTrigger = 'hover' } = props;
  const childrenWithProps = toArray(children).map((child, index) =>
    cloneElement(child, {
      key: `avatar-key-${index}`,
    }),
  );

  const numOfChildren = childrenWithProps.length;
  if (maxCount && maxCount < numOfChildren) {
    const childrenShow = childrenWithProps.slice(0, maxCount);
    const childrenHidden = childrenWithProps.slice(maxCount, numOfChildren);
    childrenShow.push(
      <Popover
        key="avatar-popover-key"
        content={<div className="flex gap-1">{childrenHidden}</div>}
        trigger={maxPopoverTrigger}
        placement={maxPopoverPlacement}
        className={{ overlay: `${prefixCls}-popover` }}
      >
        <Avatar key="avatar-key-count" style={maxStyle}>{`+${numOfChildren - maxCount}`}</Avatar>
      </Popover>,
    );
    return (
      <SizeContextProvider size={size}>
        <div className={cls} style={props.style}>
          {childrenShow}
        </div>
      </SizeContextProvider>
    );
  }

  return (
    <SizeContextProvider size={size}>
      <div className={cls} style={props.style}>
        {childrenWithProps}
      </div>
    </SizeContextProvider>
  );
};

export default Group;
