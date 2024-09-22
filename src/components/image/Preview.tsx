import React, { useContext, useEffect, useMemo, useRef, useState } from 'react';
import {
  ChevronLeftOutline,
  ChevronRightOutline,
  MagnifyingGlassMinusOutline,
  MagnifyingGlassPlusOutline,
  XMarkOutline,
} from '@metisjs/icons';
import addEventListener from 'rc-util/lib/Dom/addEventListener';
import KeyCode from 'rc-util/lib/KeyCode';
import { clsx, getSemanticCls, mergeSemanticCls } from '../_util/classNameUtils';
import Modal from '../modal';
import { BASE_SCALE_RATIO } from './constant';
import { PreviewGroupContext } from './context';
import useImageTransform from './hooks/useImageTransform';
import useMouseEvent from './hooks/useMouseEvent';
import useStatus from './hooks/useStatus';
import useTouchEvent from './hooks/useTouchEvent';
import type { PreviewProps } from './interface';
import Operations from './Operations';

interface PreviewImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallback?: string;
  imgRef: React.MutableRefObject<HTMLImageElement | null>;
}

// TODO: 添加 @metis/icons 图标
const defaultIcons = {
  rotateLeft: (
    <svg
      viewBox="64 64 896 896"
      focusable="false"
      width="1em"
      height="1em"
      fill="currentColor"
      aria-hidden="true"
      className="text-xl"
    >
      <path d="M672 418H144c-17.7 0-32 14.3-32 32v414c0 17.7 14.3 32 32 32h528c17.7 0 32-14.3 32-32V450c0-17.7-14.3-32-32-32zm-44 402H188V494h440v326z"></path>
      <path d="M819.3 328.5c-78.8-100.7-196-153.6-314.6-154.2l-.2-64c0-6.5-7.6-10.1-12.6-6.1l-128 101c-4 3.1-3.9 9.1 0 12.3L492 318.6c5.1 4 12.7.4 12.6-6.1v-63.9c12.9.1 25.9.9 38.8 2.5 42.1 5.2 82.1 18.2 119 38.7 38.1 21.2 71.2 49.7 98.4 84.3 27.1 34.7 46.7 73.7 58.1 115.8a325.95 325.95 0 016.5 140.9h74.9c14.8-103.6-11.3-213-81-302.3z"></path>
    </svg>
  ),
  rotateRight: (
    <svg
      viewBox="64 64 896 896"
      focusable="false"
      width="1em"
      height="1em"
      fill="currentColor"
      aria-hidden="true"
      className="text-xl"
    >
      <path d="M480.5 251.2c13-1.6 25.9-2.4 38.8-2.5v63.9c0 6.5 7.5 10.1 12.6 6.1L660 217.6c4-3.2 4-9.2 0-12.3l-128-101c-5.1-4-12.6-.4-12.6 6.1l-.2 64c-118.6.5-235.8 53.4-314.6 154.2A399.75 399.75 0 00123.5 631h74.9c-.9-5.3-1.7-10.7-2.4-16.1-5.1-42.1-2.1-84.1 8.9-124.8 11.4-42.2 31-81.1 58.1-115.8 27.2-34.7 60.3-63.2 98.4-84.3 37-20.6 76.9-33.6 119.1-38.8z"></path>
      <path d="M880 418H352c-17.7 0-32 14.3-32 32v414c0 17.7 14.3 32 32 32h528c17.7 0 32-14.3 32-32V450c0-17.7-14.3-32-32-32zm-44 402H396V494h440v326z"></path>
    </svg>
  ),
  zoomIn: <MagnifyingGlassPlusOutline />,
  zoomOut: <MagnifyingGlassMinusOutline />,
  left: <ChevronLeftOutline />,
  right: <ChevronRightOutline />,
  flipX: (
    <svg
      viewBox="64 64 896 896"
      focusable="false"
      data-icon="swap"
      width="1em"
      height="1em"
      fill="currentColor"
      className="text-xl"
    >
      <path d="M847.9 592H152c-4.4 0-8 3.6-8 8v60c0 4.4 3.6 8 8 8h605.2L612.9 851c-4.1 5.2-.4 13 6.3 13h72.5c4.9 0 9.5-2.2 12.6-6.1l168.8-214.1c16.5-21 1.6-51.8-25.2-51.8zM872 356H266.8l144.3-183c4.1-5.2.4-13-6.3-13h-72.5c-4.9 0-9.5 2.2-12.6 6.1L150.9 380.2c-16.5 21-1.6 51.8 25.1 51.8h696c4.4 0 8-3.6 8-8v-60c0-4.4-3.6-8-8-8z"></path>
    </svg>
  ),
  flipY: (
    <svg
      viewBox="64 64 896 896"
      focusable="false"
      data-icon="swap"
      width="1em"
      height="1em"
      fill="currentColor"
      className="rotate-90 text-xl"
    >
      <path d="M847.9 592H152c-4.4 0-8 3.6-8 8v60c0 4.4 3.6 8 8 8h605.2L612.9 851c-4.1 5.2-.4 13 6.3 13h72.5c4.9 0 9.5-2.2 12.6-6.1l168.8-214.1c16.5-21 1.6-51.8-25.2-51.8zM872 356H266.8l144.3-183c4.1-5.2.4-13-6.3-13h-72.5c-4.9 0-9.5 2.2-12.6 6.1L150.9 380.2c-16.5 21-1.6 51.8 25.1 51.8h696c4.4 0 8-3.6 8-8v-60c0-4.4-3.6-8-8-8z"></path>
    </svg>
  ),
};

const PreviewImage: React.FC<PreviewImageProps> = ({ fallback, src, imgRef, ...props }) => {
  const [getImgRef, srcAndOnload] = useStatus({
    src,
    fallback,
  });

  return (
    <img
      ref={(ref) => {
        imgRef.current = ref;
        getImgRef(ref);
      }}
      {...props}
      {...srcAndOnload}
    />
  );
};

const Preview: React.FC<PreviewProps> = (props) => {
  const {
    prefixCls,
    src,
    alt,
    imageInfo,
    fallback,
    movable = true,
    onClose,
    open,
    icons = defaultIcons,
    closeIcon = <XMarkOutline />,
    getContainer,
    current = 0,
    count = 1,
    countRender,
    scaleStep = 0.5,
    minScale = 1,
    maxScale = 50,
    imageRender,
    imgCommonProps,
    toolbarRender,
    onTransform,
    onChange,
    className,
    ...restProps
  } = props;

  const semanticCls = getSemanticCls(className);

  const imgRef = useRef<HTMLImageElement>(null);
  const groupContext = useContext(PreviewGroupContext);
  const showLeftOrRightSwitches = groupContext && count > 1;
  const showOperationsProgress = groupContext && count >= 1;
  const [enableTransition, setEnableTransition] = useState(true);
  const { transform, resetTransform, updateTransform, dispatchZoomChange } = useImageTransform(
    imgRef,
    minScale,
    maxScale,
    onTransform,
  );
  const { isMoving, onMouseDown, onWheel } = useMouseEvent(
    imgRef,
    movable,
    !!open,
    scaleStep,
    transform,
    updateTransform,
    dispatchZoomChange,
  );
  const { isTouching, onTouchStart, onTouchMove, onTouchEnd } = useTouchEvent(
    imgRef,
    movable,
    !!open,
    minScale,
    transform,
    updateTransform,
    dispatchZoomChange,
  );
  const { rotate, scale } = transform;

  useEffect(() => {
    if (!enableTransition) {
      setEnableTransition(true);
    }
  }, [enableTransition]);

  const onAfterClose = () => {
    resetTransform('close');
  };

  const onZoomIn = () => {
    dispatchZoomChange(BASE_SCALE_RATIO + scaleStep, 'zoomIn');
  };

  const onZoomOut = () => {
    dispatchZoomChange(BASE_SCALE_RATIO / (BASE_SCALE_RATIO + scaleStep), 'zoomOut');
  };

  const onRotateRight = () => {
    updateTransform({ rotate: rotate + 90 }, 'rotateRight');
  };

  const onRotateLeft = () => {
    updateTransform({ rotate: rotate - 90 }, 'rotateLeft');
  };

  const onFlipX = () => {
    updateTransform({ flipX: !transform.flipX }, 'flipX');
  };

  const onFlipY = () => {
    updateTransform({ flipY: !transform.flipY }, 'flipY');
  };

  const onReset = () => {
    resetTransform('reset');
  };

  const onActive = (offset: number) => {
    const position = current + offset;

    if (!Number.isInteger(position) || position < 0 || position > count - 1) {
      return;
    }

    setEnableTransition(false);
    resetTransform(offset < 0 ? 'prev' : 'next');
    onChange?.(position, current);
  };

  const onKeyDown = (event: KeyboardEvent) => {
    if (!open || !showLeftOrRightSwitches) return;

    if (event.keyCode === KeyCode.LEFT) {
      onActive(-1);
    } else if (event.keyCode === KeyCode.RIGHT) {
      onActive(1);
    }
  };

  const onDoubleClick = (event: React.MouseEvent<HTMLImageElement, MouseEvent>) => {
    if (open) {
      if (scale !== 1) {
        updateTransform({ x: 0, y: 0, scale: 1 }, 'doubleClick');
      } else {
        dispatchZoomChange(
          BASE_SCALE_RATIO + scaleStep,
          'doubleClick',
          event.clientX,
          event.clientY,
        );
      }
    }
  };

  useEffect(() => {
    const onKeyDownListener = addEventListener(window, 'keydown', onKeyDown, false);

    return () => {
      onKeyDownListener.remove();
    };
  }, [open, showLeftOrRightSwitches, current]);

  // ======================================= Style =======================================
  const modalCls = useMemo(
    () =>
      mergeSemanticCls(
        {
          root: clsx('static top-[unset] h-full max-w-[unset] pb-[unset] text-center'),
          content: clsx(
            'pointer-events-none static block overflow-auto rounded-none bg-transparent shadow-none',
          ),
          body: clsx('absolute inset-0 overflow-hidden p-0'),
        },
        className,
      ),
    [JSON.stringify(className)],
  );
  const wrapCls = clsx(
    `${prefixCls}-img-wrapper`,
    {
      [`${prefixCls}-moving`]: isMoving,
    },
    'absolute inset-0 flex items-center justify-center transition-transform duration-300 ease-out *:pointer-events-auto',
  );
  const imgCls = clsx(
    `${prefixCls}-img`,
    'max-h-[70%] cursor-grab select-none transition-transform duration-300',
    {
      'cursor-grabbing': isMoving,
    },
    semanticCls.image,
  );

  const imgNode = (
    <PreviewImage
      {...imgCommonProps}
      width={props.width}
      height={props.height}
      imgRef={imgRef}
      className={imgCls}
      alt={alt}
      style={{
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0) scale3d(${
          transform.flipX ? '-' : ''
        }${scale}, ${transform.flipY ? '-' : ''}${scale}, 1) rotate(${rotate}deg)`,
        transitionDuration: !enableTransition || isTouching ? '0s' : undefined,
      }}
      fallback={fallback}
      src={src}
      onWheel={onWheel}
      onMouseDown={onMouseDown}
      onDoubleClick={onDoubleClick}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      onTouchCancel={onTouchEnd}
    />
  );

  const image = {
    url: src,
    alt,
    ...imageInfo,
  };

  return (
    <>
      <Modal
        closable={false}
        keyboard
        prefixCls={prefixCls}
        onCancel={onClose}
        open={open}
        getContainer={getContainer}
        className={modalCls}
        {...restProps}
        afterClose={onAfterClose}
        footer={null}
        width="auto"
      >
        <div className={wrapCls}>
          {imageRender
            ? imageRender(imgNode, { transform, image, ...(groupContext ? { current } : {}) })
            : imgNode}
        </div>
      </Modal>
      <Operations
        open={open}
        transform={transform}
        closeIcon={closeIcon}
        getContainer={getContainer}
        prefixCls={prefixCls}
        icons={icons}
        countRender={countRender}
        showSwitch={!!showLeftOrRightSwitches}
        showProgress={!!showOperationsProgress}
        current={current}
        count={count}
        scale={scale}
        minScale={minScale}
        maxScale={maxScale}
        toolbarRender={toolbarRender}
        onActive={onActive}
        onZoomIn={onZoomIn}
        onZoomOut={onZoomOut}
        onRotateRight={onRotateRight}
        onRotateLeft={onRotateLeft}
        onFlipX={onFlipX}
        onFlipY={onFlipY}
        onClose={onClose}
        onReset={onReset}
        zIndex={restProps.zIndex !== undefined ? restProps.zIndex + 1 : undefined}
        image={image}
        className={semanticCls.operations}
      />
    </>
  );
};

export default Preview;
