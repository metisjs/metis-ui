import React from 'react';
import classNames from 'classnames';
import { useRouteMeta, useTabMeta } from 'dumi';
import { Anchor, Scrollbar } from 'metis-ui';
import { AnchorLinkItemProps } from 'metis-ui/es/anchor/Anchor';

interface DocAnchorProps {
  showDebug?: boolean;
  debugDemos?: string[];
}

interface AnchorItem {
  id: string;
  title: string;
  children?: AnchorItem[];
}

const DocAnchor: React.FC<DocAnchorProps> = ({ showDebug, debugDemos = [] }) => {
  const meta = useRouteMeta();
  const tab = useTabMeta();

  const renderAnchorItem = (item: AnchorItem): AnchorLinkItemProps => ({
    href: `#${item.id}`,
    title: item.title,
    key: item.id,
    children: item.children
      ?.filter((child) => showDebug || !debugDemos.includes(child.id))
      .map<AnchorLinkItemProps>((child) => ({
        key: child.id,
        href: `#${child.id}`,
        title: (
          <span className={classNames({ 'toc-debug': debugDemos.includes(child.id) })}>
            {child?.title}
          </span>
        ),
      })),
  });

  const anchorItems = React.useMemo<AnchorItem[]>(
    () =>
      (tab?.toc || meta.toc).reduce<AnchorItem[]>((result, item) => {
        if (item.depth === 2) {
          result.push({ ...item });
        } else if (item.depth === 3) {
          const parent = result[result.length - 1];
          if (parent) {
            parent.children = parent.children || [];
            parent.children.push({ ...item });
          }
        }
        return result;
      }, []),
    [tab?.toc, meta.toc],
  );

  if (!meta.frontmatter.toc) {
    return null;
  }

  return (
    <Scrollbar className="fixed top-24 right-10 h-[calc(100vh-var(--spacing)*34)] w-62 bg-white backdrop-blur-2xl xl:hidden dark:bg-gray-950/5">
      <Anchor
        affix={false}
        targetOffset={57}
        showInkInFixed
        items={anchorItems.map<AnchorLinkItemProps>(renderAnchorItem)}
      />
    </Scrollbar>
  );
};

export default DocAnchor;
