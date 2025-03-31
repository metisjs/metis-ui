import tailwindPlugin from 'tailwindcss/plugin';
import base from './base';
import injectThemes from './colors/injectThemes';
import config from './config';

export default tailwindPlugin.withOptions(
  (options) =>
    ({ addBase, config }) => {
      addBase(base);
      injectThemes(addBase, config);
    },
  () => config,
);
