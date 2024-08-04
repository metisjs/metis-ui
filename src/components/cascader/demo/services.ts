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

function searchTreeNodesByName(tree: TreeNode[], searchTerm: string): TreeNode[] {
  const result: TreeNode[] = [];

  for (const node of tree) {
    if (node.name.includes(searchTerm)) {
      // 如果当前节点匹配，直接将该节点及其 children 复制到结果中
      result.push({ ...node });
    } else if (node.children) {
      // 如果当前节点不匹配，则递归搜索其子节点
      const matchingChildren = searchTreeNodesByName(node.children, searchTerm);

      if (matchingChildren.length > 0) {
        // 如果子节点中有匹配的，则将当前节点添加到结果中，并保留匹配的子节点
        result.push({ ...node, children: matchingChildren });
      }
    }
  }

  return result;
}

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
  filters?: { name?: string };
  parentId?: string;
}): Promise<{ data: TreeNode[] }> {
  console.log('fetchChildrenData', params);
  const { filters, parentId } = params;
  let data: TreeNode[] = [];
  if (filters?.name) {
    data = searchTreeNodesByName(treeData, filters.name);
  } else {
    data = getChildrenByParentId(treeData, parentId);
  }
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
