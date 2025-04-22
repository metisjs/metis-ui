module.exports = function ({ types: t }) {
  return {
    visitor: {
      Program(path, state) {
        const filePath = state.file.opts.filename || '';
        const { node } = path;

        if (
          /\.(j|t)sx$/.test(filePath) ||
          /components(\/[\w-]+)?\/index\.ts$/.test(filePath)
        ) {
          for (const directive of node.directives) {
            if (directive.value.value === "use client") return;
          }

          path.unshiftContainer(
            "directives",
            t.directive(t.directiveLiteral("use client")),
          );
        }
      },
    },
  };
};
