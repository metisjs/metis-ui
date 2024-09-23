import React, { useRef, useState } from 'react';
import type { InputRef, TextAreaRef } from 'metis-ui';
import { Button, Input, Space, Switch } from 'metis-ui';

const App: React.FC = () => {
  const inputRef = useRef<InputRef>(null);
  const textareaRef = useRef<TextAreaRef>(null);
  const [input, setInput] = useState(true);

  const sharedProps = {
    className: 'w-full',
    defaultValue: 'love you!',
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
        <Switch
          checked={input}
          checkedChildren="Input"
          unCheckedChildren="TextArea"
          onChange={() => {
            setInput(!input);
          }}
        />
      </Space>
      <br />
      {input ? (
        <Input {...sharedProps} ref={inputRef} />
      ) : (
        <Input.TextArea {...sharedProps} ref={textareaRef} />
      )}
    </Space>
  );
};

export default App;
