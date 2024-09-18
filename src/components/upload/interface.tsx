import type * as React from 'react';
import type { SemanticClassName } from '../_util/classNameUtils';
import type { ProgressAriaProps } from '../progress';

export type UploadFileStatus = 'error' | 'done' | 'uploading' | 'removed';

export type BeforeUploadFileType = InternalFile | Blob | boolean | string;

export type Action = string | ((file: InternalFile) => string | PromiseLike<string>);

export interface UploadProps
  extends Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    'className' | 'onError' | 'onProgress'
  > {
  name?: string;
  style?: React.CSSProperties;
  className?: SemanticClassName<'input'>;
  disabled?: boolean;
  component?: React.ComponentType<any> | string;
  action?: Action;
  method?: UploadRequestMethod;
  directory?: boolean;
  data?:
    | Record<string, unknown>
    | ((file: InternalFile | string | Blob) => Record<string, unknown>);
  headers?: UploadRequestHeader;
  accept?: string;
  multiple?: boolean;
  onBatchStart?: (
    fileList: { file: InternalFile; parsedFile: Exclude<BeforeUploadFileType, boolean> }[],
  ) => void;
  onStart?: (file: InternalFile) => void;
  onError?: (error: Error, ret: Record<string, unknown>, file: InternalFile) => void;
  onSuccess?: (response: Record<string, unknown>, file: InternalFile, xhr: XMLHttpRequest) => void;
  onProgress?: (event: UploadProgressEvent, file: InternalFile) => void;
  beforeUpload?: (
    file: InternalFile,
    FileList: InternalFile[],
  ) => BeforeUploadFileType | Promise<void | BeforeUploadFileType> | void;
  customRequest?: (option: UploadRequestOption) => { abort: () => void };
  withCredentials?: boolean;
  openFileDialogOnClick?: boolean;
  prefixCls?: string;
  id?: string;
  onMouseEnter?: (e: React.MouseEvent<HTMLDivElement>) => void;
  onMouseLeave?: (e: React.MouseEvent<HTMLDivElement>) => void;
  onClick?: (e: React.MouseEvent<HTMLDivElement> | React.KeyboardEvent<HTMLDivElement>) => void;
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

export interface UploadRef<T = any> {
  onBatchStart: UploadProps['onBatchStart'];
  onSuccess: (response: any, file: InternalFile, xhr: any) => void;
  onProgress: (e: { percent: number }, file: InternalFile) => void;
  onError: (error: Error, response: any, file: InternalFile) => void;
  fileList: UploadFile<T>[];
  nativeElement: HTMLSpanElement | null;
}
