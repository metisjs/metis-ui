/* eslint-disable eqeqeq */
import classNames from 'classnames';
import omit from 'rc-util/lib/omit';
import { composeRef } from 'rc-util/lib/ref';
import {
  CSSProperties,
  ElementType,
  Fragment,
  ReactNode,
  cloneElement,
  createElement,
  isValidElement,
} from 'react';
import Disposables from './disposables';
import { NestingContextValues, TreeStates } from './interface';

function once<T>(cb: (...args: T[]) => void) {
  let state = { called: false };

  return (...args: T[]) => {
    if (state.called) return;
    state.called = true;
    return cb(...args);
  };
}

function addClasses(node: HTMLElement, ...classes: string[]) {
  if (node && classes.length > 0) node.classList.add(...classes);
}

function removeClasses(node: HTMLElement, ...classes: string[]) {
  if (node && classes.length > 0) node.classList.remove(...classes);
}

/**
 * CSS properties which accept numbers but are not in units of "px".
 */
function isUnitlessNumber(name: string): boolean {
  const unitlessNumbers = new Set([
    'animationIterationCount',
    'aspectRatio',
    'borderImageOutset',
    'borderImageSlice',
    'borderImageWidth',
    'boxFlex',
    'boxFlexGroup',
    'boxOrdinalGroup',
    'columnCount',
    'columns',
    'flex',
    'flexGrow',
    'flexPositive',
    'flexShrink',
    'flexNegative',
    'flexOrder',
    'gridArea',
    'gridRow',
    'gridRowEnd',
    'gridRowSpan',
    'gridRowStart',
    'gridColumn',
    'gridColumnEnd',
    'gridColumnSpan',
    'gridColumnStart',
    'fontWeight',
    'lineClamp',
    'lineHeight',
    'opacity',
    'order',
    'orphans',
    'scale',
    'tabSize',
    'widows',
    'zIndex',
    'zoom',
    'fillOpacity', // SVG-related properties
    'floodOpacity',
    'stopOpacity',
    'strokeDasharray',
    'strokeDashoffset',
    'strokeMiterlimit',
    'strokeOpacity',
    'strokeWidth',
    'MozAnimationIterationCount',
    'MozBoxFlex',
    'MozBoxFlexGroup',
    'MozLineClamp',
    'msAnimationIterationCount',
    'msFlex',
    'msZoom',
    'msFlexGrow',
    'msFlexNegative',
    'msFlexOrder',
    'msFlexPositive',
    'msFlexShrink',
    'msGridColumn',
    'msGridColumnSpan',
    'msGridRow',
    'msGridRowSpan',
    'WebkitAnimationIterationCount',
    'WebkitBoxFlex',
    'WebKitBoxFlexGroup',
    'WebkitBoxOrdinalGroup',
    'WebkitColumnCount',
    'WebkitColumns',
    'WebkitFlex',
    'WebkitFlexGrow',
    'WebkitFlexPositive',
    'WebkitFlexShrink',
    'WebkitLineClamp',
  ]);
  return unitlessNumbers.has(name);
}

function setValueForStyle(
  style: CSSStyleDeclaration,
  styleName: string,
  value?: string | number | null,
) {
  const isCustomProperty = styleName.indexOf('--') === 0;

  if (value == null || typeof value === 'boolean' || value === '') {
    if (isCustomProperty) {
      style.setProperty(styleName, '');
    } else if (styleName === 'float') {
      style.cssFloat = '';
    } else {
      style[styleName as any] = '';
    }
  } else if (isCustomProperty) {
    style.setProperty(styleName, value as string);
  } else if (typeof value === 'number' && value !== 0 && !isUnitlessNumber(styleName)) {
    style[styleName as any] = value + 'px'; // Presumes implicit 'px' suffix for unitless numbers
  } else {
    if (styleName === 'float') {
      style.cssFloat = `${value}`;
    } else {
      style[styleName as any] = ('' + value).trim();
    }
  }
}

function validateStyles(styles: CSSProperties) {
  if (styles != null && typeof styles !== 'object') {
    throw new Error(
      'The `style` prop expects a mapping from style properties to values, ' +
        "not a string. For example, style={{marginRight: spacing + 'em'}} when " +
        'using JSX.',
    );
  }
}

function addStyles(node: HTMLElement, styles: CSSProperties) {
  validateStyles(styles);

  const style = node.style;
  for (const styleName in styles) {
    if (styles.hasOwnProperty(styleName)) {
      const value = styles[styleName as keyof CSSProperties];
      setValueForStyle(style, styleName, value);
    }
  }
}

function removeStyles(node: HTMLElement, styles: CSSProperties) {
  validateStyles(styles);

  const style = node.style;
  for (const styleName in styles) {
    if (styles.hasOwnProperty(styleName)) {
      // Clear style
      const isCustomProperty = styleName.indexOf('--') === 0;
      if (isCustomProperty) {
        style.setProperty(styleName, '');
      } else if (styleName === 'float') {
        style.cssFloat = '';
      } else {
        style[styleName as any] = '';
      }
    }
  }
}

function waitForTransition(node: HTMLElement, done: () => void) {
  let d = new Disposables();

  if (!node) return d.dispose;

  // Safari returns a comma separated list of values, so let's sort them and take the highest value.
  let { transitionDuration, transitionDelay } = getComputedStyle(node);

  let [durationMs, delayMs] = [transitionDuration, transitionDelay].map((value) => {
    let [resolvedValue = 0] = value
      .split(',')
      // Remove falsy we can't work with
      .filter(Boolean)
      // Values are returned as `0.3s` or `75ms`
      .map((v) => (v.includes('ms') ? parseFloat(v) : parseFloat(v) * 1000))
      .sort((a, z) => z - a);

    return resolvedValue;
  });

  let totalDuration = durationMs + delayMs;

  if (totalDuration !== 0) {
    if (process.env.NODE_ENV === 'test') {
      let dispose = d.setTimeout(() => {
        done();
        dispose();
      }, totalDuration);
    } else {
      d.group((d) => {
        // Mark the transition as done when the timeout is reached. This is a fallback in case the
        // transitionrun event is not fired.
        d.setTimeout(() => {
          done();
          d.dispose();
        }, totalDuration);

        // The moment the transitionrun event fires, we should cleanup the timeout fallback, because
        // then we know that we can use the native transition events because something is
        // transitioning.
        d.addEventListener(node, 'transitionrun', (event) => {
          if (event.target !== event.currentTarget) return;
          d.dispose();
        });
      });

      let dispose = d.addEventListener(node, 'transitionend', (event) => {
        if (event.target !== event.currentTarget) return;
        done();
        dispose();
      });
    }
  } else {
    // No transition is happening, so we should cleanup already. Otherwise we have to wait until we
    // get disposed.
    done();
  }

  // If we get disposed before the transition finishes, we should cleanup anyway.
  d.add(() => done());

  return d.dispose;
}

export function match<TValue extends string | number = string, TReturnValue = unknown>(
  value: TValue,
  lookup: Record<TValue, TReturnValue | ((...args: any[]) => TReturnValue)>,
  ...args: any[]
): TReturnValue {
  if (value in lookup) {
    let returnValue = lookup[value];
    return typeof returnValue === 'function' ? returnValue(...args) : returnValue;
  }

  let error = new Error(
    `Tried to handle "${value}" but there is no handler defined. Only defined handlers are: ${Object.keys(
      lookup,
    )
      .map((key) => `"${key}"`)
      .join(', ')}.`,
  );
  if (Error.captureStackTrace) Error.captureStackTrace(error, match);
  throw error;
}

export function transition(
  node: HTMLElement,
  classes: {
    enter: string[];
    enterFrom: string[];
    enterTo: string[];
    leave: string[];
    leaveFrom: string[];
    leaveTo: string[];
    entered: string[];
  },
  styles: {
    enter: CSSProperties;
    enterFrom: CSSProperties;
    enterTo: CSSProperties;

    leave: CSSProperties;
    leaveFrom: CSSProperties;
    leaveTo: CSSProperties;

    entered: CSSProperties;
  },
  show: boolean,
  done?: () => void,
) {
  let direction: 'enter' | 'leave' = show ? 'enter' : 'leave';
  let d = new Disposables();
  let _done = done !== undefined ? once(done) : () => {};

  // When using unmount={false}, when the element is "hidden", then we apply a `style.display =
  // 'none'` and a `hidden` attribute. Let's remove that in case we want to make an enter
  // transition. It can happen that React is removing this a bit too late causing the element to not
  // transition at all.
  if (direction === 'enter') {
    node.removeAttribute('hidden');
    node.style.display = '';
  }

  const baseCls = match(direction, {
    enter: () => classes.enter,
    leave: () => classes.leave,
  });
  const toCls = match(direction, {
    enter: () => classes.enterTo,
    leave: () => classes.leaveTo,
  });
  const fromCls = match(direction, {
    enter: () => classes.enterFrom,
    leave: () => classes.leaveFrom,
  });

  const baseStyle = match(direction, {
    enter: () => styles.enter,
    leave: () => styles.leave,
  });
  const toStyle = match(direction, {
    enter: () => styles.enterTo,
    leave: () => styles.leaveTo,
  });
  const fromStyle = match(direction, {
    enter: () => styles.enterFrom,
    leave: () => styles.leaveFrom,
  });

  removeClasses(
    node,
    ...classes.enter,
    ...classes.enterTo,
    ...classes.enterFrom,
    ...classes.leave,
    ...classes.leaveFrom,
    ...classes.leaveTo,
    ...classes.entered,
  );
  removeStyles(node, {
    ...styles.enter,
    ...styles.enterTo,
    ...styles.enterFrom,
    ...styles.leave,
    ...styles.leaveFrom,
    ...styles.leaveTo,
    ...styles.entered,
  });
  addClasses(node, ...baseCls, ...fromCls);
  addStyles(node, { ...baseStyle, ...fromStyle });

  d.nextFrame(() => {
    removeClasses(node, ...fromCls);
    removeStyles(node, fromStyle);
    addClasses(node, ...toCls);
    addStyles(node, toStyle);

    waitForTransition(node, () => {
      removeClasses(node, ...baseCls);
      removeStyles(node, baseStyle);
      addClasses(node, ...classes.entered);
      addStyles(node, styles.entered);

      return _done();
    });
  });

  return d.dispose;
}

export function microTask(cb: () => void) {
  if (typeof queueMicrotask === 'function') {
    queueMicrotask(cb);
  } else {
    Promise.resolve()
      .then(cb)
      .catch((e) =>
        setTimeout(() => {
          throw e;
        }),
      );
  }
}

export function splitClasses(classes: string | CSSProperties = '') {
  return typeof classes === 'string'
    ? classes.split(' ').filter((className) => className.trim().length > 1)
    : [];
}

export function splitStyles(styles: string | CSSProperties = '') {
  return typeof styles === 'string' ? {} : styles;
}

export function hasChildren(
  bag: NestingContextValues['children'] | { children: NestingContextValues['children'] },
): boolean {
  if ('children' in bag) return hasChildren(bag.children);
  return (
    bag.current
      .filter(({ el }) => el.current !== null)
      .filter(({ state }) => state === TreeStates.Visible).length > 0
  );
}

export function compact<T extends Record<any, any>>(object: T) {
  let clone = Object.assign({}, object);
  for (let key in clone) {
    if (clone[key] === undefined) delete clone[key];
  }
  return clone;
}

export function render({
  props,
  tag,
  visible = true,
  name,
}: {
  props: {
    as?: ElementType;
    children?: ReactNode;
    ref?: unknown;
    unmount?: boolean;
    className?: string;
    [key: string]: any;
  };
  tag: ElementType;
  visible: boolean;
  name: string;
}) {
  let { as: Component = tag, children, unmount = true, ...rest } = omit(props, ['unmount']);

  if (!visible && unmount) {
    return null;
  }

  let styleProps = {};
  if (!visible && !unmount) {
    styleProps = { style: { display: 'none' } };
  }

  let refRelatedProps = props.ref !== undefined ? { ref: props.ref as any } : {};

  if (Component === Fragment) {
    if (Object.keys(compact(rest)).length > 0) {
      if (!isValidElement(children) || (Array.isArray(children) && children.length > 1)) {
        throw new Error(
          [
            'Passing props on "Fragment"!',
            '',
            `The current component <${name} /> is rendering a "Fragment".`,
            `However we need to passthrough the following props:`,
            Object.keys(rest)
              .map((line) => `  - ${line}`)
              .join('\n'),
            '',
            'You can apply a few solutions:',
            [
              'Add an `as="..."` prop, to ensure that we render an actual element instead of a "Fragment".',
              'Render a single element as the child so that we can forward the props onto that element.',
            ]
              .map((line) => `  - ${line}`)
              .join('\n'),
          ].join('\n'),
        );
      }

      // Merge class name prop in SSR
      let childProps = children.props as { className: string } | null;

      let newClassName = classNames(childProps?.className, rest.className);
      let classNameProps = newClassName ? { className: newClassName } : {};

      console.log(classNameProps);

      return cloneElement(
        children,
        Object.assign(
          {},
          children.props,
          compact(omit(rest, ['ref'])),
          styleProps,
          refRelatedProps,
          composeRef(...[(children as any).ref, refRelatedProps.ref].filter(Boolean)),
          classNameProps,
        ),
      );
    }
  }

  return createElement(
    Component,
    Object.assign(
      {},
      omit(rest, ['ref']),
      styleProps,
      Component !== Fragment ? refRelatedProps : {},
    ),
    children,
  );
}
