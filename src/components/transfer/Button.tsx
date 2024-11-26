import * as React from 'react';

interface TransButtonProps extends React.HTMLAttributes<HTMLDivElement> {
  onClick?: (e?: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
  noStyle?: boolean;
  autoFocus?: boolean;
  disabled?: boolean;
  tabIndex?: number;
}

const inlineStyle: React.CSSProperties = {
  border: 0,
  background: 'transparent',
  padding: 0,
  lineHeight: 'inherit',
  display: 'inline-flex',
};

const TransButton = React.forwardRef<HTMLDivElement, TransButtonProps>((props, ref) => {
  const onKeyDown: React.KeyboardEventHandler<HTMLDivElement> = (event) => {
    const { key } = event;
    if (key === 'Enter') {
      event.preventDefault();
    }
  };

  const onKeyUp: React.KeyboardEventHandler<HTMLDivElement> = (event) => {
    const { key } = event;
    const { onClick } = props;
    if (key === 'Enter' && onClick) {
      onClick();
    }
  };

  const { style, noStyle, disabled, tabIndex = 0, ...restProps } = props;

  let mergedStyle: React.CSSProperties = {};

  if (!noStyle) {
    mergedStyle = {
      ...inlineStyle,
    };
  }

  if (disabled) {
    mergedStyle.pointerEvents = 'none';
  }

  mergedStyle = {
    ...mergedStyle,
    ...style,
  };

  return (
    <div
      role="button"
      tabIndex={tabIndex}
      ref={ref}
      {...restProps}
      onKeyDown={onKeyDown}
      onKeyUp={onKeyUp}
      style={mergedStyle}
    />
  );
});

export default TransButton;
