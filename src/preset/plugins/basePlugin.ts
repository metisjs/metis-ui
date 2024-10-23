import tailwindPlugin from 'tailwindcss/plugin';
import type { PluginAPI } from 'tailwindcss/types/config';
import base from '../base';
import injectThemes from '../colors/injectThemes';
import config from '../config';

const mainFunction = ({ addBase, config }: PluginAPI) => {
  addBase(base);

  injectThemes(addBase, config);
};

export default tailwindPlugin(mainFunction, config);
