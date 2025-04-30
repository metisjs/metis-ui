import React from 'react';
import { clsx, Menu, Scrollbar } from 'metis-ui';
import useMenu from '../../../hooks/useMenu';

const Sidebar: React.FC<{ className?: string; onChange?: () => void }> = ({
  className,
  onChange,
}) => {
  const [menuItems, selectedKey] = useMenu();

  return (
    <Scrollbar
      className={{
        root: clsx(
          'fixed top-14 hidden h-[calc(100vh-57px)] w-72 border-r border-gray-950/5 lg:block dark:border-white/10',
          className,
        ),
        view: 'p-6',
      }}
    >
      <Menu
        items={menuItems}
        mode="inline"
        selectedKeys={[selectedKey]}
        onClick={onChange}
        className={{
          root: 'gap-2 py-0',
          item: ({ selected, grouped }) => ({
            root: 'cursor-auto gap-3 p-0',
            inner: clsx(
              '-ml-px flex h-7 w-fit flex-col items-start gap-2 rounded-none p-0 font-normal hover:bg-transparent',
              grouped &&
                'h-7 border-l border-transparent pl-5 hover:border-gray-950/25 lg:h-6 dark:hover:border-white/25',
              selected &&
                '**:text-text border-gray-950 bg-transparent font-semibold dark:border-white **:[svg]:stroke-gray-950! dark:**:[svg]:stroke-white!',
            ),
          }),
          group: {
            root: 'mt-6 first:mt-0',
            label:
              'p-0 font-mono text-sm/6 font-medium tracking-widest text-gray-500 uppercase sm:text-xs/6 dark:text-gray-400',
            list: 'mt-3 gap-2 border-l border-gray-950/15 p-0 dark:border-white/15',
          },
        }}
      />
    </Scrollbar>
  );
};

export default Sidebar;
