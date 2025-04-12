import * as React from 'react';
import { ChevronRightOutline, LoadingOutline } from '@metisjs/icons';

export default function useColumnIcons(expandIcon?: React.ReactNode) {
  let mergedExpandIcon = expandIcon;
  if (!expandIcon) {
    mergedExpandIcon = <ChevronRightOutline className="size-4" />;
  }

  const loadingIcon = <LoadingOutline className="size-4 animate-spin" />;

  return [mergedExpandIcon, loadingIcon];
}
