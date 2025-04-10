import * as React from 'react';
import { clsx } from '@util/classNameUtils';
import { cloneElement } from '@util/reactNode';
import { ConfigContext } from '../config-provider';
import SingleNumber from './SingleNumber';

export interface ScrollNumberProps {
  prefixCls?: string;
  className?: string;
  customComponentCls?: string;
  transitionCls?: string;
  count?: string | number | null;
  children?: React.ReactElement;
  component?: React.ComponentType<any>;
  style?: React.CSSProperties;
  title?: string | number | null;
  show: boolean;
}

export interface ScrollNumberState {
  animateStarted?: boolean;
  count?: string | number | null;
}

const ScrollNumber = React.forwardRef<HTMLElement, ScrollNumberProps>((props, ref) => {
  const {
    prefixCls: customizePrefixCls,
    count,
    className,
    customComponentCls,
    transitionCls,
    style,
    title,
    show,
    component: Component = 'sup',
    children,
    ...restProps
  } = props;
  const { getPrefixCls } = React.useContext(ConfigContext);
  const prefixCls = getPrefixCls('scroll-number', customizePrefixCls);

  // ============================ Render ============================
  const newProps = {
    ...restProps,
    'data-show': show,
    style,
    className: clsx(prefixCls, className, transitionCls),
    title: title as string,
  };

  // Only integer need motion
  let numberNodes: React.ReactNode = count;
  if (count && Number(count) % 1 === 0) {
    const numberList = String(count).split('');

    numberNodes = (
      <bdi>
        {numberList.map((num, i) => (
          <SingleNumber
            prefixCls={prefixCls}
            count={Number(count)}
            value={num}
            // eslint-disable-next-line react/no-array-index-key
            key={numberList.length - i}
          />
        ))}
      </bdi>
    );
  }

  if (children) {
    return cloneElement(children, (oriProps) => ({
      className: clsx(
        `${prefixCls}-custom-component`,
        customComponentCls,
        oriProps?.className,
        transitionCls,
      ),
    }));
  }

  return (
    <Component {...newProps} ref={ref}>
      {numberNodes}
    </Component>
  );
});

export default ScrollNumber;
