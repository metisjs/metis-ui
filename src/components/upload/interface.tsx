import type * as React from 'react';
import type { SemanticClassName } from '../_util/classNameUtils';
import type { ProgressAriaProps, ProgressProps } from '../progress';

export type BeforeUploadFileType = void | boolean | string | Blob | File;

export type UploadFileStatus = 'error' | 'done' | 'uploading' | 'removed';

export interface HttpRequestHeader {
  [key: string]: string;
}

export interface UploadChangeParam<T = UploadFile> {
  file: T;
  fileList: T[];
  event?: UploadProgressEvent;
}

export interface ShowUploadListInterface<T = any> {
  extra?: React.ReactNode | ((file: UploadFile<T>) => React.ReactNode);
  showRemoveIcon?: boolean;
  showPreviewIcon?: boolean;
  showDownloadIcon?: boolean;
  removeIcon?: React.ReactNode | ((file: UploadFile<T>) => React.ReactNode);
  downloadIcon?: React.ReactNode | ((file: UploadFile<T>) => React.ReactNode);
  previewIcon?: React.ReactNode | ((file: UploadFile<T>) => React.ReactNode);
}

export interface UploadLocale {
  uploading?: string;
  removeFile?: string;
  downloadFile?: string;
  uploadError?: string;
  previewFile?: string;
}

export type UploadType = 'drag' | 'select';
export type UploadListType = 'text' | 'picture' | 'picture-card' | 'picture-circle';
export type UploadListProgressProps = Omit<ProgressProps, 'percent' | 'type'>;

export type ItemRender<T = any> = (
  originNode: React.ReactElement,
  file: UploadFile<T>,
  fileList: Array<UploadFile<T>>,
  actions: {
    download: () => void;
    preview: () => void;
    remove: () => void;
  },
) => React.ReactNode;

type PreviewFileHandler = (file: File | Blob) => PromiseLike<string>;
export interface UploadProps<T = any> {
  className?: SemanticClassName<{
    input?: string;
    drag?: string;
    list?: UploadListProps['className'];
  }>;
  type?: UploadType;
  name?: string;
  defaultFileList?: Array<UploadFile<T>>;
  fileList?: Array<UploadFile<T>>;
  action?:
    | string
    | ((file: InternalFile) => string)
    | ((file: InternalFile) => PromiseLike<string>);
  directory?: boolean;
  data?:
    | Record<string, unknown>
    | ((file: UploadFile<T>) => Record<string, unknown> | Promise<Record<string, unknown>>);
  method?: 'POST' | 'PUT' | 'PATCH' | 'post' | 'put' | 'patch';
  headers?: HttpRequestHeader;
  showUploadList?: boolean | ShowUploadListInterface;
  multiple?: boolean;
  accept?: string;
  beforeUpload?: (
    file: InternalFile,
    fileList: InternalFile[],
  ) => BeforeUploadFileType | Promise<BeforeUploadFileType>;
  onChange?: (info: UploadChangeParam<UploadFile<T>>) => void;
  onDrop?: (event: React.DragEvent<HTMLDivElement>) => void;
  listType?: UploadListType;
  onPreview?: (file: UploadFile<T>) => void;
  onDownload?: (file: UploadFile<T>) => void;
  onRemove?: (file: UploadFile<T>) => void | boolean | Promise<void | boolean>;
  style?: React.CSSProperties;
  disabled?: boolean;
  prefixCls?: string;
  customRequest?: (options: UploadRequestOption<T>) => { abort: () => void };
  withCredentials?: boolean;
  openFileDialogOnClick?: boolean;
  locale?: UploadLocale;
  id?: string;
  previewFile?: PreviewFileHandler;
  iconRender?: (file: UploadFile<T>, listType?: UploadListType) => React.ReactNode;
  isImageUrl?: (file: UploadFile<T>) => boolean;
  progress?: UploadListProgressProps;
  itemRender?: ItemRender<T>;
  /** Config max count of `fileList`. Will replace current one when `maxCount` is 1 */
  maxCount?: number;
  children?: React.ReactNode;
  capture?: boolean | 'user' | 'environment';
  hasControlInside?: boolean;
}

export interface UploadProgressEvent extends Partial<ProgressEvent> {
  percent?: number;
}

export type UploadRequestMethod = 'POST' | 'PUT' | 'PATCH' | 'post' | 'put' | 'patch';

export type UploadRequestHeader = Record<string, string>;

export type UploadRequestFile = Exclude<BeforeUploadFileType, File | boolean> | InternalFile;

export interface UploadRequestError extends Error {
  status?: number;
  method?: UploadRequestMethod;
  url?: string;
}

export interface UploadRequestOption<T = any> {
  onProgress?: (event: UploadProgressEvent, file?: UploadRequestFile) => void;
  onError?: (event: UploadRequestError | ProgressEvent, body?: T) => void;
  onSuccess?: (body: T, fileOrXhr?: UploadRequestFile | XMLHttpRequest) => void;
  data?: Record<string, unknown>;
  filename?: string;
  file: UploadRequestFile;
  withCredentials?: boolean;
  action: string;
  headers?: UploadRequestHeader;
  method: UploadRequestMethod;
}

export interface InternalFile extends File {
  uid: string;
  lastModifiedDate?: Date;
}

export interface UploadFile<T = any> extends ProgressAriaProps {
  uid: string;
  size?: number;
  name: string;
  fileName?: string;
  lastModified?: number;
  lastModifiedDate?: Date;
  url?: string;
  status?: UploadFileStatus;
  percent?: number;
  thumbUrl?: string;
  crossOrigin?: React.ImgHTMLAttributes<HTMLImageElement>['crossOrigin'];
  originFileObj?: InternalFile;
  response?: T;
  error?: any;
  linkProps?: any;
  type?: string;
  xhr?: T;
  preview?: string;
}

export interface UploadListProps<T = any> {
  listType?: UploadListType;
  onPreview?: (file: UploadFile<T>) => void;
  onDownload?: (file: UploadFile<T>) => void;
  onRemove?: (file: UploadFile<T>) => void | boolean;
  items?: Array<UploadFile<T>>;
  progress?: UploadListProgressProps;
  prefixCls?: string;
  className?: SemanticClassName<{
    item?: string;
    icon?: string;
    name?: string;
    actions?: string;
    thumbnail?: string;
    progress?: string;
    image?: string;
  }>;
  showRemoveIcon?: boolean;
  showDownloadIcon?: boolean;
  showPreviewIcon?: boolean;
  removeIcon?: React.ReactNode | ((file: UploadFile<T>) => React.ReactNode);
  downloadIcon?: React.ReactNode | ((file: UploadFile<T>) => React.ReactNode);
  previewIcon?: React.ReactNode | ((file: UploadFile<T>) => React.ReactNode);
  extra?: React.ReactNode | ((file: UploadFile<T>) => React.ReactNode);
  locale: UploadLocale;
  previewFile?: PreviewFileHandler;
  iconRender?: (file: UploadFile<T>, listType?: UploadListType) => React.ReactNode;
  isImageUrl?: (file: UploadFile<T>) => boolean;
  appendAction?: React.ReactNode;
  appendActionVisible?: boolean;
  itemRender?: ItemRender<T>;
  /**
   * @internal Only the internal remove button is provided for use
   */
  disabled?: boolean;
}
