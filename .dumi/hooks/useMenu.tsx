import React, { useMemo } from 'react';
import { useFullSidebarData, useSidebarData } from 'dumi';
import type { MenuProps } from 'metis-ui';
import { Space } from 'metis-ui';
import Link from '../theme/common/Link';
import useLocation from './useLocation';

interface MenuItemLabelProps {
  before?: React.ReactNode;
  after?: React.ReactNode;
  link: string;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  search?: string;
}

const MenuItemLabel: React.FC<MenuItemLabelProps> = (props) => {
  const { before, after, link, title, subtitle, search } = props;

  if (!before && !after) {
    return (
      <Link
        to={`${link}${search}`}
        className="text-sm/6 text-gray-600 hover:text-gray-950 dark:text-gray-300 dark:hover:text-white"
      >
        <Space block justify="start" align="center" size="small">
          <span>{title}</span>
          {subtitle && <span className="text-text-tertiary text-xs">{subtitle}</span>}
        </Space>
      </Link>
    );
  }
  return (
    <Link
      to={`${link}${search}`}
      className="text-sm/6 text-gray-600 hover:text-gray-950 dark:text-gray-300 dark:hover:text-white"
    >
      <Space block justify="start" align="center" size="small">
        {before}
        {title}
        {subtitle && <span className="text-text-tertiary text-xs">{subtitle}</span>}
        {after}
      </Space>
    </Link>
  );
};

export interface UseMenuOptions {
  before?: React.ReactNode;
  after?: React.ReactNode;
}

const useMenu = (options: UseMenuOptions = {}): readonly [MenuProps['items'], string] => {
  const fullData = useFullSidebarData();
  const { pathname, search } = useLocation();
  const sidebarData = useSidebarData();
  const { before, after } = options;

  const menuItems = useMemo<MenuProps['items']>(() => {
    const sidebarItems = [...(sidebarData ?? [])];

    // 把 /changelog 拼到开发文档中
    if (pathname.startsWith('/docs')) {
      const changelogData = Object.entries(fullData).find(([key]) =>
        key.startsWith('/changelog'),
      )?.[1];
      if (changelogData) {
        sidebarItems.splice(1, 0, changelogData[0]);
      }
    }
    if (pathname.startsWith('/changelog')) {
      const docData = Object.entries(fullData).find(([key]) => key.startsWith('/docs'))?.[1];
      if (docData) {
        sidebarItems.unshift(docData[0]);
        sidebarItems.push(...docData.slice(1));
      }
    }

    return (
      sidebarItems?.reduce<Exclude<MenuProps['items'], undefined>>((result, group) => {
        if (group?.title) {
          result.push({
            type: 'group',
            label: group?.title,
            key: group?.title,
            children: group.children?.map((item) => ({
              label: (
                <MenuItemLabel
                  before={before}
                  after={after}
                  link={item.link}
                  title={item?.title}
                  subtitle={item.frontmatter?.subtitle}
                  search={search}
                />
              ),
              key: item.link.replace(/(-cn$)/g, ''),
            })),
          });
        } else {
          const list = group.children || [];
          // 如果有 date 字段，我们就对其进行排序
          if (list.every((info) => info?.frontmatter?.date)) {
            list.sort((a, b) => (a.frontmatter?.date > b.frontmatter?.date ? -1 : 1));
          }
          result.push(
            ...list.map((item) => ({
              label: (
                <MenuItemLabel
                  before={before}
                  after={after}
                  link={item.link}
                  title={item?.title}
                  search={search}
                />
              ),
              key: item.link.replace(/(-cn$)/g, ''),
            })),
          );
        }
        return result;
      }, []) ?? []
    );
  }, [sidebarData, fullData, pathname, search, options]);

  return [menuItems, pathname] as const;
};

export default useMenu;
