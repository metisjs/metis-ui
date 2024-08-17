import React, { useState } from 'react';
import { Button, Scrollbar, Space } from 'metis-ui';

const lorem = `Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam
  nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam
  erat, sed diam voluptua. At vero eos et accusam et justo duo dolores
  et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est
  Lorem ipsum dolor sit amet.Lorem ipsum dolor sit amet, consetetur
  sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore
  et dolore magna aliquyam erat, sed diam voluptua. At vero eos et
  accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren,
  no sea takimata sanctus est Lorem ipsum dolor sit amet.`;

export default () => {
  const [content, setContent] = useState(lorem);

  const handleIncrease = () => {
    setContent(content + lorem);
  };

  return (
    <Space vertical>
      <Scrollbar className="w-[600px]" autoHeight={[0, 300]}>
        {content}
      </Scrollbar>
      <Button type="primary" onClick={handleIncrease}>
        Increase
      </Button>
    </Space>
  );
};
