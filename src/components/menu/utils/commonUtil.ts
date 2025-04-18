import * as React from 'react';
import toArray from '@rc-component/util/es/Children/toArray';
import type { SafeKey } from '@util/type';

export function parseChildren(
  children: React.ReactNode | undefined,
  keyPath: SafeKey[],
  props?: Record<string, any>,
) {
  return toArray(children).map((child, index) => {
    if (React.isValidElement(child)) {
      const { key } = child;
      let eventKey = (child.props as any)?.eventKey ?? key;

      const emptyKey = eventKey === null || eventKey === undefined;

      if (emptyKey) {
        eventKey = `tmp_key-${[...keyPath, index].join('-')}`;
      }

      const cloneProps = {
        key: eventKey,
        eventKey,
        ...props,
      } as any;

      if (process.env.NODE_ENV !== 'production' && emptyKey) {
        cloneProps.warnKey = true;
      }

      return React.cloneElement(child, cloneProps);
    }

    return child;
  });
}
