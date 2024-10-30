import * as React from 'react';
import { ArrowDownTrayOutline, EyeOutline, TrashOutline } from '@metisjs/icons';
import { clsx } from '../../_util/classNameUtils';
import useSemanticCls from '../../_util/hooks/useSemanticCls';
import Progress from '../../progress';
import Tooltip from '../../tooltip';
import Transition from '../../transition';
import type {
  ItemRender,
  UploadFile,
  UploadListProgressProps,
  UploadListProps,
  UploadListType,
  UploadLocale,
} from '../interface';

export interface ListItemProps {
  prefixCls: string;
  className?: UploadListProps['className'];
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
    callback: (e: React.MouseEvent<HTMLElement>) => void,
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
    const semanticCls = useSemanticCls(className);

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

    const containerCls = clsx(`${prefixCls}-list-item-container`, semanticCls.root);

    const itemCls = clsx(
      `${prefixCls}-list-item`,
      `${prefixCls}-list-item-${mergedStatus}`,
      'group/item',
      'relative mt-2 flex h-6 items-center rounded-sm hover:bg-fill-quaternary',
      {
        'relative h-16 rounded-lg border border-border-secondary p-[0.4375rem] hover:bg-transparent':
          listType === 'picture',
        'mt-0 h-28 w-28 flex-col justify-center rounded-lg border border-border-secondary bg-transparent p-[0.4375rem] before:absolute before:inset-[0.4375rem] before:z-[1] before:rounded before:bg-mask before:opacity-0 before:transition-opacity hover:bg-transparent':
          listType === 'picture-card' || listType === 'picture-circle',
        'bg-fill-quinary hover:bg-fill-quinary':
          (listType === 'picture-card' || listType === 'picture-circle') &&
          mergedStatus === 'uploading',
        'hover:before:opacity-100':
          (listType === 'picture-card' || listType === 'picture-circle') &&
          mergedStatus !== 'uploading',
        'rounded-full before:rounded-full': listType === 'picture-circle',
      },
      {
        'border-dashed': mergedStatus === 'uploading',
        'border-error-border-secondary text-error': mergedStatus === 'error',
      },
      semanticCls.item,
    );

    const itemIconCls = clsx(`${prefixCls}-icon`, 'inline-flex items-center', semanticCls.icon);

    const needShowName =
      (listType !== 'picture-card' && listType !== 'picture-circle') ||
      (((!file.thumbUrl && !file.url) || !isImgUrl?.(file)) && mergedStatus !== 'uploading');

    const itemNameCls = clsx(
      `${prefixCls}-list-item-name`,
      'hidden flex-auto truncate px-2 leading-6',
      {
        '!text-error': mergedStatus === 'error',
        'mb-3': mergedStatus === 'uploading' && listType === 'picture',
        'mt-1 flex-none': listType === 'picture-card' || listType === 'picture-circle',
      },
      needShowName && 'block',
      semanticCls.name,
    );

    const itemProgressCls = clsx(
      `${prefixCls}-list-item-progress`,
      'pointer-events-none absolute -bottom-2 w-full ps-6',
      {
        'bottom-3 w-[calc(100%-16px)] ps-14': listType === 'picture',
        'static w-full ps-0': listType === 'picture-card' || listType === 'picture-circle',
      },
      semanticCls.progress,
    );

    const itemActionsCls = clsx(
      `${prefixCls}-list-item-actions`,
      'inline-flex items-center gap-1 whitespace-nowrap transition-opacity',
      {
        'opacity-0 group-hover/item:opacity-100': listType === 'text',
        'absolute z-10 opacity-0 *:text-white group-hover/item:opacity-100':
          listType === 'picture-card' || listType === 'picture-circle',
      },
      semanticCls.actions,
    );

    const itemExtraCls = clsx(`${prefixCls}-list-item-extra`);

    const itemThumbnailCls = clsx(
      `${prefixCls}-list-item-thumbnail`,
      {
        [`${prefixCls}-list-item-file`]: mergedStatus !== 'uploading' && !isImgUrl?.(file),
      },
      'flex h-full w-12 items-center justify-center overflow-hidden rounded text-primary',
      {
        'block w-full text-center text-text':
          listType === 'picture-card' || listType === 'picture-circle',
        'h-fit w-fit truncate':
          (listType === 'picture-card' || listType === 'picture-circle') &&
          (mergedStatus === 'uploading' || needShowName),
        'rounded-full': listType === 'picture-circle',
      },
      { 'text-error': mergedStatus === 'error' },
      semanticCls.thumbnail,
    );

    const itemImageCls = clsx(
      `${prefixCls}-list-item-image`,
      'block h-full w-full',
      semanticCls.image,
    );

    const iconNode = iconRender(file);
    let icon = <div className={itemIconCls}>{iconNode}</div>;
    if (listType === 'picture' || listType === 'picture-card' || listType === 'picture-circle') {
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
            <TrashOutline />
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
      showPreviewIcon && (file.url || file.thumbUrl)
        ? actionIconRender(
            typeof customPreviewIcon === 'function'
              ? customPreviewIcon(file)
              : customPreviewIcon || <EyeOutline />,
            (e) => onPreview(file, e),
            prefixCls,
            locale.previewFile,
          )
        : null;

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
          <Transition
            visible={mergedStatus === 'uploading'}
            enter="transition-opacity ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
            deadline={2000}
          >
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
