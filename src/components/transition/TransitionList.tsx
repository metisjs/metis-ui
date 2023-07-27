/* eslint react/prop-types: 0 */
import * as React from 'react';
import type { TransitionProps } from './Transition';
import Transition from './Transition';
import type { KeyObject } from './util/diff';
import { STATUS_ADD, STATUS_KEEP, STATUS_REMOVED, diffKeys, parseKeys } from './util/diff';

const TRANSITION_PROP_NAMES: (keyof TransitionProps)[] = [
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
  'entered',
  'beforeEnter',
  'afterEnter',
  'beforeLeave',
  'afterLeave',
];

export interface TransitionListProps
  extends Omit<TransitionProps, 'children' | 'onVisibleChanged'>,
    Omit<React.HTMLAttributes<any>, 'children'> {
  keys: (React.Key | { key: React.Key; [name: string]: any })[];
  component?: string | React.ComponentType | false;
  className?: string;
  children: (props: { [key: string]: any }) => React.ReactElement;
  /** This will always trigger after final visible changed. Even if no transition configured. */
  onVisibleChanged?: (visible: boolean, info: { key: React.Key }) => void;
  /** All transition leaves in the screen */
  onAllRemoved?: () => void;
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
    const { keyEntities } = this.state;
    const nextKeyEntities = keyEntities.map((entity) => {
      if (entity.key !== removeKey) return entity;
      return {
        ...entity,
        status: STATUS_REMOVED,
      };
    });

    this.setState({
      keyEntities: nextKeyEntities,
    });

    return nextKeyEntities.filter(({ status }) => status !== STATUS_REMOVED).length;
  };

  render() {
    const { keyEntities } = this.state;
    const { component, children, onVisibleChanged, onAllRemoved, ...restProps } = this.props;

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
        {keyEntities.map(({ status, ...eventProps }) => {
          const visible = status === STATUS_ADD || status === STATUS_KEEP;
          return (
            <Transition
              {...transitionProps}
              key={eventProps.key}
              visible={visible}
              onVisibleChanged={(changedVisible) => {
                onVisibleChanged?.(changedVisible, { key: eventProps.key });

                if (!changedVisible) {
                  const restKeysCount = this.removeKey(eventProps.key);

                  if (restKeysCount === 0 && onAllRemoved) {
                    onAllRemoved();
                  }
                }
              }}
            >
              {children(eventProps)}
            </Transition>
          );
        })}
      </Component>
    );
  }
}

export default TransitionList;
