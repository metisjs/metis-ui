import React, { FC, useEffect, useRef, useState } from 'react';
import { ClipboardDocumentOutline } from '@metisjs/icons';
import DumiSourceCode, { ISourceCodeProps } from 'dumi/theme-default/builtins/SourceCode';
import { clsx } from 'metis-ui';

const SourceCodeWrapper: FC<ISourceCodeProps> = (props) => {
  const { children = '', lang } = props;

  const timer = useRef<number>(null);
  const [isCopied, setIsCopied] = useState(false);
  const [text, setText] = useState(children);

  useEffect(() => {
    const isShell = /shellscript|shell|bash|sh|zsh/.test(lang);
    if (isShell) {
      const text = children.replace(/^(\$|>)\s/gm, '');
      setText(text);
    }
  }, [lang, children]);

  const copy = () => {
    if (isCopied) return;

    navigator.clipboard.writeText(text).then(() => {
      setIsCopied(true);
      if (timer.current) {
        clearTimeout(timer.current);
      }
      timer.current = window.setTimeout(() => setIsCopied(false), 2000);
    });
  };

  return (
    <div
      className="rounded-xl bg-gray-950 p-1 text-sm scheme-dark dark:bg-white/5 dark:inset-ring dark:inset-ring-white/10 **:[.dumi-default-source-code-copy]:hidden!"
      data-prefers-color="dark"
    >
      <div className="-mb-6 flex items-center justify-between px-3 pt-0.5 pb-1.5 text-xs/5 text-gray-400 dark:text-white/50">
        {lang}
        <span
          className={clsx('cursor-pointer hover:text-white', isCopied && 'text-white')}
          onClick={copy}
        >
          {isCopied ? 'copied' : <ClipboardDocumentOutline className="text-base" />}
        </span>
      </div>
      <DumiSourceCode {...props} />
    </div>
  );
};

export default SourceCodeWrapper;
