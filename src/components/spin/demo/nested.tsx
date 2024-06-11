/**
 * description: 可以直接把内容内嵌到 `Spin` 中，将现有容器变为加载状态。
 */
import { Alert, Spin, Switch } from 'metis-ui';
import React from 'react';

const App: React.FC = () => {
  const [loading, setLoading] = React.useState<boolean>(false);
  return (
    <>
      <Spin spinning={loading}>
        <Alert
          type="info"
          message="Alert message title"
          description="Further details about the context of this alert."
        />
      </Spin>
      <div style={{ marginTop: 16 }}>
        Loading state：
        <Switch checked={loading} onChange={setLoading} />
      </div>
    </>
  );
};

export default App;
