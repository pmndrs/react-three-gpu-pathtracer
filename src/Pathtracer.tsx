import { RootState, useFrame, useThree } from '@react-three/fiber'
import * as React from 'react'
import { consoleLog } from 'react-console-log'
import * as THREE from 'three'
import { API } from './API'
import useBackground from './core/useBackground'
import useRendererOptions from './core/useRendererOptions'
import { PathtracerAPI, PathtracerBackground, PathtracerProps, usePathtracedFramesProps } from './types'

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

  React.useLayoutEffect(() => {
    api.update()
  }, [])

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
      if (api.renderer.__r3fState?.initialized && enabled) {
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

let frame = 0
let prev = Date.now()
export function usePathtracedFrames({
  samples = 3,
  frames = 0,
  onFrame,
  onEnd,
  onStart,
}: Partial<usePathtracedFramesProps>) {
  const { render, update, renderer } = usePathtracer()

  const advance = useThree((s) => s.advance)
  const setFrameloop = useThree((s) => s.setFrameloop)
  const frameloop = useThree((s) => s.frameloop)
  const get = useThree((s) => s.get)
  const id = React.useRef(-1)

  const initFrameloop = React.useMemo(() => frameloop, [])

  const [enabled, setEnabled] = React.useState(false)
  const [started, setStarted] = React.useState(false)

  React.useLayoutEffect(() => {
    setFrameloop(enabled || started ? 'never' : initFrameloop)
  })

  React.useEffect(() => {
    function animate() {
      if (frame < frames) {
        renderer.__r3fState.frame.count = frame
        const current = Date.now()
        renderer.__r3fState.frame.delta = current - prev
        prev = current
        frame++

        advance(Date.now())
        render(samples)
        onFrame?.(get(), renderer)
        id.current = requestAnimationFrame(animate)
      } else {
        setEnabled(false)
      }
    }
    if (enabled && !started) {
      onStart?.(get(), renderer)
      animate()
      setStarted(true)
    } else if (!enabled && started) {
      frame = frames + 1
      cancelAnimationFrame(id.current)
      onEnd?.(get(), renderer)
      id.current = -1
      setStarted(false)
    }
  }, [enabled, started, frames, samples])

  const start = React.useCallback(() => {
    setEnabled(true)
  }, [])

  const stop = React.useCallback(() => {
    setEnabled(false)
  }, [])

  return { start, stop }
}
