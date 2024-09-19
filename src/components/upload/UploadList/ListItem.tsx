import * as React from 'react';
import { ArrowDownTrayOutline, EyeOutline, XMarkOutline } from '@metisjs/icons';
import { clsx } from '../../_util/classNameUtils';
import Progress from '../../progress';
import Tooltip from '../../tooltip';
import Transition from '../../transition';
import type {
  ItemRender,
  UploadFile,
  UploadListProgressProps,
  UploadListType,
  UploadLocale,
} from '../interface';

export interface ListItemProps {
  prefixCls: string;
  className?: string;
  style?: React.CSSProperties;
  locale: UploadLocale;
  file: UploadFile;
  items: UploadFile[];
  listType?: UploadListType;
  isImgUrl?: (file: UploadFile) => boolean;
  showRemoveIcon?: boolean;
  showDownloadIcon?: boolean;
  showPreviewIcon?: boolean;
  removeIcon?: React.ReactNode | ((file: UploadFile) => React.ReactNode);
  downloadIcon?: React.ReactNode | ((file: UploadFile) => React.ReactNode);
  previewIcon?: React.ReactNode | ((file: UploadFile) => React.ReactNode);
  extra?: React.ReactNode | ((file: UploadFile) => React.ReactNode);
  iconRender: (file: UploadFile) => React.ReactNode;
  actionIconRender: (
    customIcon: React.ReactNode,
    callback: () => void,
    prefixCls: string,
    title?: string,
    acceptUploadDisabled?: boolean,
    error?: boolean,
  ) => React.ReactNode;
  itemRender?: ItemRender;
  onPreview: (file: UploadFile, e: React.SyntheticEvent<HTMLElement>) => void;
  onClose: (file: UploadFile) => void;
  onDownload: (file: UploadFile) => void;
  progress?: UploadListProgressProps;
}

const ListItem = React.forwardRef<HTMLDivElement, ListItemProps>(
  (
    {
      prefixCls,
      className,
      style,
      locale,
      listType,
      file,
      items,
      progress: progressProps,
      iconRender,
      actionIconRender,
      itemRender,
      isImgUrl,
      showPreviewIcon,
      showRemoveIcon,
      showDownloadIcon,
      previewIcon: customPreviewIcon,
      removeIcon: customRemoveIcon,
      downloadIcon: customDownloadIcon,
      extra: customExtra,
      onPreview,
      onDownload,
      onClose,
    },
    ref,
  ) => {
    // Status: which will ignore `removed` status
    const { status } = file;
    const [mergedStatus, setMergedStatus] = React.useState(status);
    React.useEffect(() => {
      if (status !== 'removed') {
        setMergedStatus(status);
      }
    }, [status]);

    // Delay to show the progress bar
    const [showProgress, setShowProgress] = React.useState(false);
    React.useEffect(() => {
      const timer = setTimeout(() => {
        setShowProgress(true);
      }, 300);
      return () => {
        clearTimeout(timer);
      };
    }, []);

    const isPictureType =
      listType === 'picture' || listType === 'picture-card' || listType === 'picture-circle';

    const containerCls = clsx(`${prefixCls}-list-item-container`, className);
    const itemCls = clsx(
      `${prefixCls}-list-item`,
      `${prefixCls}-list-item-${mergedStatus}`,
      'group/item',
      'relative mt-2 flex h-6 items-center rounded-sm hover:bg-fill-quaternary',
      isPictureType && [
        'relative h-16 rounded-lg border border-border-secondary p-2',
        {
          'border-dashed': mergedStatus === 'uploading',
        },
      ],
      mergedStatus === 'error' && 'text-error',
    );
    const itemIconCls = clsx(`${prefixCls}-icon`, 'inline-flex items-center');
    const itemNameCls = clsx(
      `${prefixCls}-list-item-name`,
      'flex-auto truncate px-2 leading-6',
      mergedStatus === 'error' && '!text-error',
    );
    const itemProgressCls = clsx(
      `${prefixCls}-list-item-progress`,
      'pointer-events-none absolute -bottom-2 w-full ps-6',
    );
    const itemActionsCls = clsx(
      `${prefixCls}-list-item-actions`,
      'inline-flex items-center whitespace-nowrap',
    );
    const itemExtraCls = clsx(`${prefixCls}-list-item-extra`);
    const itemThumbnailCls = clsx(
      `${prefixCls}-list-item-thumbnail`,
      {
        [`${prefixCls}-list-item-file`]: mergedStatus !== 'uploading' || !isImgUrl?.(file),
      },
      'h-full overflow-hidden rounded',
    );
    const itemImageCls = clsx(`${prefixCls}-list-item-image`, 'block h-full w-full');

    const iconNode = iconRender(file);
    let icon = <div className={itemIconCls}>{iconNode}</div>;
    if (isPictureType) {
      if (mergedStatus === 'uploading' || (!file.thumbUrl && !file.url)) {
        icon = <div className={itemThumbnailCls}>{iconNode}</div>;
      } else {
        const thumbnail = isImgUrl?.(file) ? (
          <img
            src={file.thumbUrl || file.url}
            alt={file.name}
            className={itemImageCls}
            crossOrigin={file.crossOrigin}
          />
        ) : (
          iconNode
        );
        icon = (
          <a
            className={itemThumbnailCls}
            onClick={(e) => onPreview(file, e)}
            href={file.url || file.thumbUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            {thumbnail}
          </a>
        );
      }
    }

    const linkProps =
      typeof file.linkProps === 'string' ? JSON.parse(file.linkProps) : file.linkProps;

    const removeIcon = showRemoveIcon
      ? actionIconRender(
          (typeof customRemoveIcon === 'function' ? customRemoveIcon(file) : customRemoveIcon) || (
            <XMarkOutline />
          ),
          () => onClose(file),
          prefixCls,
          locale.removeFile,
          // acceptUploadDisabled is true, only remove icon will follow Upload disabled prop
          true,
          mergedStatus === 'error',
        )
      : null;

    const downloadIcon =
      showDownloadIcon && mergedStatus === 'done'
        ? actionIconRender(
            (typeof customDownloadIcon === 'function'
              ? customDownloadIcon(file)
              : customDownloadIcon) || <ArrowDownTrayOutline />,
            () => onDownload(file),
            prefixCls,
            locale.downloadFile,
          )
        : null;
    const downloadOrDelete = listType !== 'picture-card' && listType !== 'picture-circle' && (
      <span key="download-delete" className={itemActionsCls}>
        {downloadIcon}
        {removeIcon}
      </span>
    );

    const extraContent = typeof customExtra === 'function' ? customExtra(file) : customExtra;
    const extra = extraContent && <span className={itemExtraCls}>{extraContent}</span>;

    const fileName = file.url ? (
      <a
        key="view"
        target="_blank"
        rel="noopener noreferrer"
        className={itemNameCls}
        title={file.name}
        {...linkProps}
        href={file.url}
        onClick={(e) => onPreview(file, e)}
      >
        {file.name}
        {extra}
      </a>
    ) : (
      <span
        key="view"
        className={itemNameCls}
        onClick={(e) => onPreview(file, e)}
        title={file.name}
      >
        {file.name}
        {extra}
      </span>
    );

    const previewIcon =
      showPreviewIcon && (file.url || file.thumbUrl) ? (
        <a
          href={file.url || file.thumbUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => onPreview(file, e)}
          title={locale.previewFile}
        >
          {typeof customPreviewIcon === 'function'
            ? customPreviewIcon(file)
            : customPreviewIcon || <EyeOutline />}
        </a>
      ) : null;

    const pictureCardActions = (listType === 'picture-card' || listType === 'picture-circle') &&
      mergedStatus !== 'uploading' && (
        <span className={itemActionsCls}>
          {previewIcon}
          {mergedStatus === 'done' && downloadIcon}
          {removeIcon}
        </span>
      );

    const dom = (
      <div className={itemCls}>
        {icon}
        {fileName}
        {downloadOrDelete}
        {pictureCardActions}
        {showProgress && (
          <Transition visible={mergedStatus === 'uploading'} deadline={2000}>
            {({ className: transitionCls }) => {
              // show loading icon if upload progress listener is disabled
              const loadingProgress =
                'percent' in file ? (
                  <Progress
                    {...progressProps}
                    type="line"
                    percent={file.percent}
                    aria-label={file['aria-label']}
                    aria-labelledby={file['aria-labelledby']}
                  />
                ) : null;

              return <div className={clsx(itemProgressCls, transitionCls)}>{loadingProgress}</div>;
            }}
          </Transition>
        )}
      </div>
    );

    const message =
      file.response && typeof file.response === 'string'
        ? file.response
        : file.error?.statusText || file.error?.message || locale.uploadError;
    const item =
      mergedStatus === 'error' ? (
        <Tooltip title={message} getPopupContainer={(node) => node.parentNode as HTMLElement}>
          {dom}
        </Tooltip>
      ) : (
        dom
      );

    return (
      <div className={containerCls} style={style} ref={ref}>
        {itemRender
          ? itemRender(item, file, items, {
              download: onDownload.bind(null, file),
              preview: onPreview.bind(null, file) as any,
              remove: onClose.bind(null, file),
            })
          : item}
      </div>
    );
  },
);

export default ListItem;
