'use client';

import InternalDropdown from './Dropdown';
// import DropdownButton from './DropdownButton';

export type { DropdownProps as DropDownProps, DropdownProps } from './Dropdown';
export type { DropdownButtonProps, DropdownButtonType } from './DropdownButton';

const Dropdown = InternalDropdown as typeof InternalDropdown & {
  // Button: typeof DropdownButton;
};
// Dropdown.Button = DropdownButton;

export default Dropdown;
