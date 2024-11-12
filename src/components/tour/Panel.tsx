import type { ReactNode } from 'react';
import React from 'react';
import classNames from 'classnames';
import { clsx, mergeSemanticCls } from '../_util/classNameUtils';
import useClosable from '../_util/hooks/useClosable';
import useSemanticCls from '../_util/hooks/useSemanticCls';
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
    type,
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
    'rounded-md bg-[--metis-arrow-background-color] text-start text-sm shadow-sm',
    semanticCls.content,
  );

  const closeCls = clsx(
    `${prefixCls}-close`,
    'absolute right-2.5 top-2.5 inline-flex h-6 w-6 items-center justify-center rounded text-lg text-text-tertiary hover:bg-fill-tertiary hover:text-text-secondary',
    semanticCls.close,
  );

  const coverCls = clsx(
    `${prefixCls}-cover`,
    'px-4 pt-4 *:w-full',
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
    'mb-4 px-4',
    {
      'pt-4': !title,
      'pe-6': !title && isClosable && !cover,
    },
    semanticCls.description,
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
          className={classNames(
            index === current && `${prefixCls}-indicator-active`,
            `${prefixCls}-indicator`,
          )}
        />
      ),
    );
  }

  const mainBtnType = type === 'primary' ? 'default' : 'primary';

  const secondaryBtnType = type === 'primary' ? 'text' : 'default';

  const [contextLocale] = useLocale('Tour');

  return (
    <div className={rootCls}>
      <div className={innerCls}>
        {closeNode}
        {coverNode}
        {titleNode}
        {descriptionNode}
        <div className={`${prefixCls}-footer`}>
          {total > 1 && <div className={`${prefixCls}-indicators`}>{mergedIndicatorNode}</div>}
          <div className={`${prefixCls}-buttons`}>
            {current !== 0 ? (
              <Button
                type={secondaryBtnType}
                size="small"
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
              type={mainBtnType}
              size="small"
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
