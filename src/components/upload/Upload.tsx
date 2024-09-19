import type { ReactNode } from 'react';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { flushSync } from 'react-dom';
import { useMergedState } from 'rc-util';
import pickAttrs from 'rc-util/lib/pickAttrs';
import { clsx, getSemanticCls } from '../_util/classNameUtils';
import useIsMounted from '../_util/hooks/useIsMounted';
import { devUseWarning } from '../_util/warning';
import { ConfigContext } from '../config-provider';
import DisabledContext from '../config-provider/DisabledContext';
import { useLocale } from '../locale';
import type {
  BeforeUploadFileType,
  InternalFile,
  ShowUploadListInterface,
  UploadChangeParam,
  UploadFile,
  UploadProgressEvent,
  UploadProps,
  UploadRequestError,
} from './interface';
import defaultRequest from './request';
import UploadList from './UploadList';
import {
  attrAccept,
  file2Obj,
  fillUid,
  getFileItem,
  removeFileItem,
  traverseFileTree,
  updateFileList,
} from './util';

export const LIST_IGNORE = `__LIST_IGNORE_${Date.now()}__`;

interface ParsedFileInfo {
  origin: InternalFile;
  action?: string;
  data?: Record<string, unknown>;
  parsedFile?: InternalFile;
}

const Upload: React.FC<UploadProps> = (props) => {
  const {
    name,
    fileList,
    defaultFileList,
    onRemove,
    showUploadList = true,
    listType = 'text',
    onPreview,
    onDownload,
    onChange,
    onDrop,
    previewFile,
    disabled: customizeDisabled,
    locale: customizeLocale,
    iconRender,
    isImageUrl,
    progress,
    prefixCls: customizePrefixCls,
    className,
    type = 'select',
    children,
    style,
    itemRender,
    maxCount,
    data = {},
    multiple = false,
    hasControlInside = true,
    action = '',
    accept = '',
    customRequest,
    beforeUpload,
    headers,
    withCredentials,
    method,
    directory,
    capture,
    id,
  } = props;

  const { getPrefixCls } = useContext(ConfigContext);
  const prefixCls = getPrefixCls('upload', customizePrefixCls);
  const semanticCls = getSemanticCls(className);

  // ======================== Refs ========================
  const fileInputRef = useRef<HTMLInputElement>(null);

  const reqMap = useRef(
    new Map<
      string,
      {
        abort: () => void;
      }
    >(),
  );

  // ======================== States ========================
  const isMounted = useIsMounted();
  const [inputKey, setInputKey] = useState(0);
  const [mergedFileList, setMergedFileList] = useMergedState(defaultFileList || [], {
    value: fileList,
    postState: (list) => list ?? [],
  });
  const [dragState, setDragState] = React.useState<string>('drop');

  // ======================== Warning ========================
  if (process.env.NODE_ENV !== 'production') {
    const warning = devUseWarning('Upload');

    warning(
      'fileList' in props || !('value' in props),
      'usage',
      '`value` is not a valid prop, do you mean `fileList`?',
    );
  }

  // Control mode will auto fill file uid if not provided
  React.useMemo(() => {
    (fileList || []).forEach((file) => {
      if (!file.uid && !Object.isFrozen(file)) {
        fillUid(file as InternalFile);
      }
    });
  }, [fileList]);

  const abort = (file?: UploadFile | string) => {
    if (file) {
      const uid = typeof file === 'string' ? file : file.uid;
      reqMap.current.get(uid)?.abort();
      reqMap.current.delete(uid);
    } else {
      reqMap.current.forEach((req) => req.abort());
      reqMap.current.clear();
    }
  };

  // ======================== Effect ========================
  useEffect(() => abort, []);

  // ===================== Disabled =====================
  const disabled = React.useContext(DisabledContext);
  const mergedDisabled = customizeDisabled ?? disabled;

  const mergedId = children && !mergedDisabled ? id : undefined;

  // ===================== Locale =====================
  const [contextLocale] = useLocale('Upload');
  const local = { ...contextLocale, ...customizeLocale };

  // ===================== Icons =====================
  const {
    showRemoveIcon,
    showPreviewIcon,
    showDownloadIcon,
    removeIcon,
    previewIcon,
    downloadIcon,
    extra,
  } = typeof showUploadList === 'boolean' ? ({} as ShowUploadListInterface) : showUploadList;

  // use showRemoveIcon if it is specified explicitly
  const realShowRemoveIcon =
    typeof showRemoveIcon === 'undefined' ? !mergedDisabled : !!showRemoveIcon;

  // ======================== Event ========================
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

        if (transformedFile !== false) {
          // Hack for LIST_IGNORE, we add additional info to remove from the list
          delete (file as any)[LIST_IGNORE];
          if ((transformedFile as any) === LIST_IGNORE) {
            Object.defineProperty(file, LIST_IGNORE, {
              value: true,
              configurable: true,
            });
            transformedFile = false;
          }
        }
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

  const onInternalChange = (
    file: UploadFile,
    changedFileList: UploadFile[],
    event?: UploadProgressEvent,
  ) => {
    let cloneList = [...changedFileList];

    let exceedMaxCount = false;

    // Cut to match count
    if (maxCount === 1) {
      cloneList = cloneList.slice(-1);
    } else if (maxCount) {
      exceedMaxCount = cloneList.length > maxCount;
      cloneList = cloneList.slice(0, maxCount);
    }

    // Prevent React18 auto batch since input[upload] trigger process at same time
    // which makes fileList closure problem
    flushSync(() => {
      setMergedFileList(cloneList);
    });

    const changeInfo: UploadChangeParam<UploadFile> = {
      file: file as UploadFile,
      fileList: cloneList,
    };

    if (event) {
      changeInfo.event = event;
    }

    if (
      !exceedMaxCount ||
      file.status === 'removed' ||
      // We should ignore event if current file is exceed `maxCount`
      cloneList.some((f) => f.uid === file.uid)
    ) {
      flushSync(() => {
        onChange?.(changeInfo);
      });
    }
  };

  const onBatchStart = (
    batchFileInfoList: { file: InternalFile; parsedFile: Exclude<BeforeUploadFileType, boolean> }[],
  ) => {
    // Skip file which marked as `LIST_IGNORE`, these file will not add to file list
    const filteredFileInfoList = batchFileInfoList.filter(
      (info) => !(info.file as any)[LIST_IGNORE],
    );

    // Nothing to do since no file need upload
    if (!filteredFileInfoList.length) {
      return;
    }

    const objectFileList = filteredFileInfoList.map((info) => file2Obj(info.file));

    // Concat new files with prev files
    let newFileList = [...mergedFileList];

    objectFileList.forEach((fileObj) => {
      // Replace file if exist
      newFileList = updateFileList(fileObj, newFileList);
    });

    objectFileList.forEach((fileObj, index) => {
      // Repeat trigger `onChange` event for compatible
      let triggerFileObj: UploadFile = fileObj;

      if (!filteredFileInfoList[index].parsedFile) {
        // `beforeUpload` return false
        const { originFileObj } = fileObj;
        let clone: UploadFile;

        try {
          clone = new File([originFileObj], originFileObj.name, {
            type: originFileObj.type,
          }) as any as UploadFile;
        } catch {
          clone = new Blob([originFileObj], {
            type: originFileObj.type,
          }) as any as UploadFile;
          clone.name = originFileObj.name;
          clone.lastModifiedDate = new Date();
          clone.lastModified = new Date().getTime();
        }

        clone.uid = fileObj.uid;
        triggerFileObj = clone;
      } else {
        // Inject `uploading` status
        fileObj.status = 'uploading';
      }

      onInternalChange(triggerFileObj, newFileList);
    });
  };

  const onSuccess = (response: any, file: InternalFile, xhr: any) => {
    let resp: any = response;
    try {
      if (typeof response === 'string') {
        resp = JSON.parse(response);
      }
    } catch {
      /* do nothing */
    }

    // removed
    if (!getFileItem(file, mergedFileList)) {
      return;
    }

    const targetItem = file2Obj(file);
    targetItem.status = 'done';
    targetItem.percent = 100;
    targetItem.response = resp;
    targetItem.xhr = xhr;

    const nextFileList = updateFileList(targetItem, mergedFileList);

    onInternalChange(targetItem, nextFileList);
  };

  const onProgress = (e: UploadProgressEvent, file: InternalFile) => {
    // removed
    if (!getFileItem(file, mergedFileList)) {
      return;
    }

    const targetItem = file2Obj(file);
    targetItem.status = 'uploading';
    targetItem.percent = e.percent;

    const nextFileList = updateFileList(targetItem, mergedFileList);

    onInternalChange(targetItem, nextFileList, e);
  };

  const onError = (error: Error, response: any, file: InternalFile) => {
    // removed
    if (!getFileItem(file, mergedFileList)) {
      return;
    }

    const targetItem = file2Obj(file);
    targetItem.error = error;
    targetItem.response = response;
    targetItem.status = 'error';

    const nextFileList = updateFileList(targetItem, mergedFileList);

    onInternalChange(targetItem, nextFileList);
  };

  const post = ({ data, origin, action, parsedFile }: Required<ParsedFileInfo>) => {
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
      onProgress: (e: UploadProgressEvent) => onProgress(e, parsedFile),
      onSuccess: (ret: any, xhr: XMLHttpRequest) => onSuccess(ret, parsedFile, xhr),
      onError: (err: UploadRequestError, ret: any) => onError(err, ret, parsedFile),
    };

    reqMap.current.set(uid, request(requestOption));
  };

  const uploadFiles = (files: InternalFile[]) => {
    const originFiles = [...files];
    const postFiles = files.map((file) => processFile(file, originFiles));

    // Batch upload files
    Promise.all(postFiles).then((fileList) => {
      onBatchStart(fileList.map(({ origin, parsedFile }) => ({ file: origin, parsedFile })));

      fileList.filter((file) => file.parsedFile).forEach(post);
    });
  };

  const onInputClick = (
    event: React.MouseEvent<HTMLSpanElement> | React.KeyboardEvent<HTMLSpanElement>,
  ) => {
    const el = fileInputRef.current;
    if (!el || mergedDisabled) {
      return;
    }

    const target = event.target as HTMLElement;

    if (target && target.tagName === 'BUTTON') {
      const parent = el.parentNode as HTMLInputElement;
      parent.focus();
      target.blur();
    }
    el.click();
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter') {
      onInputClick(e);
    }
  };

  const onFileDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();

    if (mergedDisabled) {
      return;
    }

    setDragState(e.type);

    if (e.type === 'drop') {
      if (directory) {
        const files = await traverseFileTree(
          Array.prototype.slice.call(e.dataTransfer.items),
          (_file) => attrAccept(_file, accept),
        );
        uploadFiles(files);
      } else {
        let files = [...(e.dataTransfer.files as unknown as File[])]
          .map(fillUid)
          .filter((file) => attrAccept(file, accept));

        if (!multiple) {
          files = files.slice(0, 1);
        }

        uploadFiles(files);
      }

      onDrop?.(e);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;
    const acceptedFiles = [...(files as unknown as File[])]
      .map(fillUid)
      .filter((file: InternalFile) => !directory || attrAccept(file, accept));
    uploadFiles(acceptedFiles);
    setInputKey((origin) => origin + 1);
  };

  const handleRemove = (file: UploadFile) => {
    let currentFile: UploadFile;
    Promise.resolve(typeof onRemove === 'function' ? onRemove(file) : onRemove).then((ret) => {
      // Prevent removing file
      if (ret === false) {
        return;
      }

      const removedFileList = removeFileItem(file, mergedFileList);

      if (removedFileList) {
        currentFile = { ...file, status: 'removed' };
        mergedFileList?.forEach((item) => {
          const matchKey = currentFile.uid !== undefined ? 'uid' : 'name';
          if (item[matchKey] === currentFile[matchKey] && !Object.isFrozen(item)) {
            item.status = 'removed';
          }
        });
        abort(currentFile);

        onInternalChange(currentFile, removedFileList);
      }
    });
  };

  // ======================== Style ========================
  const rootCls = clsx(
    `${prefixCls}-wrapper`,
    {
      [`${prefixCls}-picture-card-wrapper`]: listType === 'picture-card',
      [`${prefixCls}-picture-circle-wrapper`]: listType === 'picture-circle',
    },
    semanticCls.root,
  );
  const uploadButtonCls = clsx(
    prefixCls,
    `${prefixCls}-select`,
    {
      [`${prefixCls}-disabled`]: mergedDisabled,
    },
    'inline-block',
    {
      'h-24 w-24 cursor-pointer rounded-lg border border-dashed border-border-secondary bg-fill-quinary text-center align-top transition-colors':
        listType === 'picture-card' || listType === 'picture-circle',
      'rounded-full': listType === 'picture-circle',
      'hover:border-primary':
        (listType === 'picture-card' || listType === 'picture-circle') && !mergedDisabled,
    },
    mergedDisabled && 'cursor-not-allowed text-text-tertiary',
  );
  const inputCls = clsx('hidden cursor-pointer', semanticCls.input);
  const inputWrapCls = clsx(
    {
      'flex h-full items-center justify-center':
        listType === 'picture-card' || listType === 'picture-circle',
    },
    mergedDisabled && 'cursor-not-allowed text-text-tertiary',
  );

  // ======================== Render ========================
  const renderUploader = (child: ReactNode) => (
    <span
      tabIndex={mergedDisabled || hasControlInside ? undefined : 0}
      className={inputWrapCls}
      role={hasControlInside ? undefined : 'button'}
      style={style}
      onClick={onInputClick}
      onKeyDown={onKeyDown}
    >
      <input
        {...pickAttrs(props, { aria: true, data: true })}
        id={mergedId}
        name={name}
        disabled={mergedDisabled}
        type="file"
        ref={fileInputRef}
        onClick={(e) => e.stopPropagation()}
        key={inputKey}
        className={inputCls}
        accept={accept}
        multiple={multiple}
        onChange={handleInputChange}
        capture={capture}
        {...(directory ? { directory: 'directory', webkitdirectory: 'webkitdirectory' } : {})}
      />
      {child}
    </span>
  );
  const renderUploadList = (button?: React.ReactNode, buttonVisible?: boolean) => {
    if (!showUploadList) {
      return button;
    }
    return (
      <UploadList
        prefixCls={prefixCls}
        listType={listType}
        items={mergedFileList}
        previewFile={previewFile}
        onPreview={onPreview}
        onDownload={onDownload}
        onRemove={handleRemove}
        showRemoveIcon={realShowRemoveIcon}
        showPreviewIcon={showPreviewIcon}
        showDownloadIcon={showDownloadIcon}
        removeIcon={removeIcon}
        previewIcon={previewIcon}
        downloadIcon={downloadIcon}
        iconRender={iconRender}
        extra={extra}
        locale={local}
        isImageUrl={isImageUrl}
        progress={progress}
        appendAction={button}
        appendActionVisible={buttonVisible}
        itemRender={itemRender}
        disabled={mergedDisabled}
      />
    );
  };

  if (type === 'drag') {
    const dragCls = clsx(prefixCls, `${prefixCls}-drag`, {
      [`${prefixCls}-drag-uploading`]: mergedFileList.some((file) => file.status === 'uploading'),
      [`${prefixCls}-drag-hover`]: dragState === 'dragover',
      [`${prefixCls}-disabled`]: mergedDisabled,
    });

    return (
      <div className={rootCls}>
        <div
          className={dragCls}
          style={style}
          onDrop={onFileDrop}
          onDragOver={onFileDrop}
          onDragLeave={onFileDrop}
        >
          {renderUploader(<div className={`${prefixCls}-drag-container`}>{children}</div>)}
        </div>
        {renderUploadList()}
      </div>
    );
  }

  const uploadButton = (
    <div className={uploadButtonCls} style={children ? undefined : { display: 'none' }}>
      {renderUploader(children)}
    </div>
  );

  if (listType === 'picture-card' || listType === 'picture-circle') {
    return <div className={rootCls}>{renderUploadList(uploadButton, !!children)}</div>;
  }

  return (
    <div className={rootCls}>
      {uploadButton}
      {renderUploadList()}
    </div>
  );
};

if (process.env.NODE_ENV !== 'production') {
  Upload.displayName = 'Upload';
}

export default Upload;
