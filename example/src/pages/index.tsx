import { initList } from "@/components/ImageSelector";
import SoundCreater, { SoundCreaterParams } from "@/components/SoundCreater";
import { IconGithubLogo } from "@douyinfe/semi-icons";
import { Col, Notification, Row, Spin } from "@douyinfe/semi-ui";
import imageToAudio from "image-to-audio";
import dynamic from "next/dynamic";
import Head from "next/head";
import Link from "next/link";
import { useState } from "react";
import { spawn } from "threads";
import styles from "./index.module.scss";

const SoundPlayer = dynamic(() => import("@/components/SoundPlayer"), {
  ssr: false,
});

export default function Home() {
  const [result, setResult] = useState<ReturnType<typeof imageToAudio>>();
  const [loading, setLoading] = useState(false);

  const convertImage = async (values: SoundCreaterParams) => {
    setLoading(true);
    try {
      const res = await fetch(values.url);
      const buffer = await res.arrayBuffer();
      
      const func = await spawn(new Worker(new URL('../utils/work.ts', import.meta.url)));

      const funcRes = await func(buffer, values);
      setResult(funcRes);
      setLoading(false);
    } catch (e) {
      setLoading(false);
      Notification.error({
        title: "Error fetching",
        content: e,
      });
    }
  };

  return (
    <>
      <Head>
        <title>image-to-audio</title>
        <meta
          name="description"
          content="Encode an image to sound and view it as a spectrogram - turn your images into music"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.mainContainer}>
        <h1 className={styles.header}>
          image-to-audio
          <Link
            target={"_blank"}
            href="https://github.com/hongfaqiu/image-to-audio"
            title="Visit GitHub repository"
            rel="noopener"
          >
            <IconGithubLogo style={{ fontSize: 30 }} />
          </Link>
        </h1>

        <Row className={styles.content}>
          <Col md={24} lg={8} className={styles.left}>
            <SoundCreater
              initValues={{
                url: initList[0].url as string,
                method: "LeftToRightRGB",
                melodicScales: "C_MAJOR",
                sampleRate: 8000,
                maxFreq: 20000,
                bpm: 60,
                beat: 1 / 4,
              }}
              onSubmit={convertImage}
            />
          </Col>

          <Col md={24} lg={16} className={styles.right}>
            <Spin
              wrapperClassName={styles.spin}
              spinning={loading}
              tip="Please wait"
            >
              {!!result && <SoundPlayer src={result.blob} />}
            </Spin>
          </Col>
        </Row>
      </main>
    </>
  );
}
