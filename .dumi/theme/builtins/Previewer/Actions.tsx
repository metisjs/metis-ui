import React, { type FC } from 'react';
import { IPreviewerProps, useIntl } from 'dumi';
import { Tooltip } from 'metis-ui';
import ExternalLinkIcon from '../..//icons/ExternalLinkIcon';
import CodeExpandIcon from '../../icons/CodeExpandIcon';
import CodeIcon from '../../icons/CodeIcon';

export type ActionsProps = IPreviewerProps & {
  showCode?: boolean;
  onShowCodeChange?: (show: boolean) => void;
};

const Actions: FC<ActionsProps> = (props) => {
  const intl = useIntl();

  return (
    <>
      <Tooltip
        title={intl.formatMessage({
          id: 'previewer.actions.separate',
        })}
      >
        <a target="_blank" rel="noreferrer" href={props.demoUrl}>
          <ExternalLinkIcon className="size-3.5" />
        </a>
      </Tooltip>
      <Tooltip
        title={intl.formatMessage({
          id: `previewer.actions.code.${props.showCode ? 'shrink' : 'expand'}`,
        })}
      >
        <button type="button" onClick={() => props.onShowCodeChange?.(!props.showCode)}>
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
