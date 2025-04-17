import React from 'react';
import { clsx, Menu, Scrollbar } from 'metis-ui';
import useMenu from '../../../hooks/useMenu';

const Sidebar: React.FC = () => {
  const [menuItems, selectedKey] = useMenu();

  return (
    <Scrollbar
      className={{
        root: 'fixed top-14 h-[calc(100vh-57px)] w-72 border-r border-gray-950/5 dark:border-white/10',
        view: 'p-6',
      }}
    >
      <Menu
        items={menuItems}
        mode="inline"
        selectedKeys={[selectedKey]}
        className={{
          root: 'py-0',
          item: ({ selected }) => ({
            root: 'cursor-auto p-0',
            inner: clsx(
              '-ml-px flex h-6 w-fit flex-col items-start gap-2 rounded-none border-l border-transparent p-0 pl-5 font-normal hover:border-gray-950/25 hover:bg-transparent dark:hover:border-white/25',
              selected &&
                '**:text-text border-gray-950 bg-transparent font-semibold dark:border-white',
            ),
          }),
          group: {
            root: 'mb-8 last:mb-0',
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
