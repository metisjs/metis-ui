import React, { type FC } from 'react';
import { IPreviewerProps, useIntl } from 'dumi';
import { Tooltip } from 'metis-ui';
import ExternalLinkIcon from '../..//icons/ExternalLinkIcon';
import CodeExpandIcon from '../../icons/CodeExpandIcon';
import CodeIcon from '../../icons/CodeIcon';

const track = ({ type, demo }: { type: string; demo: string }) => {
  window.gtag?.('event', 'demo', { event_category: type, event_label: demo });
};

export type ActionsProps = IPreviewerProps & {
  showCode?: boolean;
  onShowCodeChange?: (show: boolean) => void;
};

const Actions: FC<ActionsProps> = (props) => {
  const intl = useIntl();

  const handleCodeExpand = () => {
    track({ type: 'expand', demo: props.assetId });
    props.onShowCodeChange?.(!props.showCode);
  };

  return (
    <>
      <Tooltip
        title={intl.formatMessage({
          id: 'previewer.actions.separate',
        })}
      >
        <a target="_blank" rel="noreferrer" href={props.demoUrl} className="ml-auto">
          <ExternalLinkIcon className="size-3.5" />
        </a>
      </Tooltip>
      <Tooltip
        title={intl.formatMessage({
          id: `previewer.actions.code.${props.showCode ? 'shrink' : 'expand'}`,
        })}
      >
        <button type="button" onClick={handleCodeExpand}>
          {props.showCode ? (
            <CodeExpandIcon className="size-3.5" />
          ) : (
            <CodeIcon className="size-3.5" />
          )}
        </button>
      </Tooltip>
    </>
  );
};

export default Actions;
