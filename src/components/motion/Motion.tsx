/* eslint-disable react/default-props-match-prop-types, react/no-multi-comp, react/prop-types */
import { fillRef, supportRef } from 'rc-util/lib/ref';
import * as React from 'react';
import { useRef } from 'react';
import DomWrapper from './DomWrapper';
import { Context } from './context';
import useStatus from './hooks/useStatus';
import {
  MotionEndEventHandler,
  MotionEventHandler,
  MotionPrepareEventHandler,
  MotionStatus,
  STATUS_APPEAR,
  STATUS_ENTER,
  STATUS_LEAVE,
  STATUS_NONE,
  STEP_ACTIVATED,
  STEP_ACTIVE,
  STEP_NONE,
  STEP_PREPARE,
  STEP_PREPARED,
  STEP_START,
} from './interface';
import { supportTransition } from './util/motion';

export interface MotionProps {
  visible?: boolean;
  appear?: boolean;
  enter?: boolean;
  leave?: boolean;
  leaveImmediately?: boolean;
  deadline?: number;
  /**
   * Create element in view even the element is invisible.
   * Will patch `display: none` style on it.
   */
  forceRender?: boolean;
  /**
   * Preserve element when motion end. This will not work when `forceRender` is set.
   * string mean leaved class name
   */
  preserveOnLeave?: boolean | string;
  /** @private Used by MotionList. Do not use in your production. */
  eventProps?: object;

  /**
   * 状态触发时的className
   */
  appearPrepareCls?: string;
  enterPrepareCls?: string;
  leavePrepareCls?: string;
  appearStartCls?: string;
  enterStartCls?: string;
  leaveStartCls?: string;
  appearActiveCls?: string;
  enterActiveCls?: string;
  leaveActiveCls?: string;

  // Prepare groups
  /** Prepare phase is used for measure element info. It will always trigger even motion is off */
  onAppearPrepare?: MotionPrepareEventHandler;
  /** Prepare phase is used for measure element info. It will always trigger even motion is off */
  onEnterPrepare?: MotionPrepareEventHandler;
  /** Prepare phase is used for measure element info. It will always trigger even motion is off */
  onLeavePrepare?: MotionPrepareEventHandler;

  // Normal motion groups
  onAppearStart?: MotionEventHandler;
  onEnterStart?: MotionEventHandler;
  onLeaveStart?: MotionEventHandler;

  onAppearActive?: MotionEventHandler;
  onEnterActive?: MotionEventHandler;
  onLeaveActive?: MotionEventHandler;

  onAppearEnd?: MotionEndEventHandler;
  onEnterEnd?: MotionEndEventHandler;
  onLeaveEnd?: MotionEndEventHandler;

  // Special
  /** This will always trigger after final visible changed. Even if no motion configured. */
  onVisibleChanged?: (visible: boolean) => void;

  internalRef?: React.Ref<any>;

  children?: (
    props: {
      visible?: boolean;
      className?: string;
      style?: React.CSSProperties;
      [key: string]: any;
    },
    ref: (node: any) => void,
  ) => React.ReactElement;
}

export interface MotionState {
  status?: MotionStatus;
  statusActive?: boolean;
  newStatus?: boolean;
  statusStyle?: React.CSSProperties;
  prevProps?: MotionProps;
}

/**
 * `transitionSupport` is used for none transition test case.
 * Default we use browser transition event support check.
 */
export function genMotion(
  transitionSupport: boolean,
): React.ForwardRefExoticComponent<MotionProps & { ref?: React.Ref<any> }> {
  function isSupportTransition(contextMotion?: boolean) {
    return !!(transitionSupport && contextMotion !== false);
  }

  const Motion = React.forwardRef<any, MotionProps>((props, ref) => {
    const {
      // Default config
      visible = true,
      preserveOnLeave,
      forceRender,
      children,
      eventProps,
      appearPrepareCls,
      enterPrepareCls,
      leavePrepareCls,
      appearStartCls,
      enterStartCls,
      leaveStartCls,
      appearActiveCls,
      enterActiveCls,
      leaveActiveCls,
    } = props;

    const { motion: contextMotion } = React.useContext(Context);

    const supportMotion = isSupportTransition(contextMotion);

    // Ref to the react node, it may be a HTMLElement
    const nodeRef = useRef<any>();
    // Ref to the dom wrapper in case ref can not pass to HTMLElement
    const wrapperNodeRef = useRef(null);

    function getDomElement() {
      return nodeRef.current;
    }

    const [status, statusStep, statusStyle, mergedVisible] = useStatus(
      supportMotion,
      visible,
      getDomElement,
      props,
    );

    // Record whether content has rendered
    // Will return null for un-rendered even when `preserveOnLeave={true}`
    const renderedRef = React.useRef(mergedVisible);
    if (mergedVisible) {
      renderedRef.current = true;
    }

    // ====================== Refs ======================
    const setNodeRef = React.useCallback(
      (node: any) => {
        nodeRef.current = node;
        fillRef(ref, node);
      },
      [ref],
    );

    // ===================== Render =====================
    let motionChildren: React.ReactNode;
    const mergedProps = { ...eventProps, visible: visible };

    const getClsx = (targetStatus: MotionStatus) => {
      switch (targetStatus) {
        case STATUS_APPEAR:
          return {
            [STEP_PREPARE]: appearPrepareCls,
            [STEP_START]: appearStartCls,
            [STEP_ACTIVE]: appearActiveCls,
          };

        case STATUS_ENTER:
          return {
            [STEP_PREPARE]: enterPrepareCls,
            [STEP_START]: enterStartCls,
            [STEP_ACTIVE]: enterActiveCls,
          };

        case STATUS_LEAVE:
          return {
            [STEP_PREPARE]: leavePrepareCls,
            [STEP_START]: leaveStartCls,
            [STEP_ACTIVE]: leaveActiveCls,
          };

        default:
          return { [STEP_PREPARE]: '', [STEP_START]: '', [STEP_ACTIVE]: '' };
      }
    };

    if (!children) {
      // No children
      motionChildren = null;
    } else if (status === STATUS_NONE) {
      // Stable children
      if (mergedVisible) {
        motionChildren = children({ ...mergedProps }, setNodeRef);
      } else if (preserveOnLeave && renderedRef.current && typeof preserveOnLeave === 'string') {
        motionChildren = children({ ...mergedProps, className: preserveOnLeave }, setNodeRef);
      } else if (forceRender || preserveOnLeave === true) {
        motionChildren = children({ ...mergedProps, style: { display: 'none' } }, setNodeRef);
      } else {
        motionChildren = null;
      }
    } else {
      // In motion
      const statusClassName =
        statusStep !== STEP_NONE && statusStep !== STEP_ACTIVATED && statusStep !== STEP_PREPARED
          ? getClsx(status)?.[statusStep]
          : '';
      console.log(statusClassName);
      motionChildren = children(
        {
          ...mergedProps,
          className: statusClassName,
          style: statusStyle,
        },
        setNodeRef,
      );
    }

    // Auto inject ref if child node not have `ref` props
    if (React.isValidElement(motionChildren) && supportRef(motionChildren)) {
      const { ref: originNodeRef } = motionChildren as any;

      if (!originNodeRef) {
        motionChildren = React.cloneElement<any>(motionChildren, {
          ref: setNodeRef,
        });
      }
    }

    return <DomWrapper ref={wrapperNodeRef}>{motionChildren}</DomWrapper>;
  });

  Motion.displayName = 'Motion';

  return Motion;
}

export default genMotion(supportTransition);
