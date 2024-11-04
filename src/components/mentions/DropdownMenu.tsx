import * as React from 'react';
import type { MenuProps } from '../menu';
import Menu from '../menu';
import Spin from '../spin';
import { MentionsContext } from './context';
import type { MentionsOptionProps } from './Mentions';

interface DropdownMenuProps {
  prefixCls?: string;
  options: MentionsOptionProps[];
}

/**
 * We only use Menu to display the candidate.
 * The focus is controlled by textarea to make accessibility easy.
 */
function DropdownMenu(props: DropdownMenuProps) {
  const { notFoundContent, loading, activeIndex, setActiveIndex, selectOption, onFocus, onBlur } =
    React.useContext(MentionsContext);

  const { prefixCls, options } = props;
  const activeOption = options[activeIndex] || {};

  const menuItems: MenuProps['items'] = React.useMemo(() => {
    if (loading) {
      return [
        {
          key: 'METIS_SEARCHING',
          disabled: true,
          label: <Spin size="small" className="align-middle" />,
          className: { inner: 'text-center' },
        },
      ];
    }

    return options.length
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
            className: { inner: 'h-24' },
          },
        ];
  }, [options, loading, setActiveIndex]);

  return (
    <Menu
      prefixCls={`${prefixCls}-menu`}
      className={{
        root: 'p-1',
        item: {
          root: 'min-w-24 p-0',
          inner: 'h-auto rounded-md px-3 py-1 pe-3 font-normal leading-6',
        },
      }}
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
