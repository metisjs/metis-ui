import * as React from 'react';
import { useLocation as useDumiLocation, useLocale } from 'dumi';

function clearPath(path: string) {
  return path.replace('-cn', '').replace(/\/$/, '');
}

export default function useLocation() {
  const { id } = useLocale();
  const location = useDumiLocation();
  const { search } = location;
  const localeType = id === 'zh-CN' ? 'cn' : 'en';

  const getLink = React.useCallback(
    (path: string, hash?: string | { cn: string; en: string }) => {
      let pathname = clearPath(path);

      if (localeType === 'cn') {
        pathname = `${pathname}-cn`;
      }

      if (search) {
        pathname = `${pathname}${search}`;
      }

      if (hash) {
        let hashStr: string;
        if (typeof hash === 'object') {
          hashStr = hash[localeType];
        } else {
          hashStr = hash;
        }

        pathname = `${pathname}#${hashStr}`;
      }

      return pathname;
    },
    [localeType, search],
  );

  return {
    ...location,
    pathname: clearPath(location.pathname),
    getLink,
  };
}
