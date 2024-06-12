/**
 * description: 延迟显示 loading 效果。当 spinning 状态在 `delay` 时间内结束，则不显示 loading 状态。
 */
import { Alert, Spin, Switch } from 'metis-ui';
import React from 'react';

const App: React.FC = () => {
  const [loading, setLoading] = React.useState<boolean>(false);
  return (
    <>
      <Spin spinning={loading} delay={500}>
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
