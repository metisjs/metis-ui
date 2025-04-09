import React from 'react';
import DumiSearchBar from 'dumi/theme-default/slots/SearchBar';
import { clsx } from 'metis-ui';

const isAppleDevice = /(mac|iphone|ipod|ipad)/i.test(
  typeof navigator !== 'undefined' ? navigator?.platform : '',
);

const SearchBar = () => {
  return (
    <button
      type="button"
      className="inline-flex items-center gap-1 rounded-full bg-gray-950/2 px-2 py-1 inset-ring inset-ring-gray-950/8 dark:bg-white/5 dark:inset-ring-white/2"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 16 16"
        className="-ml-0.5 size-4 fill-gray-600 dark:fill-gray-500"
      >
        <path
          fillRule="evenodd"
          d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
          clipRule="evenodd"
        ></path>
      </svg>
      <kbd
        className={clsx(
          'hidden font-sans text-xs/4 text-gray-500 dark:text-gray-400',
          isAppleDevice && 'block',
        )}
      >
        ⌘K
      </kbd>
      <kbd
        className={clsx(
          'block font-sans text-xs/4 text-gray-500 dark:text-gray-400',
          isAppleDevice && 'hidden',
        )}
      >
        Ctrl&nbsp;K
      </kbd>
    </button>
  );
};

export default SearchBar;
