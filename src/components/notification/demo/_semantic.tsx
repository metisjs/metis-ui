import React from 'react';
import { Button, Space } from 'metis-ui';
import InternalPanel from 'metis-ui/es/notification/PurePanel';
import SemanticPreview from '../../../../.dumi/components/SemanticPreview';

const App: React.FC = () => (
  <SemanticPreview
    semantics={[
      { name: 'root' },
      { name: 'icon' },
      { name: 'message' },
      { name: 'description' },
      { name: 'close' },
      { name: 'progress' },
      { name: 'btn' },
    ]}
  >
    <InternalPanel
      showProgress
      closable
      duration={Number.MAX_SAFE_INTEGER}
      type="error"
      message="Notification Title"
      description="This is the content of the notification. This is the content of the notification. This is the content of the notification."
      btn={
        <Space>
          <Button type="primary" size="small">
            Confirm
          </Button>
          <Button type="text" size="small">
            Destroy All
          </Button>
        </Space>
      }
    />
  </SemanticPreview>
);

export default App;
