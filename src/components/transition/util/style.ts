/* eslint-disable eqeqeq */
import { CSSProperties } from 'react';
import { TransitionStyle, TransitionStyleType } from '../interface';
import disposables from './disposables';

export function splitStyle(style?: TransitionStyle) {
  let result: any = {};
  if (typeof style === 'string') {
    result.className = style;
  } else if (typeof style === 'object') {
    if ('className' in style || 'style' in style) {
      result = style as TransitionStyleType;
    } else {
      result.style = style;
    }
  }

  result.className = result.className ?? '';
  result.style = result.style ?? {};

  result.className = result.className.split(' ').filter(Boolean);

  return result as TransitionStyleType;
}

export function addClasses(node: HTMLElement, ...classes: string[]) {
  if (node && classes.length > 0) node.classList.add(...classes);
}

export function removeClasses(node: HTMLElement, ...classes: string[]) {
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

export function addStyles(node: HTMLElement, styles: CSSProperties) {
  validateStyles(styles);

  const style = node.style;
  for (const styleName in styles) {
    if (styles.hasOwnProperty(styleName)) {
      const value = styles[styleName as keyof CSSProperties];
      setValueForStyle(style, styleName, value);
    }
  }
}

export function removeStyles(node: HTMLElement, styles: CSSProperties) {
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

export function waitForTransition(node: HTMLElement, done: () => void) {
  let d = disposables();

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
        d.addEventListener(node, 'transitionrun', (event: any) => {
          if (event.target !== event.currentTarget) return;
          console.log('transitionrun');
          d.dispose();
        });
      });

      console.log('add transitionend listener');
      let dispose = d.addEventListener(node, 'transitionend', (event) => {
        if (event.target !== event.currentTarget) return;
        console.log('transitionend', event.propertyName, event.elapsedTime);
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
