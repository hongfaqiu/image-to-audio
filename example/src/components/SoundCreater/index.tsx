import { Button, Form } from "@douyinfe/semi-ui";
import { FormApi } from "@douyinfe/semi-ui/lib/es/form";
import { ImageToAudioOptions } from "image-to-audio"
import { useCallback, useRef } from "react";
import { ImageSelectorItem } from "../ImageSelector";

export type SoundCreaterParams = {
  url: string;
} & ImageToAudioOptions

export type SoundCreaterProps = {
  initValues?: SoundCreaterParams;
  onSubmit?: (values: SoundCreaterParams) => void;
}

const SoundCreater: React.FC<SoundCreaterProps> = ({
  initValues,
  onSubmit
}) => {
  const $form = useRef<FormApi<SoundCreaterParams>>();
  
  const submit = useCallback(() => {
    $form.current?.validate().then((values) => {
      onSubmit?.(values)
    });
  }, [onSubmit]);
  
  return (
    <Form<SoundCreaterParams>
      initValues={initValues}
      getFormApi={(formApi: FormApi<any> | undefined) => ($form.current = formApi)}
      onSubmit={submit}
    >
      <ImageSelectorItem
        field="url"
        label='Image'
        rules={[
          {
            required: true,
            message: "Please chose image"
          }
        ]}
      />

      <Form.InputNumber
        field="sampleRate"
      />
      <Form.InputNumber
        field="maxFreq"
      />
      <Form.InputNumber
        field="bpm"
      />
      <Form.InputNumber
        field="beat"
      />
      <Button htmlType="submit" >
        convert to sound
      </Button>
    </Form>
  )
}

export default SoundCreater;