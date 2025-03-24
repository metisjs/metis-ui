import * as React from 'react';
import type { ParseOptions, StringifyOptions } from 'query-string';
import qs from 'query-string';
import { useEvent } from 'rc-util';
import useForceUpdate from './useForceUpdate';

export interface Options {
  disabled?: boolean;
  navigateMode?: 'push' | 'replace';
  parseOptions?: ParseOptions;
  stringifyOptions?: StringifyOptions;
}

const baseParseConfig: ParseOptions = {
  parseNumbers: true,
  parseBooleans: true,
  arrayFormat: 'bracket-separator',
  arrayFormatSeparator: '|',
};

const baseStringifyConfig: StringifyOptions = {
  skipNull: false,
  skipEmptyString: false,
  arrayFormat: 'bracket-separator',
  arrayFormatSeparator: '|',
};

type UrlState = Record<string, any>;

function filledPrefix(record: Record<string, any>, prefix?: string) {
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

const useUrlState = <S extends UrlState = UrlState>(
  initialState?: S | (() => S),
  group?: string,
  options?: Options,
) => {
  type State = Partial<{ [key in keyof S]: any }>;

  const { disabled, navigateMode = 'replace', parseOptions, stringifyOptions } = options || {};

  const mergedParseOptions = { ...baseParseConfig, ...parseOptions };
  const mergedStringifyOptions = { ...baseStringifyConfig, ...stringifyOptions };

  const forceUpdate = useForceUpdate();

  const initialStateRef = React.useRef<S>(
    (typeof initialState === 'function' ? (initialState as () => S)() : initialState || {}) as S,
  );

  const [innerState, setInnerState] = React.useState<S>(initialStateRef.current);

  const search = React.useMemo(() => {
    if (group) {
      return location.search
        .replace('?', '')
        .split('&')
        .filter((item) => item.startsWith(`${group}.`))
        .map((item) => item.replace(`${group}.`, ''))
        .join('&');
    }

    return location.search;
  }, [group, location.search]);

  const queryFromUrl = React.useMemo(() => {
    return qs.parse(search, mergedParseOptions);
  }, [search]);

  const targetQuery: State = React.useMemo(() => {
    if (disabled) return innerState;

    return {
      ...initialStateRef.current,
      ...queryFromUrl,
    };
  }, [disabled, innerState, queryFromUrl]);

  React.useEffect(() => {
    if (disabled) return () => {};
    if (typeof window === 'undefined' || !window.URL) return () => {};

    const onPopState = () => {
      forceUpdate();
    };
    window.addEventListener('popstate', onPopState);
    return () => {
      window.removeEventListener('popstate', onPopState);
    };
  }, [disabled]);

  const setState = (s: React.SetStateAction<State>) => {
    const newQuery = typeof s === 'function' ? s(innerState) : s;

    setInnerState({ ...innerState, ...newQuery });

    if (!disabled) {
      const queryFromUrl = qs.parse(window.location.search, mergedParseOptions);

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

  return [targetQuery, useEvent(setState)] as const;
};

export default useUrlState;
