import React, { useState } from 'react';
import { range } from 'lodash';
import { Button, Modal, Space } from 'metis-ui';

const App: React.FC = () => {
  const [openWidth, setOpenWidth] = useState(false);
  const [openHeight, setOpenHeight] = useState(false);

  return (
    <Space vertical>
      <Button type="primary" onClick={() => setOpenWidth(true)}>
        Open Modal of 1000px width
      </Button>
      <Button type="primary" onClick={() => setOpenHeight(true)}>
        Open Modal of 500px height
      </Button>
      <Modal
        title="Modal 1000px width"
        centered
        open={openWidth}
        onOk={() => setOpenWidth(false)}
        onCancel={() => setOpenWidth(false)}
        width={1000}
      >
        <p>some contents...</p>
        <p>some contents...</p>
        <p>some contents...</p>
      </Modal>
      <Modal
        title="Modal 500px height"
        centered
        open={openHeight}
        onOk={() => setOpenHeight(false)}
        onCancel={() => setOpenHeight(false)}
        height={500}
      >
        {range(100).map((i) => (
          <p key={i}>some contents...</p>
        ))}
      </Modal>
    </Space>
  );
};

export default App;
