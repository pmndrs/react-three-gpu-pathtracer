import { RootState } from '@react-three/fiber'
import {
  PathTracingRenderer,
  // @ts-ignore
} from 'three-gpu-pathtracer'

export interface PathtracerProps {
  samples: number
  disable: boolean
  tiles: THREE.Vector2 | number | [number, number]
  bounces: number
  paused: boolean
  enabled: boolean
  renderPriority: number

  resolutionScale: number
  background: Partial<PathtracerBackground>
}

export interface PathtracerAPI {
  update: () => void // Re-build and re-upload BVH
  refit: () => void // Re-fit (NOT Re-build) BVH
  clear: () => void // Need to clear textures when camera changes
  render: (samples?: number, paused?: boolean) => void
  renderer: PathTracingRenderer
}

export interface PathtracerBackground {
  type: 'Environment' | 'Gradient'
  blur: number
  intensity: number
  top: THREE.ColorRepresentation
  bottom: THREE.ColorRepresentation
}

export interface usePathtracedFramesProps {
  samples: number
  frames: number
  enabled: boolean
  onFrame: (rootState: RootState, renderer: PathTracingRenderer) => void
  onEnd: (rootState: RootState, renderer: PathTracingRenderer) => void
  onStart: (rootState: RootState, renderer: PathTracingRenderer) => void
}
