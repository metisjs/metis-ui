import { useEvent } from 'rc-util';
import * as React from 'react';
import { UnstableContext } from '../context';
import type { Direction, OnStartMove } from '../interface';
import type { OffsetValues } from './useOffset';

function getPosition(e: React.MouseEvent | React.TouchEvent | MouseEvent | TouchEvent) {
  const obj = 'touches' in e ? e.touches[0] : e;

  return { pageX: obj.pageX, pageY: obj.pageY };
}

function useDrag(
  containerRef: React.RefObject<HTMLDivElement>,
  direction: Direction,
  rawValues: number[],
  min: number,
  max: number,
  formatValue: (value: number) => number,
  triggerChange: (values: number[]) => void,
  finishChange: () => void,
  offsetValues: OffsetValues,
): [
  draggingIndex: number,
  draggingValue: number | undefined,
  returnValues: number[],
  onStartMove: OnStartMove,
] {
  const [draggingValue, setDraggingValue] = React.useState<number>();
  const [draggingIndex, setDraggingIndex] = React.useState(-1);
  const [cacheValues, setCacheValues] = React.useState(rawValues);
  const [originValues, setOriginValues] = React.useState(rawValues);

  const mouseMoveEventRef = React.useRef<(event: MouseEvent) => void>();
  const mouseUpEventRef = React.useRef<(event: MouseEvent) => void>();

  const { onDragStart, onDragChange } = React.useContext(UnstableContext);

  React.useLayoutEffect(() => {
    if (draggingIndex === -1) {
      setCacheValues(rawValues);
    }
  }, [rawValues, draggingIndex]);

  // Clean up event
  React.useEffect(
    () => () => {
      if (mouseMoveEventRef.current) {
        document.removeEventListener('touchmove', mouseMoveEventRef.current);
        document.removeEventListener('mousemove', mouseMoveEventRef.current);
      }
      if (mouseUpEventRef.current) {
        document.removeEventListener('mouseup', mouseUpEventRef.current);
        document.removeEventListener('touchend', mouseUpEventRef.current);
      }
    },
    [],
  );

  const flushValues = (nextValues: number[], nextValue?: number) => {
    // Perf: Only update state when value changed
    if (nextValue !== undefined) {
      setDraggingValue(nextValue);
    }
    setCacheValues(nextValues);

    triggerChange(nextValues);

    if (onDragChange) {
      onDragChange({
        rawValues: nextValues,
        draggingIndex,
        draggingValue: nextValue,
      });
    }
  };

  const updateCacheValue = useEvent((valueIndex: number, offsetPercent: number) => {
    if (valueIndex === -1) {
      // >>>> Dragging on the track
      const startValue = originValues[0];
      const endValue = originValues[originValues.length - 1];
      const maxStartOffset = min - startValue;
      const maxEndOffset = max - endValue;

      // Get valid offset
      let offset = offsetPercent * (max - min);
      offset = Math.max(offset, maxStartOffset);
      offset = Math.min(offset, maxEndOffset);

      // Use first value to revert back of valid offset (like steps marks)
      const formatStartValue = formatValue(startValue + offset);
      offset = formatStartValue - startValue;
      const cloneCacheValues = originValues.map<number>((val) => val + offset);
      flushValues(cloneCacheValues);
    } else {
      // >>>> Dragging on the handle
      const offsetDist = (max - min) * offsetPercent;

      // Always start with the valueIndex origin value
      const cloneValues = [...cacheValues];
      cloneValues[valueIndex] = originValues[valueIndex];

      const next = offsetValues(cloneValues, offsetDist, valueIndex, 'dist');

      flushValues(next.values, next.value);
    }
  });

  const onStartMove: OnStartMove = (e, valueIndex, startValues?: number[]) => {
    e.stopPropagation();

    // 如果是点击 track 触发的，需要传入变化后的初始值，而不能直接用 rawValues
    const initialValues = startValues || rawValues;
    const originValue = initialValues[valueIndex];

    setDraggingIndex(valueIndex);
    setDraggingValue(originValue);
    setOriginValues(initialValues);
    setCacheValues(initialValues);

    const { pageX: startX, pageY: startY } = getPosition(e);

    // Internal trigger event
    if (onDragStart) {
      onDragStart({
        rawValues: initialValues,
        draggingIndex: valueIndex,
        draggingValue: originValue,
      });
    }

    // Moving
    const onMouseMove = (event: MouseEvent | TouchEvent) => {
      event.preventDefault();

      const { pageX: moveX, pageY: moveY } = getPosition(event);
      const offsetX = moveX - startX;
      const offsetY = moveY - startY;

      const { width, height } = containerRef.current!.getBoundingClientRect();

      let offSetPercent: number;

      switch (direction) {
        case 'btt':
          offSetPercent = -offsetY / height;
          break;

        case 'ttb':
          offSetPercent = offsetY / height;
          break;

        case 'rtl':
          offSetPercent = -offsetX / width;
          break;

        default:
          offSetPercent = offsetX / width;
      }

      updateCacheValue(valueIndex, offSetPercent);
    };

    // End
    const onMouseUp = (event: MouseEvent | TouchEvent) => {
      event.preventDefault();

      document.removeEventListener('mouseup', onMouseUp);
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('touchend', onMouseUp);
      document.removeEventListener('touchmove', onMouseMove);
      mouseMoveEventRef.current = undefined;
      mouseUpEventRef.current = undefined;

      finishChange();

      setDraggingIndex(-1);
    };

    document.addEventListener('mouseup', onMouseUp);
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('touchend', onMouseUp);
    document.addEventListener('touchmove', onMouseMove);
    mouseMoveEventRef.current = onMouseMove;
    mouseUpEventRef.current = onMouseUp;
  };

  // Only return cache value when it mapping with rawValues
  const returnValues = React.useMemo(() => {
    const sourceValues = [...rawValues].sort((a, b) => a - b);
    const targetValues = [...cacheValues].sort((a, b) => a - b);

    const counts: Record<number, number> = {};
    targetValues.forEach((val) => {
      counts[val] = (counts[val] || 0) + 1;
    });
    sourceValues.forEach((val) => {
      counts[val] = (counts[val] || 0) - 1;
    });

    const diffCount: number = Object.values(counts).reduce(
      (prev, next) => prev + Math.abs(next),
      0,
    );

    return diffCount <= 0 ? cacheValues : rawValues;
  }, [rawValues, cacheValues]);

  return [draggingIndex, draggingValue, returnValues, onStartMove];
}

export default useDrag;
