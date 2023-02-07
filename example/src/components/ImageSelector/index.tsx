import useMergedState from "@/hooks/useMergedState";
import { IconCheckboxTick, IconPlus } from "@douyinfe/semi-icons";
import { Upload, withField } from "@douyinfe/semi-ui";
import { FileItem, RenderFileItemProps } from "@douyinfe/semi-ui/lib/es/upload";
import Image from "next/image";
import React, { useCallback, useState } from "react";
import styles from './index.module.scss';

export type ImageSelectorProps = {
  value?: string;
  defaultValue?: string;
  onChange?: (value: string | undefined) => void;
}

export const initList: FileItem[] = [{
    uid: '1',
    name: 'fractal.jpg',
    status: 'success',
    size: '4.74KB',
    preview: true,
    url: '/fractal.jpg',
  },
  {
    uid: '2',
    name: 'mona.jpg',
    status: 'success',
    size: '30.5KB',
    preview: true,
    url: '/mona.jpg',
  },
];

const ImageSelector: React.FC<ImageSelectorProps> = ({
  value: inputValue,
  defaultValue,
  onChange
}) => {

  const [value, setValue] = useMergedState(defaultValue, {
    value: inputValue,
    onChange
  })

  const imageSelect = (file: FileItem) => {
    setValue(file.url)
  }

  const Thumbnail = useCallback(
    (file: RenderFileItemProps) => {
      return (
        <div className={styles.thumbnail}>
          {file.url ? <Image
            width={200}
            height={200}
            src={file.url}
            alt={file.name}
          /> : null}
          {
            value === file.url && <IconCheckboxTick className={styles.icon} size="inherit" />
          }
        </div>
      )
    },
    [value],
  )
  
  return (
    <div className={styles.imageSelector}>
      <Upload
        action="#"
        listType="picture"
        defaultFileList={initList}
        onPreviewClick={imageSelect}
        accept={'.png,.jpeg,.tiff,.tif,.gif,.jpg,.bmp'}
        renderThumbnail={Thumbnail}
        onRemove={(file, fileList, fileItem) => {
          if (fileItem.url === value) {
            setValue(fileList[0]?.url)
          }
        }}
        customRequest={({ onSuccess }) => {
          // @ts-ignore
          onSuccess();
        }}
        afterUpload={(obj) => {
          setValue(obj.file.url)
          return {
            status: 'success'
          }
        }}
      >
        <IconPlus size="extra-large" />
      </Upload>
    </div>
  )
}

export default ImageSelector

export const ImageSelectorItem = withField((props: ImageSelectorProps) => {
  const { validateStatus, ...rest } = props as any;
  return <ImageSelector {...rest}
  />
})