import * as React from 'react';
import { ChevronRightOutline, LoadingOutline } from '@metisjs/icons';

export default function useColumnIcons(expandIcon?: React.ReactNode) {
  let mergedExpandIcon = expandIcon;
  if (!expandIcon) {
    mergedExpandIcon = <ChevronRightOutline className="h-4 w-4" />;
  }

  const loadingIcon = <LoadingOutline className="h-4 w-4 animate-spin" />;

  return [mergedExpandIcon, loadingIcon];
}
