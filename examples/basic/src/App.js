import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Environment, Sphere } from '@react-three/drei'
import { Pathtracer, usePathtracer } from '@react-three/gpu-pathtracer'
import { Suspense, useEffect, useLayoutEffect, useRef } from 'react'
import { OrbitControls } from '@react-three/drei'
import { Box } from '@react-three/drei'

function Thing() {
  const { clear, update, render } = usePathtracer()
  const ref = useRef()
  const advance = useThree((s) => s.advance)

  useFrame(() => {
    ref.current.rotation.y += 0.01
    ref.current.rotation.x += 0.01
    update()
  })

  useLayoutEffect(() => update(), [])

  return (
    <>
      <OrbitControls onChange={() => clear()} />
      <Box ref={ref}>
        <meshPhysicalMaterial />
      </Box>
    </>
  )
}

export default function App() {
  return (
    <Canvas
      camera={{
        position: [2, 2, 2],
      }}
    >
      <Suspense fallback={null}>
        <Pathtracer>
          <Environment preset="sunset" />

          <Thing />
        </Pathtracer>
      </Suspense>
    </Canvas>
  )
}
