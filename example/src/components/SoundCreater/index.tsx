import { Button, Form } from "@douyinfe/semi-ui";
import { FormApi } from "@douyinfe/semi-ui/lib/es/form";
import { ImageToAudioOptions } from "image-to-audio"
import { useCallback, useRef } from "react";
import { ImageSelectorItem, initList } from "../ImageSelector";

export type SoundCreaterParams = {
  url: string;
} & ImageToAudioOptions

export type SoundCreaterProps = {
  onSubmit?: (values: SoundCreaterParams) => void;
}

const SoundCreater: React.FC<SoundCreaterProps> = ({
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
      initValues={{
        url: initList[0].url as string,
        sampleRate: 44100,
        maxFreq: 20000,
        bpm: 60,
        beat: 1 / 4
      }}
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