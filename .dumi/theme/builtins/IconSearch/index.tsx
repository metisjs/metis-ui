import { Segmented } from 'meta-ui';
import React, { useEffect, useRef, useState } from 'react';
import Icons from './Icons';

export default function IconSearch() {
  let searchInputRef = useRef<HTMLInputElement>(null);

  let [query, setQuery] = useState('');
  let [type, setType] = useState<string | number>('Outline');

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
      <div className="pointer-events-none sticky top-[76px] z-50 -mb-12 overflow-hidden pb-12">
        <div className="relative">
          <div className="pointer-events-auto relative pb-4 shadow-[0_1px_3px_rgba(15,23,42,0.08)] dark:bg-[#0a0e13]">
            <div className="flex flex-col items-center sm:flex-row">
              <div className="relative flex-auto">
                <input
                  ref={searchInputRef}
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  aria-label="在此搜索图标，点击图标可复制代码"
                  placeholder="在此搜索图标，点击图标可复制代码"
                  className="block w-full appearance-none rounded-lg bg-transparent py-6 pl-9 pr-4 text-base text-slate-900 transition placeholder:text-slate-400 focus:outline-none dark:text-[#c6c9cd] [&::-webkit-search-cancel-button]:appearance-none [&::-webkit-search-decoration]:appearance-none [&::-webkit-search-results-button]:appearance-none [&::-webkit-search-results-decoration]:appearance-none"
                />
                <svg
                  viewBox="0 0 20 20"
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-y-0 left-0 h-full w-5 fill-slate-500 transition"
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
