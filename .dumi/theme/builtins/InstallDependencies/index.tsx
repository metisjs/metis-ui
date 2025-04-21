import React from 'react';
import { Tabs } from 'metis-ui';
import { Tab } from 'metis-ui/es/tabs/interface';
import SourceCodeWrapper from '../SourceCodeWrapper';
import BunLogo from './bun';
import NpmLogo from './npm';
import PnpmLogo from './pnpm';
import YarnLogo from './yarn';

interface InstallProps {
  npm?: string;
  yarn?: string;
  pnpm?: string;
  bun?: string;
}

const InstallDependencies: React.FC<InstallProps> = (props) => {
  const { npm, yarn, pnpm, bun } = props;
  const items: Tab[] = [
    {
      key: 'npm',
      label: 'npm',
      content: npm ? <SourceCodeWrapper lang="bash">{npm}</SourceCodeWrapper> : null,
      icon: <NpmLogo />,
    },
    {
      key: 'pnpm',
      label: 'pnpm',
      content: pnpm ? <SourceCodeWrapper lang="bash">{pnpm}</SourceCodeWrapper> : null,
      icon: <PnpmLogo />,
    },
    {
      key: 'yarn',
      label: 'yarn',
      content: yarn ? <SourceCodeWrapper lang="bash">{yarn}</SourceCodeWrapper> : null,
      icon: <YarnLogo />,
    },
    {
      key: 'bun',
      label: 'Bun',
      content: bun ? <SourceCodeWrapper lang="bash">{bun}</SourceCodeWrapper> : null,
      icon: <BunLogo />,
    },
  ].filter((item) => item.content);

  return (
    <Tabs
      className={{
        root: 'my-6',
        panel: 'markdown',
      }}
      size="small"
      defaultActiveKey="npm"
      items={items}
      data-prefers-color=""
    />
  );
};

export default InstallDependencies;
