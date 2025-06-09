import path from 'path';
import type { IApi } from 'father';
import fs from 'fs-extra';
import { glob } from 'glob';
import { rimraf } from 'rimraf';

export default (api: IApi) => {
  api.register({
    key: 'onAllBuildComplete',
    fn: () => {
      const localeDir = path.join(api.paths.cwd, 'locale');
      const localeDts = `import type { Locale } from '../lib/locale';
declare const localeValues: Locale;
export default localeValues;`;

      rimraf.sync(localeDir);
      fs.mkdirSync(localeDir);

      const localeFiles = glob.sync('src/components/locale/*.ts?(x)');
      localeFiles.forEach((item) => {
        const match = item.match(/src\/components\/locale\/(.*)\.tsx?/);
        if (match) {
          const locale = match[1];
          fs.writeFileSync(
            path.join(localeDir, `${locale}.js`),
            `module.exports = require('../lib/locale/${locale}');`,
          );
          fs.writeFileSync(path.join(localeDir, `${locale}.d.ts`), localeDts);
        }
      });
    },
  });
};
