// import { LoadingFour } from '@matejs/icons';
import CSSMotion from 'rc-motion';
import React from 'react';

export interface LoadingIconProps {
  existIcon: boolean;
  loading?: boolean | object;
}
const getCollapsedWidth = () => ({ width: 0, opacity: 0, transform: 'scale(0)' });
const getRealWidth = (node: HTMLElement) => ({
  width: node.scrollWidth,
  opacity: 1,
  transform: 'scale(1)',
});

const LoadingIcon: React.FC<LoadingIconProps> = ({ loading, existIcon }) => {
  const visible = !!loading;

  if (existIcon) {
    return <span className="animate-spin">{/* <LoadingFour /> */}</span>;
  }

  return (
    <CSSMotion
      visible={visible}
      motionName={`loading-icon-motion`}
      removeOnLeave
      onAppearStart={getCollapsedWidth}
      onAppearActive={getRealWidth}
      onEnterStart={getCollapsedWidth}
      onEnterActive={getRealWidth}
      onLeaveStart={getRealWidth}
      onLeaveActive={getCollapsedWidth}
    >
      {({ className, style }: { className?: string; style?: React.CSSProperties }, ref: any) => (
        <span className="animate-spin" style={style} ref={ref}>
          {/* <LoadingFour className={className} /> */}
        </span>
      )}
    </CSSMotion>
  );
};

export default LoadingIcon;
