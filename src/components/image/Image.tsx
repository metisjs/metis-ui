import * as React from 'react';
import { useContext, useMemo, useState } from 'react';
import { EyeOutline } from '@metisjs/icons';
import useMergedState from '@rc-component/util/es/hooks/useMergedState';
import { clsx } from '@util/classNameUtils';
import useSemanticCls from '@util/hooks/useSemanticCls';
import { useZIndex } from '@util/hooks/useZIndex';
import { ConfigContext } from '../config-provider';
import { useLocale } from '../locale';
import { COMMON_PROPS } from './constant';
import { PreviewGroupContext } from './context';
import useRegisterImage from './hooks/useRegisterImage';
import useStatus from './hooks/useStatus';
import type { ImageElementProps, ImagePreviewType, ImageProps } from './interface';
import Preview from './Preview';
import PreviewGroup from './PreviewGroup';

interface CompoundedComponent<P> extends React.FC<P> {
  PreviewGroup: typeof PreviewGroup;
}

const ImageInternal: CompoundedComponent<ImageProps> = (props) => {
  const {
    src: imgSrc,
    alt,
    prefixCls: customizePrefixCls,
    placeholder,
    fallback,
    width,
    height,
    style,
    preview = true,
    onClick,
    onError,
    className,

    ...otherProps
  } = props;

  const { getPrefixCls, getPopupContainer: getContextPopupContainer } =
    React.useContext(ConfigContext);
  const prefixCls = getPrefixCls('image', customizePrefixCls);

  const groupContext = useContext(PreviewGroupContext);

  const semanticCls = useSemanticCls([groupContext?.imageClassName, className], 'image');

  const isCustomPlaceholder = !!placeholder && placeholder !== true;
  const {
    src: previewSrc,
    open: previewOpen = undefined,
    onOpenChange: onPreviewOpenChange,
    getContainer: getPreviewContainer = undefined,
    mask: previewMask,
    movable,
    icons,
    scaleStep,
    minScale,
    maxScale,
    zIndex,
    imageRender,
    toolbarRender,
    ...modalProps
  }: ImagePreviewType = typeof preview === 'object' ? preview : {};

  const src = previewSrc ?? imgSrc;
  const [isShowPreview, setShowPreview] = useMergedState(!!previewOpen, {
    value: previewOpen,
    onChange: onPreviewOpenChange,
  });
  const [getImgRef, srcAndOnload, status] = useStatus({
    src: imgSrc,
    isCustomPlaceholder,
    fallback,
  });
  const [mousePosition, setMousePosition] = useState<null | { x: number; y: number }>(null);

  const canPreview = !!preview;

  const onPreviewClose = () => {
    setShowPreview(false);
    setMousePosition(null);
  };

  // ========================= ImageProps =========================
  const imgCommonProps = useMemo(
    () => {
      const obj: ImageElementProps = {};
      COMMON_PROPS.forEach((prop: any) => {
        // @ts-ignore
        if (props[prop] !== undefined) {
          // @ts-ignore
          obj[prop] = props[prop];
        }
      });

      return obj;
    },
    COMMON_PROPS.map((prop) => props[prop]),
  );

  // ========================== Register ==========================
  const registerData: ImageElementProps = useMemo(
    () => ({
      ...imgCommonProps,
      src,
    }),
    [src, imgCommonProps],
  );

  const imageId = useRegisterImage(canPreview, registerData);

  // ========================== Preview ===========================
  const onPreview: React.MouseEventHandler<HTMLDivElement> = (e) => {
    const rect = (e.target as HTMLDivElement).getBoundingClientRect();
    const left = rect.x + rect.width / 2;
    const top = rect.y + rect.height / 2;

    if (groupContext) {
      groupContext.onPreview(imageId, src, left, top);
    } else {
      setMousePosition({
        x: left,
        y: top,
      });
      setShowPreview(true);
    }

    onClick?.(e);
  };

  const [local] = useLocale('Image');

  // =========================== ZIndex ===========================
  const [mergedZIndex] = useZIndex('ImagePreview', zIndex);

  // =========================== Style ===========================
  const wrapperCls = clsx(
    prefixCls,
    {
      [`${prefixCls}-error`]: status === 'error',
    },
    'relative inline-block',
    semanticCls.root,
  );
  const imageCls = clsx(
    `${prefixCls}-img`,
    {
      [`${prefixCls}-img-placeholder`]: placeholder === true,
    },
    'h-full w-full align-middle',
    {
      'bg-fill-quaternary': placeholder === true,
    },
    semanticCls.img,
  );
  const placeholderCls = clsx(`${prefixCls}-placeholder`, 'absolute inset-0');
  const maskCls = clsx(
    `${prefixCls}-mask`,
    'bg-mask absolute inset-0 flex cursor-pointer items-center justify-center text-white opacity-0 transition-opacity duration-200 hover:opacity-100',
    semanticCls.mask,
  );

  // =========================== Render ===========================
  return (
    <>
      <div
        {...otherProps}
        className={wrapperCls}
        onClick={canPreview ? onPreview : onClick}
        style={{
          width,
          height,
        }}
      >
        <img
          {...imgCommonProps}
          className={imageCls}
          style={{
            height,
            ...(placeholder === true && {
              backgroundImage:
                "url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNMTQuNSAyLjVoLTEzQS41LjUgMCAwIDAgMSAzdjEwYS41LjUgMCAwIDAgLjUuNWgxM2EuNS41IDAgMCAwIC41LS41VjNhLjUuNSAwIDAgMC0uNS0uNXpNNS4yODEgNC43NWExIDEgMCAwIDEgMCAyIDEgMSAwIDAgMSAwLTJ6bTguMDMgNi44M2EuMTI3LjEyNyAwIDAgMS0uMDgxLjAzSDIuNzY5YS4xMjUuMTI1IDAgMCAxLS4wOTYtLjIwN2wyLjY2MS0zLjE1NmEuMTI2LjEyNiAwIDAgMSAuMTc3LS4wMTZsLjAxNi4wMTZMNy4wOCAxMC4wOWwyLjQ3LTIuOTNhLjEyNi4xMjYgMCAwIDEgLjE3Ny0uMDE2bC4wMTUuMDE2IDMuNTg4IDQuMjQ0YS4xMjcuMTI3IDAgMCAxLS4wMi4xNzV6IiBmaWxsPSIjOEM4QzhDIiBmaWxsLXJ1bGU9Im5vbnplcm8iLz48L3N2Zz4=')",
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'center center',
              backgroundSize: '30%',
            }),
            ...style,
          }}
          ref={getImgRef as any}
          {...srcAndOnload}
          width={width}
          height={height}
          onError={onError}
        />

        {status === 'loading' && (
          <div aria-hidden="true" className={placeholderCls}>
            {placeholder}
          </div>
        )}

        {/* Preview Click Mask */}
        {canPreview && (
          <div
            className={maskCls}
            style={{
              display: style?.display === 'none' ? 'none' : undefined,
            }}
          >
            {previewMask ?? (
              <>
                <EyeOutline className="mr-1 size-4" />
                {local?.preview}
              </>
            )}
          </div>
        )}
      </div>
      {!groupContext && canPreview && (
        <Preview
          aria-hidden={!isShowPreview}
          open={isShowPreview}
          prefixCls={`${prefixCls}-preview`}
          onClose={onPreviewClose}
          mousePosition={mousePosition}
          src={src}
          alt={alt}
          imageInfo={{ width, height }}
          fallback={fallback}
          getContainer={getPreviewContainer ?? getContextPopupContainer}
          icons={icons}
          movable={movable}
          scaleStep={scaleStep}
          minScale={minScale}
          maxScale={maxScale}
          imageRender={imageRender}
          imgCommonProps={imgCommonProps}
          toolbarRender={toolbarRender}
          zIndex={mergedZIndex}
          className={semanticCls.preview}
          {...modalProps}
        />
      )}
    </>
  );
};

ImageInternal.PreviewGroup = PreviewGroup;

if (process.env.NODE_ENV !== 'production') {
  ImageInternal.displayName = 'Image';
}

export default ImageInternal;
