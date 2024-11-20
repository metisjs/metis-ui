import React, { forwardRef } from 'react';
import { LinkOutline } from '@metisjs/icons';
import { Link } from 'dumi';
import { clsx, mergeSemanticCls, Popover, Space, Tag } from 'metis-ui';
import { cloneElement } from 'metis-ui/es/_util/reactNode';

const MARK_BORDER_SIZE = 2;

type SemanticArg = {
  name: string;
  type: string;
  version?: string;
};

type SemanticItem = {
  name: string;
  args?: SemanticArg[];
  version?: string;
  children?: SemanticItem[];
  link?: string;
  desc?: string;
};

export interface SemanticPreviewProps {
  transform?: boolean;
  semantics: SemanticItem[];
  children: React.ReactElement | ((hover?: { name: string; path: string }) => React.ReactElement);
  height?: number;
  rootArgs?: SemanticArg[];
  extra?: React.ReactNode;
}

type ClassNameItemProps = SemanticItem & {
  path: string;
  indent?: number;
  onHover: (name: string | null) => void;
};

const ArgsPopover = ({ args, children }: { args?: SemanticArg[]; children: React.ReactNode }) =>
  args && args.length ? (
    <Popover
      content={
        <ul className="divide-y divide-border-secondary">
          {args.map(({ name, type, version }) => (
            <li key={name} className="flex items-center py-2">
              <span>{name}</span>
              <span className="ml-1 text-text-tertiary">: {type}</span>
              {version && (
                <Tag color="processing" className="ml-4">
                  {version}
                </Tag>
              )}
            </li>
          ))}
        </ul>
      }
    >
      {children}
    </Popover>
  ) : (
    <>{children}</>
  );

const ClassNameItem = ({
  name,
  version,
  args,
  children,
  indent = 0,
  path,
  link,
  desc,
  onHover,
}: ClassNameItemProps) => (
  <>
    <li
      className="flex h-14 items-center px-3 hover:bg-fill-quaternary"
      style={{ paddingLeft: indent * 16 + 12 }}
      onMouseEnter={() => onHover(path)}
      onMouseLeave={() => onHover(null)}
    >
      <div className="flex-1 items-center">
        <div>
          {link && (
            <Link to={link}>
              <span className="text-base text-text hover:text-primary">{name}</span>
            </Link>
          )}
          {!link && <span className="text-base text-text">{name}</span>}
          {version && (
            <Tag color="processing" className="ml-2">
              {version}
            </Tag>
          )}
        </div>
        {desc && <div className="text-xs text-text-tertiary">{desc}</div>}
      </div>

      <Space className="ml-auto">
        {link && (
          <Link to={link} className="inline-flex items-center">
            <LinkOutline className="h-4 w-4" />
          </Link>
        )}
        {args && args.length > 0 && (
          <ArgsPopover args={args}>
            <Tag color="warning">Args:{args.length}</Tag>
          </ArgsPopover>
        )}
      </Space>
    </li>
    {children &&
      children.length > 0 &&
      children.map((child) => (
        <ClassNameItem
          key={`${name}_${child.name}`}
          {...child}
          path={`${path}_${child.name}`}
          indent={indent + 1}
          onHover={onHover}
        />
      ))}
  </>
);

function parseSemanticCls(
  semantics: SemanticItem[],
  parent: string | null = null,
  getMarkClassName: (key: string) => string,
) {
  const result: Record<string, any> = {};

  semantics.forEach(({ name, children }) => {
    const pathName = parent ? `${parent}_${name}` : name;
    const markCls = getMarkClassName(pathName);

    if (children) {
      result[name] = {
        root: markCls,
        ...parseSemanticCls(children, pathName, getMarkClassName),
      };
    } else {
      result[name] = markCls;
    }
  });
  return result;
}

const SemanticPreview = forwardRef<HTMLDivElement, SemanticPreviewProps>((props, ref) => {
  const { transform, semantics = [], children, height, rootArgs, extra } = props;

  // ======================= Semantic =======================
  const getMarkClassName = React.useCallback(
    (semanticKey: string) => `semantic-mark-${semanticKey}`,
    [],
  );

  const semanticClassName = React.useMemo<Record<string, string>>(
    () => parseSemanticCls(semantics, null, getMarkClassName),
    [semantics],
  );

  // ======================== Hover =========================
  const containerRef = React.useRef<HTMLDivElement>(null);

  const timerRef = React.useRef<ReturnType<typeof setTimeout>>();

  const [positionTransition, setPositionTransition] = React.useState<boolean>(false);
  const [hoverSemantic, setHoverSemantic] = React.useState<string | null>(null);
  const [markPositions, setMarkPositions] = React.useState<[number, number, number, number][]>([
    [0, 0, 0, 0],
  ]);

  // ======================== Children =========================
  const mergedChildren =
    typeof children === 'function'
      ? children(
          hoverSemantic
            ? {
                name: hoverSemantic.replace('semantic-mark-', '').split('_').reverse()[0],
                path: hoverSemantic,
              }
            : undefined,
        )
      : children;
  const cloneNode = cloneElement(mergedChildren, (ori) => ({
    className: mergeSemanticCls(ori.className, semanticClassName),
  }));

  React.useEffect(() => {
    if (hoverSemantic) {
      timerRef.current = setTimeout(() => {
        const targetClassName = getMarkClassName(hoverSemantic);
        const targetElements = containerRef.current?.querySelectorAll<HTMLElement>(
          `.${targetClassName}`,
        );

        const containerRect = containerRef.current?.getBoundingClientRect();

        setMarkPositions(() =>
          Array.from(targetElements ?? []).map((targetElement) => {
            const targetRect = targetElement?.getBoundingClientRect();
            return [
              (targetRect?.left || 0) - (containerRect?.left || 0),
              (targetRect?.top || 0) - (containerRect?.top || 0),
              targetRect?.width || 0,
              targetRect?.height || 0,
            ];
          }),
        );

        setPositionTransition(true);
      }, 10);
    } else {
      timerRef.current = setTimeout(() => {
        setPositionTransition(false);
      }, 500);
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [hoverSemantic]);

  // ======================== Render ========================
  return (
    <div className="relative rounded" ref={containerRef}>
      <div className="flex divide-x divide-border-secondary" style={{ minHeight: height }}>
        <div className="flex flex-auto flex-col divide-y divide-border-secondary">
          {extra && <div className="flex h-[62px] items-center px-5">{extra}</div>}
          <div
            ref={ref}
            className="relative flex flex-auto items-center justify-center overflow-hidden p-5"
            style={transform ? { transform: 'translate(0, 0)' } : {}}
          >
            {cloneNode}
          </div>
        </div>
        <div className="basis-72">
          <ul className="divide-y divide-border-secondary">
            {
              <li className="bg-fill-quinary px-3 py-2">
                <div className="flex items-center">
                  <span className="mr-auto text-base">Root Arguments</span>
                  <ArgsPopover args={rootArgs}>
                    <Tag color="warning" className="ml-auto">
                      {rootArgs?.length ?? 0}
                    </Tag>
                  </ArgsPopover>
                </div>
                <div className="mt-0.5 text-text-tertiary">
                  usage: (&#123; arg1 &#125;) =&gt; clsx(arg1 && '...')
                </div>
              </li>
            }
            {semantics.map((item) => (
              <ClassNameItem
                {...item}
                key={item.name}
                path={item.name}
                onHover={setHoverSemantic}
              />
            ))}
          </ul>
        </div>
      </div>
      {markPositions.map((pos, i) => (
        <div
          key={i}
          className={clsx(
            'pointer-events-none absolute z-[99999999] border-warning ring-1 ring-transparent',
            hoverSemantic ? 'opacity-100' : 'opacity-0',
            positionTransition ? 'transition-all duration-300' : 'transition-opacity duration-300',
          )}
          style={{
            borderWidth: MARK_BORDER_SIZE,
            left: pos[0] - MARK_BORDER_SIZE,
            top: pos[1] - MARK_BORDER_SIZE,
            width: pos[2] + MARK_BORDER_SIZE * 2,
            height: pos[3] + MARK_BORDER_SIZE * 2,
          }}
        />
      ))}
    </div>
  );
});

export default SemanticPreview;
