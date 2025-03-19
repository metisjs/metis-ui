export default function toArray<T>(candidate?: T | T[] | false | null): T[] {
  if (candidate === undefined || candidate === false || candidate === null) return [];

  return Array.isArray(candidate) ? candidate : [candidate];
}
