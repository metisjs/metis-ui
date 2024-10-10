import type * as React from 'react';
import type { GetContainer } from 'rc-util/lib/PortalWrapper';
import type { SemanticClassName } from '../_util/classNameUtils';
import type { TransformAction, TransformType } from './hooks/useImageTransform';

/**
 * Used for PreviewGroup passed image data
 */
export type ImageElementProps = Pick<
  React.ImgHTMLAttributes<HTMLImageElement>,
  | 'src'
  | 'crossOrigin'
  | 'decoding'
  | 'draggable'
  | 'loading'
  | 'referrerPolicy'
  | 'sizes'
  | 'srcSet'
  | 'useMap'
  | 'alt'
>;

export type PreviewImageElementProps = {
  data: ImageElementProps;
  canPreview: boolean;
};

export type InternalItem = PreviewImageElementProps & {
  id?: string;
};

export type RegisterImage = (id: string, data: PreviewImageElementProps) => VoidFunction;

export type OnGroupPreview = (id: string, imageSrc: string, mouseX: number, mouseY: number) => void;

export interface ImgInfo {
  url?: string;
  alt?: string;
  width?: string | number;
  height?: string | number;
}

export interface ImagePreviewType {
  className?: SemanticClassName<
    'body' | 'mask' | 'content' | 'image',
    void,
    { operations?: OperationsProps['className'] }
  >;
  maskClosable?: boolean;
  destroyOnClose?: boolean;
  src?: string;
  open?: boolean;
  minScale?: number;
  maxScale?: number;
  onOpenChange?: (value: boolean, prevValue: boolean) => void;
  getContainer?: GetContainer | false;
  mask?: React.ReactNode;
  icons?: PreviewProps['icons'];
  closeIcon?: React.ReactNode;
  scaleStep?: number;
  movable?: boolean;
  zIndex?: number;
  imageRender?: (
    originalNode: React.ReactElement,
    info: { transform: TransformType; image: ImgInfo },
  ) => React.ReactNode;
  onTransform?: PreviewProps['onTransform'];
  toolbarRender?: (
    originalNode: React.ReactElement,
    info: Omit<ToolbarRenderInfoType, 'current' | 'total'>,
  ) => React.ReactNode;
  afterOpenChange?: (open: boolean) => void;
}

export interface ImageProps
  extends Omit<React.ImgHTMLAttributes<HTMLImageElement>, 'placeholder' | 'onClick' | 'className'> {
  className?: SemanticClassName<'image'>;
  // Original
  src: string;
  prefixCls?: string;
  placeholder?: React.ReactNode;
  fallback?: string;
  preview?: boolean | ImagePreviewType;
  onClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
  onError?: (e: React.SyntheticEvent<HTMLImageElement, Event>) => void;
}

export type OperationType =
  | 'prev'
  | 'next'
  | 'flipY'
  | 'flipX'
  | 'rotateLeft'
  | 'rotateRight'
  | 'zoomOut'
  | 'zoomIn';

export interface OperationsProps
  extends Pick<
    PreviewProps,
    'open' | 'getContainer' | 'prefixCls' | 'icons' | 'countRender' | 'closeIcon' | 'onClose'
  > {
  className?: SemanticClassName<'operation' | 'close' | 'progress'>;
  showSwitch: boolean;
  showProgress: boolean;
  current: number;
  transform: TransformType;
  count: number;
  scale: number;
  minScale: number;
  maxScale: number;
  onActive: (offset: number) => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onRotateRight: () => void;
  onRotateLeft: () => void;
  onFlipX: () => void;
  onFlipY: () => void;
  onReset: () => void;
  toolbarRender?: (
    originalNode: React.ReactElement,
    info: ToolbarRenderInfoType | Omit<ToolbarRenderInfoType, 'current' | 'total'>,
  ) => React.ReactNode;
  zIndex?: number;
  image: ImgInfo;
}

export type ToolbarRenderInfoType = {
  icons: {
    prevIcon?: React.ReactNode;
    nextIcon?: React.ReactNode;
    flipYIcon: React.ReactNode;
    flipXIcon: React.ReactNode;
    rotateLeftIcon: React.ReactNode;
    rotateRightIcon: React.ReactNode;
    zoomOutIcon: React.ReactNode;
    zoomInIcon: React.ReactNode;
  };
  actions: {
    onActive?: (offset: number) => void;
    onFlipY: () => void;
    onFlipX: () => void;
    onRotateLeft: () => void;
    onRotateRight: () => void;
    onZoomOut: () => void;
    onZoomIn: () => void;
    onClose: () => void;
    onReset: () => void;
  };
  transform: TransformType;
  current: number;
  total: number;
  image: ImgInfo;
};

export interface PreviewProps {
  prefixCls?: string;
  imgCommonProps?: React.ImgHTMLAttributes<HTMLImageElement>;
  className?: ImagePreviewType['className'];
  open?: boolean;
  src?: string;
  alt?: string;
  imageInfo?: {
    width?: number | string;
    height?: number | string;
  };
  fallback?: string;
  movable?: boolean;
  icons?: {
    rotateLeft?: React.ReactNode;
    rotateRight?: React.ReactNode;
    zoomIn?: React.ReactNode;
    zoomOut?: React.ReactNode;
    left?: React.ReactNode;
    right?: React.ReactNode;
    flipX?: React.ReactNode;
    flipY?: React.ReactNode;
  };
  current?: number;
  count?: number;
  closeIcon?: React.ReactNode;
  countRender?: (current: number, total: number) => React.ReactNode;
  scaleStep?: number;
  minScale?: number;
  maxScale?: number;
  getContainer?: GetContainer | false;
  mousePosition?: {
    x: number;
    y: number;
  } | null;
  width?: string | number;
  height?: string | number;
  zIndex?: number;
  imageRender?: (
    originalNode: React.ReactElement,
    info: { transform: TransformType; current?: number; image?: ImgInfo },
  ) => React.ReactNode;
  onClose: () => void;
  onTransform?: (info: { transform: TransformType; action: TransformAction }) => void;
  toolbarRender?: (
    originalNode: React.ReactElement,
    info: ToolbarRenderInfoType,
  ) => React.ReactNode;
  onChange?: (current: number, prev: number) => void;
}

export interface PreviewGroupPreview
  extends Omit<ImagePreviewType, 'mask' | 'onOpenChange' | 'toolbarRender' | 'imageRender'> {
  /**
   * If Preview the show img index
   * @default 0
   */
  current?: number;
  countRender?: (current: number, total: number) => React.ReactNode;
  toolbarRender?: (
    originalNode: React.ReactElement,
    info: ToolbarRenderInfoType,
  ) => React.ReactNode;
  imageRender?: (
    originalNode: React.ReactElement,
    info: { transform: TransformType; current: number; image: ImgInfo },
  ) => React.ReactNode;
  onOpenChange?: (value: boolean, prevValue: boolean, current: number) => void;
  onChange?: (current: number, prevCurrent: number) => void;
}
