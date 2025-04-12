import React, { type FC } from 'react';
import { IPreviewerProps, openCodeSandbox, openStackBlitz, useIntl } from 'dumi';
import { Tooltip } from 'metis-ui';
import ExternalLinkIcon from '../..//icons/ExternalLinkIcon';
import CodeExpandIcon from '../../icons/CodeExpandIcon';
import CodeIcon from '../../icons/CodeIcon';
import CodeSandboxIcon from '../../icons/CodeSandboxIcon';
import StackBlitzIcon from '../../icons/StackBlitzIcon';

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
          id: 'previewer.actions.codesandbox',
        })}
      >
        <button className="ml-auto" type="button" onClick={() => openCodeSandbox(props)}>
          <CodeSandboxIcon className="size-3.5" />
        </button>
      </Tooltip>
      <Tooltip
        title={intl.formatMessage({
          id: 'previewer.actions.stackblitz',
        })}
      >
        <button type="button" onClick={() => openStackBlitz(props)}>
          <StackBlitzIcon className="size-3.5" />
        </button>
      </Tooltip>
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
