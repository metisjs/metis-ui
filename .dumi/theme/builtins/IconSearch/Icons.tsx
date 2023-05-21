import React from 'react';
import CopyableIcon from './CopyableIcon';
import fields from './fields';

export default ({ type, query }: { type: string; query?: string }) => {
  let filteredIcons = fields[type];

  if (query) {
    const matchKey = query
      // eslint-disable-next-line prefer-regex-literals
      .replace(new RegExp(`^<([a-zA-Z]*)\\s/>$`, 'gi'), (_, name) => name)
      .replace(/(Solid|Outline)$/, '')
      .toLowerCase();
    filteredIcons = filteredIcons.filter((iconName) => iconName.toLowerCase().includes(matchKey));
  }

  if (query && filteredIcons.length === 0) {
    return (
      <div className="flex flex-col items-center py-20 text-sm leading-6 text-slate-600 md:py-32 lg:py-40">
        <svg viewBox="0 0 32 32" fill="none" aria-hidden="true" className="h-8 w-8">
          <path
            d="m13 13 6 6m0-6-6 6m15-3c0 6.627-5.373 12-12 12S4 22.627 4 16 9.373 4 16 4s12 5.373 12 12Z"
            stroke="#CBD5E1"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <p className="mt-6">
          抱歉，没找到<span className="font-semibold text-slate-900">{`“${query}”`}</span>
          相关的图标
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(8rem,1fr))] gap-x-6 gap-y-8 pb-16 pt-10 sm:pt-11 md:pt-12">
      {filteredIcons.map((name) => (
        <CopyableIcon key={name} name={name} />
      ))}
    </div>
  );
};
