import clsx from 'classnames';
import type { CSSProperties, FC } from 'react';
import React, { useEffect, useRef, useState } from 'react';
import { getSemanticCls, SemanticClassName } from '../_util/classNameUtils';
import { TransitionList, TransitionProps } from '../transition';
import useStack from './hooks/useStack';
import type {
  InnerOpenConfig,
  NoticeConfig,
  NotificationPlacement,
  OpenConfig,
  StackConfig,
} from './interface';
import Notice from './Notice';

export interface NoticeListProps {
  configList?: OpenConfig[];
  placement: NotificationPlacement;
  prefixCls: string;
  transition?:
    | Partial<TransitionProps>
    | ((placement: NotificationPlacement) => Partial<TransitionProps>);
  stack?: StackConfig;

  // Events
  onAllNoticeRemoved?: (placement: NotificationPlacement) => void;
  onNoticeClose?: (key: React.Key) => void;

  // Common
  className?: SemanticClassName<'wrapper' | 'notice'>;
  style?: CSSProperties;
}

const NoticeList: FC<NoticeListProps> = (props) => {
  const {
    configList,
    placement,
    prefixCls,
    className,
    style,
    transition,
    onAllNoticeRemoved,
    onNoticeClose,
    stack: stackConfig,
  } = props;

  const semanticCls = getSemanticCls(className);

  const dictRef = useRef<Record<string, HTMLDivElement>>({});
  const [latestNotice, setLatestNotice] = useState<HTMLDivElement | null>(null);
  const [hoverKeys, setHoverKeys] = useState<string[]>([]);

  const keys =
    configList?.map((config) => ({
      config,
      key: String(config.key),
    })) ?? [];

  const [stack, { offset, threshold, gap }] = useStack(stackConfig);

  const expanded = stack && (hoverKeys.length > 0 || keys.length <= threshold);

  const placementTransition = typeof transition === 'function' ? transition(placement) : transition;

  // Clean hover key
  useEffect(() => {
    if (stack && hoverKeys.length > 1) {
      setHoverKeys((prev) =>
        prev.filter((key) => keys.some(({ key: dataKey }) => key === dataKey)),
      );
    }
  }, [hoverKeys, keys, stack]);

  // Force update latest notice
  useEffect(() => {
    if (stack && dictRef.current[keys[keys.length - 1]?.key]) {
      setLatestNotice(dictRef.current[keys[keys.length - 1]?.key]);
    }
  }, [keys, stack]);

  return (
    <TransitionList
      key={placement}
      className={clsx(
        prefixCls,
        `${prefixCls}-${placement}`,
        {
          [`${prefixCls}-stack`]: !!stack,
          [`${prefixCls}-stack-expanded`]: expanded,
        },
        semanticCls.root,
      )}
      style={style}
      keys={keys}
      appear
      {...placementTransition}
      onAllRemoved={() => {
        onAllNoticeRemoved?.(placement);
      }}
    >
      {(
        { config, className: transitionClassName, style: transitionStyle, index: transitionIndex },
        nodeRef,
      ) => {
        const { key, times } = config as InnerOpenConfig;
        const strKey = String(key);
        const {
          className: configClassName,
          style: configStyle,
          ...restConfig
        } = config as NoticeConfig;
        const dataIndex = keys.findIndex((item) => item.key === strKey);

        // If dataIndex is -1, that means this notice has been removed in data, but still in dom
        // Should minus (transitionIndex - 1) to get the correct index because keys.length is not the same as dom length
        const stackStyle: CSSProperties = {};
        if (stack) {
          const index = keys.length - 1 - (dataIndex > -1 ? dataIndex : transitionIndex - 1);
          const transformX = placement === 'top' || placement === 'bottom' ? '-50%' : '0';
          if (index > 0) {
            stackStyle.height = expanded
              ? dictRef.current[strKey]?.offsetHeight
              : latestNotice?.offsetHeight;

            // Transform
            let verticalOffset = 0;
            for (let i = 0; i < index; i++) {
              verticalOffset += dictRef.current[keys[keys.length - 1 - i].key]?.offsetHeight + gap;
            }

            const transformY =
              (expanded ? verticalOffset : index * offset) * (placement.startsWith('top') ? 1 : -1);
            const scaleX =
              !expanded && latestNotice?.offsetWidth && dictRef.current[strKey]?.offsetWidth
                ? (latestNotice?.offsetWidth - offset * 2 * (index < 3 ? index : 3)) /
                  dictRef.current[strKey]?.offsetWidth
                : 1;
            stackStyle.transform = `translate3d(${transformX}, ${transformY}px, 0) scaleX(${scaleX})`;
          } else {
            stackStyle.transform = `translate3d(${transformX}, 0, 0)`;
          }
        }

        return (
          <div
            ref={nodeRef}
            className={clsx(
              `${prefixCls}-notice-wrapper`,
              semanticCls.wrapper,
              transitionClassName,
            )}
            style={{
              ...transitionStyle,
              ...stackStyle,
            }}
            onMouseEnter={() =>
              setHoverKeys((prev) => (prev.includes(strKey) ? prev : [...prev, strKey]))
            }
            onMouseLeave={() => setHoverKeys((prev) => prev.filter((k) => k !== strKey))}
          >
            <Notice
              {...restConfig}
              ref={(node) => {
                if (dataIndex > -1) {
                  dictRef.current[strKey] = node!;
                } else {
                  delete dictRef.current[strKey];
                }
              }}
              prefixCls={prefixCls}
              className={clsx(semanticCls.notice, configClassName)}
              style={configStyle}
              times={times}
              key={key}
              eventKey={key}
              onNoticeClose={onNoticeClose}
              hovering={stack && hoverKeys.length > 0}
            />
          </div>
        );
      }}
    </TransitionList>
  );
};

if (process.env.NODE_ENV !== 'production') {
  NoticeList.displayName = 'NoticeList';
}

export default NoticeList;
