import * as React from 'react';
import type { SafeKey } from '@util/type';
import type { ItemType } from '../interface';
import MenuDivider from '../MenuDivider';
import MenuItem from '../MenuItem';
import MenuItemGroup from '../MenuItemGroup';
import SubMenu from '../SubMenu';
import { parseChildren } from './commonUtil';

function convertItemsToNodes(list: ItemType[]) {
  return (list || [])
    .map((opt, index) => {
      if (opt && typeof opt === 'object') {
        const { label, children, key, type, ...restProps } = opt as any;
        const mergedKey = key ?? `tmp-${index}`;

        // MenuItemGroup & SubMenuItem
        if (children || type === 'group') {
          if (type === 'group') {
            // Group
            return (
              <MenuItemGroup key={mergedKey} eventKey={mergedKey} {...restProps} title={label}>
                {convertItemsToNodes(children)}
              </MenuItemGroup>
            );
          }

          // Sub Menu
          return (
            <SubMenu key={mergedKey} eventKey={mergedKey} {...restProps} title={label}>
              {convertItemsToNodes(children)}
            </SubMenu>
          );
        }

        // MenuItem & Divider
        if (type === 'divider') {
          return <MenuDivider key={mergedKey} {...restProps} />;
        }

        return (
          <MenuItem key={mergedKey} eventKey={mergedKey} {...restProps}>
            {label}
          </MenuItem>
        );
      }

      return null;
    })
    .filter((opt) => opt);
}

export function parseItems(items: ItemType[], keyPath: SafeKey[]) {
  const childNodes = convertItemsToNodes(items);

  return parseChildren(childNodes, keyPath);
}
