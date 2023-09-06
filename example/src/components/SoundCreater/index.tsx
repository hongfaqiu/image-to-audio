import { Button, Form } from "@douyinfe/semi-ui";
import { FormApi } from "@douyinfe/semi-ui/lib/es/form";
import {
  ImageToAudioOptions,
  LeftToRightRGBOptions,
  LtoRVarianceToMelodicOptions,
} from "image-to-audio";
import { useCallback, useRef, useState } from "react";
import { ImageSelectorItem } from "../ImageSelector";

export type SoundCreaterState = "LeftToRightRGB" | "VarianceToMelodic";

export type SoundCreaterParams = {
  url: string;
  method: string;
} & ImageToAudioOptions &
  (LeftToRightRGBOptions | { melodicScales: string });

export type SoundCreaterProps = {
  initValues?: SoundCreaterParams;
  onSubmit?: (values: SoundCreaterParams) => void;
};

const SoundCreater: React.FC<SoundCreaterProps> = ({
  initValues,
  onSubmit,
}) => {
  const $form = useRef<FormApi<SoundCreaterParams>>();
  const [state, setState] = useState<SoundCreaterState>("LeftToRightRGB");
  const { Option } = Form.Select;

  const submit = useCallback(() => {
    console.log($form.current?.getFormState());
    $form.current?.validate().then((values) => {
      onSubmit?.(values);
    });
  }, [onSubmit]);

  const optionalFormsGenerator = (currentState: SoundCreaterState) => {
    if (currentState === "LeftToRightRGB") {
      return <Form.InputNumber initValue={20000} field="maxFreq" />;
    }
    if (currentState === "VarianceToMelodic") {
      return (
        <Form.Select
          field="melodicScales"
          initValue="C_MAJOR"
          label={{ text: "Melodic Scales" }}
          rules={[{ required: true, message: "required error" }]}
        >
          <Option value="ANCIENT_PENTATONIC">宫商角徵羽</Option>
          <Option value="C_MAJOR">C Major</Option>
          <Option value="C_HARMONIC_MAJOR">C Harmonic Major</Option>
          <Option value="C_MELODY_MAJOR">C Melody Major</Option>
          <Option value="A_MINOR">A Minor</Option>
          <Option value="A_HARMONIC_MINOR">A Harmonic Minor</Option>
          <Option value="A_MELODY_MINOR">A Melody Minor Scales</Option>      
        </Form.Select>
      );
    }
  };
  const optionalForms = optionalFormsGenerator(state);
  const methodOnChange = (value:any) => {
    if (value === "LeftToRightRGB"||value === "VarianceToMelodic") {
      setState(value);
    }
  }

  return (
    <Form<SoundCreaterParams>
      initValues={initValues}
      getFormApi={(formApi: FormApi<any> | undefined) =>
        ($form.current = formApi)
      }
      onSubmit={submit}
    >
      <ImageSelectorItem
        field="url"
        label="Image"
        rules={[
          {
            required: true,
            message: "Please chose image",
          },
        ]}
      />
      <Form.Select
        field="method"
        label={{ text: "Convert Methods" }}
        rules={[{ required: true, message: "required error" }]}
        onChange={methodOnChange}
      >
        <Option value="LeftToRightRGB">LeftToRightRGB</Option>
        <Option value="VarianceToMelodic">VarianceToMelodic</Option>
      </Form.Select>
      {optionalForms}
      <Form.InputNumber field="sampleRate" />
      <Form.InputNumber field="bpm" />
      <Form.InputNumber field="beat" />
      <Button htmlType="submit">convert to sound</Button>
    </Form>
  );
};

export default SoundCreater;
