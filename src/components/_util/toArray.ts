export default function toArray<T>(candidate?: T | T[] | false | null, skipEmpty = true): T[] {
  if (skipEmpty && (candidate === undefined || candidate === false || candidate === null))
    return [];

  return Array.isArray(candidate) ? candidate : [candidate as T];
}
