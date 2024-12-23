import React from 'react';
import { DocumentDuplicateOutline, MagnifyingGlassOutline } from '@metisjs/icons';
import { Button, Cascader, Input, InputNumber, Select, Space, TimePicker } from 'metis-ui';

const App: React.FC = () => (
  <>
    <Space.Compact block>
      <Space.Compact>
        <Space.Compact>
          <Input style={{ width: 90 }} placeholder="Typing..." />
          <Button icon={<MagnifyingGlassOutline />} />
        </Space.Compact>
        <Space.Compact>
          <InputNumber defaultValue={12} />
          <Select
            defaultValue="Option1"
            options={[
              { label: 'Opt1', value: 'Option1' },
              { label: 'Opt2', value: 'Option2' },
            ]}
          />
        </Space.Compact>
      </Space.Compact>
      <Button type="primary">Separator</Button>
      <Space.Compact>
        <Space.Compact>
          <Input style={{ width: 110 }} placeholder="Search" />
          <Button type="primary">Submit</Button>
        </Space.Compact>
        <Space.Compact>
          <Input defaultValue="mysite" />
          <Button icon={<DocumentDuplicateOutline />} />
        </Space.Compact>
      </Space.Compact>
    </Space.Compact>
    <>
      <br />
      <Space.Compact block>
        <Space.Compact>
          <TimePicker />
          <Button type="primary">Submit</Button>
        </Space.Compact>
        <Space.Compact>
          <Cascader
            options={[
              {
                value: 'zhejiang',
                label: 'Zhejiang',
                children: [
                  {
                    value: 'hangzhou',
                    label: 'Hangzhou',
                    children: [
                      {
                        value: 'xihu',
                        label: 'West Lake',
                      },
                    ],
                  },
                ],
              },
              {
                value: 'jiangsu',
                label: 'Jiangsu',
                children: [
                  {
                    value: 'nanjing',
                    label: 'Nanjing',
                    children: [
                      {
                        value: 'zhonghuamen',
                        label: 'Zhong Hua Men',
                      },
                    ],
                  },
                ],
              },
            ]}
            placeholder="Select Address"
          />
          <Button type="primary">Submit</Button>
        </Space.Compact>
      </Space.Compact>
    </>
  </>
);

export default App;
