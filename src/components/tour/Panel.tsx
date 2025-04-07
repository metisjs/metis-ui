import type { ReactNode } from 'react';
import React from 'react';
import { clsx, mergeSemanticCls } from '@util/classNameUtils';
import useClosable from '@util/hooks/useClosable';
import useSemanticCls from '@util/hooks/useSemanticCls';
import Button from '../button';
import { useLocale } from '../locale';
import type { TourProps, TourStepInfo } from './interface';

function isValidNode(node: ReactNode): boolean {
  return node !== undefined && node !== null;
}

interface TourPanelProps extends TourStepInfo {
  prefixCls: string;
  total?: number;
  current: number;
  indicatorsRender?: TourProps['indicatorsRender'];
  onClose?: () => void;
  onFinish?: () => void;
  onPrev?: () => void;
  onNext?: () => void;
}

const TourPanel: React.FC<TourPanelProps> = (props) => {
  const {
    prefixCls,
    className,
    total = 1,
    title,
    onClose,
    onPrev,
    onNext,
    onFinish,
    cover,
    description,
    nextButtonProps,
    prevButtonProps,
    closable,
    current,
    indicatorsRender,
  } = props;

  const [isClosable, closeIcon, closeAriaProps] = useClosable(closable);

  const isLastStep = current === total - 1;

  const prevBtnClick = () => {
    onPrev?.();
  };

  const nextBtnClick = () => {
    if (isLastStep) {
      onFinish?.();
    } else {
      onNext?.();
    }
  };

  const semanticCls = useSemanticCls(className);

  const rootCls = clsx(`${prefixCls}-content`, 'relative');

  const innerCls = clsx(
    `${prefixCls}-inner`,
    'ring-border-secondary rounded-md bg-(--metis-arrow-background-color) text-start text-sm shadow-lg ring-1 backdrop-blur-2xl',
    semanticCls.content,
  );

  const closeCls = clsx(
    `${prefixCls}-close`,
    'text-text-tertiary hover:bg-fill-tertiary hover:text-text-secondary absolute top-2.5 right-2.5 inline-flex h-6 w-6 items-center justify-center rounded-sm text-lg',
    semanticCls.close,
  );

  const coverCls = clsx(
    `${prefixCls}-cover`,
    'px-4 pt-4',
    {
      'pt-10': isClosable,
    },
    semanticCls.cover,
  );

  const titleCls = clsx(
    `${prefixCls}-title`,
    'mb-1 w-full truncate px-4 pt-4 font-semibold',
    {
      'pe-6': isClosable && !cover,
    },
    semanticCls.title,
  );

  const descCls = clsx(
    `${prefixCls}-description`,
    'mb-1 px-4',
    {
      'pt-4': !title,
      'pe-6': !title && isClosable && !cover,
    },
    semanticCls.description,
  );

  const footerCls = clsx(`${prefixCls}-footer`, 'flex items-center p-4 pt-2', semanticCls.footer);

  const buttonsCls = clsx(`${prefixCls}-buttons`, 'ml-auto space-x-2');

  const indicatorsCls = clsx(
    `${prefixCls}-indicators`,
    'mr-6 inline-flex items-center gap-1.5',
    semanticCls.indicators,
  );

  const closeNode = isClosable ? (
    <button type="button" onClick={onClose} className={closeCls} {...closeAriaProps}>
      {closeIcon}
    </button>
  ) : null;

  const titleNode = isValidNode(title) ? <div className={titleCls}>{title}</div> : null;

  const descriptionNode = isValidNode(description) ? (
    <div className={descCls}>{description}</div>
  ) : null;

  const coverNode = isValidNode(cover) ? <div className={coverCls}>{cover}</div> : null;

  let mergedIndicatorNode: ReactNode;

  if (indicatorsRender) {
    mergedIndicatorNode = indicatorsRender(current, total);
  } else {
    mergedIndicatorNode = [...Array.from({ length: total }).keys()].map<ReactNode>(
      (stepItem, index) => (
        <span
          key={stepItem}
          className={clsx(
            index === current && `${prefixCls}-indicator-active`,
            `${prefixCls}-indicator`,
            'bg-fill h-1.5 w-1.5 rounded-full',
            index === current && 'bg-primary',
          )}
        />
      ),
    );
  }

  const [contextLocale] = useLocale('Tour');

  return (
    <div className={rootCls}>
      <div className={innerCls}>
        {closeNode}
        {coverNode}
        {titleNode}
        {descriptionNode}
        <div className={footerCls}>
          {total > 1 && <div className={indicatorsCls}>{mergedIndicatorNode}</div>}
          <div className={buttonsCls}>
            {current !== 0 ? (
              <Button
                size="mini"
                {...prevButtonProps}
                onClick={prevBtnClick}
                className={mergeSemanticCls(
                  `${prefixCls}-prev-btn`,
                  semanticCls.prev,
                  prevButtonProps?.className,
                )}
              >
                {prevButtonProps?.children ?? contextLocale?.Previous}
              </Button>
            ) : null}
            <Button
              type="primary"
              size="mini"
              {...nextButtonProps}
              onClick={nextBtnClick}
              className={mergeSemanticCls(
                `${prefixCls}-next-btn`,
                semanticCls.next,
                nextButtonProps?.className,
              )}
            >
              {nextButtonProps?.children ??
                (isLastStep ? contextLocale?.Finish : contextLocale?.Next)}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TourPanel;
