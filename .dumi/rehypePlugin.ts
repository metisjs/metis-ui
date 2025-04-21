import type { HastRoot, UnifiedTransformer } from 'dumi';
import { unistUtilVisit } from 'dumi';

const RE = /^\s*(\S+\.\S*)\s*.*$/;

/**
 * plugin for modify hast tree when docs compiling
 */
function rehype(): UnifiedTransformer<HastRoot> {
  return (tree) => {
    unistUtilVisit.visit(tree, 'element', (node) => {
      if (node.tagName === 'DumiDemoGrid') {
        node.tagName = 'DemoGrid';
      } else if (node.tagName === 'SourceCode') {
        node.tagName = 'SourceCodeWrapper';
        if (typeof node.data?.meta === 'string') {
          const match = node.data.meta.match(RE);
          if (match) {
            const filePath = match[1];
            node.properties = {
              ...node.properties,
              title: filePath,
            };
          }
        }
      }
    });
  };
}

export default rehype;
