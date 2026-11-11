import { useRef, useState } from 'react';
import isEqual from '@rc-component/util/es/isEqual';
import raf from '@rc-component/util/es/raf';
import { getClientSize, getImageLayoutCenter } from '../util';

export type TransformType = {
  x: number;
  y: number;
  rotate: number;
  scale: number;
  flipX: boolean;
  flipY: boolean;
};

export type TransformAction =
  | 'flipY'
  | 'flipX'
  | 'rotateLeft'
  | 'rotateRight'
  | 'zoomIn'
  | 'zoomOut'
  | 'close'
  | 'prev'
  | 'next'
  | 'wheel'
  | 'doubleClick'
  | 'move'
  | 'dragRebound'
  | 'touchZoom'
  | 'reset';

export type UpdateTransformFunc = (
  newTransform: Partial<TransformType>,
  action: TransformAction,
) => void;

export type DispatchZoomChangeFunc = (
  ratio: number,
  action: TransformAction,
  centerX?: number,
  centerY?: number,
  isTouch?: boolean,
) => void;

const initialTransform = {
  x: 0,
  y: 0,
  rotate: 0,
  scale: 1,
  flipX: false,
  flipY: false,
};

export default function useImageTransform(
  imgRef: React.RefObject<HTMLImageElement | null>,
  minScale: number,
  maxScale: number,
  onTransform?: (info: { transform: TransformType; action: TransformAction }) => void,
  getEventTarget?: () => HTMLElement,
) {
  const frame = useRef<number | null>(null);
  const queue = useRef<TransformType[]>([]);
  const [transform, setTransform] = useState(initialTransform);

  const resetTransform = (action: TransformAction) => {
    setTransform(initialTransform);
    if (!isEqual(initialTransform, transform)) {
      onTransform?.({ transform: initialTransform, action });
    }
  };

  /** Direct update transform */
  const updateTransform: UpdateTransformFunc = (newTransform, action) => {
    if (frame.current === null) {
      queue.current = [];
      frame.current = raf(() => {
        setTransform((preState) => {
          let memoState: any = preState;
          queue.current.forEach((queueState) => {
            memoState = { ...memoState, ...queueState };
          });
          frame.current = null;

          onTransform?.({ transform: memoState, action });
          return memoState;
        });
      });
    }
    queue.current.push({
      ...transform,
      ...newTransform,
    });
  };

  /** Scale according to the position of centerX and centerY */
  const dispatchZoomChange: DispatchZoomChangeFunc = (
    ratio,
    action,
    centerX?,
    centerY?,
    isTouch?,
  ) => {
    const { offsetWidth, offsetHeight } = imgRef.current!;

    let newRatio = ratio;
    let newScale = transform.scale * ratio;
    if (newScale > maxScale) {
      newScale = maxScale;
      newRatio = maxScale / transform.scale;
    } else if (newScale < minScale) {
      // For mobile interactions, allow scaling down to the minimum scale.
      newScale = isTouch ? newScale : minScale;
      newRatio = newScale / transform.scale;
    }

    /**
     * The scale transform is applied around the image center, while the pointer is expressed in
     * viewport coordinates. Resolve the layout center in the same coordinate space, together with
     * the scale applied by the ancestors, so the anchored point stays under the pointer wherever
     * the preview is mounted.
     */
    const {
      centerX: imageCenterX,
      centerY: imageCenterY,
      scale: ancestorScale,
    } = getImageLayoutCenter(imgRef.current!);

    /** Default center point scaling */
    const eventTargetRect = getEventTarget?.()?.getBoundingClientRect();
    const mergedCenterX =
      centerX ??
      (eventTargetRect ? eventTargetRect.left + eventTargetRect.width / 2 : innerWidth / 2);
    const mergedCenterY =
      centerY ??
      (eventTargetRect ? eventTargetRect.top + eventTargetRect.height / 2 : innerHeight / 2);

    /**
     * Keep the point under the pointer fixed. The current translation is scaled together with the
     * image, otherwise each zoom step after the first one drifts away from the pointer.
     */
    const offsetX = (mergedCenterX - imageCenterX) / ancestorScale;
    const offsetY = (mergedCenterY - imageCenterY) / ancestorScale;

    let newX = newRatio * transform.x + (1 - newRatio) * offsetX;
    let newY = newRatio * transform.y + (1 - newRatio) * offsetY;

    /**
     * When zooming the image
     * When the image size is smaller than the width and height of the container,
     * the position is initialized
     */
    if (ratio < 1 && newScale === 1) {
      const mergedWidth = offsetWidth * newScale;
      const mergedHeight = offsetHeight * newScale;
      const { width: clientWidth, height: clientHeight } = getClientSize(getEventTarget?.());
      if (mergedWidth <= clientWidth && mergedHeight <= clientHeight) {
        newX = 0;
        newY = 0;
      }
    }

    updateTransform(
      {
        x: newX,
        y: newY,
        scale: newScale,
      },
      action,
    );
  };

  return {
    transform,
    resetTransform,
    updateTransform,
    dispatchZoomChange,
  };
}
