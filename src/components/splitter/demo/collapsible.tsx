import React from 'react';
import { mergeSemanticCls, Space, Splitter } from 'metis-ui';
import type { SplitterProps } from 'metis-ui';

const Desc: React.FC<Readonly<{ text?: string | number }>> = (props) => (
  <Space block justify="center" align="center" className="h-full">
    <div className="text-text-secondary text-base">{props.text}</div>
  </Space>
);

const CustomSplitter: React.FC<Readonly<SplitterProps>> = ({ className, ...restProps }) => (
  <Splitter className={mergeSemanticCls(className, 'bg-gray-950/2 dark:bg-white/5')} {...restProps}>
    <Splitter.Panel collapsible min="20%">
      <Desc text="First" />
    </Splitter.Panel>
    <Splitter.Panel collapsible>
      <Desc text="Second" />
    </Splitter.Panel>
  </Splitter>
);

const App: React.FC = () => (
  <Space size="middle" vertical block>
    <CustomSplitter className="h-50" />
    <CustomSplitter className="h-[300px]" layout="vertical" />
  </Space>
);

export default App;
