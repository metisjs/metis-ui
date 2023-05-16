import classNames from 'classnames';
import React, { useEffect, useId, useRef, useState } from 'react';

function Blur({ className }: { className?: string }) {
  let id = useId();

  return (
    <svg viewBox="0 0 1140 34" fill="none" className={className}>
      <g opacity=".6" filter={`url(#${id}-a)`}>
        <path fill={`url(#${id}-b)`} d="M6 6h1128v22H6z" />
        <path fill={`url(#${id}-c)`} d="M6 6h1128v22H6z" />
      </g>
      <defs>
        <radialGradient
          id={`${id}-c`}
          cx={0}
          cy={0}
          r={1}
          gradientUnits="userSpaceOnUse"
          gradientTransform="matrix(0 -22 1128 0 563 28)"
        >
          <stop offset=".273" stopColor="#fff" />
          <stop offset={1} stopColor="#fff" stopOpacity={0} />
        </radialGradient>
        <linearGradient
          id={`${id}-b`}
          x1={6}
          y1={6}
          x2={1134}
          y2={6}
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#A78BFA" stopOpacity={0} />
          <stop offset=".323" stopColor="#A78BFA" />
          <stop offset=".672" stopColor="#EC4899" stopOpacity=".3" />
          <stop offset={1} stopColor="#EC4899" stopOpacity={0} />
        </linearGradient>
        <filter
          id={`${id}-a`}
          x={0}
          y={0}
          width={1140}
          height={34}
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity={0} result="BackgroundImageFix" />
          <feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
          <feGaussianBlur stdDeviation={3} result="effect1_foregroundBlur_311_43535" />
        </filter>
      </defs>
    </svg>
  );
}

function TabListSmall({ enabled = true, selectedIndex }) {
  let List = enabled ? Tab.List : 'div';
  let Item = enabled ? Tab : 'div';

  return (
    <List
      aria-hidden={!enabled}
      className="grid grid-cols-3 gap-0.5 rounded-lg bg-slate-400/10 text-center text-[0.8125rem] font-semibold leading-6 text-slate-600 shadow-[0_1px_2px_rgba(15,23,42,0.04)] ring-1 ring-slate-900/5"
    >
      {['Outline', 'Solid'].map((type, typeIndex, types) => (
        <Item
          key={type}
          className={classNames(
            'px-6 py-2 transition focus:z-10 [&:not(:focus-visible)]:focus:outline-none',
            typeIndex === 0 && 'rounded-l-lg',
            typeIndex === types.length - 1 && 'rounded-r-lg',
            selectedIndex === typeIndex
              ? 'bg-slate-50 text-violet-500'
              : 'bg-white hover:bg-slate-50 hover:text-slate-700',
          )}
        >
          {type}
        </Item>
      ))}
    </List>
  );
}

export default function IconSearch() {
  let searchInputRef = useRef<HTMLInputElement>(null);

  let [query, setQuery] = useState('');

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
      <Tab.Group>
        {({ selectedIndex }) => (
          <>
            <div className="pointer-events-none sticky top-0 z-50 -mb-12  overflow-hidden pb-12">
              <div className="relative">
                <Blur className="absolute bottom-[-16px] left-1/2 ml-[-570px] w-[1140px]" />
                <div className="pointer-events-auto relative bg-white pb-4 shadow-[0_1px_3px_rgba(15,23,42,0.08)]">
                  <div className="flex flex-col items-center sm:flex-row">
                    <div className="relative flex-auto">
                      <input
                        ref={searchInputRef}
                        type="search"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        aria-label="在此搜索图标，点击图标可复制代码"
                        placeholder="在此搜索图标，点击图标可复制代码"
                        className="block w-full appearance-none rounded-lg bg-transparent py-6 pl-9 pr-4 text-base text-slate-900 transition placeholder:text-slate-400 focus:outline-none [&::-webkit-search-cancel-button]:appearance-none [&::-webkit-search-decoration]:appearance-none [&::-webkit-search-results-button]:appearance-none [&::-webkit-search-results-decoration]:appearance-none"
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
                      <TabListSmall enabled={isLg === false} selectedIndex={selectedIndex} />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <Tab.Panels>
                <Tab.Panel className="focus:outline-none">
                  <Icons icons={icons1} query={query} />
                </Tab.Panel>
                <Tab.Panel className="focus:outline-none">
                  <Icons icons={icons2} query={query} />
                </Tab.Panel>
              </Tab.Panels>
            </div>
          </>
        )}
      </Tab.Group>
    </main>
  );
}
