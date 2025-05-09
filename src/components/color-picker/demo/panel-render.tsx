import React from 'react';
import { upperFirst } from 'lodash';
import { ColorPicker, Divider, Space, useTheme } from 'metis-ui';
import type { ColorPickerProps } from 'metis-ui';
import twColors from 'tailwindcss/colors';

const colors = ['amber', 'lime', 'teal', 'sky', 'indigo', 'rose'];

const HorizontalLayoutDemo = () => {
  const theme = useTheme();
  const presets = colors.map((color) => ({
    label: upperFirst(color),
    colors: Object.values(twColors[color as keyof typeof twColors]),
  }));

  const customPanelRender: ColorPickerProps['panelRender'] = (
    _,
    { components: { Picker, Presets } },
  ) => (
    <div className="flex justify-between">
      <div className="w-1/2">
        <Presets />
      </div>
      <Divider type="vertical" className="h-auto" />
      <div className="w-1/2">
        <Picker />
      </div>
    </div>
  );

  return (
    <ColorPicker
      defaultValue={theme.primary}
      className={{ popup: 'w-120' }}
      presets={presets}
      panelRender={customPanelRender}
    />
  );
};

const BasicDemo = () => (
  <ColorPicker
    defaultValue="#4f46e5"
    panelRender={(panel) => (
      <div className="custom-panel">
        <div className="text-text/5 mb-2 text-xs">Color Picker</div>
        {panel}
      </div>
    )}
  />
);

export default () => (
  <Space vertical block>
    <Space>
      <span>Add title:</span>
      <BasicDemo />
    </Space>
    <Space>
      <span>Horizontal layout:</span>
      <HorizontalLayoutDemo />
    </Space>
  </Space>
);
