import * as React from 'react';
import { useRef, useState } from 'react';
import { EyeOutline, EyeSlashOutline } from '@metisjs/icons';
import omit from '@rc-component/util/es/omit';
import { composeRef } from '@rc-component/util/es/ref';
import useRemovePasswordTimeout from './hooks/useRemovePasswordTimeout';
import Input from './Input';
import type { InputProps, InputRef } from './interface';

const defaultIconRender = (visible: boolean): React.ReactNode =>
  visible ? <EyeOutline /> : <EyeSlashOutline />;

type VisibilityToggle = {
  visible?: boolean;
  onVisibleChange?: (visible: boolean) => void;
};

export interface PasswordProps extends InputProps {
  readonly inputPrefixCls?: string;
  readonly action?: string;
  visibilityToggle?: boolean | VisibilityToggle;
  iconRender?: (visible: boolean) => React.ReactNode;
}

const ActionMap: Record<string, string> = {
  click: 'onClick',
  hover: 'onMouseOver',
};

const Password = React.forwardRef<InputRef, PasswordProps>((props, ref) => {
  const { visibilityToggle = true } = props;
  const visibilityControlled =
    typeof visibilityToggle === 'object' && visibilityToggle.visible !== undefined;
  const [visible, setVisible] = useState(() =>
    visibilityControlled ? visibilityToggle.visible! : false,
  );
  const inputRef = useRef<InputRef>(null);

  React.useEffect(() => {
    if (visibilityControlled) {
      setVisible(visibilityToggle.visible!);
    }
  }, [visibilityControlled, visibilityToggle]);

  // Remove Password value
  const removePasswordTimeout = useRemovePasswordTimeout(inputRef);

  const onVisibleChange = () => {
    const { disabled } = props;
    if (disabled) {
      return;
    }
    if (visible) {
      removePasswordTimeout();
    }
    setVisible((prevState) => {
      const newState = !prevState;
      if (typeof visibilityToggle === 'object') {
        visibilityToggle.onVisibleChange?.(newState);
      }
      return newState;
    });
  };

  const getIcon = () => {
    const { action = 'click', iconRender = defaultIconRender } = props;
    const iconTrigger = ActionMap[action] || '';
    const icon = iconRender(visible);
    const iconProps = {
      [iconTrigger]: onVisibleChange,
      className: 'cursor-pointer',
      key: 'passwordIcon',
      onMouseDown: (e: MouseEvent) => {
        // Prevent focused state lost
        e.preventDefault();
      },
      onMouseUp: (e: MouseEvent) => {
        // Prevent caret position change
        e.preventDefault();
      },
    };
    return React.cloneElement(React.isValidElement(icon) ? icon : <span>{icon}</span>, iconProps);
  };

  const { className, ...restProps } = props;

  const suffixIcon = visibilityToggle && getIcon();

  const omittedProps: InputProps = {
    ...omit(restProps, ['suffix', 'iconRender', 'visibilityToggle']),
    type: visible ? 'text' : 'password',
    className,
    suffix: suffixIcon,
  };

  return <Input ref={composeRef(ref, inputRef)} {...omittedProps} />;
});

if (process.env.NODE_ENV !== 'production') {
  Password.displayName = 'Password';
}

export default Password;
