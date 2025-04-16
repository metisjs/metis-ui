import React from 'react';
import { clsx } from 'metis-ui';

const ContentPlaceholder = ({ className }: { className?: string }) => {
  return (
    <div
      className={clsx(
        'border-border relative h-full min-h-48 overflow-hidden rounded-xl border border-dashed opacity-75',
        className,
      )}
    >
      <svg
        fill="none"
        className="absolute inset-0 block h-full w-full stroke-gray-900/10 align-middle dark:stroke-gray-100/10"
      >
        <defs>
          <pattern
            x="0"
            y="0"
            id="pattern-1526ac66-f54a-4681-8fb8-0859d412f251"
            width="10"
            height="10"
            patternUnits="userSpaceOnUse"
          >
            <path d="M-3 13 15-5M-5 5l18-18M-1 21 17 3"></path>
          </pattern>
        </defs>
        <rect
          fill="url(#pattern-1526ac66-f54a-4681-8fb8-0859d412f251)"
          width="100%"
          height="100%"
          stroke="none"
        ></rect>
      </svg>
    </div>
  );
};

export default ContentPlaceholder;
