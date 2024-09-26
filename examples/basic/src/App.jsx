import { Canvas, useFrame } from '@react-three/fiber'
import { Environment, OrbitControls, Stats, Bounds, useTexture, Circle, PerspectiveCamera } from '@react-three/drei'
import { Suspense, useLayoutEffect, useRef, useState, useEffect } from 'react'
import { button, folder, Leva, useControls } from 'leva'
import { Pathtracer, usePathtracer } from '@react-three/gpu-pathtracer'

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
  const { pathtracer } = usePathtracer()

  useFrame(() => {
    if (pathtracer && infoRef.current) {
      infoRef.current.children[0].textContent = `${Math.ceil(pathtracer.samples)} samples`
    }
  }, [])

  return null
}

function Thing() {
  const { reset, update } = usePathtracer()
  const opts = Controls()

  // Trigger updates when envmap stuff changes
  useEffect(() => {
    update()
  }, [opts.Environment_Visible, opts.Environment_Preset, opts.Environment_Intensity, opts.Environment_Blur])

  return (
    <>
      <OrbitControls makeDefault />

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
          toneMapping: ACESFilmicToneMapping,
        }}
        camera={{
          position: [5, 4.5, -5],
          fov: 40,
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
          >
            <Environment
              preset={opts.Environment_Preset}
              background={opts.Environment_Visible}
              backgroundBlurriness={opts.Environment_Blur}
              backgroundIntensity={opts.Environment_Intensity}
            />
            <Thing />
            <UI infoRef={infoRef} />
          </Pathtracer>
        </Suspense>
      </Canvas>
      <Stats />
      <Tag />
      <div className="info" ref={infoRef}>
        <p>0 samples</p>
      </div>
    </>
  )
}
