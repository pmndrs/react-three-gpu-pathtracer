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

  resolutionScale: number
  background: Partial<PathtracerBackground>
}

export interface PathtracerAPI {
  update: () => void
  reset: () => void
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
