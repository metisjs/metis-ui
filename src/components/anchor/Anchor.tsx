import * as React from 'react';
import { useEvent } from 'rc-util';
import scrollIntoView from 'scroll-into-view-if-needed';
import type { SemanticClassName } from '../_util/classNameUtils';
import { clsx, getSemanticCls } from '../_util/classNameUtils';
import useSemanticCls from '../_util/hooks/useSemanticCls';
import { getScroll, scrollTo } from '../_util/scroll';
import { devUseWarning } from '../_util/warning';
import Affix from '../affix';
import type { ConfigConsumerProps } from '../config-provider';
import { ConfigContext } from '../config-provider';
import type { AnchorLinkBaseProps } from './AnchorLink';
import AnchorLink from './AnchorLink';
import AnchorContext from './context';

export interface AnchorLinkItemProps extends AnchorLinkBaseProps {
  key: React.Key;
  children?: AnchorLinkItemProps[];
}

export type AnchorContainer = HTMLElement | Window;

function getDefaultContainer() {
  return window;
}

function getOffsetTop(element: HTMLElement, container: AnchorContainer): number {
  if (!element.getClientRects().length) {
    return 0;
  }

  const rect = element.getBoundingClientRect();

  if (rect.width || rect.height) {
    if (container === window) {
      return rect.top - element.ownerDocument!.documentElement!.clientTop;
    }
    return rect.top - (container as HTMLElement).getBoundingClientRect().top;
  }

  return rect.top;
}

const sharpMatcherRegex = /#([\S ]+)$/;

interface Section {
  link: string;
  top: number;
}

export interface AnchorProps {
  prefixCls?: string;
  className?: SemanticClassName<'ink' | 'link' | 'title'>;
  style?: React.CSSProperties;
  offsetTop?: number;
  bounds?: number;
  affix?: boolean;
  showInkInFixed?: boolean;
  getContainer?: () => AnchorContainer;
  /** Return customize highlight anchor */
  getCurrentAnchor?: (activeLink: string) => string;
  onClick?: (
    e: React.MouseEvent<HTMLElement>,
    link: { title: React.ReactNode; href: string },
  ) => void;
  /** Scroll to target offset value, if none, it's offsetTop prop value or 0. */
  targetOffset?: number;
  /** Listening event when scrolling change active link */
  onChange?: (currentActiveLink: string) => void;
  items: AnchorLinkItemProps[];
  direction?: AnchorDirection;
  replace?: boolean;
}

export interface AnchorState {
  activeLink: null | string;
}

export interface AnchorDefaultProps extends AnchorProps {
  prefixCls: string;
  affix: boolean;
  showInkInFixed: boolean;
  getContainer: () => AnchorContainer;
}

export type AnchorDirection = 'vertical' | 'horizontal';

export interface AntAnchor {
  registerLink: (link: string) => void;
  unregisterLink: (link: string) => void;
  activeLink: string | null;
  scrollTo: (link: string) => void;
  onClick?: (
    e: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
    link: { title: React.ReactNode; href: string },
  ) => void;
  direction: AnchorDirection;
}

const Anchor: React.FC<AnchorProps> = (props) => {
  const {
    prefixCls: customPrefixCls,
    className,
    style,
    offsetTop,
    affix = true,
    showInkInFixed = false,
    items,
    direction: anchorDirection = 'vertical',
    bounds,
    targetOffset,
    onClick,
    onChange,
    getContainer,
    getCurrentAnchor,
    replace,
  } = props;

  // =================== Warning =====================
  if (process.env.NODE_ENV !== 'production') {
    const warning = devUseWarning('Anchor');

    warning(
      !(anchorDirection === 'horizontal' && items.some((n) => 'children' in n)),
      'usage',
      '`Anchor items#children` is not supported when `Anchor` direction is horizontal.',
    );
  }

  const [links, setLinks] = React.useState<string[]>([]);
  const [activeLink, setActiveLink] = React.useState<string | null>(null);
  const activeLinkRef = React.useRef<string | null>(activeLink);

  const anchorRef = React.useRef<HTMLDivElement>(null);
  const spanLinkNode = React.useRef<HTMLSpanElement>(null);
  const animating = React.useRef<boolean>(false);

  const { getTargetContainer, getPrefixCls } = React.useContext<ConfigConsumerProps>(ConfigContext);

  const prefixCls = getPrefixCls('anchor', customPrefixCls);
  const semanticCls = useSemanticCls(className, 'anchor');

  const getCurrentContainer = getContainer ?? getTargetContainer ?? getDefaultContainer;

  const dependencyListItem: React.DependencyList[number] = JSON.stringify(links);

  const registerLink = useEvent<AntAnchor['registerLink']>((link) => {
    if (!links.includes(link)) {
      setLinks((prev) => [...prev, link]);
    }
  });

  const unregisterLink = useEvent<AntAnchor['unregisterLink']>((link) => {
    if (links.includes(link)) {
      setLinks((prev) => prev.filter((i) => i !== link));
    }
  });

  const updateInk = () => {
    const linkNode = anchorRef.current?.querySelector<HTMLElement>(
      `.${prefixCls}-link-title-active`,
    );

    if (linkNode && spanLinkNode.current) {
      const { style: inkStyle } = spanLinkNode.current;
      const horizontalAnchor = anchorDirection === 'horizontal';
      inkStyle.top = horizontalAnchor ? '' : `${linkNode.offsetTop + linkNode.clientHeight / 2}px`;
      inkStyle.height = horizontalAnchor ? '' : `${linkNode.clientHeight}px`;
      inkStyle.left = horizontalAnchor ? `${linkNode.offsetLeft}px` : '';
      inkStyle.width = horizontalAnchor ? `${linkNode.clientWidth}px` : '';
      if (horizontalAnchor) {
        scrollIntoView(linkNode, { scrollMode: 'if-needed', block: 'nearest' });
      }
    }
  };

  const getInternalCurrentAnchor = (_links: string[], _offsetTop = 0, _bounds = 5): string => {
    const linkSections: Section[] = [];
    const container = getCurrentContainer();
    _links.forEach((link) => {
      const sharpLinkMatch = sharpMatcherRegex.exec(link?.toString());
      if (!sharpLinkMatch) {
        return;
      }
      const target = document.getElementById(sharpLinkMatch[1]);
      if (target) {
        const top = getOffsetTop(target, container);
        if (top <= _offsetTop + _bounds) {
          linkSections.push({ link, top });
        }
      }
    });

    if (linkSections.length) {
      const maxSection = linkSections.reduce((prev, curr) => (curr.top > prev.top ? curr : prev));
      return maxSection.link;
    }
    return '';
  };

  const setCurrentActiveLink = useEvent((link: string) => {
    // FIXME: Seems a bug since this compare is not equals
    // `activeLinkRef` is parsed value which will always trigger `onChange` event.
    if (activeLinkRef.current === link) {
      return;
    }

    const newLink = typeof getCurrentAnchor === 'function' ? getCurrentAnchor(link) : link;
    setActiveLink(newLink);
    activeLinkRef.current = newLink;

    // onChange should respect the original link (which may caused by
    // window scroll or user click), not the new link
    onChange?.(link);
  });

  const handleScroll = React.useCallback(() => {
    if (animating.current) {
      return;
    }

    const currentActiveLink = getInternalCurrentAnchor(
      links,
      targetOffset !== undefined ? targetOffset : offsetTop || 0,
      bounds,
    );

    setCurrentActiveLink(currentActiveLink);
  }, [dependencyListItem, targetOffset, offsetTop]);

  const handleScrollTo = React.useCallback<(link: string) => void>(
    (link) => {
      setCurrentActiveLink(link);
      const sharpLinkMatch = sharpMatcherRegex.exec(link);
      if (!sharpLinkMatch) {
        return;
      }
      const targetElement = document.getElementById(sharpLinkMatch[1]);
      if (!targetElement) {
        return;
      }

      const container = getCurrentContainer();
      const scrollTop = getScroll(container);
      const eleOffsetTop = getOffsetTop(targetElement, container);
      let y = scrollTop + eleOffsetTop;
      y -= targetOffset !== undefined ? targetOffset : offsetTop || 0;
      animating.current = true;
      scrollTo(y, {
        getContainer: getCurrentContainer,
        callback() {
          animating.current = false;
        },
      });
    },
    [targetOffset, offsetTop],
  );

  const anchorClass = clsx(
    prefixCls,
    {
      [`${prefixCls}-fixed`]: !affix && !showInkInFixed,
      [`${prefixCls}-horizontal`]: anchorDirection === 'horizontal',
    },
    'relative ps-[2px] text-sm text-text',
    'before:absolute before:border-solid before:border-fill-secondary',
    {
      'flex before:bottom-0 before:left-0 before:right-0 before:border-b':
        anchorDirection === 'horizontal',
      'before:start-0 before:top-0 before:h-full before:border-s-2': anchorDirection === 'vertical',
    },
    semanticCls.root,
  );

  const inkClass = clsx(
    `${prefixCls}-ink`,
    {
      [`${prefixCls}-ink-visible`]: activeLink,
    },
    'absolute hidden bg-primary duration-300',
    {
      'inline-block': activeLink,
      'start-0 w-[2px] -translate-y-1/2 transition-[top]': anchorDirection === 'vertical',
      'bottom-0 h-[2px]': anchorDirection === 'horizontal',
    },
    semanticCls.ink,
  );

  const createNestedLink = (options?: AnchorLinkItemProps[]) =>
    Array.isArray(options)
      ? options.map((item) => {
          const itemCls = getSemanticCls(item.className);
          const cls = {
            root: clsx(semanticCls.link, itemCls.root),
            title: clsx(semanticCls.title, itemCls.title),
          };
          return (
            <AnchorLink replace={replace} {...item} className={cls} key={item.key}>
              {anchorDirection === 'vertical' && createNestedLink(item.children)}
            </AnchorLink>
          );
        })
      : null;

  const anchorContent = (
    <div ref={anchorRef} className={anchorClass} style={style}>
      <span className={inkClass} ref={spanLinkNode} />
      {createNestedLink(items)}
    </div>
  );

  React.useEffect(() => {
    const scrollContainer = getCurrentContainer();
    handleScroll();
    scrollContainer?.addEventListener('scroll', handleScroll);
    return () => {
      scrollContainer?.removeEventListener('scroll', handleScroll);
    };
  }, [dependencyListItem]);

  React.useEffect(() => {
    if (typeof getCurrentAnchor === 'function') {
      setCurrentActiveLink(getCurrentAnchor(activeLinkRef.current || ''));
    }
  }, [getCurrentAnchor]);

  React.useEffect(() => {
    updateInk();
  }, [anchorDirection, getCurrentAnchor, dependencyListItem, activeLink]);

  const memoizedContextValue = React.useMemo<AntAnchor>(
    () => ({
      registerLink,
      unregisterLink,
      scrollTo: handleScrollTo,
      activeLink,
      onClick,
      direction: anchorDirection,
    }),
    [activeLink, onClick, handleScrollTo, anchorDirection],
  );

  return (
    <AnchorContext.Provider value={memoizedContextValue}>
      {affix ? (
        <Affix offsetTop={offsetTop} target={getCurrentContainer}>
          {anchorContent}
        </Affix>
      ) : (
        anchorContent
      )}
    </AnchorContext.Provider>
  );
};

if (process.env.NODE_ENV !== 'production') {
  Anchor.displayName = 'Anchor';
}

export default Anchor;
