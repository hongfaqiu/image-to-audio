import { IconGithubLogo } from '@douyinfe/semi-icons'
import { Button, Image } from '@douyinfe/semi-ui'
import imageToAudio from 'image-to-audio'
import Head from 'next/head'
import Link from 'next/link'

export default function Home() {

  const convertImage = async () => {
    const res = await fetch('./fractal.jpg')
    const buffer = await res.arrayBuffer()

    const blob = imageToAudio(buffer)
    
    const src = window.URL.createObjectURL(blob)
    const audio = new Audio()
    audio.src = src
    audio.controls = true

    const audioControl = document.getElementById('audioControls')
    if (!audioControl) return
    if (audioControl.lastChild) audioControl.removeChild(audioControl.lastChild)
    audioControl.appendChild(audio)

  }

  return (
    <>
      <Head>
        <title>image-to-audio</title>
        <meta name="description" content="Encode an image to sound and view it as a spectrogram - turn your images into music" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <h1>
          image-to-audio
          <Link target={'_blank'} href="https://github.com/hongfaqiu/image-to-audio" title="Visit GitHub repository" rel="noopener">
            <IconGithubLogo style={{ fontSize: 30 }} />
          </Link>
        </h1>
        
        <div >
          <Image src="./fractal.jpg" alt='fractal' />
          {/* <Image src="./mona.jpg" alt='mona' /> */}
        </div>

        <Button onClick={convertImage}>convert to audio</Button>

        <div id="audioControls"></div>
      </main>
    </>
  )
}
