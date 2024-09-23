import type * as React from 'react';
import InternalInput from './Input';
import type { InputProps, InputRef } from './interface';
import Password from './Password';
import TextArea from './TextArea';

export type { PasswordProps } from './Password';
export type { InputProps, InputRef, TextAreaProps, TextAreaRef } from './interface';

type CompoundedComponent = React.ForwardRefExoticComponent<
  InputProps & React.RefAttributes<InputRef>
> & {
  TextArea: typeof TextArea;
  Password: typeof Password;
};

const Input = InternalInput as CompoundedComponent;

Input.TextArea = TextArea;
Input.Password = Password;
export default Input;
