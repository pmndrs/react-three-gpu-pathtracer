import { Canvas } from '@react-three/fiber'
import { Environment, Sphere } from '@react-three/drei'
import { Pathtracer, usePathtracer, usePathtracedFrames } from '@react-three/gpu-pathtracer'
import { Suspense, useLayoutEffect, useState } from 'react'
import { OrbitControls } from '@react-three/drei'
import CanvasCapture from 'canvas-capture'
import { Stats } from '@react-three/drei'
import Model from './Model'
import { Bounds } from '@react-three/drei'
import { useTexture } from '@react-three/drei'
import { button, folder, Leva, useControls } from 'leva'
import { Circle } from '@react-three/drei'
import Controls from './Controls'
import Tag from './Tag'

function Floor() {
  const [aoMap, diffMap, norMap, roughMap] = useTexture([
    '/textures/wood_cabinet_worn_long_ao_2k.jpg',
    '/textures/wood_cabinet_worn_long_diff_2k.jpg',
    '/textures/wood_cabinet_worn_long_nor_gl_2k.jpg',
    '/textures/wood_cabinet_worn_long_rough_2k.jpg',
  ])

  return (
    <>
      <Circle args={[4, 128]} position={[0, -1, 0]} rotation-x={-Math.PI / 2}>
        <meshPhysicalMaterial map={diffMap} aoMap={aoMap} roughnessMap={roughMap} normalMap={norMap} roughness={0.5} />
      </Circle>
    </>
  )
}

function Thing({ setEnabled }) {
  const { clear, update } = usePathtracer()

  useLayoutEffect(() => update(), [])
  const [captureStarted, setCaptureStarted] = useState(false)

  const opts = useControls(
    {
      CaptureVideo: folder({
        'Max Frames': {
          value: 60,
          step: 1,
        },
        Samples: {
          value: 3,
          step: 1,
        },
        [captureStarted ? 'Stop' : 'Start']: button(() => {
          if (!captureStarted) {
            start()
          } else {
            stop()
          }

          setCaptureStarted((s) => !s)
        }),
      }),
    },
    [captureStarted]
  )

  var { start, stop } = usePathtracedFrames({
    frames: opts['Max Frames'],
    samples: opts.Samples,
    onStart: ({ gl }) => {
      CanvasCapture.init(gl.domElement)
      CanvasCapture.beginVideoRecord({ format: CanvasCapture.WEBM, name: 'vid', fps: 60 })
    },
    onFrame: (_, renderer, dt) => {
      console.log(`Rendered frame ${renderer.__r3fState.frame.count} in ${dt * 100}ms:`)
      CanvasCapture.recordFrame()
    },
    onEnd: () => {
      CanvasCapture.stopRecord()
    },
  })

  return (
    <>
      <OrbitControls
        autoRotateSpeed={2}
        onEnd={() => setEnabled(true)}
        onStart={() => setEnabled(false)}
        onChange={() => clear()}
      />
      <group>
        <Bounds fit clip observe damping={6} margin={1.7}>
          <group position={[0.2, -1, 0]}>
            <Model rotation-y={Math.PI} position={[-0.3, 0, 0]} scale={5} />
          </group>
        </Bounds>
        <Floor />
      </group>
    </>
  )
}

export default function App() {
  const opts = Controls()

  const [enabled, setEnabled] = useState(true)

  return (
    <>
      <Leva
        collapsed
        titleBar={{
          title: 'Options',
        }}
      />
      <Canvas
        camera={{
          position: [5, 4.5, -5],
          fov: 40,
        }}
        gl={{
          preserveDrawingBuffer: true,
        }}
      >
        <Suspense fallback={null}>
          <Pathtracer
            background={{
              type: opts.Background_Type,
              top: opts.Gradient_ColorTop,
              bottom: opts.Gradient_ColorBottom,
              intensity: opts.Environment_Intensity,
              blur: opts.Environment_Blur,
            }}
            bounces={opts.Rendering_Bounces}
            enabled={enabled && opts.Rendering_Enabled}
            paused={opts.Rendering_Paused}
            samples={opts.Rendering_Samples}
            resolutionScale={opts.Rendering_Scale}
            tiles={[opts.Rendering_Tiles.x, opts.Rendering_Tiles.y]}
          >
            <Environment preset={opts.Environment_Preset} />
            <Thing setEnabled={setEnabled} />
          </Pathtracer>
        </Suspense>
      </Canvas>
      <Stats />
      <Tag />
    </>
  )
}
