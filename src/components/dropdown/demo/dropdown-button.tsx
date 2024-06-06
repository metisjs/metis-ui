/**
 * description: 左边是按钮，右边是额外的相关功能菜单。可设置 `icon` 属性来修改右边的图标。
 */
import { ChevronDownOutline, UserOutline } from '@metisjs/icons';
import type { MenuProps } from 'metis-ui';
import { Button, Dropdown, Space, Tooltip } from 'metis-ui';
import React from 'react';

const handleButtonClick = (e: React.MouseEvent<HTMLButtonElement>) => {
  console.log('click left button', e);
};

const handleMenuClick: MenuProps['onClick'] = (e) => {
  console.log('click', e);
};

const items: MenuProps['items'] = [
  {
    label: '1st menu item',
    key: '1',
    icon: <UserOutline />,
  },
  {
    label: '2nd menu item',
    key: '2',
    icon: <UserOutline />,
  },
  {
    label: '3rd menu item',
    key: '3',
    icon: <UserOutline />,
    danger: true,
  },
  {
    label: '4rd menu item',
    key: '4',
    icon: <UserOutline />,
    danger: true,
    disabled: true,
  },
];

const menuProps = {
  items,
  onClick: handleMenuClick,
};

const App: React.FC = () => (
  <Space wrap>
    <Dropdown.Button menu={menuProps} onClick={handleButtonClick}>
      Dropdown
    </Dropdown.Button>
    <Dropdown.Button menu={menuProps} placement="bottom" icon={<UserOutline />}>
      Dropdown
    </Dropdown.Button>
    <Dropdown.Button menu={menuProps} onClick={handleButtonClick} disabled>
      Dropdown
    </Dropdown.Button>
    <Dropdown.Button
      menu={menuProps}
      buttonsRender={([leftButton, rightButton]) => [
        <Tooltip title="tooltip" key="leftButton">
          {leftButton}
        </Tooltip>,
        React.cloneElement(rightButton as React.ReactElement<any, string>, { loading: true }),
      ]}
    >
      With Tooltip
    </Dropdown.Button>
    <Dropdown menu={menuProps}>
      <Button>
        <Space>
          Button
          <ChevronDownOutline className="h-5 w-5" />
        </Space>
      </Button>
    </Dropdown>
    <Dropdown.Button menu={menuProps} onClick={handleButtonClick} danger>
      Danger
    </Dropdown.Button>
  </Space>
);

export default App;
