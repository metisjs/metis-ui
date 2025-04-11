import fs from 'fs';
import type { IApi, IRoute } from 'dumi';
import ReactTechStack from 'dumi/dist/techStacks/react';
import { dependencies, devDependencies } from '../../package.json';

class MetisUIReactTechStack extends ReactTechStack {
  generatePreviewerProps(...[props, opts]: any) {
    props.pkgDependencyList = { ...devDependencies, ...dependencies };

    if (opts.type === 'external') {
      // try to find md file with the same name as the demo tsx file
      const locale = opts.mdAbsPath.match(/index\.([a-z-]+)\.md$/i)?.[1];
      const mdPath = opts.fileAbsPath!.replace(/\.\w+$/, '.md');
      const md = fs.existsSync(mdPath) ? fs.readFileSync(mdPath, 'utf-8') : '';

      if (md) {
        // extract description & css style from md file
        const blocks: Record<string, string> = {};

        const lines = md.split('\n');

        let blockName = '';
        let cacheList: string[] = [];

        // Get block name
        const getBlockName = (text: string) => {
          if (text.startsWith('## ')) {
            return text.replace('## ', '').trim();
          }

          return null;
        };

        // Fill block content
        const fillBlock = (name: string, lineList: string[]) => {
          if (lineList.length) {
            blocks[name] = lineList.slice(1).join('\n');
          }
        };

        for (let i = 0; i < lines.length; i++) {
          const line = lines[i];

          // Mark as new block
          const nextBlockName = getBlockName(line);
          if (nextBlockName) {
            fillBlock(blockName, cacheList);

            // Next Block
            blockName = nextBlockName;
            cacheList = [line];
          } else {
            cacheList.push(line);
          }
        }

        // Last block
        fillBlock(blockName, cacheList);

        props.description = blocks[locale];
        props.style = blocks.style;
      }
    }

    return props;
  }
}

const resolve = (p: string): string => require.resolve(p);

const MetisUIPlugin = async (api: IApi) => {
  api.registerTechStack(() => new MetisUIReactTechStack());

  api.modifyRoutes((routes) => {
    const extraRoutesList: IRoute[] = [
      {
        id: 'changelog-cn',
        path: 'changelog-cn',
        absPath: '/changelog-cn',
        parentId: 'DocLayout',
        file: resolve('../../CHANGELOG.zh-CN.md'),
      },
      {
        id: 'changelog',
        path: 'changelog',
        absPath: '/changelog',
        parentId: 'DocLayout',
        file: resolve('../../CHANGELOG.en-US.md'),
      },
    ];

    extraRoutesList.forEach((itemRoute) => {
      routes[itemRoute.path] = itemRoute;
    });

    return routes;
  });
};

export default MetisUIPlugin;
