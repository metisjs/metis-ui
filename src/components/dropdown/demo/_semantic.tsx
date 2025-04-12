import React from 'react';
import { ChevronDownOutline } from '@metisjs/icons';
import type { MenuProps } from 'metis-ui';
import { Dropdown, Space } from 'metis-ui';
import SemanticPreview from '../../../../.dumi/components/SemanticPreview';

const items: MenuProps['items'] = [
  {
    key: '1',
    label: '1st menu item',
  },
  {
    key: '2',
    label: '2nd menu item (disabled)',
    disabled: true,
  },
  {
    key: '4',
    danger: true,
    label: 'a danger item',
  },
];

const App: React.FC = () => (
  <SemanticPreview
    semantics={[{ name: 'root' }, { name: 'overlay' }]}
    rootArgs={[{ name: 'open', type: 'boolean' }]}
    height={360}
  >
    <Dropdown
      menu={{ items }}
      open
      getPopupContainer={(triggerNode) => triggerNode.parentNode as HTMLElement}
    >
      <a onClick={(e) => e.preventDefault()}>
        <Space>
          Hover me
          <ChevronDownOutline className="size-4" />
        </Space>
      </a>
    </Dropdown>
  </SemanticPreview>
);

export default App;
