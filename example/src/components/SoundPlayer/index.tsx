import { useEffect, useRef, useState } from 'react';
import styles from './index.module.scss';
import WaveSurfer from "wavesurfer.js";
// @ts-ignore
import CursorPlugin from "wavesurfer.js/dist/plugin/wavesurfer.cursor.min";
// @ts-ignore
import SpectrogramPlugin from "wavesurfer.js/dist/plugin/wavesurfer.spectrogram.min";
import { Button } from '@douyinfe/semi-ui';
import { IconPause, IconPlay } from '@douyinfe/semi-icons';

export type WaveSurferProps = {
  src?: Blob | File;
}

const SoundPlayer: React.FC<WaveSurferProps> = ({
  src
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [ws, setWs] = useState<WaveSurfer>()

  type WaveState = {
    playing?: boolean;
    progress?: number;
    duration?: number;
  }
  const [state, setState] = useState<WaveState>({
    playing: false,
    progress: 0,
    duration: 0
  })

  const changeState = (values: WaveState) => {
    setState(old => ({
      ...old,
      ...values
    }))
  }

  useEffect(() => {
    const container = ref.current as HTMLElement
    
    if (container && !ws) {
      const waveform = WaveSurfer.create({
        container,
        plugins: [
          CursorPlugin.create({
            showTime: true,
            opacity: 1,
            customShowTimeStyle: {
              'background-color': '#000',
              color: '#fff',
              padding: '2px',
              'font-size': '10px'
            }
          }),
          SpectrogramPlugin.create({
            wavesurfer: ws,
            container: "#wave-spectrogram",
            labels: true,
            height: 256,
          })
        ]
      });
      
      waveform.on('ready', () => {
        changeState({duration: waveform.getDuration()});
      });
      waveform.on('audioprocess', () => {
        changeState({progress: waveform.getCurrentTime()});
      })
      waveform.on('finish', () => {
        changeState({playing: false, progress: 0});
        waveform.seekTo(0);
      })
      setWs(waveform)
    }

    return () => {
      ws?.destroy();
      setWs(undefined)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (ws && src) {
      ws.loadBlob(src);
      setState({
        playing: false,
        progress: 0,
        duration: 0
      })
    }
  }, [ws, src])

  const playPause = async () => {
    if (ws) {
      await ws?.playPause();
      changeState({
        playing: ws.isPlaying()
      })
    }
  }

  return (
    <div className={styles.soundPlayer}>
      <div className={styles.control}>
        <Button onClick={playPause} >
          {state.playing ? <IconPause/> : <IconPlay/> }
          {state.playing ? 'Pause' : 'Play' }
        </Button>
      </div>
      <div ref={ref} />
      <div id='wave-spectrogram'/>
    </div>
  )
}

export default SoundPlayer