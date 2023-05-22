import type { ForwardRefExoticComponent, RefAttributes } from 'react';
import type { AvatarProps } from './Avatar';
import InternalAvatar from './Avatar';
import Group from './Group';

export type { AvatarProps } from './Avatar';
export type { GroupProps } from './Group';
export { Group };

type CompoundedComponent = ForwardRefExoticComponent<
  AvatarProps & RefAttributes<HTMLSpanElement>
> & {
  Group: typeof Group;
};

const Avatar = InternalAvatar as CompoundedComponent;

Avatar.Group = Group;

export default Avatar;
