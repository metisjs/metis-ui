import * as React from 'react';
import Transition from '../../transition';
import MenuContextProvider, { MenuContext } from '../context/MenuContext';
import type { MenuMode } from '../interface';
import { getTransition } from '../utils/transitionUtil';
import SubMenuList from './SubMenuList';

export interface InlineSubMenuListProps {
  id?: string;
  open: boolean;
  keyPath: string[];
  children: React.ReactNode;
}

export default function InlineSubMenuList({ id, open, keyPath, children }: InlineSubMenuListProps) {
  const fixedMode: MenuMode = 'inline';

  const { forceSubMenuRender, transition, defaultTransitions, mode } =
    React.useContext(MenuContext);

  // Always use latest mode check
  const sameModeRef = React.useRef(false);
  sameModeRef.current = mode === fixedMode;

  // We record `destroy` mark here since when mode change from `inline` to others.
  // The inline list should remove when motion end.
  const [destroy, setDestroy] = React.useState(!sameModeRef.current);

  const mergedOpen = sameModeRef.current ? open : false;

  // ================================= Effect =================================
  // Reset destroy state when mode change back
  React.useEffect(() => {
    if (sameModeRef.current) {
      setDestroy(false);
    }
  }, [mode]);

  // ================================= Render =================================
  const mergedTransition = { ...getTransition(fixedMode, transition, defaultTransitions) };

  // No need appear since nest inlineCollapse changed
  if (keyPath.length > 1) {
    mergedTransition.appear = false;
  }

  // Hide inline list when mode changed and motion end
  const originOnVisibleChanged = mergedTransition.onVisibleChanged;
  mergedTransition.onVisibleChanged = (newVisible) => {
    if (!sameModeRef.current && !newVisible) {
      setDestroy(true);
    }

    return originOnVisibleChanged?.(newVisible);
  };

  if (destroy) {
    return null;
  }

  return (
    <MenuContextProvider mode={fixedMode} locked={!sameModeRef.current}>
      <Transition
        visible={mergedOpen}
        {...mergedTransition}
        forceRender={forceSubMenuRender}
        removeOnLeave={false}
      >
        {({ className: transitionClassName, style: transitionStyle }) => {
          return (
            <SubMenuList id={id} className={transitionClassName} style={transitionStyle}>
              {children}
            </SubMenuList>
          );
        }}
      </Transition>
    </MenuContextProvider>
  );
}
