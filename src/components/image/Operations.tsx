import * as React from 'react';
import { useContext } from 'react';
import { TinyColor } from '@ctrl/tinycolor';
import Portal from '@rc-component/portal';
import { useSetState } from 'ahooks';
import KeyCode from 'rc-util/lib/KeyCode';
import { clsx, getSemanticCls } from '../_util/classNameUtils';
import useTheme from '../theme/useTheme';
import Transition from '../transition';
import { PreviewGroupContext } from './context';
import type { OperationsProps, OperationType } from './interface';

interface RenderOperationParams {
  icon: React.ReactNode;
  type: OperationType;
  disabled?: boolean;
  onClick: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
}
const Operations: React.FC<OperationsProps> = (props) => {
  const {
    open,
    getContainer,
    prefixCls,
    icons = {},
    countRender,
    showSwitch,
    showProgress,
    current,
    transform,
    count,
    scale,
    minScale,
    maxScale,
    closeIcon,
    onActive,
    onClose,
    onZoomIn,
    onZoomOut,
    onRotateRight,
    onRotateLeft,
    onFlipX,
    onFlipY,
    onReset,
    toolbarRender,
    zIndex,
    image,
    className,
  } = props;
  const semanticCls = getSemanticCls(className);

  const groupContext = useContext(PreviewGroupContext);
  const { rotateLeft, rotateRight, zoomIn, zoomOut, left, right, flipX, flipY } = icons;

  const [hover, setHover] = useSetState({
    close: false,
    prev: false,
    next: false,
  });

  React.useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.keyCode === KeyCode.ESC) {
        onClose?.();
      }
    };

    if (open) {
      window.addEventListener('keydown', onKeyDown);
    }

    return () => {
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);

  const handleActive = (e: React.MouseEvent<HTMLDivElement, MouseEvent>, offset: number) => {
    e.preventDefault();
    e.stopPropagation();

    onActive(offset);
  };

  // =========================== Style ===============================
  const { mask } = useTheme();
  const operationBg = new TinyColor(mask).setAlpha(0.1);
  const operationBgHover = operationBg.clone().setAlpha(0.2);

  const wrapperCls = clsx(`${prefixCls}-operations-wrapper`, 'fixed text-sm *:select-none');

  const closeCls = clsx(
    `${prefixCls}-close`,
    'fixed right-8 top-8 flex rounded-full p-2 text-2xl text-white transition-colors',
    semanticCls.close,
  );

  const footCls = clsx(
    `${prefixCls}-footer`,
    'fixed bottom-8 left-1/2 flex -translate-x-1/2 flex-col items-center',
  );

  const operationsCls = clsx(
    `${prefixCls}-operations`,
    'flex items-center gap-3 rounded-full px-6',
    semanticCls.root,
  );

  const prevCls = clsx(
    `${prefixCls}-switch-left`,
    {
      [`${prefixCls}-switch-left-disabled`]: current === 0,
    },
    'fixed start-3 top-1/2 flex -translate-y-1/2 cursor-pointer rounded-full p-2 text-2xl text-white transition-colors',
    {
      'cursor-not-allowed text-white/25': current === 0,
    },
  );

  const nextCls = clsx(
    `${prefixCls}-switch-right`,
    {
      [`${prefixCls}-switch-right-disabled`]: current === count - 1,
    },
    'fixed end-3 top-1/2 flex -translate-y-1/2 cursor-pointer rounded-full p-2 text-2xl text-white transition-colors',
    {
      'cursor-not-allowed text-white/25': current === count - 1,
    },
  );

  const progressCls = clsx(`${prefixCls}-progress`, 'mb-4 text-white/65', semanticCls.progress);

  // =========================== Render ===============================
  const renderOperation = React.useCallback(
    ({ type, disabled, onClick, icon }: RenderOperationParams) => {
      return (
        <div
          key={type}
          className={clsx(
            `${prefixCls}-operations-operation`,
            `${prefixCls}-operations-operation-${type}`,
            {
              [`${prefixCls}-operations-operation-disabled`]: !!disabled,
            },
            'flex cursor-pointer items-center p-3 text-2xl text-white/65 transition-all',
            disabled ? 'cursor-not-allowed text-white/25' : 'hover:text-white',
            semanticCls.operation,
          )}
          onClick={onClick}
        >
          {icon}
        </div>
      );
    },
    [prefixCls, JSON.stringify(className)],
  );

  const switchPrevNode = showSwitch
    ? renderOperation({
        icon: left,
        onClick: (e) => handleActive(e, -1),
        type: 'prev',
        disabled: current === 0,
      })
    : undefined;

  const switchNextNode = showSwitch
    ? renderOperation({
        icon: right,
        onClick: (e) => handleActive(e, 1),
        type: 'next',
        disabled: current === count - 1,
      })
    : undefined;

  const flipYNode = renderOperation({
    icon: flipY,
    onClick: onFlipY,
    type: 'flipY',
  });

  const flipXNode = renderOperation({
    icon: flipX,
    onClick: onFlipX,
    type: 'flipX',
  });

  const rotateLeftNode = renderOperation({
    icon: rotateLeft,
    onClick: onRotateLeft,
    type: 'rotateLeft',
  });

  const rotateRightNode = renderOperation({
    icon: rotateRight,
    onClick: onRotateRight,
    type: 'rotateRight',
  });

  const zoomOutNode = renderOperation({
    icon: zoomOut,
    onClick: onZoomOut,
    type: 'zoomOut',
    disabled: scale <= minScale,
  });

  const zoomInNode = renderOperation({
    icon: zoomIn,
    onClick: onZoomIn,
    type: 'zoomIn',
    disabled: scale === maxScale,
  });

  const toolbarNode = (
    <div className={operationsCls} style={{ backgroundColor: operationBg.toRgbString() }}>
      {flipYNode}
      {flipXNode}
      {rotateLeftNode}
      {rotateRightNode}
      {zoomOutNode}
      {zoomInNode}
    </div>
  );

  return (
    <Transition
      visible={open}
      enter="transition-opacity ease-out duration-300"
      enterFrom="opacity-0"
      enterTo="opacity-100"
      leave="transition-opacity ease-in duration-200"
      leaveFrom="opacity-100"
      leaveTo="opacity-0"
    >
      {({ className, style }) => (
        <Portal open getContainer={getContainer ?? document.body}>
          <div
            className={clsx(wrapperCls, className)}
            style={{
              ...style,
              zIndex,
            }}
          >
            {closeIcon === null ? null : (
              <button
                type="button"
                className={closeCls}
                onClick={onClose}
                style={{
                  backgroundColor: hover.close
                    ? operationBgHover.toRgbString()
                    : operationBg.toRgbString(),
                }}
                onMouseOver={() => setHover({ close: true })}
                onMouseOut={() => setHover({ close: false })}
              >
                {closeIcon}
              </button>
            )}

            {showSwitch && (
              <>
                <div
                  className={prevCls}
                  onClick={(e) => handleActive(e, -1)}
                  style={
                    current !== 0
                      ? {
                          backgroundColor: hover.prev
                            ? operationBgHover.toRgbString()
                            : operationBg.toRgbString(),
                        }
                      : undefined
                  }
                  onMouseOver={() => setHover({ prev: true })}
                  onMouseOut={() => setHover({ prev: false })}
                >
                  {left}
                </div>
                <div
                  className={nextCls}
                  onClick={(e) => handleActive(e, 1)}
                  style={
                    current !== count - 1
                      ? {
                          backgroundColor: hover.next
                            ? operationBgHover.toRgbString()
                            : operationBg.toRgbString(),
                        }
                      : undefined
                  }
                  onMouseOver={() => setHover({ next: true })}
                  onMouseOut={() => setHover({ next: false })}
                >
                  {right}
                </div>
              </>
            )}

            <div className={footCls}>
              {showProgress && (
                <div className={progressCls}>
                  {countRender ? countRender(current + 1, count) : `${current + 1} / ${count}`}
                </div>
              )}

              {toolbarRender
                ? toolbarRender(toolbarNode, {
                    icons: {
                      prevIcon: switchPrevNode,
                      nextIcon: switchNextNode,
                      flipYIcon: flipYNode,
                      flipXIcon: flipXNode,
                      rotateLeftIcon: rotateLeftNode,
                      rotateRightIcon: rotateRightNode,
                      zoomOutIcon: zoomOutNode,
                      zoomInIcon: zoomInNode,
                    },
                    actions: {
                      onActive,
                      onFlipY,
                      onFlipX,
                      onRotateLeft,
                      onRotateRight,
                      onZoomOut,
                      onZoomIn,
                      onReset,
                      onClose,
                    },
                    transform,
                    ...(groupContext ? { current, total: count } : {}),
                    image,
                  })
                : toolbarNode}
            </div>
          </div>
        </Portal>
      )}
    </Transition>
  );
};

export default Operations;
