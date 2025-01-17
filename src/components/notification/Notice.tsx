import * as React from 'react';
import type { SemanticClassName } from '@util/classNameUtils';
import { clsx } from '@util/classNameUtils';
import useClosable from '@util/hooks/useClosable';
import useSemanticCls from '@util/hooks/useSemanticCls';
import type { NoticeConfig } from './interface';

export interface NoticeProps extends Omit<NoticeConfig, 'onClose' | 'className'> {
  prefixCls: string;
  className?: SemanticClassName<{ close?: string; progress?: string }>;
  style?: React.CSSProperties;
  eventKey: React.Key;

  onClick?: React.MouseEventHandler<HTMLDivElement>;
  onNoticeClose?: (key: React.Key) => void;
  hovering?: boolean;
}

const Notice = React.forwardRef<HTMLDivElement, NoticeProps & { times?: number }>((props, ref) => {
  const {
    prefixCls,
    style,
    className,
    duration = 4.5,
    showProgress,
    pauseOnHover = true,

    eventKey,
    content,
    closable,
    props: divProps,

    onClick,
    onNoticeClose,
    times,
    hovering: forcedHovering,
  } = props;

  const semanticCls = useSemanticCls(className);

  const [hovering, setHovering] = React.useState(false);
  const [percent, setPercent] = React.useState(0);
  const [spentTime, setSpentTime] = React.useState(0);
  const mergedHovering = forcedHovering || hovering;
  const mergedShowProgress = duration > 0 && showProgress;

  // ======================== Close =========================
  const onInternalClose = () => {
    onNoticeClose?.(eventKey);
  };

  const onCloseKeyDown: React.KeyboardEventHandler<HTMLAnchorElement> = (e) => {
    if (e.key === 'Enter' || e.code === 'Enter' || e.key === 'Enter') {
      onInternalClose();
    }
  };

  // ======================== Effect ========================
  React.useEffect(() => {
    if (!mergedHovering && duration > 0) {
      const start = Date.now() - spentTime;
      const timeout = setTimeout(
        () => {
          onInternalClose();
        },
        duration * 1000 - spentTime,
      );

      return () => {
        if (pauseOnHover) {
          clearTimeout(timeout);
        }
        setSpentTime(Date.now() - start);
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [duration, mergedHovering, times]);

  React.useEffect(() => {
    if (!mergedHovering && mergedShowProgress && (pauseOnHover || spentTime === 0)) {
      const start = performance.now();
      let animationFrame: number;

      const calculate = () => {
        cancelAnimationFrame(animationFrame);
        animationFrame = requestAnimationFrame((timestamp) => {
          const runtime = timestamp + spentTime - start;
          const progress = Math.min(runtime / (duration * 1000), 1);
          setPercent(progress * 100);
          if (progress < 1) {
            calculate();
          }
        });
      };

      calculate();

      return () => {
        if (pauseOnHover) {
          cancelAnimationFrame(animationFrame);
        }
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [duration, spentTime, mergedHovering, mergedShowProgress, times]);

  // ======================== Closable ========================
  const [mergedClosable, closeIcon] = useClosable(closable);

  // ======================== Progress ========================
  const validPercent = 100 - (!percent || percent < 0 ? 0 : percent > 100 ? 100 : percent);

  // ======================== Render ========================
  const noticePrefixCls = `${prefixCls}-notice`;

  return (
    <div
      {...divProps}
      ref={ref}
      className={clsx(
        noticePrefixCls,
        {
          [`${noticePrefixCls}-closable`]: mergedClosable,
        },
        semanticCls.root,
      )}
      style={style}
      onMouseEnter={(e) => {
        setHovering(true);
        divProps?.onMouseEnter?.(e);
      }}
      onMouseLeave={(e) => {
        setHovering(false);
        divProps?.onMouseLeave?.(e);
      }}
      onClick={onClick}
    >
      {content}
      {/* Close Icon */}
      {mergedClosable && (
        <a
          tabIndex={0}
          className={clsx(`${noticePrefixCls}-close`, semanticCls.close)}
          onKeyDown={onCloseKeyDown}
          aria-label="Close"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onInternalClose();
          }}
        >
          {closeIcon}
        </a>
      )}

      {/* Progress Bar */}
      {mergedShowProgress && (
        <progress
          className={clsx(`${noticePrefixCls}-progress`, semanticCls.progress)}
          max="100"
          value={validPercent}
        >
          {validPercent + '%'}
        </progress>
      )}
    </div>
  );
});

export default Notice;
