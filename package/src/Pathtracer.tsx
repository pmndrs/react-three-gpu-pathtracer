import React from 'react'
import * as THREE from 'three'
import { useFrame, useThree } from '@react-three/fiber'
import {
  PathTracingSceneGenerator,
  PathTracingRenderer,
  PhysicalPathTracingMaterial,
  GradientEquirectTexture,
  EquirectHdrInfoUniform,
} from 'three-gpu-pathtracer'
import { FullScreenQuad } from './Pass'

type TilesType = [number, number] | THREE.Vector2 | { x: number; y: number } | number

interface PathtracerProps {
  alpha?: number
  samples?: number
  frames?: number
  tiles?: TilesType
  bounces?: number
  enabled?: boolean
  resolutionFactor?: number

  backgroundBlur?: number
  backgroundIntensity?: number
}

interface PathtracerAPI {
  update: () => void
  reset: () => void
  renderer: typeof PathTracingRenderer
}

const context = React.createContext<PathtracerAPI>(null as any)

function fiberVec2ToArr(vec: TilesType): [number, number] {
  if (Array.isArray(vec)) return vec
  if (vec instanceof THREE.Vector2) return [vec.x, vec.y]
  if (typeof vec === 'number') return [vec, vec]
  return [vec.x, vec.y]
}

export function Pathtracer({
  alpha = 1,
  samples = 1,
  frames = Infinity,
  tiles = 2,
  bounces = 1,
  enabled = true,
  resolutionFactor = 1,
  backgroundBlur = 0,
  backgroundIntensity = 1,
  children,
}: React.PropsWithChildren<PathtracerProps>) {
  const gl = useThree((state) => state.gl)
  const size = useThree((state) => state.size)
  const viewport = useThree((state) => state.viewport)
  const camera = useThree((state) => state.camera)
  const scene = useThree((state) => state.scene)

  const generator = React.useMemo(() => new PathTracingSceneGenerator(), [])
  const ptMaterial = React.useMemo(() => new PhysicalPathTracingMaterial(), [])
  const ptRenderer = React.useMemo(() => {
    const renderer = new PathTracingRenderer(gl)
    renderer.frames = 0
    return renderer
  }, [gl])

  React.useEffect(() => {
    ptMaterial.envMapInfo = new EquirectHdrInfoUniform()
    ptMaterial.backgroundMap = null

    if (scene.background instanceof THREE.DataTexture) {
      // If env map is set on the scene background, use it as the background
      ptMaterial.envMapInfo.updateFrom(scene.background)
      return
    } else if (scene.environment instanceof THREE.DataTexture) {
      // If env map is set on the scene but not as background, use it only for lighting but with black background
      ptMaterial.envMapInfo.updateFrom(scene.environment)
      const gradient = new GradientEquirectTexture()
      gradient.topColor.set(0x000000)
      gradient.bottomColor.set(0x000000)
      gradient.update()
      ptMaterial.backgroundMap = gradient
    }

    if (scene.background instanceof THREE.Color) {
      const gradient = new GradientEquirectTexture()
      gradient.topColor.set(scene.background.getHex())
      gradient.bottomColor.set(scene.background.getHex())
      gradient.update()
      ptMaterial.backgroundMap = gradient
    } else if (scene.background instanceof GradientEquirectTexture) {
      ptMaterial.backgroundMap = scene.background
    }
  }, [ptMaterial, scene.background, scene.environment])
  React.useEffect(() => void (ptMaterial.bounces = bounces), [ptMaterial, bounces])
  React.useEffect(() => void (ptMaterial.backgroundBlur = backgroundBlur), [ptMaterial, backgroundBlur])
  React.useEffect(() => void (ptMaterial.backgroundAlpha = alpha), [ptMaterial, alpha])
  React.useEffect(() => void (ptMaterial.environmentIntensity = backgroundIntensity), [ptMaterial, backgroundIntensity])

  React.useEffect(() => {
    ptRenderer.setSize(size.width * resolutionFactor * viewport.dpr, size.height * resolutionFactor * viewport.dpr)
    ptRenderer.reset()
  }, [ptRenderer, size, resolutionFactor])
  React.useEffect(() => void (ptRenderer.camera = camera), [ptRenderer, camera])
  React.useEffect(() => void (ptRenderer.material = ptMaterial), [ptRenderer, ptMaterial])
  React.useEffect(() => void (ptRenderer.alpha = alpha < 1), [ptRenderer, alpha])
  React.useEffect(() => {
    const t = fiberVec2ToArr(tiles)
    ptRenderer.tiles.set(t[0], t[1])
  }, [ptRenderer, tiles])

  const fsQuad = React.useMemo(
    () =>
      new FullScreenQuad(
        new THREE.MeshBasicMaterial({
          map: ptRenderer.target.texture,
          blending: THREE.CustomBlending,
        })
      ),
    []
  )

  const groupRef = React.useRef<THREE.Group>(null as any)
  const api = React.useMemo<PathtracerAPI>(
    () => ({
      update: () => {
        const group = groupRef.current
        const { bvh, textures, materials, lights } = generator.generate(group)

        const geometry = bvh.geometry
        const material = ptRenderer.material

        ptMaterial.bvh.updateFrom(bvh)

        material.bvh.updateFrom(bvh)
        material.attributesArray.updateFrom(
          geometry.attributes.normal,
          geometry.attributes.tangent,
          geometry.attributes.uv,
          geometry.attributes.color
        )
        material.materialIndexAttribute.updateFrom(geometry.attributes.materialIndex)
        material.textures.setTextures(gl, 2048, 2048, textures)
        material.materials.updateFrom(materials, textures)

        // update the lights
        ptMaterial.lights.updateFrom(lights)
      },
      reset: () => {
        ptRenderer.reset()
        ptRenderer.frames = 0
      },
      renderer: ptRenderer,
    }),
    [ptMaterial, generator, gl]
  )

  React.useEffect(() => {
    scene.updateMatrixWorld()
    api.update()
    api.reset()
  }, [])

  useFrame(({ camera, gl, scene }) => {
    camera.updateMatrixWorld()

    if (enabled && ptRenderer.frames < frames) {
      for (let i = 0; i < samples; i++) {
        ptRenderer.update()
      }

      ptRenderer.frames++
    }

    if (ptRenderer.samples < 1) {
      gl.render(scene, camera)
    }

    gl.autoClear = false
    ;(fsQuad.material as THREE.MeshBasicMaterial).map = ptRenderer.target.texture
    fsQuad.render(gl)
    gl.autoClear = true
  }, 1)

  return (
    <context.Provider value={api}>
      <group ref={groupRef}>{children}</group>
    </context.Provider>
  )
}

export function usePathtracer() {
  const ctx = React.useContext(context)
  if (!ctx) throw new Error('usePathtracer must be used within a Pathtracer')

  return ctx
}
