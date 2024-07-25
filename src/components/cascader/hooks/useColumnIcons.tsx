import { ArrowRightOutline, LoadingOutline } from '@metisjs/icons';
import * as React from 'react';

export default function useColumnIcons(prefixCls: string, expandIcon?: React.ReactNode) {
  let mergedExpandIcon = expandIcon;
  if (!expandIcon) {
    mergedExpandIcon = <ArrowRightOutline />;
  }

  const loadingIcon = (
    <span className={`${prefixCls}-menu-item-loading-icon`}>
      <LoadingOutline className="animate-spin" />
    </span>
  );

  return [mergedExpandIcon, loadingIcon];
}
