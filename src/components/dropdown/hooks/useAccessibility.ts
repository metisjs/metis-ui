import * as React from 'react';
import raf from '@rc-component/util/es/raf';

interface UseAccessibilityProps {
  open: boolean;
  triggerRef: React.RefObject<any>;
  onOpenChange?: (open: boolean) => void;
  autoFocus?: boolean;
  overlayRef: React.RefObject<any>;
}

export default function useAccessibility({
  open,
  triggerRef,
  onOpenChange,
  autoFocus,
  overlayRef,
}: UseAccessibilityProps) {
  const focusMenuRef = React.useRef<boolean>(false);

  const handleCloseMenuAndReturnFocus = () => {
    if (open) {
      triggerRef.current?.focus?.();
      onOpenChange?.(false);
    }
  };

  const focusMenu = () => {
    if (overlayRef.current?.focus) {
      overlayRef.current.focus();
      focusMenuRef.current = true;
      return true;
    }
    return false;
  };

  const handleKeyDown = (event: KeyboardEvent) => {
    switch (event.key) {
      case 'Escape':
        handleCloseMenuAndReturnFocus();
        break;
      case 'Tab': {
        let focusResult: boolean = false;
        if (!focusMenuRef.current) {
          focusResult = focusMenu();
        }

        if (focusResult) {
          event.preventDefault();
        } else {
          handleCloseMenuAndReturnFocus();
        }
        break;
      }
    }
  };

  React.useEffect(() => {
    if (open) {
      window.addEventListener('keydown', handleKeyDown);
      if (autoFocus) {
        raf(focusMenu, 3);
      }
      return () => {
        window.removeEventListener('keydown', handleKeyDown);
        focusMenuRef.current = false;
      };
    }
    return () => {
      focusMenuRef.current = false;
    };
  }, [open]); // eslint-disable-line react-hooks/exhaustive-deps
}
