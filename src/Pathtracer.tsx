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
  renderPriority = 1,

  // Controls
  enabled = true,
  paused = false,

  resolutionScale = 0.5,
  background = {},
  children,
}: React.PropsWithChildren<PathtracerProps>) {
  const api = API()
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

  // React.useLayoutEffect(() => {
  //   api.update()
  // }, [])

  React.useLayoutEffect(() => {
    const w = size.width
    const h = size.height
    const scale = resolutionScale
    const dpr = viewport.dpr

    api.renderer.reset()
    api.renderer.target.setSize(w * scale * dpr, h * scale * dpr)
  }, [viewport, size, resolutionScale])

  useFrame(
    () => {
      if (api.renderer.__initialized && enabled) {
        api.render(samples, paused)
      }
    },
    enabled ? renderPriority : 0
  )

  return <context.Provider value={api}>{children}</context.Provider>
}

export function usePathtracer() {
  return React.useContext(context)
}
