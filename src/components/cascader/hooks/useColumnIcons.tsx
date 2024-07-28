import { ChevronRightOutline, LoadingOutline } from '@metisjs/icons';
import * as React from 'react';

export default function useColumnIcons(prefixCls: string, expandIcon?: React.ReactNode) {
  let mergedExpandIcon = expandIcon;
  if (!expandIcon) {
    mergedExpandIcon = <ChevronRightOutline className="h-6 w-5" />;
  }

  const loadingIcon = (
    <span className={`${prefixCls}-menu-item-loading-icon`}>
      <LoadingOutline className="h-5 w-5 animate-spin" />
    </span>
  );

  return [mergedExpandIcon, loadingIcon];
}
