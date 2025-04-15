import React, { useEffect, useRef, useState } from 'react';
import { useIntl } from 'dumi';
import { Segmented } from 'metis-ui';
import Icons from './Icons';

export default function IconSearch() {
  const { formatMessage } = useIntl();
  const searchInputRef = useRef<HTMLInputElement>(null);

  const [query, setQuery] = useState('');
  const [type, setType] = useState<string | number>('Outline');

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'k' && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        searchInputRef.current?.focus();
      }
    }

    window.addEventListener('keydown', onKeyDown);

    return () => {
      window.removeEventListener('keydown', onKeyDown);
    };
  }, []);

  return (
    <main>
      <div className="pointer-events-none sticky top-14 z-50 overflow-hidden bg-white/50 pt-4 backdrop-blur dark:bg-gray-950/50">
        <div className="relative">
          <div className="border-border-secondary pointer-events-auto relative border-b pb-4">
            <div className="flex flex-row items-center sm:flex-col">
              <div className="relative flex-auto">
                <input
                  ref={searchInputRef}
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  aria-label={formatMessage({ id: 'app.docs.components.icon.search.placeholder' })}
                  placeholder={formatMessage({ id: 'app.docs.components.icon.search.placeholder' })}
                  className="placeholder:text-text-quaternary text-text block w-full appearance-none rounded-lg border-0 bg-transparent py-4 pr-4 pl-9 text-base transition focus:ring-0 focus:outline-hidden [&::-webkit-search-cancel-button]:appearance-none [&::-webkit-search-decoration]:appearance-none [&::-webkit-search-results-button]:appearance-none [&::-webkit-search-results-decoration]:appearance-none"
                />
                <svg
                  viewBox="0 0 20 20"
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-y-0 left-0 h-full w-5 fill-gray-600 transition dark:fill-gray-500"
                >
                  <path d="M16.72 17.78a.75.75 0 1 0 1.06-1.06l-1.06 1.06ZM9 14.5A5.5 5.5 0 0 1 3.5 9H2a7 7 0 0 0 7 7v-1.5ZM3.5 9A5.5 5.5 0 0 1 9 3.5V2a7 7 0 0 0-7 7h1.5ZM9 3.5A5.5 5.5 0 0 1 14.5 9H16a7 7 0 0 0-7-7v1.5Zm3.89 10.45 3.83 3.83 1.06-1.06-3.83-3.83-1.06 1.06ZM14.5 9a5.48 5.48 0 0 1-1.61 3.89l1.06 1.06A6.98 6.98 0 0 0 16 9h-1.5Zm-1.61 3.89A5.48 5.48 0 0 1 9 14.5V16a6.98 6.98 0 0 0 4.95-2.05l-1.06-1.06Z" />
                </svg>
              </div>
              <div>
                <Segmented
                  size="large"
                  options={['Outline', 'Solid']}
                  value={type}
                  onChange={setType}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className={'mx-auto max-w-7xl px-4'}>
        <Icons type={type as string} query={query} />
      </div>
    </main>
  );
}
