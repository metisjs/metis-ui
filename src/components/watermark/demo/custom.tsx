import React, { useState } from 'react';
import type { WatermarkProps } from 'metis-ui';
import { ColorPicker, Form, Input, InputNumber, Slider, Space, Watermark } from 'metis-ui';
import type { AggregationColor } from 'metis-ui/es/color-picker/color';

interface WatermarkConfig {
  content: string;
  color: string | AggregationColor;
  fontSize: number;
  zIndex: number;
  rotate: number;
  gap: [number, number];
  offset?: [number, number];
}

const App: React.FC = () => {
  const [form] = Form.useForm();
  const [config, setConfig] = useState<WatermarkConfig>({
    content: 'Metis UI',
    color: 'rgba(0, 0, 0, 0.15)',
    fontSize: 16,
    zIndex: 11,
    rotate: -22,
    gap: [100, 100],
    offset: undefined,
  });
  const { content, color, fontSize, zIndex, rotate, gap, offset } = config;

  const watermarkProps: WatermarkProps = {
    content,
    zIndex,
    rotate,
    gap,
    offset,
    font: { color: typeof color === 'string' ? color : color.toRgbString(), fontSize },
  };

  return (
    <Space block size="middle">
      <Watermark {...watermarkProps}>
        <div>
          <p>
            The light-speed iteration of the digital world makes products more complex. However,
            human consciousness and attention resources are limited. Facing this design
            contradiction, the pursuit of natural interaction will be the consistent direction of
            Metis UI.
          </p>
          <p>
            Natural user cognition: According to cognitive psychology, about 80% of external
            information is obtained through visual channels. The most important visual elements in
            the interface design, including layout, colors, illustrations, icons, etc., should fully
            absorb the laws of nature, thereby reducing the user&apos;s cognitive cost and bringing
            authentic and smooth feelings. In some scenarios, opportunely adding other sensory
            channels such as hearing, touch can create a richer and more natural product experience.
          </p>
          <p>
            Natural user behavior: In the interaction with the system, the designer should fully
            understand the relationship between users, system roles, and task objectives, and also
            contextually organize system functions and services. At the same time, a series of
            methods such as behavior analysis, artificial intelligence and sensors could be applied
            to assist users to make effective decisions and reduce extra operations of users, to
            save users&apos; mental and physical resources and make human-computer interaction more
            natural.
          </p>
        </div>
        <img
          src="https://gw.alipayobjects.com/mdn/rms_08e378/afts/img/A*zx7LTI_ECSAAAAAAAAAAAABkARQnAQ"
          alt="img"
          className="relative z-10 w-full max-w-200"
        />
      </Watermark>
      <Form
        form={form}
        layout="vertical"
        initialValues={config}
        onValuesChange={(_, values) => {
          setConfig(values);
        }}
        className="border-border w-70 shrink-0 border-l ps-4"
      >
        <Form.Item name="content" label="Content">
          <Input />
        </Form.Item>
        <Form.Item name="color" label="Color">
          <ColorPicker />
        </Form.Item>
        <Form.Item name="fontSize" label="FontSize">
          <Slider step={1} min={1} max={100} />
        </Form.Item>
        <Form.Item name="zIndex" label="zIndex">
          <Slider step={1} min={0} max={100} />
        </Form.Item>
        <Form.Item name="rotate" label="Rotate">
          <Slider step={1} min={-180} max={180} />
        </Form.Item>
        <Form.Item label="Gap" className="mb-0">
          <Space block size="small">
            <Form.Item name={['gap', 0]}>
              <InputNumber placeholder="gapX" className="w-full" />
            </Form.Item>
            <Form.Item name={['gap', 1]}>
              <InputNumber placeholder="gapY" className="w-full" />
            </Form.Item>
          </Space>
        </Form.Item>
        <Form.Item label="Offset" className="mb-0">
          <Space block size="small">
            <Form.Item name={['offset', 0]}>
              <InputNumber placeholder="offsetLeft" className="w-full" />
            </Form.Item>
            <Form.Item name={['offset', 1]}>
              <InputNumber placeholder="offsetTop" className="w-full" />
            </Form.Item>
          </Space>
        </Form.Item>
      </Form>
    </Space>
  );
};

export default App;
