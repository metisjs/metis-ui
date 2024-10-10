import { omit } from 'lodash';

export interface TreeNode {
  id: string;
  name: string;
  children?: TreeNode[];
  leaf?: boolean;
}
const treeData: TreeNode[] = Array.from({ length: 3 }, (_, i) => ({
  id: `${i + 1}`,
  name: `Node ${i + 1}`,
  children: Array.from({ length: 5 }, (_, j) => ({
    id: `${i + 1}-${j + 1}`,
    name: `Node ${i + 1}-${j + 1}`,
    children: Array.from({ length: 2 }, (_, k) => ({
      id: `${i + 1}-${j + 1}-${k + 1}`,
      name: `Node ${i + 1}-${j + 1}-${k + 1}`,
      leaf: true,
    })),
    leaf: false,
  })),
  leaf: false,
}));

function getChildrenByParentId(treeData: TreeNode[], parentId?: string): TreeNode[] {
  if (!parentId) {
    return treeData.map((item) => omit(item, 'children'));
  }

  const findNode = (nodes: TreeNode[]): TreeNode | undefined => {
    for (const node of nodes) {
      if (node.id === parentId) {
        return node;
      } else if (node.children) {
        const found = findNode(node.children);
        if (found) return found;
      }
    }
    return undefined;
  };

  const parentNode = findNode(treeData);

  return (parentNode?.children || []).map((item) => omit(item, 'children'));
}

export async function fetchChildrenData(params: {
  parentId?: string;
}): Promise<{ data: TreeNode[] }> {
  console.log('fetchChildrenData', params);
  const { parentId } = params;
  const data = getChildrenByParentId(treeData, parentId);

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        data,
      });
    }, 700);
  });
}

export async function fetchData(): Promise<{ data: TreeNode[] }> {
  console.log('fetchData');
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        data: treeData,
      });
    }, 700);
  });
}
