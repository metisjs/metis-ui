import type { BasicDataNode, Key, KeyEntities } from '../interface';

export default function getEntity<T extends BasicDataNode = any>(
  keyEntities: KeyEntities<T>,
  key: Key,
) {
  return keyEntities[key];
}
