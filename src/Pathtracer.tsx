import { useFrame, useThree } from '@react-three/fiber'
import * as React from 'react'
import * as THREE from 'three'
import { API } from './API'
import useBackground from './core/useBackground'
import useRendererOptions from './core/useRendererOptions'
import { PathtracerAPI, PathtracerBackground, PathtracerProps } from './types'

const context = React.createContext<PathtracerAPI>(null!)
export function Pathtracer({
  // Render opts
  samples = 1,
  tiles = 1,
  bounces = 3,

  // Controls
  disable = false,
  paused = false,

  resolutionScale = 0.5,
  background = {},
  children,
}: React.PropsWithChildren<PathtracerProps>) {
  const { api, quad } = API()
  const bg: Partial<PathtracerBackground> = {
    // @ts-ignore
    type: 'Environment',
    blur: 0.5,
    intensity: 1,
    ...background,
  }

  const viewport = useThree((s) => s.viewport)
  const size = useThree((s) => s.size)

  useBackground(api, bg)
  useRendererOptions(api, bounces, tiles)

  React.useEffect(() => {
    api.update()
  }, [])

  React.useEffect(() => {
    const w = size.width
    const h = size.height
    const scale = resolutionScale
    const dpr = viewport.dpr

    api.renderer.reset()
    api.renderer.target.setSize(w * scale * dpr, h * scale * dpr)
  }, [viewport, size, resolutionScale])

  useFrame(({ gl, camera }) => {
    if (api.renderer.__initialized) {
      camera.updateMatrixWorld()

      if (!paused || api.renderer.samples < 1) {
        for (let i = 0; i < samples; i++) {
          api.renderer.update()
        }
      }

      gl.autoClear = false
      quad.render(gl)
      gl.autoClear = true
    }
  }, 1)

  return <context.Provider value={api}>{children}</context.Provider>
}

export function usePathtracer() {
  return React.useContext(context)
}
