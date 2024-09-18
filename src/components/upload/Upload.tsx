import React, { useContext, useRef } from 'react';
import pickAttrs from 'rc-util/lib/pickAttrs';
import { clsx } from '../_util/classNameUtils';
import useIsMounted from '../_util/hooks/useIsMounted';
import { ConfigContext } from '../config-provider';
import type {
  BeforeUploadFileType,
  InternalFile,
  UploadProgressEvent,
  UploadProps,
  UploadRef,
  UploadRequestError,
} from './interface';
import defaultRequest from './request';
import { attrAccept, fillUid, traverseFileTree } from './util';

interface ParsedFileInfo {
  origin: InternalFile;
  action?: string;
  data?: Record<string, unknown>;
  parsedFile?: InternalFile;
}

const InternalUpload: React.ForwardRefRenderFunction<UploadRef, UploadProps> = (props, ref) => {
  const {
    component: Component = 'span',
    prefixCls: customizePrefixCls,
    id,
    data,
    headers,
    name = 'file',
    multipart,
    directory,
    disabled,
    multiple,
    accept,
    withCredentials,
    openFileDialogOnClick = true,
    hasControlInside,
    className,
    style,
    children,
    capture,
    method,
    action,
    onStart,
    onError,
    onSuccess,
    beforeUpload,
    customRequest,
    onClick,
    onMouseEnter,
    onMouseLeave,
    onBatchStart,
    onProgress,
  } = props;

  const { getPrefixCls } = useContext(ConfigContext);
  const prefixCls = getPrefixCls('upload', customizePrefixCls);

  // ======================== Refs ========================
  const fileInput = useRef<HTMLInputElement>(null);

  // ======================== States ========================
  const isMounted = useIsMounted();

  /**
   * Process file before upload. When all the file is ready, we start upload.
   */
  const processFile = async (
    file: InternalFile,
    fileList: InternalFile[],
  ): Promise<ParsedFileInfo> => {
    let transformedFile: BeforeUploadFileType | void = file;
    if (beforeUpload) {
      try {
        transformedFile = await beforeUpload(file, fileList);
      } catch (e) {
        // Rejection will also trade as false
        transformedFile = false;
      }
      if (transformedFile === false) {
        return {
          origin: file,
        };
      }
    }

    let mergedAction: string | undefined;
    if (typeof action === 'function') {
      mergedAction = await action(file);
    } else {
      mergedAction = action;
    }

    let mergedData: Record<string, unknown> | undefined;
    if (typeof data === 'function') {
      mergedData = await data(file);
    } else {
      mergedData = data;
    }

    const parsedData =
      (typeof transformedFile === 'object' || typeof transformedFile === 'string') &&
      transformedFile
        ? transformedFile
        : file;

    let parsedFile: File;
    if (parsedData instanceof File) {
      parsedFile = parsedData;
    } else {
      parsedFile = new File([parsedData], file.name, { type: file.type });
    }

    const mergedParsedFile: InternalFile = parsedFile as InternalFile;
    mergedParsedFile.uid = file.uid;

    return {
      origin: file,
      data: mergedData,
      parsedFile: mergedParsedFile,
      action: mergedAction,
    };
  };

  const post = ({ data, origin, action, parsedFile }: ParsedFileInfo) => {
    if (!isMounted) {
      return;
    }

    const { uid } = origin;
    const request = customRequest || defaultRequest;

    const requestOption = {
      action,
      filename: name,
      data,
      file: parsedFile,
      headers,
      withCredentials,
      method: method || 'post',
      onProgress: (e: UploadProgressEvent) => {
        onProgress?.(e, parsedFile);
      },
      onSuccess: (ret: any, xhr: XMLHttpRequest) => {
        const { onSuccess } = this.props;
        onSuccess?.(ret, parsedFile, xhr);

        delete this.reqs[uid];
      },
      onError: (err: UploadRequestError, ret: any) => {
        const { onError } = this.props;
        onError?.(err, ret, parsedFile);

        delete this.reqs[uid];
      },
    };

    onStart?.(origin);
    this.reqs[uid] = request(requestOption);
  };

  // ======================== Event ========================
  const uploadFiles = (files: InternalFile[]) => {
    const originFiles = [...files];
    const postFiles = files.map((file) => processFile(file, originFiles));

    // Batch upload files
    Promise.all(postFiles).then((fileList) => {
      onBatchStart?.(fileList.map(({ origin, parsedFile }) => ({ file: origin, parsedFile })));

      fileList.filter((file) => file.parsedFile !== null).forEach(post);
    });
  };

  const handleClick = (
    event: React.MouseEvent<HTMLDivElement> | React.KeyboardEvent<HTMLDivElement>,
  ) => {
    const el = fileInput.current;
    if (!el || !openFileDialogOnClick || disabled) {
      return;
    }

    const target = event.target as HTMLElement;

    if (target && target.tagName === 'BUTTON') {
      const parent = el.parentNode as HTMLInputElement;
      parent.focus();
      target.blur();
    }
    el.click();
    onClick?.(event);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter') {
      handleClick(e);
    }
  };

  const handleFileDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();

    if (disabled || e.type === 'dragover') {
      return;
    }

    if (directory) {
      const files = await traverseFileTree(
        Array.prototype.slice.call(e.dataTransfer.items),
        (_file) => attrAccept(_file, accept),
      );
      uploadFiles(files);
    } else {
      let files = [...(e.dataTransfer.files as any)]
        .map(fillUid)
        .filter((file) => attrAccept(file, accept));

      if (!multiple) {
        files = files.slice(0, 1);
      }

      uploadFiles(files);
    }
  };
  // ======================== Style ========================
  const rootCls = clsx(prefixCls, { [`${prefixCls}-disabled`]: disabled });

  // ======================== Render ========================
  return (
    <Component
      tabIndex={disabled || hasControlInside ? undefined : '0'}
      className={rootCls}
      role={hasControlInside ? undefined : 'button'}
      style={style}
      onClick={handleClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onKeyDown={handleKeyDown}
      onDrop={handleFileDrop}
    >
      <input
        {...pickAttrs(props, { aria: true, data: true })}
        id={id}
        /**
         * https://github.com/ant-design/ant-design/issues/50643,
         * https://github.com/react-component/upload/pull/575#issuecomment-2320646552
         */
        name={name}
        disabled={disabled}
        type="file"
        ref={this.saveFileInput}
        onClick={(e) => e.stopPropagation()} // https://github.com/ant-design/ant-design/issues/19948
        key={this.state.uid}
        style={{ display: 'none', ...styles.input }}
        className={classNames.input}
        accept={accept}
        {...dirProps}
        multiple={multiple}
        onChange={this.onChange}
        {...(capture !== null ? { capture } : {})}
      />
      {children}
    </Component>
  );
};

const Upload = React.forwardRef<UploadRef, UploadProps>(InternalUpload);

if (process.env.NODE_ENV !== 'production') {
  Upload.displayName = 'Upload';
}

export default Upload;
