import * as React from 'react';
import { DocumentOutline, LoadingOutline, PaperClipOutline, PhotoOutline } from '@metisjs/icons';
import { useUpdate } from 'ahooks';
import { clsx } from '../../_util/classNameUtils';
import { cloneElement } from '../../_util/reactNode';
import { collapseTransition } from '../../_util/transition';
import type { ButtonProps } from '../../button';
import Button from '../../button';
import { ConfigContext } from '../../config-provider';
import Transition, { TransitionList, type TransitionListProps } from '../../transition';
import type { UploadFile, UploadListProps } from '../interface';
import { isImageUrl, previewImage } from '../util';
import ListItem from './ListItem';

interface UploadListRef {
  handlePreview: (file: UploadFile, e?: React.SyntheticEvent<HTMLElement>) => void;
  handleDownload: (file: UploadFile) => void;
}

const InternalUploadList: React.ForwardRefRenderFunction<UploadListRef, UploadListProps> = (
  props,
  ref,
) => {
  const {
    listType = 'text',
    previewFile = previewImage,
    onPreview,
    onDownload,
    onRemove,
    locale,
    iconRender,
    isImageUrl: isImgUrl = isImageUrl,
    prefixCls: customizePrefixCls,
    items = [],
    showPreviewIcon = true,
    showRemoveIcon = true,
    showDownloadIcon = false,
    removeIcon,
    previewIcon,
    downloadIcon,
    extra,
    progress = { size: [-1, 2], showInfo: false },
    appendAction,
    appendActionVisible = true,
    itemRender,
    disabled,
  } = props;
  const forceUpdate = useUpdate();
  const [transitionAppear, setTransitionAppear] = React.useState(false);

  // ============================= Effect =============================
  React.useEffect(() => {
    if (listType !== 'picture' && listType !== 'picture-card' && listType !== 'picture-circle') {
      return;
    }
    (items || []).forEach((file) => {
      if (
        typeof document === 'undefined' ||
        typeof window === 'undefined' ||
        !(window as any).FileReader ||
        !(window as any).File ||
        !(file.originFileObj instanceof File || (file.originFileObj as any) instanceof Blob) ||
        file.thumbUrl !== undefined
      ) {
        return;
      }
      file.thumbUrl = '';
      if (previewFile) {
        previewFile(file.originFileObj as File).then((previewDataUrl: string) => {
          // Need append '' to avoid dead loop
          file.thumbUrl = previewDataUrl || '';
          forceUpdate();
        });
      }
    });
  }, [listType, items, previewFile]);

  React.useEffect(() => {
    setTransitionAppear(true);
  }, []);

  // ============================= Events =============================
  const onInternalPreview = (file: UploadFile, e?: React.SyntheticEvent<HTMLElement>) => {
    if (!onPreview) {
      return;
    }
    e?.preventDefault();
    return onPreview(file);
  };

  const onInternalDownload = (file: UploadFile) => {
    if (typeof onDownload === 'function') {
      onDownload(file);
    } else if (file.url) {
      window.open(file.url);
    }
  };

  const onInternalClose = (file: UploadFile) => {
    onRemove?.(file);
  };

  const internalIconRender = (file: UploadFile) => {
    if (iconRender) {
      return iconRender(file, listType);
    }
    const isLoading = file.status === 'uploading';
    const fileIcon = isImgUrl?.(file) ? (
      <PhotoOutline className="h-9 w-9" />
    ) : (
      <DocumentOutline className="h-9 w-9" />
    );
    let icon: React.ReactNode = isLoading ? (
      <LoadingOutline className="h-4 w-4 animate-spin" />
    ) : (
      <PaperClipOutline className="h-4 w-4" />
    );
    if (listType === 'picture') {
      icon = isLoading ? (
        <LoadingOutline className="h-7 w-7 animate-spin text-primary" />
      ) : (
        fileIcon
      );
    } else if (listType === 'picture-card' || listType === 'picture-circle') {
      icon = isLoading ? locale.uploading : fileIcon;
    }
    return icon;
  };

  const actionIconRender = (
    customIcon: React.ReactNode,
    callback: () => void,
    prefixCls: string,
    title?: string,
    acceptUploadDisabled?: boolean,
    error?: boolean,
  ) => {
    const btnProps: ButtonProps = {
      type: listType === 'picture' ? 'text' : 'link',
      size: 'mini',
      title,
      onClick: (e: React.MouseEvent<HTMLElement>) => {
        callback();
        if (React.isValidElement(customIcon)) {
          customIcon.props.onClick?.(e);
        }
      },
      className: clsx(
        `${prefixCls}-list-item-action`,
        'mr-1 h-5 w-fit p-0 font-normal',
        {
          'hidden text-text-tertiary hover:!text-text-secondary group-hover/item:flex':
            listType === 'text',
          'px-0.5 text-text-secondary': listType === 'picture',
        },
        error && {
          'flex text-error-hover hover:enabled:!text-error': listType === 'text',
          'text-text-error hover:enabled:bg-error-bg': listType === 'picture',
        },
      ),
    };
    if (acceptUploadDisabled) {
      btnProps.disabled = disabled;
    }
    if (React.isValidElement(customIcon)) {
      const btnIcon = cloneElement(customIcon, {
        ...customIcon.props,
        onClick: () => {},
      });

      return <Button {...btnProps} icon={btnIcon} />;
    }
    return (
      <Button {...btnProps}>
        <span>{customIcon}</span>
      </Button>
    );
  };

  // ============================== Ref ===============================
  // Test needs
  React.useImperativeHandle(ref, () => ({
    handlePreview: onInternalPreview,
    handleDownload: onInternalDownload,
  }));

  const { getPrefixCls } = React.useContext(ConfigContext);

  // ============================= Render =============================
  const prefixCls = getPrefixCls('upload', customizePrefixCls);

  const listCls = clsx(`${prefixCls}-list`, `${prefixCls}-list-${listType}`, 'text-sm text-text');

  // >>> Transition config
  const transitionKeyList = [...items.map((file) => ({ key: file.uid, file }))];

  let transitionConfig: Omit<TransitionListProps, 'onVisibleChanged' | 'children'> = {
    deadline: 2000,
    keys: transitionKeyList,
    appear: transitionAppear,
  };

  if (listType !== 'picture-card' && listType !== 'picture-circle') {
    transitionConfig = {
      ...collapseTransition,
      ...transitionConfig,
    };
  }

  return (
    <div className={listCls}>
      <TransitionList {...transitionConfig} component={false}>
        {({ key, file, className: transitionCls, style: transitionStyle }) => (
          <ListItem
            key={key}
            locale={locale}
            prefixCls={prefixCls}
            className={transitionCls}
            style={transitionStyle}
            file={file}
            items={items}
            progress={progress}
            listType={listType}
            isImgUrl={isImgUrl}
            showPreviewIcon={showPreviewIcon}
            showRemoveIcon={showRemoveIcon}
            showDownloadIcon={showDownloadIcon}
            removeIcon={removeIcon}
            previewIcon={previewIcon}
            downloadIcon={downloadIcon}
            extra={extra}
            iconRender={internalIconRender}
            actionIconRender={actionIconRender}
            itemRender={itemRender}
            onPreview={onInternalPreview}
            onDownload={onInternalDownload}
            onClose={onInternalClose}
          />
        )}
      </TransitionList>

      {/* Append action */}
      {appendAction && (
        <Transition {...transitionConfig} visible={appendActionVisible} forceRender>
          {({ className: transitionCls, style: transitionStyle }) =>
            cloneElement(appendAction, (oriProps) => ({
              className: clsx(oriProps.className, transitionCls),
              style: {
                ...transitionStyle,
                // prevent the element has hover css pseudo-class that may cause animation to end prematurely.
                pointerEvents: transitionCls ? 'none' : undefined,
                ...oriProps.style,
              },
            }))
          }
        </Transition>
      )}
    </div>
  );
};

const UploadList = React.forwardRef<UploadListRef, UploadListProps>(InternalUploadList);

if (process.env.NODE_ENV !== 'production') {
  UploadList.displayName = 'UploadList';
}

export default UploadList;
