import React, { FC, useState } from 'react';
import { IPreviewerProps, useDemo } from 'dumi';
import DumiSourceCode from 'dumi/theme-default/builtins/SourceCode';
import SourceCodeEditor from 'dumi/theme-default/slots/SourceCodeEditor';
import { clsx, Tabs } from 'metis-ui';

export interface SourceCodeProps extends IPreviewerProps {}

const SourceCode: FC<SourceCodeProps> = (props) => {
  const files = Object.entries(props.asset.dependencies).filter(([, { type }]) => type === 'FILE');
  const { renderOpts } = useDemo(props.asset.id)!;
  const [activeKey, setActiveKey] = useState(0);
  const isSingleFile = files.length === 1;
  const lang = (files[activeKey][0].match(/\.([^.]+)$/)?.[1] || 'text') as any;

  return (
    <div className="-mx-1 -mb-1 rounded-xl bg-gray-950" data-prefers-color="dark">
      <div className="rounded-xl p-1 text-sm scheme-dark dark:bg-white/5 dark:inset-ring dark:inset-ring-white/10">
        <Tabs
          className={{
            nav: clsx('mb-0 px-3 pt-0.5 pb-1.5', isSingleFile && 'hidden'),
            tab: ({ active }) =>
              clsx(
                'p-0 text-xs/5 text-white/50 hover:bg-transparent hover:text-white/70',
                active && 'bg-transparent text-white/70',
              ),
          }}
          type="pills"
          defaultActiveKey={String(activeKey)}
          onChange={(key) => setActiveKey(Number(key))}
          items={files.map(([filename], i) => ({
            key: String(i),
            // remove leading ./ prefix
            label: filename.replace(/^\.\//, ''),
            // only support to edit entry file currently
            content:
              i === 0 && renderOpts?.compile ? (
                <SourceCodeEditor
                  lang={lang}
                  initialValue={files[i][1].value.trim()}
                  onChange={(code) => {
                    props.onSourceChange?.({ [files[i][0]]: code });
                    props.onSourceTranspile?.({
                      source: { [files[i][0]]: code },
                    });
                  }}
                />
              ) : (
                <DumiSourceCode lang={lang}>{files[activeKey][1].value.trim()}</DumiSourceCode>
              ),
          }))}
        />
      </div>
    </div>
  );
};

export default SourceCode;
