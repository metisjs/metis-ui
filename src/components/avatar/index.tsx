import type { ForwardRefExoticComponent, RefAttributes } from 'react';
import type { AvatarProps } from './_avatar';
import InternalAvatar from './_avatar';
import Group from './_group';

export type { AvatarProps } from './_avatar';
export type { GroupProps } from './_group';
export { Group };

type CompoundedComponent = ForwardRefExoticComponent<
  AvatarProps & RefAttributes<HTMLSpanElement>
> & {
  Group: typeof Group;
};

const Avatar = InternalAvatar as CompoundedComponent;

Avatar.Group = Group;

export default Avatar;
