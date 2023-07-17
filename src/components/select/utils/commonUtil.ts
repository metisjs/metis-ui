import type { DisplayValueType } from '../BaseSelect';

export function toArray<T>(value: T | T[]): T[] {
  if (Array.isArray(value)) {
    return value;
  }
  return value !== undefined ? [value] : [];
}

export const isClient =
  typeof window !== 'undefined' && window.document && window.document.documentElement;

export function hasValue(value) {
  return value !== undefined && value !== null;
}

function isTitleType(title: any) {
  return ['string', 'number'].includes(typeof title);
}

export function getTitle(item: DisplayValueType): string {
  let title: string = undefined;
  if (item) {
    if (isTitleType(item.title)) {
      title = item.title.toString();
    } else if (isTitleType(item.label)) {
      title = item.label.toString();
    }
  }

  return title;
}
