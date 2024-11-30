import React from 'react';

export type Breakpoint = '2xl' | 'xl' | 'lg' | 'md' | 'sm' | 'xs';
export type BreakpointMap = Record<Breakpoint, string>;
export type ScreenMap = Partial<Record<Breakpoint, boolean>>;
export type ScreenSizeMap = Partial<Record<Breakpoint, number>>;

export const responsiveArray: Breakpoint[] = ['2xl', 'xl', 'lg', 'md', 'sm', 'xs'];
type SubscribeFunc = (screens: ScreenMap) => void;

const responsiveMap: BreakpointMap = {
  xs: `(max-width: 566px)`,
  sm: `(min-width: 567px)`,
  md: `(min-width: 768px)`,
  lg: `(min-width: 992px)`,
  xl: `(min-width: 1200px)`,
  '2xl': `(min-width: 1600px)`,
};

export default function useResponsiveObserver() {
  // To avoid repeat create instance, we add `useMemo` here.
  return React.useMemo(() => {
    const subscribers = new Map<number, SubscribeFunc>();
    let subUid = -1;
    let screens = {};

    return {
      matchHandlers: {} as {
        [prop: string]: {
          mql: MediaQueryList;
          listener: ((this: MediaQueryList, ev: MediaQueryListEvent) => any) | null;
        };
      },
      dispatch(pointMap: ScreenMap) {
        screens = pointMap;
        subscribers.forEach((func) => func(screens));
        return subscribers.size >= 1;
      },
      subscribe(func: SubscribeFunc): number {
        if (!subscribers.size) this.register();
        subUid += 1;
        subscribers.set(subUid, func);
        func(screens);
        return subUid;
      },
      unsubscribe(paramToken: number) {
        subscribers.delete(paramToken);
        if (!subscribers.size) this.unregister();
      },
      unregister() {
        Object.keys(responsiveMap).forEach((screen) => {
          const matchMediaQuery = responsiveMap[screen as Breakpoint];
          const handler = this.matchHandlers[matchMediaQuery];
          handler?.mql.removeListener(handler?.listener);
        });
        subscribers.clear();
      },
      register() {
        Object.keys(responsiveMap).forEach((screen) => {
          const matchMediaQuery = responsiveMap[screen as Breakpoint];
          const listener = ({ matches }: { matches: boolean }) => {
            this.dispatch({
              ...screens,
              [screen]: matches,
            });
          };
          const mql = window.matchMedia(matchMediaQuery);
          mql.addEventListener('change', listener);
          this.matchHandlers[matchMediaQuery] = {
            mql,
            listener,
          };

          listener(mql);
        });
      },
      responsiveMap,
    };
  }, []);
}

export const matchScreen = (screens: ScreenMap, screenSizes?: ScreenSizeMap) => {
  if (screenSizes && typeof screenSizes === 'object') {
    for (let i = 0; i < responsiveArray.length; i++) {
      const breakpoint: Breakpoint = responsiveArray[i];
      if (screens[breakpoint] && screenSizes[breakpoint] !== undefined) {
        return screenSizes[breakpoint];
      }
    }
  }
};
