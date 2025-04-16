import React, { useMemo } from 'react';
import { ChevronLeftOutline, ChevronRightOutline } from '@metisjs/icons';
import { ItemType, MenuItemType } from 'metis-ui/es/menu/interface';
import useMenu from '../../hooks/useMenu';

const flattenMenu = (menuItems: ItemType[]): ItemType[] | null => {
  if (Array.isArray(menuItems)) {
    return menuItems.reduce<Exclude<ItemType[], undefined>>((acc, item) => {
      if (!item) {
        return acc;
      }
      if ('children' in item && item.children) {
        return acc.concat(flattenMenu(item.children as ItemType[]) ?? []);
      }
      return acc.concat(item);
    }, []);
  }
  return null;
};

const PrevAndNext: React.FC = () => {
  const before = <ChevronLeftOutline className="left" />;
  const after = <ChevronRightOutline className="right" />;

  const [menuItems, selectedKey] = useMenu({ before, after });

  const [prev, next] = useMemo<[MenuItemType | null, MenuItemType | null]>(() => {
    const flatMenu = flattenMenu(menuItems);
    if (!flatMenu) {
      return [null, null];
    }

    let activeMenuItemIndex = -1;
    flatMenu.forEach((menuItem, i) => {
      if (menuItem && menuItem.key === selectedKey) {
        activeMenuItemIndex = i;
      }
    });

    return [
      flatMenu[activeMenuItemIndex - 1] as MenuItemType,
      flatMenu[activeMenuItemIndex + 1] as MenuItemType,
    ];
  }, [menuItems, selectedKey]);

  return (
    <section className="mt-16 flex items-center justify-between text-sm leading-6">
      {prev && <div className="**:[.right]:hidden">{prev.label}</div>}
      {next && <div className="ml-auto **:[.left]:hidden">{next.label}</div>}
    </section>
  );
};

export default PrevAndNext;
