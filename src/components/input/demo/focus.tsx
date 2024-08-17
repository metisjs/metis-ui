import React, { useRef, useState } from 'react';
import type { InputRef } from 'metis-ui';
import { Button, Input, Space } from 'metis-ui';

const App: React.FC = () => {
  const inputRef = useRef<InputRef>(null);
  const [input] = useState(true);

  const sharedProps = {
    style: { width: '100%' },
    defaultValue: 'love you!',
    ref: inputRef,
  };

  return (
    <Space vertical block>
      <Space wrap>
        <Button
          onClick={() => {
            inputRef.current!.focus({
              cursor: 'start',
            });
          }}
        >
          Focus at first
        </Button>
        <Button
          onClick={() => {
            inputRef.current!.focus({
              cursor: 'end',
            });
          }}
        >
          Focus at last
        </Button>
        <Button
          onClick={() => {
            inputRef.current!.focus({
              cursor: 'all',
            });
          }}
        >
          Focus to select all
        </Button>
        <Button
          onClick={() => {
            inputRef.current!.focus({
              preventScroll: true,
            });
          }}
        >
          Focus prevent scroll
        </Button>
        {/* <Switch
          checked={input}
          checkedChildren="Input"
          unCheckedChildren="TextArea"
          onChange={() => {
            setInput(!input);
          }}
        /> */}
      </Space>
      <br />
      {input ? <Input {...sharedProps} /> : <Input.TextArea {...sharedProps} />}
    </Space>
  );
};

export default App;
