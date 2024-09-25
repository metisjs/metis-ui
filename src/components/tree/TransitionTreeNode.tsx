import * as React from 'react';
import classNames from 'classnames';
import useLayoutEffect from 'rc-util/lib/hooks/useLayoutEffect';
import Transition from '../transition';
import { TreeContext } from './context';
import useUnmount from './hooks/useUnmount';
import type { BasicDataNode, DataNode, FlattenNode, TreeNodeProps } from './interface';
import TreeNode from './TreeNode';
import type { TreeNodeRequiredProps } from './utils/treeUtil';
import { getTreeNodeProps } from './utils/treeUtil';

interface TransitionTreeNodeProps<TreeDataType extends BasicDataNode = DataNode>
  extends Omit<TreeNodeProps<TreeDataType>, 'domRef'> {
  active: boolean;
  transition?: any;
  transitionNodes?: FlattenNode[];
  onTransitionStart: () => void;
  onTransitionEnd: () => void;
  transitionType: 'show' | 'hide' | null;

  treeNodeRequiredProps: TreeNodeRequiredProps;
}

const TransitionTreeNode = React.forwardRef<HTMLDivElement, TransitionTreeNodeProps>(
  (
    {
      className,
      style,
      transition,
      transitionNodes,
      transitionType,
      onTransitionStart: onOriginTransitionStart,
      onTransitionEnd: onOriginTransitionEnd,
      active,
      treeNodeRequiredProps,
      ...props
    },
    ref,
  ) => {
    const [visible, setVisible] = React.useState(true);
    const { prefixCls } = React.useContext(TreeContext);

    // Calculate target visible here.
    // And apply in effect to make `leave` transition work.
    const targetVisible = transitionNodes && transitionType !== 'hide';

    useLayoutEffect(() => {
      if (transitionNodes) {
        if (targetVisible !== visible) {
          setVisible(!!targetVisible);
        }
      }
    }, [transitionNodes]);

    const triggerTransitionStart = () => {
      if (transitionNodes) {
        onOriginTransitionStart();
      }
    };

    // Should only trigger once
    const triggerTransitionEndRef = React.useRef(false);
    const triggerTransitionEnd = () => {
      if (transitionNodes && !triggerTransitionEndRef.current) {
        triggerTransitionEndRef.current = true;
        onOriginTransitionEnd();
      }
    };

    // Effect if unmount
    useUnmount(triggerTransitionStart, triggerTransitionEnd);

    // Transition end event
    const onVisibleChanged = (nextVisible: boolean) => {
      if (targetVisible === nextVisible) {
        triggerTransitionEnd();
      }
    };

    if (transitionNodes) {
      return (
        <Transition
          ref={ref}
          visible={visible}
          {...transition}
          transitionAppear={transitionType === 'show'}
          onVisibleChanged={onVisibleChanged}
        >
          {({ className: transitionClassName, style: transitionStyle }, transitionRef) => (
            <div
              ref={transitionRef}
              className={classNames(`${prefixCls}-treenode-transition`, transitionClassName)}
              style={transitionStyle}
            >
              {transitionNodes.map((treeNode: FlattenNode) => {
                const {
                  data: { ...restProps },
                  title,
                  key,
                  isStart,
                  isEnd,
                } = treeNode;
                delete restProps.children;

                const treeNodeProps = getTreeNodeProps(key, treeNodeRequiredProps);

                return (
                  <TreeNode
                    {...(restProps as Omit<typeof restProps, 'children'>)}
                    {...treeNodeProps}
                    title={title}
                    active={active}
                    data={treeNode.data}
                    key={key}
                    isStart={isStart}
                    isEnd={isEnd}
                  />
                );
              })}
            </div>
          )}
        </Transition>
      );
    }
    return <TreeNode ref={ref} className={className} style={style} {...props} active={active} />;
  },
) as unknown as (<TreeDataType extends BasicDataNode = DataNode>(
  props: TransitionTreeNodeProps<TreeDataType> & {
    ref?: React.Ref<HTMLDivElement>;
  },
) => React.ReactElement) & {
  displayName?: string;
};

if (process.env.NODE_ENV !== 'production') {
  TransitionTreeNode.displayName = 'TransitionTreeNode';
}

export default TransitionTreeNode;
