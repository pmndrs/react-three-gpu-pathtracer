import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Environment, Sphere } from '@react-three/drei'
import { Pathtracer, usePathtracer, usePathtracedFrames } from '@react-three/gpu-pathtracer'
import { Suspense, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { OrbitControls } from '@react-three/drei'
import { Box } from '@react-three/drei'
import CanvasCapture from 'canvas-capture'
import { Stats } from '@react-three/drei'
import { Plane } from '@react-three/drei'
import { Icosahedron } from '@react-three/drei'
import Model from './Model'
import { Bounds } from '@react-three/drei'
import { Center } from '@react-three/drei'
import { useTexture } from '@react-three/drei'
import CustomShaderMaterial from 'three-custom-shader-material'
import { MeshPhysicalMaterial, MultiplyBlending } from 'three'
import { button, folder, useControls } from 'leva'

function Floor() {
  const [aoMap, diffMap, norMap, roughMap] = useTexture([
    '/textures/wood_cabinet_worn_long_ao_2k.jpg',
    '/textures/wood_cabinet_worn_long_diff_2k.jpg',
    '/textures/wood_cabinet_worn_long_nor_gl_2k.jpg',
    '/textures/wood_cabinet_worn_long_rough_2k.jpg',
  ])

  return (
    <Plane args={[10, 10]} position-y={-1} rotation-x={-Math.PI / 2}>
      <meshPhysicalMaterial map={diffMap} aoMap={aoMap} roughnessMap={roughMap} normalMap={norMap} />
    </Plane>
  )
}

function Thing() {
  const { clear, update } = usePathtracer()

  useLayoutEffect(() => update(), [])
  // const [captureStarted, setCaptureStarted] = useState(false)

  // const opts = useControls(
  //   {
  //     CaptureVideo: folder({
  //       'Max Frames': {
  //         value: 600,

  //         step: 1,
  //       },
  //       [captureStarted ? 'Stop' : 'Start']: button(() => {
  //         if (!captureStarted) {
  //           start()
  //         } else {
  //           stop()
  //         }

  //         setCaptureStarted((s) => !s)
  //       }),
  //     }),
  //   },
  //   [captureStarted]
  // )

  // var { start, stop } = usePathtracedFrames({
  //   frames: opts['Max Frames'],
  //   samples: 3,
  //   onStart: ({ gl }) => {
  //     CanvasCapture.init(gl.domElement)
  //     CanvasCapture.beginVideoRecord({ format: CanvasCapture.WEBM, name: 'vid', fps: 60 })
  //   },
  //   onFrame: (_, renderer) => {
  //     console.log(
  //       `Rendered frame ${renderer.__r3fState.frame.count} in ${renderer.__r3fState.frame.delta?.toFixed(2)}ms:`
  //     )
  //     CanvasCapture.recordFrame()
  //   },
  //   onEnd: () => {
  //     CanvasCapture.stopRecord()
  //   },
  // })

  return (
    <>
      <OrbitControls onChange={() => clear()} />
      <Bounds fit clip observe damping={6} margin={1.5}>
        <group position={[0.2, -1, 0]}>
          <Model rotation-y={Math.PI} scale={5} />
        </group>
      </Bounds>
      <Floor />
    </>
  )
}

export default function App() {
  return (
    <>
      <Canvas
        camera={{
          position: [5, 5, -5],
        }}
        gl={{
          preserveDrawingBuffer: true,
        }}
      >
        <Suspense fallback={null}>
          <Pathtracer
            background={{
              type: 'Environment',
              top: 0x390f20,
              bottom: 0x151b1f,
              intensity: 3,
            }}
            bounces={3}
            // enabled={false}
          >
            <Environment files="/royal_esplanade_1k.hdr" />

            <Thing />
          </Pathtracer>
        </Suspense>
      </Canvas>
      <Stats />
    </>
  )
}
