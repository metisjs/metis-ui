import React, { useEffect, useRef, useState } from 'react';
import { LoadingOutline, MagnifyingGlassOutline } from '@metisjs/icons';
import { useIntl, useSiteSearch } from 'dumi';
import { clsx, Input, InputRef, Modal, Scrollbar } from 'metis-ui';
import SearchResult from './SearchResult';

const isAppleDevice = /(mac|iphone|ipod|ipad)/i.test(
  typeof navigator !== 'undefined' ? navigator?.platform : '',
);

const SearchBar = () => {
  const intl = useIntl();
  const { keywords, setKeywords, result, loading } = useSiteSearch();

  const [open, setOpen] = useState(false);

  const inputRef = useRef<InputRef>(null);

  useEffect(() => {
    const handler = (ev: KeyboardEvent) => {
      if ((isAppleDevice ? ev.metaKey : ev.ctrlKey) && ev.key === 'k') {
        ev.preventDefault();

        setOpen(true);
      }
    };

    document.addEventListener('keydown', handler);

    return () => document.removeEventListener('keydown', handler);
  }, []);

  return (
    <>
      <button
        type="button"
        className="inline-flex items-center md:hidden"
        onClick={() => setOpen(true)}
      >
        <MagnifyingGlassOutline className="size-4" />
      </button>
      <button
        type="button"
        className="hidden items-center gap-1 rounded-full bg-gray-950/2 px-2 py-1 inset-ring inset-ring-gray-950/8 md:inline-flex dark:bg-white/5 dark:inset-ring-white/2"
        onClick={() => setOpen(true)}
      >
        <MagnifyingGlassOutline className="-ml-0.5 size-4 text-gray-600 dark:text-gray-500" />
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
      <Modal
        open={open}
        footer={null}
        closable={false}
        onCancel={() => setOpen(false)}
        width={680}
        className={{ body: 'px-0 py-2' }}
        afterClose={() => {
          setKeywords('');
        }}
        afterOpenChange={() => inputRef.current?.focus()}
      >
        <Input
          ref={inputRef}
          size="large"
          prefix={
            loading && !!keywords.trim() ? (
              <LoadingOutline className="text-primary animate-spin" />
            ) : (
              <MagnifyingGlassOutline />
            )
          }
          placeholder={intl.formatMessage({ id: 'header.search.placeholder' })}
          className="rounded-none bg-transparent px-4 shadow-none outline-hidden"
          value={keywords}
          onChange={setKeywords}
        />
        {!!keywords.trim() && (
          <Scrollbar
            autoHeight={[0, 520]}
            className="mt-2 border-t border-gray-950/5 dark:border-white/10"
          >
            <SearchResult data={result} loading={loading} onItemSelect={() => setOpen(false)} />
          </Scrollbar>
        )}
      </Modal>
    </>
  );
};

export default SearchBar;
