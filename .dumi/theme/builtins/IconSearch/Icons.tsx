import React from 'react';
import { Empty } from 'metis-ui';
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
      <div className="flex flex-col items-center py-12">
        <Empty />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(8rem,1fr))] gap-x-6 gap-y-8 pb-16 pt-12 md:pt-11 sm:pt-10">
      {filteredIcons.map((name) => (
        <CopyableIcon key={name} name={name} />
      ))}
    </div>
  );
};
