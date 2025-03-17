const isNode = typeof process !== 'undefined' && process.versions && process.versions.node;

export default () => {
  if (typeof process !== 'undefined' && process.env.NODE_ENV === 'TEST') {
    return true;
  }

  return (
    typeof window !== 'undefined' &&
    typeof window.document !== 'undefined' &&
    typeof window.matchMedia !== 'undefined' &&
    !isNode
  );
};
