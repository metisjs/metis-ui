import React from 'react';
import { CalendarOutline } from '@metisjs/icons';
import type { TreeDataNode, TreeProps } from 'metis-ui';
import { Switch, Tree } from 'metis-ui';

const x = 3;
const y = 2;
const z = 1;
const data: TreeDataNode[] = [];

const generateData = (_level: number, preKey = '0', tns = data): TreeDataNode[] | undefined => {
  const children: string[] = [];
  for (let i = 0; i < x; i++) {
    const key = `${preKey}-${i}`;
    tns.push({ title: key, key, icon: <CalendarOutline /> });
    if (i < y) {
      children.push(key);
    }
  }
  if (_level < 0) {
    return tns;
  }
  const level = _level - 1;
  children.forEach((key, index) => {
    tns[index].children = [];
    return generateData(level, key, tns[index].children);
  });
};

generateData(z);

const App: React.FC = () => {
  const [gData, setGData] = React.useState<TreeDataNode[]>(data);
  const [showLine, setShowLine] = React.useState<boolean>(true);
  const [showIcon, setShowIcon] = React.useState<boolean>(true);
  const [expandedKeys, setExpandedKeys] = React.useState<React.Key[]>(['0-0', '0-0-0', '0-0-0-0']);

  const onDragEnter: TreeProps['onDragEnter'] = (info) => {
    console.log(info);
    // expandedKeys, set it when controlled is needed
    setExpandedKeys(info.expandedKeys);
  };

  const onDrop: TreeProps['onDrop'] = (info) => {
    console.log(info);
    const dropKey = info.node.key as number;
    const dragKey = info.dragNode.key as number;
    const dropPos = info.node.pos.split('-');
    const dropPosition = info.dropPosition - Number(dropPos[dropPos.length - 1]);

    const loop = (
      data: TreeDataNode[],
      key: number,
      callback: (item: TreeDataNode, index: number, err: TreeDataNode[]) => void,
    ): void => {
      for (let i = 0; i < data.length; i++) {
        if (data[i].key === key) {
          return callback(data[i], i, data);
        }
        if (data[i].children) {
          loop(data[i].children!, key, callback);
        }
      }
    };

    const data = [...gData];

    // Find dragObject
    let dragObj: TreeDataNode;
    loop(data, dragKey, (item, index, arr) => {
      arr.splice(index, 1);
      dragObj = item;
    });

    if (!info.dropToGap) {
      // Drop on the content
      loop(data, dropKey, (item) => {
        item.children = item.children || [];
        // where to insert. New item was inserted to the end of the array in this example, but can be anywhere
        item.children.push(dragObj);
      });
    } else {
      let ar: TreeDataNode[];
      let i: number;
      loop(data, dropKey, (_, index, arr) => {
        ar = arr;
        i = index;
      });
      if (dropPosition === -1) {
        ar!.splice(i!, 0, dragObj!);
      } else {
        ar!.splice(i! + 1, 0, dragObj!);
      }
    }
    setGData(data);
  };

  return (
    <>
      <div style={{ marginBottom: 16 }}>
        showLine: <Switch checked={showLine} onChange={(v) => setShowLine(v)} />
        <br />
        <br />
        showIcon: <Switch checked={showIcon} onChange={(v) => setShowIcon(v)} />
      </div>
      <Tree
        showLine={showLine}
        showIcon={showIcon}
        className="draggable-tree"
        defaultExpandedKeys={expandedKeys}
        draggable={{ icon: true }}
        onDragEnter={onDragEnter}
        onDrop={onDrop}
        treeData={gData}
      />
    </>
  );
};

export default App;
