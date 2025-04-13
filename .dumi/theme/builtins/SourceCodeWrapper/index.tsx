import React, { FC } from 'react';
import DumiSourceCode, { ISourceCodeProps } from 'dumi/theme-default/builtins/SourceCode';

const SourceCodeWrapper: FC<ISourceCodeProps> = (props) => {
  return (
    <div
      className="rounded-xl bg-gray-950 p-1 text-sm scheme-dark dark:bg-white/5 dark:inset-ring dark:inset-ring-white/10"
      data-prefers-color="dark"
    >
      <div className="-mb-6 px-3 pt-0.5 pb-1.5 text-xs/5 text-gray-400 dark:text-white/50">
        {props.lang}
      </div>
      <DumiSourceCode {...props} />
    </div>
  );
};

export default SourceCodeWrapper;
