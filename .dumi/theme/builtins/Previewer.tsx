import React, { useRef, type FC } from 'react';
import { XCircleSolid } from '@metisjs/icons';
import { useLiveDemo, useLocation, type IPreviewerProps } from 'dumi';
import PreviewerActions from 'dumi/theme-default/slots/PreviewerActions';
import { clsx } from 'metis-ui';
import 'dumi/theme-default/builtins/Previewer/index.less';

export type MetisPreviewerProps = IPreviewerProps & {
  simplify?: boolean;
};

const Previewer: FC<MetisPreviewerProps> = (props) => {
  const { simplify } = props;
  const demoContainer = useRef<HTMLDivElement>(null);
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
      className={clsx('dumi-default-previewer', props.className)}
      style={props.style}
      data-debug={props.debug}
      data-active={hash === link || undefined}
    >
      <div
        className={clsx('dumi-default-previewer-demo', {
          'p-0': simplify,
        })}
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
        <div className="dumi-default-previewer-demo-error">
          <XCircleSolid />
          {liveDemoError.toString()}
        </div>
      )}
      {!simplify && (
        <div className="dumi-default-previewer-meta">
          {(props.title || props.debug) && (
            <div className="dumi-default-previewer-desc">
              <h5>
                <a href={link}>
                  {props.debug && <strong>DEV ONLY</strong>}
                  {props.title}
                </a>
              </h5>
              {props.description && (
                <div className="markdown" dangerouslySetInnerHTML={{ __html: props.description }} />
              )}
            </div>
          )}
          <PreviewerActions
            {...props}
            onSourceChange={setLiveDemoSource}
            demoContainer={
              props.iframe
                ? (demoContainer.current?.firstElementChild as HTMLIFrameElement)
                : demoContainer.current!
            }
          />
        </div>
      )}
    </div>
  );
};

export default Previewer;
