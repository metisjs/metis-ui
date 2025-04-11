import React, { ReactNode, useCallback, useEffect, useState, type FC } from 'react';
import { DumiDemo, useRouteMeta } from 'dumi';
import { IDumiDemoProps } from 'dumi/dist/client/theme-api/DumiDemo';
import { IRouteMeta } from 'dumi/dist/client/theme-api/types';

export interface DemoGridProps {
  items: IDumiDemoProps[];
  demoRender?: (item: IDumiDemoProps) => ReactNode;
}

const DemoGrid: FC<DemoGridProps> = (props) => {
  const { frontmatter: fm } = useRouteMeta();
  const generator = useCallback((fm: IRouteMeta['frontmatter'], oItems: typeof props.items) => {
    const cols: IDumiDemoProps[][] = [];
    const items =
      process.env.NODE_ENV === 'production'
        ? // hide debug demo in production
          oItems.filter((d) => !d.previewerProps.debug)
        : oItems;

    if (
      fm.demo?.cols &&
      fm.demo.cols > 1 &&
      // compatible for ssr env
      (typeof window === 'undefined' || window.innerWidth > 1536)
    ) {
      for (let i = 0; i < items.length; i += fm.demo.cols) {
        items.slice(i, i + fm.demo.cols).forEach((item, j) => {
          cols[j] ??= [];
          cols[j].push(item);
        });
      }

      return cols;
    } else {
      cols.push(items);
    }

    return cols;
  }, []);
  const [cols, setCols] = useState(() => generator(fm, props.items));

  useEffect(() => {
    const handler = () => setCols(generator(fm, props.items));

    window.addEventListener('resize', handler);
    handler();

    return () => window.removeEventListener('resize', handler);
  }, [props.items, fm.demo]);

  return (
    <div className="my-6 flex gap-6">
      {cols.map((col, i) => (
        <section className="flex w-0 flex-1 flex-col gap-6" key={String(i)}>
          {col.map((item) => {
            if (props.demoRender) {
              return props.demoRender(item);
            }
            return <DumiDemo key={item.demo.id} {...item} />;
          })}
        </section>
      ))}
    </div>
  );
};

export default DemoGrid;
