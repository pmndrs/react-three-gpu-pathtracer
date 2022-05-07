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
  render: (samples: number, paused: boolean) => void
  renderer: PathTracingRenderer
}

export type PathtracerBackground =
  | {
      type: 'Environment'
      blur: number
      intensity: number
    }
  | {
      type: 'Gradient'
      top: THREE.ColorRepresentation
      bottom: THREE.ColorRepresentation
    }
