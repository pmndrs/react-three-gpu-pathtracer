import { useFrame, useThree } from '@react-three/fiber'
import React, { useState } from 'react'
import { usePathtracer } from './Pathtracer'
import { usePathtracedFramesProps } from './types'

export function usePathtracedFrames({
  samples = 3,
  frames = 1,
  onFrame,
  onEnd,
  onStart,
}: Partial<usePathtracedFramesProps>) {
  const { render, renderer } = usePathtracer()
  const get = useThree((s) => s.get)

  const [enabled, setEnabled] = useState(false)
  const enabledRef = React.useRef(false)
  const frame = React.useRef(0)

  useFrame(
    (gl, dt) => {
      if (enabledRef.current && frame.current < frames) {
        renderer.__r3fState.frames = frame.current
        frame.current++

        render(samples)
        onFrame?.(gl, renderer, dt)
      }
    },
    enabled ? 1 : 0
  )

  const start = React.useCallback(() => {
    renderer.__r3fState.frames = 0
    renderer.__r3fState.initialized = false
    frame.current = 0
    onStart?.(get(), renderer)

    setEnabled(true)
    enabledRef.current = true
  }, [])

  const stop = React.useCallback(() => {
    setEnabled(false)

    enabledRef.current = false
    renderer.__r3fState.initialized = true
    onEnd?.(get(), renderer)
  }, [])

  return { start, stop }
}
