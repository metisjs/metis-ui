import type { IApi, IRoute } from 'dumi';

const resolve = (p: string): string => require.resolve(p);

const MetisUIPlugin = async (api: IApi) => {
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
