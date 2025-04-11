import React, { useRef, type FC } from 'react';
import { useLiveDemo, useLocation, type IPreviewerProps } from 'dumi';
import PreviewerActions from 'dumi/theme-default/slots/PreviewerActions';
import { Alert, clsx, Tag, Tooltip } from 'metis-ui';

export type MetisPreviewerProps = IPreviewerProps & {
  simplify?: boolean;
};

const Previewer: FC<MetisPreviewerProps> = (props) => {
  const { simplify } = props;
  const demoContainer = useRef<HTMLDivElement>(null!);
  const { hash } = useLocation();
  const link = `#${props.asset.id}`;

  const {
    node: liveDemoNode,
    error: liveDemoError,
    loading: liveDemoLoading,
    setSource: setLiveDemoSource,
  } = useLiveDemo(props.asset.id, {
    iframe: Boolean(props.iframe || props._live_in_iframe),
    containerRef: demoContainer,
  });

  return (
    <div
      id={props.asset.id}
      className={clsx(
        'flex flex-col gap-1 rounded-xl bg-gray-950/5 p-1 inset-ring inset-ring-gray-950/5 dark:bg-white/10 dark:inset-ring-white/10',
        props.className,
      )}
      style={props.style}
      data-debug={props.debug}
      data-active={hash === link || undefined}
    >
      {(props.title || props.debug) && (
        <div className="flex justify-between px-3 pt-0.5 pb-1.5 text-xs/5 text-gray-400 dark:text-white/50">
          <a href={link} className="text-gray-400 dark:text-white/50">
            {props.title}
            {props.debug && <span className="text-warning ml-2">DEV ONLY</span>}
          </a>
          <div className="ml-auto flex gap-4">
            {props.description && (
              <Tooltip
                title={
                  <div
                    className="markdown *:[p]:m-0"
                    dangerouslySetInnerHTML={{ __html: props.description }}
                  />
                }
                className={{ overlay: 'max-w-300' }}
              >
                desc
              </Tooltip>
            )}
          </div>
        </div>
      )}
      <div
        className={clsx(
          'overflow-auto rounded-lg bg-white p-8 outline outline-white/5 dark:bg-gray-950/50',
          {
            'p-0': simplify,
          },
        )}
        style={{ background: props.background }}
        data-compact={props.compact || undefined}
        data-transform={props.transform || undefined}
        data-iframe={props.iframe || undefined}
        data-error={Boolean(liveDemoError) || undefined}
        data-loading={liveDemoLoading || undefined}
        ref={demoContainer}
      >
        {props.iframe ? (
          <iframe
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
    </div>
  );
};

export default Previewer;
