import { ChevronRightOutline, LoadingOutline } from '@metisjs/icons';
import * as React from 'react';

export default function useColumnIcons(prefixCls: string, expandIcon?: React.ReactNode) {
  let mergedExpandIcon = expandIcon;
  if (!expandIcon) {
    mergedExpandIcon = <ChevronRightOutline className="h-4 w-4" />;
  }

  const loadingIcon = (
    <span className={`${prefixCls}-menu-item-loading-icon`}>
      <LoadingOutline className="h-4 w-4 animate-spin" />
    </span>
  );

  return [mergedExpandIcon, loadingIcon];
}
