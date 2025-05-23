import { useCallback, useEffect, useRef, useState } from 'react';
import type { AggregationColor } from '../color';
import type { TransformOffset } from '../interface';

type EventType =
  | MouseEvent
  | React.MouseEvent<Element, MouseEvent>
  | React.TouchEvent<Element>
  | TouchEvent;

type EventHandle = (e: EventType) => void;

interface useColorDragProps {
  color: AggregationColor;
  containerRef: React.RefObject<HTMLDivElement | null>;
  targetRef: React.RefObject<HTMLDivElement | null>;
  direction?: 'x' | 'y';
  onDragChange?: (offset: TransformOffset) => void;
  onDragChangeComplete?: () => void;
  calculate: () => TransformOffset;
  /** Disabled drag */
  disabledDrag?: boolean;
}

function getPosition(e: EventType) {
  const obj = 'touches' in e ? e.touches[0] : e;
  const scrollXOffset =
    document.documentElement.scrollLeft || document.body.scrollLeft || window.pageXOffset;
  const scrollYOffset =
    document.documentElement.scrollTop || document.body.scrollTop || window.pageYOffset;
  return { pageX: obj.pageX - scrollXOffset, pageY: obj.pageY - scrollYOffset };
}

function useColorDrag(props: useColorDragProps): [TransformOffset, EventHandle] {
  const {
    targetRef,
    containerRef,
    direction,
    onDragChange,
    onDragChangeComplete,
    calculate,
    color,
    disabledDrag,
  } = props;
  const [offsetValue, setOffsetValue] = useState({ x: 0, y: 0 });
  const mouseMoveRef = useRef<((event: MouseEvent) => void) | null>(null);
  const mouseUpRef = useRef<((event: MouseEvent) => void) | null>(null);

  const removeEventListeners = useCallback(() => {
    if (mouseMoveRef.current) {
      document.removeEventListener('mousemove', mouseMoveRef.current);
      document.removeEventListener('touchmove', mouseMoveRef.current);
    }
    if (mouseUpRef.current) {
      document.removeEventListener('mouseup', mouseUpRef.current);
      document.removeEventListener('touchend', mouseUpRef.current);
    }
    mouseMoveRef.current = null;
    mouseUpRef.current = null;
  }, []);

  // Always get position from `color`
  useEffect(() => {
    setOffsetValue(calculate());
  }, [color]);

  useEffect(() => removeEventListeners, []);

  const updateOffset: EventHandle = (e) => {
    const { pageX, pageY } = getPosition(e);
    const { x: rectX, y: rectY, width, height } = containerRef.current!.getBoundingClientRect();
    const { width: targetWidth, height: targetHeight } = targetRef.current!.getBoundingClientRect();

    const centerOffsetX = targetWidth / 2;
    const centerOffsetY = targetHeight / 2;

    const offsetX = Math.max(0, Math.min(pageX - rectX, width)) - centerOffsetX;
    const offsetY = Math.max(0, Math.min(pageY - rectY, height)) - centerOffsetY;

    const calcOffset = {
      x: offsetX,
      y: direction === 'x' ? offsetValue.y : offsetY,
    };

    // Exclusion of boundary cases
    if ((targetWidth === 0 && targetHeight === 0) || targetWidth !== targetHeight) {
      return false;
    }

    onDragChange?.(calcOffset);
  };

  const onDragMove: EventHandle = (e) => {
    e.preventDefault();
    updateOffset(e);
  };

  const onDragStop: EventHandle = (e) => {
    e.preventDefault();
    removeEventListeners();
    onDragChangeComplete?.();
  };

  const onDragStart: EventHandle = (e) => {
    removeEventListeners();

    if (disabledDrag) {
      return;
    }
    updateOffset(e);
    document.addEventListener('mousemove', onDragMove);
    document.addEventListener('mouseup', onDragStop);
    document.addEventListener('touchmove', onDragMove);
    document.addEventListener('touchend', onDragStop);
    mouseMoveRef.current = onDragMove;
    mouseUpRef.current = onDragStop;
  };

  return [offsetValue, onDragStart];
}

export default useColorDrag;
