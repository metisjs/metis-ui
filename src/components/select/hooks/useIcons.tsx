import type { ReactNode } from 'react';
import * as React from 'react';
import {
  CheckOutline,
  ChevronDownOutline,
  LoadingOutline,
  MagnifyingGlassOutline,
  XCircleSolid,
  XMarkOutline,
} from '@metisjs/icons';
import { clsx } from '../../_util/classNameUtils';
import { cloneElement } from '../../_util/reactNode';
import type { SizeType } from '../../config-provider/SizeContext';

type RenderNode = React.ReactNode | ((props: any) => React.ReactNode);

export default function useIcons({
  size = 'middle',
  suffixIcon,
  clearIcon,
  menuItemSelectedIcon,
  removeIcon,
  loading,
  hasFeedback,
  prefixCls,
  feedbackIcon,
}: {
  suffixIcon?: React.ReactNode;
  clearIcon?: RenderNode;
  menuItemSelectedIcon?: RenderNode;
  removeIcon?: RenderNode;
  loading?: boolean;
  multiple?: boolean;
  hasFeedback?: boolean;
  feedbackIcon?: ReactNode;
  prefixCls: string;
  size?: SizeType;
}) {
  const sizeCls = clsx({
    'text-lg': size === 'large' || size === 'middle',
    'text-base': size === 'small' || size === 'mini',
  });
  // Clear Icon
  const mergedClearIcon = clearIcon ?? <XCircleSolid className={sizeCls} />;

  // Validation Feedback Icon
  const getSuffixIconNode = (arrowIcon?: ReactNode) => {
    if (suffixIcon === null && !hasFeedback) {
      return null;
    }
    return (
      <>
        {suffixIcon !== null && arrowIcon}
        {hasFeedback &&
          cloneElement(feedbackIcon, (origin) => ({
            ...origin,
            className: clsx(sizeCls, origin.className),
          }))}
      </>
    );
  };

  // Arrow item icon
  let mergedSuffixIcon = null;
  if (suffixIcon !== undefined) {
    mergedSuffixIcon = getSuffixIconNode(suffixIcon);
  } else if (loading) {
    mergedSuffixIcon = getSuffixIconNode(
      <LoadingOutline className={clsx(sizeCls, 'animate-spin text-primary')} />,
    );
  } else {
    const iconCls = clsx(`${prefixCls}-suffix`, sizeCls);
    mergedSuffixIcon = ({ open, showSearch }: { open: boolean; showSearch: boolean }) => {
      if (open && showSearch) {
        return getSuffixIconNode(<MagnifyingGlassOutline className={iconCls} />);
      }
      return getSuffixIconNode(<ChevronDownOutline className={iconCls} />);
    };
  }

  // Checked item icon
  let mergedItemIcon = null;
  if (menuItemSelectedIcon !== undefined) {
    mergedItemIcon = menuItemSelectedIcon;
  } else {
    mergedItemIcon = <CheckOutline className="h-5 w-5" />;
  }

  let mergedRemoveIcon = null;
  if (removeIcon !== undefined) {
    mergedRemoveIcon = removeIcon;
  } else {
    mergedRemoveIcon = <XMarkOutline />;
  }

  return {
    clearIcon: mergedClearIcon,
    suffixIcon: mergedSuffixIcon,
    itemIcon: mergedItemIcon,
    removeIcon: mergedRemoveIcon,
  };
}
