import React, { useRef, useState, type FC } from 'react';
import { useLiveDemo, useSiteData, type IPreviewerProps } from 'dumi';
import { Alert, clsx } from 'metis-ui';
import Actions from './Actions';
import SourceCode from './SourceCode';

export type MetisPreviewerProps = IPreviewerProps & {
  simplify?: boolean;
};

const Previewer: FC<MetisPreviewerProps> = (props) => {
  const { pkg } = useSiteData();
  const demoContainer = useRef<HTMLDivElement>(null!);
  const link = `#${props.asset.id}`;

  const {
    node: liveDemoNode,
    error: liveDemoError,
    setSource: setLiveDemoSource,
  } = useLiveDemo(props.asset.id, {
    iframe: Boolean(props.iframe || props._live_in_iframe),
    containerRef: demoContainer,
  });

  const [showCode, setShowCode] = useState(props.forceShowCode || props.defaultShowCode);

  return (
    <div
      id={props.asset.id}
      className={clsx(
        'mt-6 flex flex-col gap-1 rounded-xl bg-gray-950/5 p-1 inset-ring inset-ring-gray-950/5 in-[.demo-grid]:mt-0 dark:bg-white/10 dark:inset-ring-white/10',
        props.className,
      )}
      style={props.style}
    >
      {!props.simplify && (
        <div className="flex gap-2 px-3 pt-0.5 pb-1.5 *:inline-flex *:items-center *:text-xs/5 *:text-gray-400 *:hover:text-gray-500 dark:*:text-white/50 dark:*:hover:text-white/70">
          {props.iframe && (
            <div className="relative w-12 before:absolute before:block before:h-2 before:w-2 before:rounded-full before:bg-[#f44] before:shadow-[0_0_0_2px_#f44,_1.5em_0_0_2px_#9b3,_3em_0_0_2px_#fb5]" />
          )}
          {(props.title || props.debug) && (
            <a href={link}>
              {props.title}
              {props.debug && <span className="text-warning ml-2">DEV ONLY</span>}
            </a>
          )}
          <Actions
            {...props}
            showCode={showCode}
            onShowCodeChange={setShowCode}
            description={`metis-ui@${pkg.version}`}
          />
        </div>
      )}
      <div
        className={clsx(
          'overflow-auto rounded-lg bg-white p-8 outline outline-white/5 dark:bg-gray-950/50',
          {
            'p-0': props.simplify || props.compact || props.iframe,
            relative: props.iframe,
          },
        )}
        style={{
          background: props.background,
          ...(props.transform && { transform: 'translate(0, 0)' }),
        }}
        ref={demoContainer}
      >
        {props.iframe ? (
          <iframe
            className="block h-72 w-full"
            style={
              ['string', 'number'].includes(typeof props.iframe)
                ? { height: Number(props.iframe) }
                : {}
            }
            src={props.demoUrl}
          ></iframe>
        ) : (
          liveDemoNode || props.children
        )}
      </div>
      {liveDemoError && (
        <Alert banner type="error" message={liveDemoError.toString()} className="rounded-lg" />
      )}
      {showCode && <SourceCode {...props} onSourceChange={setLiveDemoSource} />}
    </div>
  );
};

export default Previewer;
