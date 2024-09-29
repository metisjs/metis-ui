import * as React from 'react';
import { useState } from 'react';
import useMergedState from 'rc-util/lib/hooks/useMergedState';
import { useZIndex } from '../_util/hooks/useZIndex';
import { ConfigContext } from '../config-provider';
import { PreviewGroupContext } from './context';
import usePreviewItems from './hooks/usePreviewItems';
import type {
  ImageElementProps,
  OnGroupPreview,
  PreviewGroupPreview,
  PreviewProps,
} from './interface';
import Preview from './Preview';

export interface GroupConsumerProps {
  previewPrefixCls?: string;
  icons?: PreviewProps['icons'];
  items?: (string | ImageElementProps)[];
  fallback?: string;
  preview?: boolean | PreviewGroupPreview;
  children?: React.ReactNode;
}

const Group: React.FC<GroupConsumerProps> = ({
  previewPrefixCls: customizePrefixCls,
  children,
  icons,
  items,
  preview,
  fallback,
}) => {
  const { getPrefixCls } = React.useContext(ConfigContext);
  const prefixCls = getPrefixCls('image', customizePrefixCls);
  const previewPrefixCls = `${prefixCls}-preview`;

  const {
    open: previewOpen,
    onOpenChange: onVisibleChange,
    getContainer,
    current: currentIndex,
    movable,
    minScale,
    maxScale,
    countRender,
    closeIcon,
    zIndex,
    onChange,
    onTransform,
    toolbarRender,
    imageRender,
    ...modalProps
  } = typeof preview === 'object' ? preview : ({} as PreviewGroupPreview);

  // ========================== Items ===========================
  const [mergedItems, register, fromItems] = usePreviewItems(items);

  // ========================= Preview ==========================
  // >>> Index
  const [current, setCurrent] = useMergedState(0, {
    value: currentIndex,
  });

  const [keepOpenIndex, setKeepOpenIndex] = useState(false);

  // >>> Image
  const { src, ...imgCommonProps } = mergedItems[current]?.data || {};
  // >>> Visible
  const [isShowPreview, setShowPreview] = useMergedState(!!previewOpen, {
    value: previewOpen,
    onChange: (val, prevVal) => {
      onVisibleChange?.(val, prevVal, current);
    },
  });

  // >>> Position
  const [mousePosition, setMousePosition] = useState<null | { x: number; y: number }>(null);

  const onPreviewFromImage = React.useCallback<OnGroupPreview>(
    (id, imageSrc, mouseX, mouseY) => {
      const index = fromItems
        ? mergedItems.findIndex((item) => item.data.src === imageSrc)
        : mergedItems.findIndex((item) => item.id === id);

      setCurrent(index < 0 ? 0 : index);

      setShowPreview(true);
      setMousePosition({ x: mouseX, y: mouseY });

      setKeepOpenIndex(true);
    },
    [mergedItems, fromItems],
  );

  // Reset current when reopen
  React.useEffect(() => {
    if (isShowPreview) {
      if (!keepOpenIndex) {
        setCurrent(0);
      }
    } else {
      setKeepOpenIndex(false);
    }
  }, [isShowPreview]);

  // ========================== Events ==========================
  const onInternalChange: PreviewGroupPreview['onChange'] = (next, prev) => {
    setCurrent(next);

    onChange?.(next, prev);
  };

  const onPreviewClose = () => {
    setShowPreview(false);
    setMousePosition(null);
  };

  // ========================= Context ==========================
  const previewGroupContext = React.useMemo(
    () => ({ register, onPreview: onPreviewFromImage }),
    [register, onPreviewFromImage],
  );

  // ========================= ZIndex ==========================
  const [mergedZIndex] = useZIndex('ImagePreview', zIndex);

  // ========================== Render ==========================
  return (
    <PreviewGroupContext.Provider value={previewGroupContext}>
      {children}
      <Preview
        aria-hidden={!isShowPreview}
        movable={movable}
        open={isShowPreview}
        prefixCls={previewPrefixCls}
        closeIcon={closeIcon}
        onClose={onPreviewClose}
        mousePosition={mousePosition}
        imgCommonProps={imgCommonProps}
        src={src}
        fallback={fallback}
        icons={icons}
        minScale={minScale}
        maxScale={maxScale}
        getContainer={getContainer}
        current={current}
        count={mergedItems.length}
        countRender={countRender}
        onTransform={onTransform}
        toolbarRender={toolbarRender}
        imageRender={imageRender}
        onChange={onInternalChange}
        zIndex={mergedZIndex}
        {...modalProps}
      />
    </PreviewGroupContext.Provider>
  );
};

export default Group;