import * as React from 'react';
import { clsx } from '../../_util/classNameUtils';
import type { TabBarExtraContent, TabBarExtraMap, TabBarExtraPosition } from '../interface';

interface ExtraContentProps {
  position: TabBarExtraPosition;
  prefixCls: string;
  extra?: TabBarExtraContent;
  className?: string;
}

const ExtraContent = React.forwardRef<HTMLDivElement, ExtraContentProps>((props, ref) => {
  const { position, prefixCls, extra, className } = props;
  if (!extra) {
    return null;
  }

  let content: React.ReactNode;

  // Parse extra
  let assertExtra: TabBarExtraMap = {};
  if (typeof extra === 'object' && !React.isValidElement(extra)) {
    assertExtra = extra as TabBarExtraMap;
  } else {
    assertExtra.right = extra;
  }

  if (position === 'right') {
    content = assertExtra.right;
  }

  if (position === 'left') {
    content = assertExtra.left;
  }

  return content ? (
    <div
      className={clsx(
        `${prefixCls}-extra-content`,
        {
          'mr-4': position === 'left',
          'ml-4': position === 'right',
        },
        className,
      )}
      ref={ref}
    >
      {content}
    </div>
  ) : null;
});

export default ExtraContent;
