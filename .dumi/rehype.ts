import type { HastRoot, UnifiedTransformer } from 'dumi';
import { unistUtilVisit } from 'dumi';

/**
 * plugin for modify hast tree when docs compiling
 */
function rehype(): UnifiedTransformer<HastRoot> {
  return (tree) => {
    unistUtilVisit.visit(tree, 'element', (node) => {
      if (node.tagName === 'DumiDemoGrid') {
        node.tagName = 'DemoGrid';
      }
    });
  };
}

export default rehype;
