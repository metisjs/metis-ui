import * as React from 'react';
import { useMemo } from 'react';
import Portal from '@rc-component/portal';
import classNames from 'classnames';
import useLayoutEffect from 'rc-util/lib/hooks/useLayoutEffect';
import useMergedState from 'rc-util/lib/hooks/useMergedState';
import { clsx, mergeSemanticCls } from '../_util/classNameUtils';
import useSemanticCls from '../_util/hooks/useSemanticCls';
import { useZIndex } from '../_util/hooks/useZIndex';
import getArrowClassName from '../_util/placementArrow';
import getPlacements from '../_util/placements';
import ZIndexContext from '../_util/ZIndexContext';
import { ConfigContext } from '../config-provider';
import type { TriggerRef } from '../trigger';
import Trigger from '../trigger';
import useTarget from './hooks/useTarget';
import type { TourProps } from './interface';
import Mask from './Mask';
import TourPanel from './Panel';
import { getPlacement } from './util';

const CENTER_PLACEHOLDER: React.CSSProperties = {
  left: '50%',
  top: '50%',
  width: 1,
  height: 1,
};
const defaultScrollIntoViewOptions: ScrollIntoViewOptions = {
  block: 'center',
  inline: 'center',
};

const defaultTransition = {
  enter: 'transition duration-[100ms]',
  enterFrom: 'opacity-0 scale-[0.8]',
  enterTo: 'opacity-100 scale-100',
  leave: 'transition duration-[100ms]',
  leaveFrom: 'opacity-100 scale-100 ',
  leaveTo: 'opacity-0 scale-[0.8]',
};

const Tour: React.FC<TourProps> = (props) => {
  const {
    prefixCls: customizePrefixCls,
    steps = [],
    defaultCurrent,
    current,
    onChange,
    onClose,
    onFinish,
    open,
    mask = true,
    arrow = true,
    placement,
    gap,
    animated,
    scrollIntoViewOptions = defaultScrollIntoViewOptions,
    zIndex: customizeZIndex,
    closable = true,
    disabledInteraction,
    type,
    indicatorsRender,
    className,
    ...restProps
  } = props;

  const { getPrefixCls } = React.useContext(ConfigContext);
  const prefixCls = getPrefixCls('tour', customizePrefixCls);

  const triggerRef = React.useRef<TriggerRef>(null);

  const [mergedCurrent, setMergedCurrent] = useMergedState(0, {
    value: current,
    defaultValue: defaultCurrent,
  });

  const [mergedOpen, setMergedOpen] = useMergedState(undefined, {
    value: open,
    postState: (origin) =>
      mergedCurrent < 0 || mergedCurrent >= steps.length ? false : (origin ?? true),
  });

  // Record if already rended in the DOM to avoid `findDOMNode` issue
  const [hasOpened, setHasOpened] = React.useState(mergedOpen);

  const openRef = React.useRef(mergedOpen);

  useLayoutEffect(() => {
    if (mergedOpen) {
      if (!openRef.current) {
        setMergedCurrent(0);
      }

      setHasOpened(true);
    }
    openRef.current = mergedOpen;
  }, [mergedOpen]);

  const {
    target,
    placement: stepPlacement,
    style: stepStyle,
    arrow: stepArrow,
    mask: stepMask,
    scrollIntoViewOptions: stepScrollIntoViewOptions = defaultScrollIntoViewOptions,
    closable: stepClosable = true,
    type: stepType,
    className: stepClassName,
  } = steps[mergedCurrent] || {};

  const mergedClosable = useMemo(() => {
    if (typeof closable === typeof stepClosable) {
      return stepClosable;
    }

    if (typeof closable === 'object') {
      return stepClosable ? closable : stepClosable;
    }

    return stepClosable;
  }, [closable, stepClosable]);

  const mergedType = stepType ?? type;
  const mergedMask = mergedOpen && (stepMask ?? mask);
  const mergedScrollIntoViewOptions = stepScrollIntoViewOptions ?? scrollIntoViewOptions;
  const [posInfo, targetElement] = useTarget(target, !!open, gap, mergedScrollIntoViewOptions);
  const mergedPlacement = getPlacement(targetElement, placement, stepPlacement);

  // ========================= arrow =========================
  const arrowConfig = targetElement
    ? typeof stepArrow === 'undefined'
      ? arrow
      : stepArrow
    : false;
  const arrowPointAtCenter = typeof arrowConfig === 'object' ? arrowConfig.pointAtCenter : false;
  const mergedArrow = !!arrowConfig
    ? {
        className: getArrowClassName({
          limitVerticalRadius: true,
        }),
      }
    : false;

  useLayoutEffect(() => {
    triggerRef.current?.forceAlign();
  }, [arrowPointAtCenter, mergedCurrent]);

  // ========================= Change =========================
  const onInternalChange = (nextCurrent: number) => {
    setMergedCurrent(nextCurrent);
    onChange?.(nextCurrent);
  };

  const builtinPlacements = useMemo(
    () =>
      getPlacements({
        arrowPointAtCenter: arrowPointAtCenter ?? true,
        autoAdjustOverflow: true,
        offset: 4,
        arrowWidth: arrow ? 16 : 0,
        borderRadius: 6,
      }),
    [arrowPointAtCenter, arrow],
  );

  // ============================ zIndex ============================
  const [zIndex, contextZIndex] = useZIndex('Tour', customizeZIndex);

  // ============================ Style ============================
  const semanticCls = useSemanticCls([className, stepClassName], 'tour');

  const maskCls = clsx('fill-mask', semanticCls.mask);

  const popupCls = clsx(
    'visible absolute block w-96 max-w-fit origin-[var(--arrow-x,50%)_var(--arrow-y,50%)]',
    {
      '[--metis-arrow-background-color:hsla(var(--elevated))]': type !== 'primary',
      '[--metis-arrow-background-color:hsla(var(--primary-bg))]': type === 'primary',
    },
    semanticCls.popup,
  );

  // ============================ Render ============================
  if (targetElement === undefined || !hasOpened) {
    return null;
  }

  const handleClose = () => {
    setMergedOpen(false);
    onClose?.(mergedCurrent);
  };

  const getPopupElement = () => (
    <TourPanel
      key="content"
      prefixCls={prefixCls}
      total={steps.length}
      onPrev={() => {
        onInternalChange(mergedCurrent - 1);
      }}
      onNext={() => {
        onInternalChange(mergedCurrent + 1);
      }}
      onClose={handleClose}
      current={mergedCurrent}
      onFinish={() => {
        handleClose();
        onFinish?.();
      }}
      {...steps[mergedCurrent]}
      closable={mergedClosable}
      indicatorsRender={indicatorsRender}
      type={mergedType}
      className={mergeSemanticCls(className, stepClassName)}
    />
  );

  // when targetElement is not exist, use body as triggerDOMNode
  const getTriggerDOMNode = (node: React.ReactInstance) => {
    return (node || targetElement || document.body) as HTMLElement;
  };

  return (
    <ZIndexContext.Provider value={contextZIndex}>
      <Mask
        zIndex={zIndex}
        prefixCls={prefixCls}
        pos={posInfo}
        showMask={mergedMask}
        open={mergedOpen}
        animated={animated}
        disabledInteraction={disabledInteraction}
        className={maskCls}
      />
      <Trigger
        {...restProps}
        builtinPlacements={builtinPlacements}
        ref={triggerRef}
        popupStyle={stepStyle}
        popupPlacement={mergedPlacement}
        popupOpen={mergedOpen}
        className={{ popup: popupCls, root: semanticCls.root }}
        prefixCls={prefixCls}
        popup={getPopupElement}
        forceRender={false}
        autoDestroy
        zIndex={zIndex}
        getTriggerDOMNode={getTriggerDOMNode}
        arrow={mergedArrow}
        popupTransition={defaultTransition}
      >
        <Portal open={mergedOpen} autoLock>
          <div
            className={classNames(`${prefixCls}-target-placeholder`)}
            style={{
              ...(posInfo || CENTER_PLACEHOLDER),
              position: 'fixed',
              pointerEvents: 'none',
            }}
          />
        </Portal>
      </Trigger>
    </ZIndexContext.Provider>
  );
};

export default Tour;
