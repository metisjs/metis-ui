import React from 'react';
import { useLocale } from 'dumi';
import { upperFirst } from 'lodash';
import { ColorPicker } from 'metis-ui';
import twColors from 'tailwindcss/colors';
import SemanticPreview from '../../../../.dumi/components/SemanticPreview';

const colors = ['teal'];

const presets = colors.map((color) => ({
  label: upperFirst(color),
  colors: Object.values(twColors[color as keyof typeof twColors]),
}));

const App: React.FC = () => {
  const { id } = useLocale();
  const localeSuffix = id === 'zh-CN' ? '-cn' : '';

  return (
    <SemanticPreview
      semantics={[
        { name: 'root' },
        { name: 'block' },
        { name: 'text' },
        { name: 'popup' },
        {
          name: 'panel',
          children: [
            { name: 'mode' },
            { name: 'clear' },
            { name: 'palette' },
            { name: 'paletteHandle' },
            { name: 'block' },
            { name: 'slider', link: `/components/slider${localeSuffix}#semantic-dom` },
            { name: 'formatSelect', link: `/components/select${localeSuffix}#semantic-dom` },
            { name: 'alphaInput', link: `/components/input${localeSuffix}#semantic-dom` },
            { name: 'hexInput', link: `/components/input${localeSuffix}#semantic-dom` },
            { name: 'rgbInput', link: `/components/input${localeSuffix}#semantic-dom` },
            { name: 'hsbInput', link: `/components/input${localeSuffix}#semantic-dom` },
            {
              name: 'presets',
              children: [
                {
                  name: 'header',
                },
                {
                  name: 'content',
                },
                {
                  name: 'block',
                },
              ],
            },
          ],
        },
      ]}
      rootArgs={[
        { name: 'open', type: 'boolean' },
        { name: 'disabled', type: 'boolean' },
      ]}
    >
      {(hover) => {
        const modeSwitchable = ['panel_mode'].includes(hover?.path ?? '');
        const format =
          hover?.path === 'panel_rgbInput'
            ? 'rgb'
            : hover?.path === 'panel_hsbInput'
              ? 'hsb'
              : 'hex';

        return (
          <ColorPicker
            defaultValue="#4f46e5"
            mode={modeSwitchable ? ['single', 'gradient'] : undefined}
            showText
            allowClear
            open
            format={format}
            presets={presets}
            getPopupContainer={(node) => node.parentElement!}
          />
        );
      }}
    </SemanticPreview>
  );
};

export default App;
