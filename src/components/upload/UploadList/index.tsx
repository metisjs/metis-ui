import * as React from 'react';
import { DocumentOutline, LoadingOutline, PaperClipOutline, PhotoOutline } from '@metisjs/icons';
import { clsx, mergeSemanticCls } from '@util/classNameUtils';
import { cloneElement } from '@util/reactNode';
import { collapseTransition } from '@util/transition';
import { useUpdate } from 'ahooks';
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
    type,
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
    className,
    itemClassName,
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
    const isLoading = file.status === 'uploading';

    if (iconRender) {
      const icon = iconRender(file, listType);
      return cloneElement(icon, (origin) => ({
        className: clsx(
          'h-9 w-9',
          {
            'h-7 w-7': isLoading,
            'h-4 w-4': listType === 'text',
          },
          origin.className,
        ),
      }));
    }

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
    callback: (e: React.MouseEvent<HTMLElement>) => void,
    prefixCls: string,
    title?: string,
    acceptUploadDisabled?: boolean,
    error?: boolean,
  ) => {
    const btnProps: ButtonProps = {
      type: listType === 'picture' ? 'text' : 'link',
      size: listType === 'picture-card' || listType === 'picture-circle' ? 'middle' : 'mini',
      title,
      onClick: (e: React.MouseEvent<HTMLElement>) => {
        callback(e);
        if (React.isValidElement(customIcon)) {
          customIcon.props.onClick?.(e);
        }
      },
      className: clsx(
        `${prefixCls}-list-item-action`,
        'h-5 w-fit p-0 font-normal focus-visible:ring-0',
        {
          'text-text-tertiary hover:!text-text-secondary': listType === 'text',
          'px-0.5 text-text-secondary': listType === 'picture',
          'text-white hover:!text-white':
            listType === 'picture-card' || listType === 'picture-circle',
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

  const listCls = clsx(
    `${prefixCls}-list`,
    `${prefixCls}-list-${listType}`,
    'text-sm text-text',
    {
      'flex flex-wrap gap-2': listType === 'picture-card' || listType === 'picture-circle',
      'mt-2': type === 'drag' && (listType === 'picture-card' || listType === 'picture-circle'),
    },
    className,
  );

  // >>> Transition config
  const transitionKeyList = [...items.map((file) => ({ key: file.uid, file }))];

  let transitionConfig: Omit<TransitionListProps, 'onVisibleChanged' | 'children'> = {
    deadline: 2000,
    keys: transitionKeyList,
    appear: transitionAppear,
    enter: 'transition-opacity ease-out duration-300',
    enterFrom: 'opacity-0',
    enterTo: 'opacity-100',
    leave: 'transition-opacity ease-in duration-200',
    leaveFrom: 'opacity-100',
    leaveTo: 'opacity-0',
  };

  if (listType !== 'picture-card' && listType !== 'picture-circle') {
    transitionConfig = {
      ...transitionConfig,
      ...collapseTransition,
      deadline: 2000,
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
            className={mergeSemanticCls(itemClassName, transitionCls)}
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
