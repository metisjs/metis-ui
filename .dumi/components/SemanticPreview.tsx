import React from 'react';
import { clsx, Popover, Tag } from 'metis-ui';

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
};

export interface SemanticPreviewProps {
  semantics: SemanticItem[];
  children: React.ReactElement;
  height?: number;
  rootArgs?: SemanticArg[];
}

type ClassNameItemProps = SemanticItem & {
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
  onHover,
}: ClassNameItemProps) => (
  <>
    <li
      className="flex items-center px-3 py-4 hover:bg-fill-quaternary"
      style={{ paddingLeft: indent * 16 + 12 }}
      onMouseEnter={() => onHover(name)}
      onMouseLeave={() => onHover(null)}
    >
      <span className="text-base">{name}</span>
      {version && (
        <Tag color="processing" className="ml-2">
          {version}
        </Tag>
      )}
      {args && args.length > 0 && (
        <ArgsPopover args={args}>
          <Tag color="warning" className="ml-auto">
            Args:{args.length}
          </Tag>
        </ArgsPopover>
      )}
    </li>
    {children &&
      children.length > 0 &&
      children.map((child) => (
        <ClassNameItem key={child.name} {...child} indent={indent + 1} onHover={onHover} />
      ))}
  </>
);

function parseSemanticCls(semantics: SemanticItem[], getMarkClassName: (key: string) => string) {
  const result: Record<string, any> = {};

  semantics.forEach(({ name, children }) => {
    const markCls = getMarkClassName(name);

    if (children) {
      result[name] = { root: markCls, ...parseSemanticCls(children, getMarkClassName) };
    } else {
      result[name] = markCls;
    }
  });
  return result;
}

const SemanticPreview: React.FC<SemanticPreviewProps> = (props) => {
  const { semantics = [], children, height, rootArgs } = props;

  // ======================= Semantic =======================
  const getMarkClassName = React.useCallback(
    (semanticKey: string) => `semantic-mark-${semanticKey}`,
    [],
  );

  const semanticClassName = React.useMemo<Record<string, string>>(
    () => parseSemanticCls(semantics, getMarkClassName),
    [semantics],
  );

  const cloneNode = React.cloneElement(children, {
    className: semanticClassName,
  });

  // ======================== Hover =========================
  const containerRef = React.useRef<HTMLDivElement>(null);

  const timerRef = React.useRef<ReturnType<typeof setTimeout>>();

  const [positionTransition, setPositionTransition] = React.useState<boolean>(false);
  const [hoverSemantic, setHoverSemantic] = React.useState<string | null>(null);
  const [markPos, setMarkPos] = React.useState<[number, number, number, number]>([0, 0, 0, 0]);

  React.useEffect(() => {
    if (hoverSemantic) {
      const targetClassName = getMarkClassName(hoverSemantic);
      const targetElement = containerRef.current?.querySelector<HTMLElement>(`.${targetClassName}`);
      const containerRect = containerRef.current?.getBoundingClientRect();
      const targetRect = targetElement?.getBoundingClientRect();
      setMarkPos([
        (targetRect?.left || 0) - (containerRect?.left || 0),
        (targetRect?.top || 0) - (containerRect?.top || 0),
        targetRect?.width || 0,
        targetRect?.height || 0,
      ]);
      timerRef.current = setTimeout(() => {
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
        <div className="flex basis-2/3 items-center justify-center overflow-hidden p-5">
          {cloneNode}
        </div>
        <div className="basis-1/3">
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
              <ClassNameItem {...item} key={item.name} onHover={setHoverSemantic} />
            ))}
          </ul>
        </div>
      </div>
      <div
        className={clsx(
          'pointer-events-none absolute z-[99999999] border-warning',
          hoverSemantic ? 'opacity-100' : 'opacity-0',
          positionTransition ? 'transition-all duration-300' : 'transition-opacity duration-300',
        )}
        style={{
          borderWidth: MARK_BORDER_SIZE,
          left: markPos[0] - MARK_BORDER_SIZE,
          top: markPos[1] - MARK_BORDER_SIZE,
          width: markPos[2] + MARK_BORDER_SIZE * 2,
          height: markPos[3] + MARK_BORDER_SIZE * 2,
        }}
      />
    </div>
  );
};

export default SemanticPreview;
