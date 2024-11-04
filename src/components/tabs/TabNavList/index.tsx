import * as React from 'react';
import { useEffect, useRef, useState } from 'react';
import ResizeObserver from 'rc-resize-observer';
import useEvent from 'rc-util/lib/hooks/useEvent';
import { useComposeRef } from 'rc-util/lib/ref';
import type { SemanticClassName } from '../../_util/classNameUtils';
import { clsx } from '../../_util/classNameUtils';
import useSemanticCls from '../../_util/hooks/useSemanticCls';
import { TabContext } from '../context';
import type { GetIndicatorSize } from '../hooks/useIndicator';
import useIndicator from '../hooks/useIndicator';
import useOffsets from '../hooks/useOffsets';
import useSyncState from '../hooks/useSyncState';
import useTouchMove from '../hooks/useTouchMove';
import useUpdate, { useUpdateState } from '../hooks/useUpdate';
import useVisibleRange from '../hooks/useVisibleRange';
import type {
  AnimatedConfig,
  EditableConfig,
  IconsType,
  MoreProps,
  OnTabScroll,
  SizeInfo,
  TabBarExtraContent,
  TabPosition,
  TabSizeMap,
  TabsLocale,
} from '../interface';
import { genDataNodeKey, stringify } from '../util';
import AddButton from './AddButton';
import ExtraContent from './ExtraContent';
import OperationNode from './OperationNode';
import type { TabNodeProps } from './TabNode';
import TabNode from './TabNode';

export type TabNavListClassStruct = {
  addBtn?: string;
  indicator?: string;
  extra?: string;
  operations?: string;
  tab?: TabNodeProps['className'];
  more?: string;
};

export interface TabNavListProps {
  id: string;
  tabPosition: TabPosition;
  activeKey: string;
  animated: AnimatedConfig;
  extra?: TabBarExtraContent;
  editable?: EditableConfig;
  icons?: IconsType;
  more?: MoreProps;
  mobile: boolean;
  tabBarGutter?: number;
  className?: SemanticClassName<TabNavListClassStruct>;
  style?: React.CSSProperties;
  locale?: TabsLocale;
  onTabClick: (activeKey: string, e: React.MouseEvent | React.KeyboardEvent) => void;
  onTabScroll?: OnTabScroll;
  children?: (node: React.ReactElement) => React.ReactElement;
  getPopupContainer?: (node: HTMLElement) => HTMLElement;
  indicator?: {
    size?: GetIndicatorSize;
    align?: 'start' | 'center' | 'end';
  };
}

const getTabSize = (tab: HTMLElement, containerRect: { left: number; top: number }) => {
  // tabListRef
  const { offsetWidth, offsetHeight, offsetTop, offsetLeft } = tab;
  const { width, height, left, top } = tab.getBoundingClientRect();

  // Use getBoundingClientRect to avoid decimal inaccuracy
  if (Math.abs(width - offsetWidth) < 1) {
    return [width, height, left - containerRect.left, top - containerRect.top];
  }

  return [offsetWidth, offsetHeight, offsetLeft, offsetTop];
};

const getSize = (refObj: React.RefObject<HTMLElement>): SizeInfo => {
  const { offsetWidth = 0, offsetHeight = 0 } = refObj.current || {};

  // Use getBoundingClientRect to avoid decimal inaccuracy
  if (refObj.current) {
    const { width, height } = refObj.current.getBoundingClientRect();

    if (Math.abs(width - offsetWidth) < 1) {
      return [width, height];
    }
  }

  return [offsetWidth, offsetHeight];
};

/**
 * Convert `SizeInfo` to unit value. Such as [123, 456] with `top` position get `123`
 */
const getUnitValue = (size: SizeInfo, tabPositionTopOrBottom: boolean) => {
  return size[tabPositionTopOrBottom ? 0 : 1];
};

const TabNavList = React.forwardRef<HTMLDivElement, TabNavListProps>((props, ref) => {
  const {
    className,
    style,
    id,
    animated,
    activeKey,
    extra,
    editable,
    locale,
    tabPosition,
    tabBarGutter,
    children,
    onTabClick,
    onTabScroll,
    indicator,
    icons,
  } = props;

  const semanticCls = useSemanticCls(className);

  const { prefixCls, tabs } = React.useContext(TabContext);
  const containerRef = useRef<HTMLDivElement>(null);
  const extraLeftRef = useRef<HTMLDivElement>(null);
  const extraRightRef = useRef<HTMLDivElement>(null);
  const tabsWrapperRef = useRef<HTMLDivElement>(null);
  const tabListRef = useRef<HTMLDivElement>(null);
  const operationsRef = useRef<HTMLDivElement>(null);
  const innerAddButtonRef = useRef<HTMLButtonElement>(null);

  const horizontal = tabPosition === 'top' || tabPosition === 'bottom';

  const [transformLeft, setTransformLeft] = useSyncState(0, (next, prev) => {
    if (horizontal && onTabScroll) {
      onTabScroll({ direction: next > prev ? 'left' : 'right' });
    }
  });
  const [transformTop, setTransformTop] = useSyncState(0, (next, prev) => {
    if (!horizontal && onTabScroll) {
      onTabScroll({ direction: next > prev ? 'top' : 'bottom' });
    }
  });

  const [containerExcludeExtraSize, setContainerExcludeExtraSize] = useState<SizeInfo>([0, 0]);
  const [tabContentSize, setTabContentSize] = useState<SizeInfo>([0, 0]);
  const [addSize, setAddSize] = useState<SizeInfo>([0, 0]);
  const [operationSize, setOperationSize] = useState<SizeInfo>([0, 0]);

  const [tabSizes, setTabSizes] = useUpdateState<TabSizeMap>(new Map());
  const tabOffsets = useOffsets(tabs, tabSizes, tabContentSize[0]);

  // ========================== Unit =========================
  const containerExcludeExtraSizeValue = getUnitValue(containerExcludeExtraSize, horizontal);
  const tabContentSizeValue = getUnitValue(tabContentSize, horizontal);
  const addSizeValue = getUnitValue(addSize, horizontal);
  const operationSizeValue = getUnitValue(operationSize, horizontal);

  const needScroll =
    Math.floor(containerExcludeExtraSizeValue) < Math.floor(tabContentSizeValue + addSizeValue);
  const visibleTabContentValue = needScroll
    ? containerExcludeExtraSizeValue - operationSizeValue
    : containerExcludeExtraSizeValue - addSizeValue;

  // ========================== Util =========================
  let transformMin = 0;
  let transformMax = 0;

  if (!horizontal) {
    transformMin = Math.min(0, visibleTabContentValue - tabContentSizeValue);
    transformMax = 0;
  } else {
    transformMin = Math.min(0, visibleTabContentValue - tabContentSizeValue);
    transformMax = 0;
  }

  function alignInRange(value: number): number {
    if (value < transformMin) {
      return transformMin;
    }
    if (value > transformMax) {
      return transformMax;
    }
    return value;
  }

  // ========================= Mobile ========================
  const touchMovingRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [lockAnimation, setLockAnimation] = useState<number>();

  function doLockAnimation() {
    setLockAnimation(Date.now());
  }

  function clearTouchMoving() {
    if (touchMovingRef.current) {
      clearTimeout(touchMovingRef.current);
    }
  }

  useTouchMove(tabsWrapperRef, (offsetX, offsetY) => {
    function doMove(setState: React.Dispatch<React.SetStateAction<number>>, offset: number) {
      setState((value) => {
        const newValue = alignInRange(value + offset);
        return newValue;
      });
    }

    // Skip scroll if place is enough
    if (!needScroll) {
      return false;
    }

    if (horizontal) {
      doMove(setTransformLeft, offsetX);
    } else {
      doMove(setTransformTop, offsetY);
    }

    clearTouchMoving();
    doLockAnimation();

    return true;
  });

  useEffect(() => {
    clearTouchMoving();
    if (lockAnimation) {
      touchMovingRef.current = setTimeout(() => {
        setLockAnimation(0);
      }, 100);
    }

    return clearTouchMoving;
  }, [lockAnimation]);

  // ===================== Visible Range =====================
  // Render tab node & collect tab offset
  const [visibleStart, visibleEnd] = useVisibleRange(
    tabOffsets,
    // Container
    visibleTabContentValue,
    // Transform
    horizontal ? transformLeft : transformTop,
    // Tabs
    tabContentSizeValue,
    // Add
    addSizeValue,
    // Operation
    operationSizeValue,
    { ...props, tabs },
  );

  // ========================= Scroll ========================
  const scrollToTab = useEvent((key = activeKey) => {
    const tabOffset = tabOffsets.get(key) || {
      width: 0,
      height: 0,
      left: 0,
      right: 0,
      top: 0,
    };

    if (horizontal) {
      // ============ Align with top & bottom ============
      let newTransform = transformLeft;

      if (tabOffset.left < -transformLeft) {
        newTransform = -tabOffset.left;
      } else if (tabOffset.left + tabOffset.width > -transformLeft + visibleTabContentValue) {
        newTransform = -(tabOffset.left + tabOffset.width - visibleTabContentValue);
      }

      setTransformTop(0);
      setTransformLeft(alignInRange(newTransform));
    } else {
      // ============ Align with left & right ============
      let newTransform = transformTop;

      if (tabOffset.top < -transformTop) {
        newTransform = -tabOffset.top;
      } else if (tabOffset.top + tabOffset.height > -transformTop + visibleTabContentValue) {
        newTransform = -(tabOffset.top + tabOffset.height - visibleTabContentValue);
      }

      setTransformLeft(0);
      setTransformTop(alignInRange(newTransform));
    }
  });

  // ======================== Dropdown =======================
  const startHiddenTabs = tabs.slice(0, visibleStart);
  const endHiddenTabs = tabs.slice(visibleEnd + 1);
  const hiddenTabs = [...startHiddenTabs, ...endHiddenTabs];

  // =================== Link & Operations ===================
  const activeTabOffset = tabOffsets.get(activeKey);
  const { style: indicatorStyle } = useIndicator({
    tabOffset: activeTabOffset,
    horizontal: horizontal,
    indicator,
  });

  // ========================= Effect ========================
  useEffect(() => {
    scrollToTab();
  }, [
    activeKey,
    transformMin,
    transformMax,
    stringify(activeTabOffset),
    stringify(tabOffsets as any),
    horizontal,
  ]);

  // ========================== Tab ==========================
  const tabNodeStyle: React.CSSProperties = {};
  if (tabPosition === 'top' || tabPosition === 'bottom') {
    tabNodeStyle.marginLeft = tabBarGutter;
  } else {
    tabNodeStyle.marginTop = tabBarGutter;
  }

  const tabNodes = tabs.map<React.ReactNode>((tab, i) => {
    const { key } = tab;
    return (
      <TabNode
        id={id}
        prefixCls={prefixCls}
        key={key}
        tab={tab}
        position={tabPosition}
        /* first node should not have margin left */
        style={i === 0 ? undefined : tabNodeStyle}
        className={semanticCls.tab}
        closable={tab.closable}
        editable={editable}
        removeIcon={icons?.remove}
        active={key === activeKey}
        renderWrapper={children}
        removeAriaLabel={locale?.removeAriaLabel}
        offset={tabOffsets.get(key)}
        indicator={indicator}
        onClick={(e) => {
          onTabClick(key, e);
        }}
        onFocus={() => {
          scrollToTab(key);
          doLockAnimation();
          if (!tabsWrapperRef.current) {
            return;
          }
          // Focus element will make scrollLeft change which we should reset back
          tabsWrapperRef.current.scrollLeft = 0;
          tabsWrapperRef.current.scrollTop = 0;
        }}
      />
    );
  });

  // Update buttons records
  const updateTabSizes = () =>
    setTabSizes(() => {
      const newSizes: TabSizeMap = new Map();
      const listRect = tabListRef.current!.getBoundingClientRect();

      tabs.forEach(({ key }) => {
        const btnNode = tabListRef.current?.querySelector<HTMLElement>(
          `[data-node-key="${genDataNodeKey(key)}"]`,
        );
        if (btnNode) {
          const [width, height, left, top] = getTabSize(btnNode, listRect);
          newSizes.set(key, { width, height, left, top });
        }
      });
      return newSizes;
    });

  useEffect(() => {
    updateTabSizes();
  }, [tabs.map((tab) => tab.key).join('_')]);

  const onListHolderResize = useUpdate(() => {
    // Update wrapper records
    const containerSize = getSize(containerRef);
    const extraLeftSize = getSize(extraLeftRef);
    const extraRightSize = getSize(extraRightRef);
    setContainerExcludeExtraSize([
      containerSize[0] - extraLeftSize[0] - extraRightSize[0],
      containerSize[1] - extraLeftSize[1] - extraRightSize[1],
    ]);

    const newAddSize = getSize(innerAddButtonRef);
    setAddSize(newAddSize);

    const newOperationSize = getSize(operationsRef);
    setOperationSize(newOperationSize);

    // Which includes add button size
    const tabContentFullSize = getSize(tabListRef);
    setTabContentSize([
      tabContentFullSize[0] - newAddSize[0],
      tabContentFullSize[1] - newAddSize[1],
    ]);

    // Update buttons records
    updateTabSizes();
  });
  // ========================= Style ========================
  const rootCls = clsx(
    `${prefixCls}-nav`,
    'relative flex flex-none items-center',
    !horizontal && 'min-w-16 flex-col',
    'before:absolute before:border-border-secondary',
    {
      'mb-4 before:bottom-0 before:left-0 before:right-0 before:border-b': tabPosition === 'top',
      'order-2 mt-4 before:left-0 before:right-0 before:top-0 before:border-t':
        tabPosition === 'bottom',
      'mr-4 before:bottom-0 before:right-0 before:top-0 before:border-r': tabPosition === 'left',
      'order-2 ml-4 before:bottom-0 before:left-0 before:top-0 before:border-l':
        tabPosition === 'right',
    },
    semanticCls.root,
  );

  let pingLeft: boolean = false;
  let pingRight: boolean = false;
  let pingTop: boolean = false;
  let pingBottom: boolean = false;

  if (horizontal) {
    pingLeft = transformLeft < 0;
    pingRight = transformLeft !== transformMin;
  } else {
    pingTop = transformTop < 0;
    pingBottom = transformTop !== transformMin;
  }

  const wrapPrefix = `${prefixCls}-nav-wrap`;
  const wrapCls = clsx(
    wrapPrefix,
    {
      [`${wrapPrefix}-ping-left`]: pingLeft,
      [`${wrapPrefix}-ping-right`]: pingRight,
      [`${wrapPrefix}-ping-top`]: pingTop,
      [`${wrapPrefix}-ping-bottom`]: pingBottom,
    },
    'relative flex flex-auto overflow-hidden whitespace-nowrap',
    !horizontal && 'flex-col',
    /* *********** Scroll shadow start *********** */
    'before:pointer-events-none before:absolute before:z-[1] before:opacity-0 before:transition-opacity before:duration-300',
    {
      'before:bottom-0 before:left-0 before:top-0 before:w-8 before:shadow-[inset_10px_0_8px_-8px_rgba(0,_0,_0,_0.08)]':
        horizontal,
      'before:left-0 before:right-0 before:top-0 before:h-8 before:shadow-[inset_0_10px_8px_-8px_rgba(0,_0,_0,_0.08)]':
        !horizontal,
      'before:opacity-100': pingLeft || pingTop,
    },
    'after:pointer-events-none after:absolute after:z-[1] after:opacity-0 after:transition-opacity after:duration-300',
    {
      'after:bottom-0 after:right-0 after:top-0 after:w-8 after:shadow-[inset_-10px_0_8px_-8px_rgba(0,_0,_0,_0.08)]':
        horizontal,
      'after:bottom-0 after:left-0 after:right-0 after:h-8 after:shadow-[inset_0px_-10px_8px_-8px_rgba(0,_0,_0,_0.08)]':
        !horizontal,
      'after:opacity-100': pingRight || pingBottom,
    },
    /* *********** Scroll shadow end *********** */
  );

  const tabListCls = clsx(
    `${prefixCls}-nav-list`,
    'relative flex transition-opacity duration-300',
    !horizontal && 'flex-shrink-0 flex-grow basis-auto flex-col',
  );

  const indicatorCls = clsx(
    `${prefixCls}-indicator`,
    {
      [`${prefixCls}-indicator-animated`]: animated.indicator,
    },
    'pointer-events-none absolute z-[1] bg-primary duration-300',
    {
      'bottom-0 h-0.5 transition-[width,left,right]': tabPosition === 'top',
      'top-0 h-0.5 transition-[width,left,right]': tabPosition === 'bottom',
      'right-0 w-0.5 transition-[height,top,bottom]': tabPosition === 'left',
      'left-0 w-0.5 transition-[height,top,bottom]': tabPosition === 'right',
    },
    semanticCls.indicator,
  );

  // ========================= Render ========================
  const hasDropdown = !!hiddenTabs.length;
  return (
    <ResizeObserver onResize={onListHolderResize}>
      <div
        ref={useComposeRef(ref, containerRef)}
        role="tablist"
        className={rootCls}
        style={style}
        onKeyDown={() => {
          // No need animation when use keyboard
          doLockAnimation();
        }}
      >
        <ExtraContent
          ref={extraLeftRef}
          position="left"
          extra={extra}
          prefixCls={prefixCls}
          className={semanticCls.extra}
        />

        <ResizeObserver onResize={onListHolderResize}>
          <div className={wrapCls} ref={tabsWrapperRef}>
            <ResizeObserver onResize={onListHolderResize}>
              <div
                ref={tabListRef}
                className={tabListCls}
                style={{
                  transform: `translate(${transformLeft}px, ${transformTop}px)`,
                  transition: lockAnimation ? 'none' : undefined,
                }}
              >
                {tabNodes}
                <AddButton
                  ref={innerAddButtonRef}
                  prefixCls={prefixCls}
                  locale={locale}
                  editable={editable}
                  icon={icons?.add}
                  style={{
                    ...(tabNodes.length === 0 ? undefined : tabNodeStyle),
                    visibility: hasDropdown ? 'hidden' : undefined,
                  }}
                  className={semanticCls.addBtn}
                />
                <div className={indicatorCls} style={indicatorStyle} />
              </div>
            </ResizeObserver>
          </div>
        </ResizeObserver>

        {hasDropdown && (
          <OperationNode
            {...props}
            removeAriaLabel={locale?.removeAriaLabel}
            ref={operationsRef}
            prefixCls={prefixCls}
            tabs={hiddenTabs}
            className={{
              root: semanticCls.operations,
              addBtn: semanticCls.addBtn,
              more: semanticCls.more,
            }}
            tabMoving={!!lockAnimation}
            horizontal={horizontal}
          />
        )}

        <ExtraContent ref={extraRightRef} position="right" extra={extra} prefixCls={prefixCls} />
      </div>
    </ResizeObserver>
  );
});

export default TabNavList;
