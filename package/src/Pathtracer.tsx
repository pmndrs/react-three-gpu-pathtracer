import React, { useMemo } from 'react'
import * as THREE from 'three'
import { useFrame, useThree } from '@react-three/fiber'
import { GradientEquirectTexture, WebGLPathTracer, ParallelMeshBVHWorker } from 'three-gpu-pathtracer'

type TilesType = [number, number] | THREE.Vector2 | { x: number; y: number } | number

interface PathtracerProps {
  minSamples?: number
  samples?: number
  tiles?: TilesType
  bounces?: number
  enabled?: boolean
  resolutionFactor?: number
}

interface PathtracerAPI {
  update: () => void
  reset: () => void
  renderer: typeof WebGLPathTracer
  pathtracer: typeof WebGLPathTracer
}

const context = React.createContext<PathtracerAPI>(null as any)

//* Helper Function to convert TilesType to [number, number]
function fiberVec2ToArr(vec: TilesType): [number, number] {
  if (Array.isArray(vec)) return vec
  if (vec instanceof THREE.Vector2) return [vec.x, vec.y]
  if (typeof vec === 'number') return [vec, vec]
  return [vec.x, vec.y]
}

export const Pathtracer = React.forwardRef<
  InstanceType<typeof WebGLPathTracer>,
  React.PropsWithChildren<PathtracerProps>
>(({ enabled = true, children, ...props }, ref) => {
  // state objects
  const { gl, size, viewport, camera, scene, controls } = useThree()

  const pathtracer = useMemo(() => {
    const pt = new WebGLPathTracer(gl)
    // This might not be needed as we arent using setSceneAsync
    //pt.setBVHWorker(new ParallelMeshBVHWorker())
    return pt
  }, [gl])

  // Expose the pathtracer instance via ref
  React.useImperativeHandle(ref, () => pathtracer, [pathtracer])

  //* Set a Gradient Background ============
  React.useEffect(() => {
    // If the background is a color, replace it with a gradient
    if (scene.background instanceof THREE.Color) {
      const gradient = new GradientEquirectTexture()
      gradient.topColor.set(scene.background.getHex())
      gradient.bottomColor.set(scene.background.getHex())
      gradient.update()
      scene.background = gradient
    }
  }, [scene])

  //* Single handler for all props
  React.useEffect(() => {
    const { minSamples = 5, tiles = 2, bounces = 4 } = props

    pathtracer.bounces = bounces
    pathtracer.minSamples = minSamples
    const t = fiberVec2ToArr(tiles)
    pathtracer.tiles.set(t[0], t[1])
  }, [props, pathtracer])

  // If enabled toggles reset
  React.useEffect(() => {
    if (enabled) pathtracer.reset()
  }, [enabled])

  // if the viewport size changes, update the pathtracer size
  /*
  React.useEffect(() => {
    pathtracer.setSize(
      size.width * (props.resolutionFactor || 1) * viewport.dpr,
      size.height * (props.resolutionFactor || 1) * viewport.dpr
    )
    pathtracer.reset()
  }, [pathtracer, size, props.resolutionFactor, viewport.dpr])
*/
  const api = React.useMemo<PathtracerAPI>(
    () => ({
      // Update the pathtracer scene
      update: () => {
        pathtracer.setScene(scene, camera)
      },
      reset: () => {
        pathtracer.reset()
      },
      // *DEPRECATED*
      renderer: pathtracer,
      // Use this instead. Keeps base three renderer seperate mentally
      pathtracer: pathtracer,
    }),
    [pathtracer, scene, camera]
  )

  //* Initialize the pathtracer
  React.useEffect(() => {
    scene.updateMatrixWorld()
    api.update()
    api.reset()
  }, [])

  // Bind control listeners
  React.useEffect(() => {
    // setup control listeners
    const controlListener = () => {
      pathtracer.updateCamera()
    }
    if (controls) controls.addEventListener('change', controlListener)

    return () => {
      if (controls) controls.removeEventListener('change', controlListener)
    }
  }, [controls, pathtracer])

  useFrame(({ camera, gl, scene }) => {
    // do we need to update every frame?
    camera.updateMatrixWorld()

    if (enabled && pathtracer.samples < (props.samples || Infinity)) pathtracer.renderSample()

    if (!enabled) gl.render(scene, camera)
  }, 1)

  return <context.Provider value={api}>{children}</context.Provider>
})

export function usePathtracer() {
  const ctx = React.useContext(context)
  if (!ctx) throw new Error('usePathtracer must be used within a Pathtracer')

  return ctx
}
