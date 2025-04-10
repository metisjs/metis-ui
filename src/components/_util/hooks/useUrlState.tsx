import * as React from 'react';
import { useEvent } from '@rc-component/util';
import type { RequiredWith } from '@util/type';
import type { ParseOptions, StringifyOptions } from 'query-string';
import qs from 'query-string';

export interface UrlStateOptions<S extends UrlState = UrlState, T = any> {
  disabled?: boolean;
  navigateMode?: 'push' | 'replace';
  parseOptions?: ParseOptions;
  stringifyOptions?: StringifyOptions;
  /**
   * @desc get is transform S to T, set is transform T to S
   */
  transform?: (value: T | S, type: 'set' | 'get') => S | T;
}

const baseParseConfig: ParseOptions = {
  parseNumbers: false,
  parseBooleans: false,
  arrayFormat: 'bracket-separator',
  arrayFormatSeparator: '|',
};

const baseStringifyConfig: StringifyOptions = {
  skipNull: true,
  skipEmptyString: true,
  arrayFormat: 'bracket-separator',
  arrayFormatSeparator: '|',
};

type UrlState = Record<string, any>;

function filledPrefix(record: Record<string, any>, prefix: string) {
  if (prefix) {
    return Object.keys(record).reduce(
      (prev, curr) => ({
        ...prev,
        [`${prefix}.${curr}`]: record[curr],
      }),
      {},
    );
  }

  return record;
}

const defaultTransform = (a: any) => a;

function useUrlState<S extends UrlState = UrlState, T = any>(
  group: string,
  initialState?: T | (() => T),
  options?: RequiredWith<UrlStateOptions<S, T>, 'transform'>,
): [T, (s: React.SetStateAction<T>) => void];
function useUrlState<S extends UrlState = UrlState, T = any>(
  group: string,
  initialState?: S | (() => S),
  options?: Omit<UrlStateOptions<S, T>, 'transform'>,
): [S, (s: React.SetStateAction<S>) => void];
function useUrlState(group: string, initialState?: any | (() => any), options?: UrlStateOptions) {
  const {
    disabled,
    navigateMode = 'replace',
    parseOptions,
    stringifyOptions,
    transform = defaultTransform,
  } = options || {};

  const mergedParseOptions = { ...baseParseConfig, ...parseOptions };
  const mergedStringifyOptions = { ...baseStringifyConfig, ...stringifyOptions };

  const initialStateRef = React.useRef(
    typeof initialState === 'function' ? initialState() : initialState || {},
  );

  const getCurrentState = useEvent(() => {
    const search = location.search
      .replace('?', '')
      .split('&')
      .filter((item) => item.startsWith(`${group}.`))
      .map((item) => item.replace(`${group}.`, ''))
      .join('&');

    const queryFromUrl = qs.parse(search, mergedParseOptions);

    return transform(
      {
        ...transform(initialStateRef.current, 'set'),
        ...queryFromUrl,
      },
      'get',
    );
  });

  const [innerState, setInnerState] = React.useState(() => {
    if (disabled) {
      return initialStateRef.current;
    }

    return getCurrentState();
  });

  React.useEffect(() => {
    if (disabled) return () => {};
    if (typeof window === 'undefined' || !window.URL) return () => {};

    const onPopState = () => {
      setInnerState(getCurrentState());
    };
    window.addEventListener('popstate', onPopState);
    return () => {
      window.removeEventListener('popstate', onPopState);
    };
  }, [disabled]);

  const setState = (s: React.SetStateAction<any>) => {
    setInnerState(s);

    if (!disabled) {
      let newQuery = transform(typeof s === 'function' ? s(innerState) : s, 'set');

      const queryFromUrl = qs.parse(
        window.location.search
          .replace('?', '')
          .split('&')
          .filter((item) => !item.startsWith(`${group}.`))
          .join('&'),
        mergedParseOptions,
      );

      const queryString = qs.stringify(
        { ...queryFromUrl, ...filledPrefix(newQuery, group) },
        mergedStringifyOptions,
      );
      const newUrl = `${window.location.pathname}?${queryString}${window.location.hash}`;

      if (window.location.search.replace('?', '') !== queryString) {
        if (navigateMode === 'replace') {
          window.history.replaceState(window.history.state, '', newUrl);
        } else {
          window.history.pushState(window.history.state, '', newUrl);
        }
      }
    }
  };

  return [innerState, useEvent(setState)] as const;
}

export default useUrlState;
