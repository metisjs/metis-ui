import classNames from 'classnames';
import * as React from 'react';
import warning from '../_util/warning';
import type { SizeType } from '../config-provider/SizeContext';

export interface ButtonGroupProps {
  size?: SizeType;
  style?: React.CSSProperties;
  className?: string;
  children?: React.ReactNode;
}

export const GroupSizeContext = React.createContext<SizeType | undefined>(undefined);

const ButtonGroup: React.FC<ButtonGroupProps> = (props) => {
  const { size, className, ...others } = props;

  // large => lg
  // small => sm
  let sizeCls = '';
  switch (size) {
    case 'large':
      sizeCls = 'lg';
      break;
    case 'small':
      sizeCls = 'sm';
      break;
    case 'middle':
    case undefined:
      break;
    default:
      warning(!size, 'Button.Group', 'Invalid prop `size`.');
  }

  const classes = classNames(className, sizeCls);

  return (
    <GroupSizeContext.Provider value={size}>
      <div {...others} className={classes} />
    </GroupSizeContext.Provider>
  );
};

export default ButtonGroup;
