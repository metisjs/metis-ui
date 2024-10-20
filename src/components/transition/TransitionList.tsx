/* eslint react/prop-types: 0 */
import * as React from 'react';
import type { TransitionProps } from './Transition';
import Transition from './Transition';
import type { KeyObject } from './util/diff';
import { diffKeys, parseKeys, STATUS_ADD, STATUS_KEEP, STATUS_REMOVED } from './util/diff';

const TRANSITION_PROP_NAMES: (keyof TransitionProps)[] = [
  'eventProps',
  'visible',
  'children',
  'appear',
  'removeOnLeave',
  'enter',
  'enterFrom',
  'enterTo',
  'leave',
  'leaveFrom',
  'leaveTo',
  'beforeEnter',
  'afterEnter',
  'beforeLeave',
  'afterLeave',
  'deadline',
];

export interface TransitionListProps
  extends Omit<TransitionProps, 'onVisibleChanged'>,
    Omit<React.HTMLAttributes<any>, 'children'> {
  keys: (React.Key | { key: React.Key; [name: string]: any })[];
  component?: string | React.ComponentType | false;
  className?: string;
  /** This will always trigger after final visible changed. Even if no transition configured. */
  onVisibleChanged?: (visible: boolean, info: { key: React.Key }) => void;
  /** All transition leaves in the screen */
  onAllRemoved?: () => void;
  children: (
    props: {
      visible?: boolean;
      className?: string;
      style?: React.CSSProperties;
      index: number;
      [key: string]: any;
    },
    ref: (node: any) => void,
  ) => React.ReactElement;
}

export interface TransitionListState {
  keyEntities: KeyObject[];
}

class TransitionList extends React.Component<TransitionListProps, TransitionListState> {
  static defaultProps = {
    component: 'div',
  };

  state: TransitionListState = {
    keyEntities: [],
  };

  static getDerivedStateFromProps(
    { keys }: TransitionListProps,
    { keyEntities }: TransitionListState,
  ) {
    const parsedKeyObjects = parseKeys(keys as KeyObject[] | React.Key[]);
    const mixedKeyEntities = diffKeys(keyEntities, parsedKeyObjects);

    return {
      keyEntities: mixedKeyEntities,
    };
  }

  removeKey = (removeKey: React.Key) => {
    this.setState(
      (prevState) => {
        const nextKeyEntities = prevState.keyEntities.map((entity) => {
          if (entity.key !== removeKey) return entity;
          return {
            ...entity,
            status: STATUS_REMOVED,
          };
        });

        return {
          keyEntities: nextKeyEntities,
        };
      },
      () => {
        const { keyEntities } = this.state;
        const restKeysCount = keyEntities.filter(({ status }) => status !== STATUS_REMOVED).length;

        if (restKeysCount === 0 && this.props.onAllRemoved) {
          this.props.onAllRemoved();
        }
      },
    );
  };

  render() {
    const { keyEntities } = this.state;
    const { component, children, onVisibleChanged, ...restProps } = this.props;

    const Component = component || React.Fragment;

    // @ts-ignore
    const transitionProps: TransitionProps = {};
    TRANSITION_PROP_NAMES.forEach((prop: keyof TransitionProps) => {
      // @ts-ignore
      transitionProps[prop] = restProps[prop];
      // @ts-ignore
      delete restProps[prop];
    });
    // @ts-ignore
    delete restProps.keys;

    return (
      <Component {...restProps}>
        {keyEntities.map(({ status, ...eventProps }, index) => {
          const visible = status === STATUS_ADD || status === STATUS_KEEP;
          return (
            <Transition
              {...transitionProps}
              key={eventProps.key}
              visible={visible}
              eventProps={eventProps}
              onVisibleChanged={(changedVisible) => {
                onVisibleChanged?.(changedVisible, { key: eventProps.key });

                if (!changedVisible) {
                  this.removeKey(eventProps.key);
                }
              }}
            >
              {(props, ref) => children({ ...props, index }, ref)}
            </Transition>
          );
        })}
      </Component>
    );
  }
}

export default TransitionList;
