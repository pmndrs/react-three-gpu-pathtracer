import { Canvas, useFrame } from '@react-three/fiber'
import { Environment, OrbitControls, Stats, Bounds, useTexture, Circle, PerspectiveCamera } from '@react-three/drei'
import { Suspense, useLayoutEffect, useRef, useState } from 'react'
import { button, folder, Leva, useControls } from 'leva'
import { Pathtracer, usePathtracer, usePathtracedFrames } from '@react-three/gpu-pathtracer'

import Controls from './Controls'

import Tag from './Tag'
import Model from './Model'
import { ACESFilmicToneMapping, sRGBEncoding } from 'three'

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

function UI({ infoRef }) {
  const { renderer } = usePathtracer()

  useFrame(() => {
    if (infoRef.current) {
      infoRef.current.children[0].textContent = `${renderer.frames} frames`
      infoRef.current.children[1].textContent = `${renderer.samples} samples`
    }
  }, [])

  return null
}

function Thing() {
  const { reset } = usePathtracer()

  return (
    <>
      <OrbitControls onChange={() => reset()} makeDefault />
      <PerspectiveCamera position={[5, 4.5, -5]} fov={40} makeDefault />
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
  const infoRef = useRef()
  const opts = Controls()

  return (
    <>
      <Leva
        collapsed
        titleBar={{
          title: 'Options',
        }}
      />
      <Canvas
        gl={{
          outputEncoding: sRGBEncoding,
          toneMapping: ACESFilmicToneMapping,
        }}
      >
        {!opts.Environment_Visible && <color attach="background" args={['#ffdcb5']} />}

        <Suspense fallback={null}>
          <Pathtracer
            samples={opts.Rendering_Samples}
            bounces={opts.Rendering_Bounces}
            resolutionFactor={opts.Rendering_Factor}
            tiles={opts.Rendering_Tiles}
            enabled={opts.Rendering_Enabled}
            backgroundIntensity={opts.Environment_Intensity}
            backgroundBlur={opts.Environment_Blur}
          >
            <Environment preset={opts.Environment_Preset} background={opts.Environment_Visible} />
            <Thing />
            <UI infoRef={infoRef} />
          </Pathtracer>
        </Suspense>
      </Canvas>
      <Stats />
      <Tag />
      <div className="info" ref={infoRef}>
        <p>0 frames</p>
        <p>0 samples</p>
      </div>
    </>
  )
}
