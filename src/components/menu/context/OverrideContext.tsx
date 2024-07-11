import ContextIsolator from 'metis-ui/es/_util/ContextIsolator';
import { supportNodeRef, useComposeRef } from 'rc-util';
import * as React from 'react';
import { MenuProps } from '../Menu';

// Used for Dropdown only
export interface OverrideContextProps {
  prefixCls?: string;
  expandIcon?: React.ReactNode;
  mode?: MenuProps['mode'];
  selectable?: boolean;
  className?: { root?: string; item?: string; itemInner?: string; itemIcon?: string };
  validator?: (menuProps: Pick<MenuProps, 'mode'>) => void;
  onClick?: () => void;
}

const OverrideContext = React.createContext<OverrideContextProps | null>(null);

/** @internal Only used for Dropdown component. Do not use this in your production. */
export const OverrideProvider = React.forwardRef<
  HTMLElement,
  OverrideContextProps & { children: React.ReactNode }
>((props, ref) => {
  const { children, ...restProps } = props;
  const override = React.useContext(OverrideContext);

  const context = React.useMemo<OverrideContextProps>(
    () => ({ ...override, ...restProps }),
    [override, restProps.prefixCls, restProps.mode, restProps.selectable, restProps.className],
  );

  const canRef = supportNodeRef(children);
  const mergedRef = useComposeRef(ref, canRef ? children.ref : null);

  return (
    <OverrideContext.Provider value={context}>
      <ContextIsolator space>
        {canRef ? React.cloneElement(children as React.ReactElement, { ref: mergedRef }) : children}
      </ContextIsolator>
    </OverrideContext.Provider>
  );
});

/** @internal Only used for Dropdown component. Do not use this in your production. */
export default OverrideContext;
