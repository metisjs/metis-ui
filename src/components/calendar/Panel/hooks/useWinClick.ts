import * as React from 'react';

export default function useWinClick(callback: () => void) {
  React.useEffect(() => {
    addEventListener('click', callback);
    addEventListener('contextmenu', callback);

    return () => {
      removeEventListener('click', callback);
      removeEventListener('contextmenu', callback);
    };
  }, []);
}
