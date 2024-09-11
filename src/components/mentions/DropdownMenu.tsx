import * as React from 'react';
import type { MenuProps } from '../menu';
import Menu from '../menu';
import { MentionsContext } from './context';
import type { OptionProps } from './Mentions';

interface DropdownMenuProps {
  prefixCls?: string;
  options: OptionProps[];
}

/**
 * We only use Menu to display the candidate.
 * The focus is controlled by textarea to make accessibility easy.
 */
function DropdownMenu(props: DropdownMenuProps) {
  const { notFoundContent, activeIndex, setActiveIndex, selectOption, onFocus, onBlur } =
    React.useContext(MentionsContext);

  const { prefixCls, options } = props;
  const activeOption = options[activeIndex] || {};

  const menuItems: MenuProps['items'] = React.useMemo(
    () =>
      options.length
        ? options.map(({ key, disabled, className, style, label, value }, index) => ({
            key: key ?? value,
            label: label ?? value,
            disabled,
            className,
            style,
            onMouseEnter: () => {
              setActiveIndex(index);
            },
          }))
        : [
            {
              key: 'notFoundContent',
              disabled: true,
              label: notFoundContent,
            },
          ],
    [options, setActiveIndex],
  );

  return (
    <Menu
      prefixCls={`${prefixCls}-menu`}
      activeKey={activeOption.key}
      items={menuItems}
      onSelect={({ key }) => {
        const option = options.find(({ key: optionKey }) => optionKey === key)!;
        selectOption(option);
      }}
      onFocus={onFocus}
      onBlur={onBlur}
    ></Menu>
  );
}

export default DropdownMenu;
