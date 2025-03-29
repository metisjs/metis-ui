import { warning } from 'rc-util/es/warning';
import type {
  BasicDataNode,
  DataEntity,
  DataNode,
  GetCheckDisabled,
  Key,
  KeyEntities,
} from '../interface';
import getEntity from './keyUtil';

interface ConductReturnType {
  checkedKeys: Key[];
  halfCheckedKeys: Key[];
}

function removeFromCheckedKeys(halfCheckedKeys: Set<Key>, checkedKeys: Set<Key>) {
  const filteredKeys = new Set<Key>();
  halfCheckedKeys.forEach((key) => {
    if (!checkedKeys.has(key)) {
      filteredKeys.add(key);
    }
  });
  return filteredKeys;
}

export function isCheckDisabled<TreeDataType>(node: TreeDataType, disabledFieldName: string) {
  const { disableCheckbox, checkable } = (node || {}) as DataNode;
  return (
    !!(node[disabledFieldName as keyof TreeDataType] || disableCheckbox) || checkable === false
  );
}

// Fill miss keys
function fillConductCheck<TreeDataType extends BasicDataNode = DataNode>(
  keys: Set<Key>,
  levelEntities: Map<number, Set<DataEntity<TreeDataType>>>,
  maxLevel: number,
  getCheckDisabled: GetCheckDisabled<TreeDataType>,
): ConductReturnType {
  const checkedKeys = new Set<Key>(keys);
  const halfCheckedKeys = new Set<Key>();

  // Add checked keys top to bottom
  for (let level = 0; level <= maxLevel; level += 1) {
    const entities = levelEntities.get(level) || new Set();
    entities.forEach((entity) => {
      const { key, node, children = [] } = entity;

      if (checkedKeys.has(key) && !getCheckDisabled(node)) {
        children
          .filter((childEntity) => !getCheckDisabled(childEntity.node))
          .forEach((childEntity) => {
            checkedKeys.add(childEntity.key);
          });
      }
    });
  }

  // Add checked keys from bottom to top
  const visitedKeys = new Set<Key>();
  for (let level = maxLevel; level >= 0; level -= 1) {
    const entities = levelEntities.get(level) || new Set();
    entities.forEach((entity) => {
      const { parent, node } = entity;

      // Skip if no need to check
      if (getCheckDisabled(node) || !parent || visitedKeys.has(parent.key)) {
        return;
      }

      // Skip if parent is disabled
      if (getCheckDisabled(parent.node)) {
        visitedKeys.add(parent.key);
        return;
      }

      let allChecked = true;
      let partialChecked = false;

      (parent.children || [])
        .filter((childEntity) => !getCheckDisabled(childEntity.node))
        .forEach(({ key }) => {
          const checked = checkedKeys.has(key);
          if (allChecked && !checked) {
            allChecked = false;
          }
          if (!partialChecked && (checked || halfCheckedKeys.has(key))) {
            partialChecked = true;
          }
        });

      if (allChecked) {
        checkedKeys.add(parent.key);
      }
      if (partialChecked) {
        halfCheckedKeys.add(parent.key);
      }

      visitedKeys.add(parent.key);
    });
  }

  return {
    checkedKeys: Array.from(checkedKeys),
    halfCheckedKeys: Array.from(removeFromCheckedKeys(halfCheckedKeys, checkedKeys)),
  };
}

// Remove useless key
function cleanConductCheck<TreeDataType extends BasicDataNode = DataNode>(
  keys: Set<Key>,
  halfKeys: Key[],
  levelEntities: Map<number, Set<DataEntity<TreeDataType>>>,
  maxLevel: number,
  getCheckDisabled: GetCheckDisabled<TreeDataType>,
): ConductReturnType {
  const checkedKeys = new Set<Key>(keys);
  let halfCheckedKeys = new Set<Key>(halfKeys);

  // Remove checked keys from top to bottom
  for (let level = 0; level <= maxLevel; level += 1) {
    const entities = levelEntities.get(level) || new Set();
    // eslint-disable-next-line @typescript-eslint/no-loop-func
    entities.forEach((entity) => {
      const { key, node, children = [] } = entity;

      if (!checkedKeys.has(key) && !halfCheckedKeys.has(key) && !getCheckDisabled(node)) {
        children
          .filter((childEntity) => !getCheckDisabled(childEntity.node))
          .forEach((childEntity) => {
            checkedKeys.delete(childEntity.key);
          });
      }
    });
  }

  // Remove checked keys form bottom to top
  halfCheckedKeys = new Set<Key>();
  const visitedKeys = new Set<Key>();
  for (let level = maxLevel; level >= 0; level -= 1) {
    const entities = levelEntities.get(level) || new Set();

    entities.forEach((entity) => {
      const { parent, node } = entity;

      // Skip if no need to check
      if (getCheckDisabled(node) || !parent || visitedKeys.has(parent.key)) {
        return;
      }

      // Skip if parent is disabled
      if (getCheckDisabled(parent.node)) {
        visitedKeys.add(parent.key);
        return;
      }

      let allChecked = true;
      let partialChecked = false;

      (parent.children || [])
        .filter((childEntity) => !getCheckDisabled(childEntity.node))
        .forEach(({ key }) => {
          const checked = checkedKeys.has(key);
          if (allChecked && !checked) {
            allChecked = false;
          }
          if (!partialChecked && (checked || halfCheckedKeys.has(key))) {
            partialChecked = true;
          }
        });

      if (!allChecked) {
        checkedKeys.delete(parent.key);
      }
      if (partialChecked) {
        halfCheckedKeys.add(parent.key);
      }

      visitedKeys.add(parent.key);
    });
  }

  return {
    checkedKeys: Array.from(checkedKeys),
    halfCheckedKeys: Array.from(removeFromCheckedKeys(halfCheckedKeys, checkedKeys)),
  };
}

/**
 * Conduct with keys.
 * @param keyList current key list
 * @param keyEntities key - dataEntity map
 */
export function conductCheck<TreeDataType extends BasicDataNode = DataNode>(
  keyList: Key[],
  checked: true | { checked: false; halfCheckedKeys: Key[] },
  keyEntities: KeyEntities<TreeDataType>,
  getCheckDisabled: GetCheckDisabled<TreeDataType>,
): ConductReturnType {
  const warningMissKeys: Key[] = [];

  // We only handle exist keys
  const keys = new Set<Key>(
    keyList.filter((key) => {
      const hasEntity = !!getEntity(keyEntities, key);
      if (!hasEntity) {
        warningMissKeys.push(key);
      }

      return hasEntity;
    }),
  );
  const levelEntities = new Map<number, Set<DataEntity<TreeDataType>>>();
  let maxLevel = 0;

  // Convert entities by level for calculation
  Object.keys(keyEntities).forEach((key) => {
    const entity = keyEntities[key];
    const { level } = entity;

    let levelSet: Set<DataEntity<TreeDataType>> | undefined = levelEntities.get(level);
    if (!levelSet) {
      levelSet = new Set();
      levelEntities.set(level, levelSet);
    }

    levelSet.add(entity);

    maxLevel = Math.max(maxLevel, level);
  });

  warning(
    !warningMissKeys.length,
    `Tree missing follow keys: ${warningMissKeys
      .slice(0, 100)
      .map((key) => `'${key}'`)
      .join(', ')}`,
  );

  let result: ConductReturnType;
  if (checked === true) {
    result = fillConductCheck<TreeDataType>(keys, levelEntities, maxLevel, getCheckDisabled);
  } else {
    result = cleanConductCheck(
      keys,
      checked.halfCheckedKeys,
      levelEntities,
      maxLevel,
      getCheckDisabled,
    );
  }

  return result;
}
